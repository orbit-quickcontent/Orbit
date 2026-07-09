package io.orbitlogic.partner.data.network

import android.util.Log
import io.socket.client.IO
import io.socket.client.Socket
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import org.json.JSONObject

class WebSocketService {
    private var socket: Socket? = null
    
    private val _incomingDispatches = MutableSharedFlow<JSONObject>(extraBufferCapacity = 64)
    val incomingDispatches: SharedFlow<JSONObject> = _incomingDispatches

    fun connect(userId: String) {
        try {
            val opts = IO.Options().apply {
                forceNew = true
                reconnection = true
                query = "userId=$userId&role=partner"
            }
            socket = IO.socket("http://10.0.2.2:3003", opts)

            socket?.on(Socket.EVENT_CONNECT) {
                Log.d("WebSocket", "Connected to Orbit Partner WebSockets")
            }

            socket?.on("booking-dispatched") { args ->
                if (args.isNotEmpty()) {
                    val data = args[0] as? JSONObject
                    data?.let {
                        Log.d("WebSocket", "New dispatch request received: $it")
                        _incomingDispatches.tryEmit(it)
                    }
                }
            }

            socket?.connect()
        } catch (e: Exception) {
            Log.e("WebSocket", "Error connecting", e)
        }
    }

    fun toggleAvailability(isOnline: Boolean) {
        socket?.emit("toggle-availability", JSONObject().apply {
            put("available", isOnline)
        })
    }

    fun disconnect() {
        socket?.disconnect()
        socket = null
    }
}
