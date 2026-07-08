import 'package:dio/dio.dart';
import '../storage/secure_storage_service.dart';
import 'dio_client.dart';
import 'api_endpoints.dart';
import '../models/user_profile.dart';

class AuthService {
  final DioClient _dioClient;
  final SecureStorageService _secureStorage;

  AuthService({DioClient? dioClient, SecureStorageService? secureStorage})
      : _dioClient = dioClient ?? DioClient(),
        _secureStorage = secureStorage ?? SecureStorageService();

  Future<UserProfile?> login({
    required String email,
    required String name,
    required String phone,
  }) async {
    try {
      final dio = _dioClient.instance;

      // 1. Check if user exists in DB
      final usersRes = await dio.get(ApiEndpoints.users);
      String? userId;
      UserProfile? profile;

      if (usersRes.statusCode == 200) {
        final data = usersRes.data;
        final List usersList = data['users'] ?? [];
        final existingUser = usersList.firstWhere(
          (u) => u['email']?.toString().toLowerCase().trim() == email.toLowerCase().trim(),
          orElse: () => null,
        );

        if (existingUser != null) {
          userId = existingUser['id'];
          profile = UserProfile(
            name: existingUser['name'] ?? name,
            email: existingUser['email'] ?? email,
            phone: existingUser['phone'] ?? phone,
            location: existingUser['location'] ?? 'Mumbai, India',
            isOnline: true,
            isVerified: false,
            wallet: PartnerWallet(balance: 0, pendingClearance: 0, totalWithdrawn: 0),
            settings: PartnerSettings(
              notificationsEnabled: true,
              newBookingAlerts: true,
              paymentAlerts: true,
              autoSyncOnWifi: true,
              highQualityUpload: false,
              locationTracking: true,
            ),
          );
        }
      }

      // 2. If not found, create new User
      if (userId == null) {
        final createUserRes = await dio.post(
          ApiEndpoints.users,
          data: {
            'email': email,
            'name': name,
            'phone': phone,
            'role': 'USER',
          },
        );

        if (createUserRes.statusCode == 201 || createUserRes.statusCode == 200) {
          final data = createUserRes.data;
          final userJson = data['user'];
          userId = userJson['id'];
          profile = UserProfile.fromJson(userJson);
        }
      }

      if (userId != null && profile != null) {
        // We use the userId as the session token since auth is session-based
        await _secureStorage.saveSession(
          token: userId,
          role: 'USER',
          email: email,
          name: name,
          phone: phone,
        );
        return profile;
      }
    } catch (e) {
      print('[AuthService] Login failed: $e');
      rethrow;
    }
    return null;
  }

  Future<void> logout() async {
    await _secureStorage.clearSession();
  }

  Future<bool> isLoggedIn() async {
    return await _secureStorage.hasSession();
  }
}
