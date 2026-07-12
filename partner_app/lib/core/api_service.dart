import 'package:dio/dio.dart';
import '../models/partner_profile.dart';
import '../models/booking.dart';

class ApiService {
  final Dio _dio;

  ApiService()
      : _dio = Dio(BaseOptions(
          baseUrl: const String.fromEnvironment('API_URL', defaultValue: 'http://10.0.2.2:5000/api'),
          connectTimeout: const Duration(seconds: 10),
          receiveTimeout: const Duration(seconds: 10),
          headers: {'Content-Type': 'application/json'},
        ));

  // Partner Profile
  Future<PartnerProfile?> fetchPartnerProfile(String partnerId) async {
    try {
      final res = await _dio.get('/partners/$partnerId');
      if (res.statusCode == 200) {
        return PartnerProfile.fromJson(res.data['partner'] ?? res.data);
      }
    } catch (e) {
      print("[API Error] fetchPartnerProfile: $e");
    }
    return null;
  }

  // Update Online / Offline toggle
  Future<bool> updateAvailability(String partnerId, bool availability) async {
    try {
      final res = await _dio.patch('/partners/$partnerId', data: {'availability': availability});
      return res.statusCode == 200;
    } catch (e) {
      print("[API Error] updateAvailability: $e");
    }
    return false;
  }

  // Fetch Available Dispatches
  Future<List<BookingInfo>> fetchAvailableBookings(String partnerId) async {
    try {
      final res = await _dio.get('/bookings/available', queryParameters: {'partnerId': partnerId});
      if (res.statusCode == 200) {
        final List list = res.data['bookings'] ?? res.data;
        return list.map((item) => BookingInfo.fromJson(item)).toList();
      }
    } catch (e) {
      print("[API Error] fetchAvailableBookings: $e");
    }
    return [];
  }

  // Accept Booking
  Future<BookingInfo?> acceptBooking(String bookingId, String partnerId) async {
    try {
      final res = await _dio.post('/bookings/$bookingId/accept', data: {'partnerId': partnerId});
      if (res.statusCode == 200) {
        return BookingInfo.fromJson(res.data['booking'] ?? res.data);
      }
    } catch (e) {
      print("[API Error] acceptBooking: $e");
    }
    return null;
  }

  // Decline Booking
  Future<bool> declineBooking(String bookingId, String partnerId) async {
    try {
      final res = await _dio.post('/bookings/$bookingId/decline', data: {'partnerId': partnerId});
      return res.statusCode == 200;
    } catch (e) {
      print("[API Error] declineBooking: $e");
    }
    return false;
  }

  // Complete Sync Footage
  Future<bool> syncComplete(String bookingId, List<String> urls) async {
    try {
      final res = await _dio.post('/bookings/$bookingId/sync-complete', data: {'footageUrls': urls});
      return res.statusCode == 200;
    } catch (e) {
      print("[API Error] syncComplete: $e");
    }
    return false;
  }

  // Link Bank Details
  Future<Map<String, dynamic>?> linkBankAccount({
    required String holderName,
    required String accNumber,
    required String ifsc,
    required String pan,
  }) async {
    try {
      final res = await _dio.post('/partners/link-bank', data: {
        'accountHolderName': holderName,
        'accountNumber': accNumber,
        'ifsc': ifsc,
        'pan': pan,
      });
      if (res.statusCode == 200) {
        return res.data;
      }
    } catch (e) {
      print("[API Error] linkBankAccount: $e");
    }
    return null;
  }

  // Withdraw Wallet Payout
  Future<bool> withdrawWallet(String partnerId, double amount) async {
    try {
      final res = await _dio.post('/partners/$partnerId/withdraw', data: {'amount': amount});
      return res.statusCode == 200;
    } catch (e) {
      print("[API Error] withdrawWallet: $e");
    }
    return false;
  }
}
