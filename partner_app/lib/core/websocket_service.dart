import 'package:socket_io_client/socket_io_client.dart' as IO;
import '../models/booking.dart';

class WebSocketService {
  IO.Socket? _socket;
  final String _wsUrl = const String.fromEnvironment('WS_URL', defaultValue: 'http://10.0.2.2:3003');

  void connect({
    required String partnerId,
    required bool isOnline,
    required Function(BookingInfo booking) onBookingDispatched,
    required Function(String bookingId) onBookingAcceptedByOther,
  }) {
    if (_socket != null && _socket!.connected) return;

    print("[WS] Partner connecting to $_wsUrl...");
    _socket = IO.io(_wsUrl, IO.OptionBuilder()
        .setTransports(['websocket', 'polling'])
        .setPath('/socket.io/')
        .enableReconnection()
        .setReconnectionDelay(3000)
        .build());

    _socket!.onConnect((_) {
      print("[WS] Partner connected! ID: $partnerId");
      if (isOnline) {
        _socket!.emit('partner:online', {'partnerId': partnerId});
      }
    });

    _socket!.on('booking:dispatched', (data) {
      print("[WS] New dispatch offer: $data");
      final Map<String, dynamic> bookingJson = data['booking'] ?? {};
      onBookingDispatched(BookingInfo.fromJson(bookingJson));
    });

    _socket!.on('booking:accepted-by-other', (data) {
      print("[WS] Booking accepted by other: $data");
      final String bId = data['bookingId'] ?? '';
      onBookingAcceptedByOther(bId);
    });

    _socket!.onDisconnect((_) => print("[WS] Partner disconnected"));
  }

  void goOnline(String partnerId) {
    if (_socket == null || !_socket!.connected) return;
    print("[WS] Partner online signal: $partnerId");
    _socket!.emit('partner:online', {'partnerId': partnerId});
  }

  void goOffline(String partnerId) {
    if (_socket == null || !_socket!.connected) return;
    print("[WS] Partner offline signal: $partnerId");
    _socket!.emit('partner:offline', {'partnerId': partnerId});
  }

  void disconnect(String partnerId) {
    if (_socket != null) {
      if (_socket!.connected) {
        _socket!.emit('partner:offline', {'partnerId': partnerId});
      }
      _socket!.disconnect();
      _socket = null;
    }
  }
}
