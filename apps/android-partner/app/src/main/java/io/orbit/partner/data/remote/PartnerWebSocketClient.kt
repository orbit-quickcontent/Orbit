package io.orbit.partner.data.remote

import android.util.Log
import com.google.gson.Gson
import io.orbit.partner.data.remote.dto.WsBookingAcceptedByOther
import io.orbit.partner.data.remote.dto.WsBookingDispatched
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

sealed class PartnerWsEvent {
    data class GigDispatched(val data: WsBookingDispatched) : PartnerWsEvent()
    data class GigAcceptedByOther(val data: WsBookingAcceptedByOther) : PartnerWsEvent()
    data class Connected(val sid: String) : PartnerWsEvent()
    object Disconnected : PartnerWsEvent()
    data class Error(val msg: String) : PartnerWsEvent()
}

@Singleton
class PartnerWebSocketClient @Inject constructor(private val gson: Gson) {

    private val TAG = "PartnerSocket"

    private var webSocket: WebSocket? = null
    private var currentPartnerId: String? = null
    private var isOnlineState: Boolean = false

    private val _events = MutableSharedFlow<PartnerWsEvent>(replay = 0, extraBufferCapacity = 64)
    val events: SharedFlow<PartnerWsEvent> = _events

    private val client = OkHttpClient.Builder()
        .readTimeout(0, TimeUnit.MILLISECONDS)
        .connectTimeout(15, TimeUnit.SECONDS)
        .build()

    fun connect(wsUrl: String, partnerId: String) {
        currentPartnerId = partnerId
        val request = Request.Builder()
            .url("$wsUrl/socket.io/?EIO=4&transport=websocket")
            .build()
        webSocket = client.newWebSocket(request, socketListener)
        Log.d(TAG, "Connecting to $wsUrl for partner: $partnerId")
    }

    fun goOnline() {
        val partnerId = currentPartnerId ?: return
        isOnlineState = true
        emit("partner:online", JSONObject().put("partnerId", partnerId))
        Log.d(TAG, "Partner $partnerId set online")
    }

    fun goOffline() {
        val partnerId = currentPartnerId ?: return
        isOnlineState = false
        emit("partner:offline", JSONObject().put("partnerId", partnerId))
        Log.d(TAG, "Partner $partnerId set offline")
    }

    fun disconnect() {
        if (isOnlineState) {
            goOffline()
        }
        webSocket?.close(1000, "Partner disconnect")
        webSocket = null
        currentPartnerId = null
    }

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
                    text.startsWith("0") -> {
                        val json = JSONObject(text.substring(1))
                        val sid = json.optString("sid", "unknown")
                        webSocket.send("40")
                        _events.tryEmit(PartnerWsEvent.Connected(sid))
                    }
                    text == "2" -> webSocket.send("3")
                    text == "40" -> {
                        Log.d(TAG, "Connected ACK received")
                        if (isOnlineState) goOnline()
                    }
                    text.startsWith("42") -> {
                        val arr = JSONArray(text.substring(2))
                        val eventName = arr.getString(0)
                        val payload = arr.get(1)
                        handleEvent(eventName, payload.toString())
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Parse error: ${e.message}")
            }
        }

        override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
            _events.tryEmit(PartnerWsEvent.Disconnected)
            Log.d(TAG, "Closing: $code $reason")
        }

        override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
            _events.tryEmit(PartnerWsEvent.Error(t.message ?: "WS Failure"))
            Log.e(TAG, "Failure: ${t.message}")
            scheduleReconnect()
        }
    }

    private fun handleEvent(eventName: String, payload: String) {
        Log.d(TAG, "Event: $eventName → $payload")
        when (eventName) {
            "booking:dispatched" -> {
                val data = gson.fromJson(payload, WsBookingDispatched::class.java)
                _events.tryEmit(PartnerWsEvent.GigDispatched(data))
            }
            "booking:accepted-by-other" -> {
                val data = gson.fromJson(payload, WsBookingAcceptedByOther::class.java)
                _events.tryEmit(PartnerWsEvent.GigAcceptedByOther(data))
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
