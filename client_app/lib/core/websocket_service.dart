import 'package:socket_io_client/socket_io_client.dart' as IO;

class WebSocketService {
  IO.Socket? _socket;
  final String _wsUrl = const String.fromEnvironment('WS_URL', defaultValue: 'http://10.0.2.2:3003');

  void connect({
    required Function(String bookingId, String partnerId, String partnerName) onPartnerAssigned,
    required Function(String event, Map<String, dynamic> data) onNotifyClient,
  }) {
    if (_socket != null && _socket!.connected) return;

    print("[WS] Connecting to $_wsUrl...");
    _socket = IO.io(_wsUrl, IO.OptionBuilder()
        .setTransports(['websocket', 'polling'])
        .setPath('/socket.io/')
        .enableReconnection()
        .setReconnectionDelay(3000)
        .build());

    _socket!.onConnect((_) {
      print("[WS] Connected to Socket server!");
    });

    _socket!.on('booking:partner-assigned', (data) {
      print("[WS] Partner Assigned event received: $data");
      final String bId = data['bookingId'] ?? '';
      final String pId = data['partnerId'] ?? '';
      final String pName = data['partnerName'] ?? '';
      onPartnerAssigned(bId, pId, pName);
    });

    _socket!.onAny((event, data) {
      print("[WS] Event received: $event -> $data");
      if (data is Map<String, dynamic>) {
        onNotifyClient(event, data);
      }
    });

    _socket!.onDisconnect((_) => print("[WS] Disconnected from server"));
  }

  void subscribeToBooking(String bookingId) {
    if (_socket == null || !_socket!.connected) return;
    print("[WS] Subscribing to booking room: $bookingId");
    _socket!.emit('client:subscribe', {'bookingId': bookingId});
  }

  void disconnect() {
    if (_socket != null) {
      _socket!.disconnect();
      _socket = null;
    }
  }
}
