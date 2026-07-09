package io.orbitlogic.client.data.network

import android.util.Log
import io.socket.client.IO
import io.socket.client.Socket
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import org.json.JSONObject

class WebSocketService {
    private var socket: Socket? = null
    
    private val _statusUpdates = MutableSharedFlow<JSONObject>(extraBufferCapacity = 64)
    val statusUpdates: SharedFlow<JSONObject> = _statusUpdates

    fun connect(userId: String) {
        try {
            // Emulators connect to 10.0.2.2 for local server loopback
            val opts = IO.Options().apply {
                forceNew = true
                reconnection = true
                query = "userId=$userId&role=client"
            }
            socket = IO.socket("http://10.0.2.2:3003", opts)

            socket?.on(Socket.EVENT_CONNECT) {
                Log.d("WebSocket", "Connected to Orbit WebSockets")
            }

            socket?.on("status-update") { args ->
                if (args.isNotEmpty()) {
                    val data = args[0] as? JSONObject
                    data?.let {
                        Log.d("WebSocket", "Status update: $it")
                        _statusUpdates.tryEmit(it)
                    }
                }
            }

            socket?.connect()
        } catch (e: Exception) {
            Log.e("WebSocket", "Error connecting", e)
        }
    }

    fun disconnect() {
        socket?.disconnect()
        socket = null
    }
}
