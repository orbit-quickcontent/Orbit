import 'package:flutter/foundation.dart';
import 'package:socket_io_client/socket_io_client.dart' as socket_io;

class WebSocketService {
  socket_io.Socket? _socket;
  final String _wsUrl = const String.fromEnvironment('WS_URL', defaultValue: 'http://10.0.2.2:3003');

  void connect({
    required Function(String bookingId, String partnerId, String partnerName) onPartnerAssigned,
    required Function(String event, Map<String, dynamic> data) onNotifyClient,
  }) {
    if (_socket != null && _socket!.connected) return;

    debugPrint("[WS] Connecting to $_wsUrl...");
    _socket = socket_io.io(_wsUrl, socket_io.OptionBuilder()
        .setTransports(['websocket', 'polling'])
        .setPath('/socket.io/')
        .enableReconnection()
        .setReconnectionDelay(3000)
        .build());

    _socket!.onConnect((_) {
      debugPrint("[WS] Connected to Socket server!");
    });

    _socket!.on('booking:partner-assigned', (data) {
      debugPrint("[WS] Partner Assigned event received: $data");
      final String bId = data['bookingId'] ?? '';
      final String pId = data['partnerId'] ?? '';
      final String pName = data['partnerName'] ?? '';
      onPartnerAssigned(bId, pId, pName);
    });

    _socket!.onAny((event, data) {
      debugPrint("[WS] Event received: $event -> $data");
      if (data is Map<String, dynamic>) {
        onNotifyClient(event, data);
      }
    });

    _socket!.onDisconnect((_) => debugPrint("[WS] Disconnected from server"));
  }

  void subscribeToBooking(String bookingId) {
    if (_socket == null || !_socket!.connected) return;
    debugPrint("[WS] Subscribing to booking room: $bookingId");
    _socket!.emit('client:subscribe', {'bookingId': bookingId});
  }

  void disconnect() {
    if (_socket != null) {
      _socket!.disconnect();
      _socket = null;
    }
  }
}
