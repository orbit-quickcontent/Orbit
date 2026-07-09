import 'package:dio/dio.dart';
import '../models/user.dart';
import '../models/booking.dart';
import '../models/package.dart';

class ApiService {
  final Dio _dio;

  ApiService()
      : _dio = Dio(BaseOptions(
          baseUrl: const String.fromEnvironment('API_URL', defaultValue: 'http://10.0.2.2:5000/api'),
          connectTimeout: const Duration(seconds: 10),
          receiveTimeout: const Duration(seconds: 10),
          headers: {'Content-Type': 'application/json'},
        ));

  // Send Email OTP
  Future<String?> sendOtp(String email) async {
    try {
      final res = await _dio.post('/auth/send-otp', data: {'email': email});
      if (res.statusCode == 200) {
        return res.data['devOtp'] as String?;
      }
    } catch (e) {
      print("[API Error] sendOtp: $e");
    }
    return null;
  }

  // Verify Email OTP
  Future<bool> verifyOtp(String email, String otp) async {
    try {
      final res = await _dio.post('/auth/verify-otp', data: {'email': email, 'otp': otp});
      return res.statusCode == 200;
    } catch (e) {
      print("[API Error] verifyOtp: $e");
    }
    return false;
  }

  // Register / login user
  Future<UserProfile?> registerOrLoginUser(UserProfile profile) async {
    try {
      final res = await _dio.post('/users', data: profile.toJson());
      if (res.statusCode == 200 || res.statusCode == 201) {
        return UserProfile.fromJson(res.data['user'] ?? res.data);
      }
    } catch (e) {
      print("[API Error] registerOrLoginUser: $e");
    }
    return null;
  }

  // Fetch Packages
  Future<List<PackageInfo>> fetchPackages() async {
    try {
      final res = await _dio.get('/packages');
      if (res.statusCode == 200) {
        final List list = res.data['packages'] ?? res.data;
        return list.map((item) => PackageInfo.fromJson(item)).toList();
      }
    } catch (e) {
      print("[API Error] fetchPackages: $e");
    }
    return [];
  }

  // Fetch Client Bookings
  Future<List<BookingInfo>> fetchClientBookings(String userId) async {
    try {
      final res = await _dio.get('/bookings', queryParameters: {'userId': userId});
      if (res.statusCode == 200) {
        final List list = res.data['bookings'] ?? res.data;
        return list.map((item) => BookingInfo.fromJson(item)).toList();
      }
    } catch (e) {
      print("[API Error] fetchClientBookings: $e");
    }
    return [];
  }

  // Create Booking
  Future<BookingInfo?> createBooking({
    required String userId,
    required String packageId,
    required String bookingDate,
    required String timeSlot,
    String? location,
    String? notes,
    String? paymentId,
  }) async {
    try {
      final res = await _dio.post('/bookings', data: {
        'userId': userId,
        'packageId': packageId,
        'bookingDate': bookingDate,
        'timeSlot': timeSlot,
        'location': location,
        'notes': notes,
        'razorpayPaymentId': paymentId ?? 'mock_pay_${DateTime.now().millisecondsSinceEpoch}',
      });
      if (res.statusCode == 200 || res.statusCode == 201) {
        return BookingInfo.fromJson(res.data['booking'] ?? res.data);
      }
    } catch (e) {
      print("[API Error] createBooking: $e");
    }
    return null;
  }
}
