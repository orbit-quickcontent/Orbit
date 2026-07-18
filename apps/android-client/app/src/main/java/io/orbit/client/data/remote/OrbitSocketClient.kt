package io.orbit.client.data.remote

import android.util.Log
import com.google.gson.Gson
import io.orbit.client.data.remote.dto.WsBookingStatusUpdate
import io.orbit.client.data.remote.dto.WsPartnerAssigned
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton

// ============================================================
// Socket.IO Client for Android (OkHttp WebSocket)
// Implements Socket.IO v4 wire protocol manually
// ============================================================

sealed class WsEvent {
    data class BookingStatusUpdate(val data: WsBookingStatusUpdate) : WsEvent()
    data class PartnerAssigned(val data: WsPartnerAssigned) : WsEvent()
    data class Connected(val socketId: String) : WsEvent()
    object Disconnected : WsEvent()
    data class Error(val message: String) : WsEvent()
}

@Singleton
class OrbitSocketClient @Inject constructor(private val gson: Gson) {

    private val TAG = "OrbitSocket"

    private var webSocket: WebSocket? = null
    private var currentBookingId: String? = null

    private val _events = MutableSharedFlow<WsEvent>(replay = 0, extraBufferCapacity = 64)
    val events: SharedFlow<WsEvent> = _events

    private val client = OkHttpClient.Builder()
        .readTimeout(0, TimeUnit.MILLISECONDS)
        .connectTimeout(15, TimeUnit.SECONDS)
        .build()

    fun connect(wsUrl: String) {
        val request = Request.Builder()
            .url("$wsUrl/socket.io/?EIO=4&transport=websocket")
            .build()
        webSocket = client.newWebSocket(request, socketListener)
        Log.d(TAG, "Connecting to $wsUrl")
    }

    fun subscribeToBooking(bookingId: String) {
        currentBookingId = bookingId
        emit("client:subscribe", JSONObject().put("bookingId", bookingId))
        Log.d(TAG, "Subscribed to booking: $bookingId")
    }

    fun disconnect() {
        webSocket?.close(1000, "User disconnect")
        webSocket = null
        currentBookingId = null
    }

    // Socket.IO emit: packet type 42 = MESSAGE EVENT
    private fun emit(eventName: String, data: Any) {
        val payload = JSONArray().apply {
            put(eventName)
            put(data)
        }
        val message = "42$payload"
        webSocket?.send(message)
    }

    private val socketListener = object : WebSocketListener() {

        override fun onOpen(webSocket: WebSocket, response: Response) {
            Log.d(TAG, "WebSocket opened")
        }

        override fun onMessage(webSocket: WebSocket, text: String) {
            Log.v(TAG, "Raw: $text")
            try {
                when {
                    // Socket.IO OPEN packet: "0{...}"
                    text.startsWith("0") -> {
                        val json = JSONObject(text.substring(1))
                        val sid = json.optString("sid", "unknown")
                        // Send upgrade ping
                        webSocket.send("40")
                        _events.tryEmit(WsEvent.Connected(sid))
                        Log.d(TAG, "Connected, sid=$sid")
                    }
                    // Socket.IO ping "2"
                    text == "2" -> webSocket.send("3") // pong
                    // Socket.IO MESSAGE EVENT "42[...]"
                    text.startsWith("42") -> {
                        val arr = JSONArray(text.substring(2))
                        val eventName = arr.getString(0)
                        val payload = arr.get(1)
                        handleEvent(eventName, payload.toString())
                    }
                    // Connected ack "40"
                    text == "40" -> {
                        Log.d(TAG, "Connected ACK received")
                        currentBookingId?.let { subscribeToBooking(it) }
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Parse error: ${e.message}")
            }
        }

        override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
            _events.tryEmit(WsEvent.Disconnected)
            Log.d(TAG, "Closing: $code $reason")
        }

        override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
            _events.tryEmit(WsEvent.Error(t.message ?: "Unknown WS error"))
            Log.e(TAG, "Failure: ${t.message}")
            // Auto-reconnect after 5 seconds
            scheduleReconnect()
        }
    }

    private fun handleEvent(eventName: String, payload: String) {
        Log.d(TAG, "Event: $eventName → $payload")
        when (eventName) {
            "booking:status-update" -> {
                val data = gson.fromJson(payload, WsBookingStatusUpdate::class.java)
                _events.tryEmit(WsEvent.BookingStatusUpdate(data))
            }
            "booking:partner-assigned" -> {
                val data = gson.fromJson(payload, WsPartnerAssigned::class.java)
                _events.tryEmit(WsEvent.PartnerAssigned(data))
            }
        }
    }

    private fun scheduleReconnect() {
        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
            Log.d(TAG, "Attempting reconnect...")
            webSocket?.let {
                val request = it.request()
                webSocket = client.newWebSocket(request, socketListener)
            }
        }, 5000)
    }
}
