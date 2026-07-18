import 'package:flutter/foundation.dart';
import 'package:socket_io_client/socket_io_client.dart' as socket_io;
import '../models/booking.dart';

class WebSocketService {
  socket_io.Socket? _socket;
  final String _wsUrl = const String.fromEnvironment('WS_URL', defaultValue: 'http://10.0.2.2:3003');

  void connect({
    required String partnerId,
    required bool isOnline,
    required Function(BookingInfo booking) onBookingDispatched,
    required Function(String bookingId) onBookingAcceptedByOther,
  }) {
    if (_socket != null && _socket!.connected) return;

    debugPrint("[WS] Partner connecting to $_wsUrl...");
    _socket = socket_io.io(_wsUrl, socket_io.OptionBuilder()
        .setTransports(['websocket', 'polling'])
        .setPath('/socket.io/')
        .enableReconnection()
        .setReconnectionDelay(3000)
        .build());

    _socket!.onConnect((_) {
      debugPrint("[WS] Partner connected! ID: $partnerId");
      if (isOnline) {
        _socket!.emit('partner:online', {'partnerId': partnerId});
      }
    });

    _socket!.on('booking:dispatched', (data) {
      debugPrint("[WS] New dispatch offer: $data");
      final Map<String, dynamic> bookingJson = data['booking'] ?? {};
      onBookingDispatched(BookingInfo.fromJson(bookingJson));
    });

    _socket!.on('booking:accepted-by-other', (data) {
      debugPrint("[WS] Booking accepted by other: $data");
      final String bId = data['bookingId'] ?? '';
      onBookingAcceptedByOther(bId);
    });

    _socket!.onDisconnect((_) => debugPrint("[WS] Partner disconnected"));
  }

  void goOnline(String partnerId) {
    if (_socket == null || !_socket!.connected) return;
    debugPrint("[WS] Partner online signal: $partnerId");
    _socket!.emit('partner:online', {'partnerId': partnerId});
  }

  void goOffline(String partnerId) {
    if (_socket == null || !_socket!.connected) return;
    debugPrint("[WS] Partner offline signal: $partnerId");
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
