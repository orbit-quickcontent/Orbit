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
    required String location,
  }) async {
    try {
      final dio = _dioClient.instance;

      // 1. Fetch partners to check if one exists with this email
      final partnersRes = await dio.get(ApiEndpoints.partners);
      String? partnerId;
      UserProfile? profile;

      if (partnersRes.statusCode == 200) {
        final data = partnersRes.data;
        final List partnersList = data['partners'] ?? [];
        final existingPartner = partnersList.firstWhere(
          (p) => p['user']?['email']?.toString().toLowerCase().trim() == email.toLowerCase().trim(),
          orElse: () => null,
        );

        if (existingPartner != null) {
          partnerId = existingPartner['id'];
          final userJson = existingPartner['user'] ?? {};
          profile = UserProfile(
            name: userJson['name'] ?? name,
            email: userJson['email'] ?? email,
            phone: userJson['phone'] ?? phone,
            location: existingPartner['location'] ?? location,
            isOnline: existingPartner['availability'] ?? true,
            isVerified: existingPartner['verificationStatus'] == 'VERIFIED',
            wallet: PartnerWallet(
              balance: (existingPartner['balance'] ?? 0).toDouble(),
              pendingClearance: (existingPartner['pendingClearance'] ?? 0).toDouble(),
              totalWithdrawn: (existingPartner['totalWithdrawn'] ?? 0).toDouble(),
            ),
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

      // 2. If partner does not exist, check User or create one, then create partner
      if (partnerId == null) {
        String? dbUserId;

        // 2a. Check if User exists
        final usersRes = await dio.get(ApiEndpoints.users);
        if (usersRes.statusCode == 200) {
          final List usersList = usersRes.data['users'] ?? [];
          final existingUser = usersList.firstWhere(
            (u) => u['email']?.toString().toLowerCase().trim() == email.toLowerCase().trim(),
            orElse: () => null,
          );
          if (existingUser != null) {
            dbUserId = existingUser['id'];
          }
        }

        // 2b. If not found, create User
        if (dbUserId == null) {
          final createUserRes = await dio.post(
            ApiEndpoints.users,
            data: {
              'email': email,
              'name': name,
              'phone': phone,
              'role': 'PARTNER',
            },
          );
          if (createUserRes.statusCode == 201 || createUserRes.statusCode == 200) {
            dbUserId = createUserRes.data['user']?['id'];
          }
        }

        // 2c. Create Partner
        if (dbUserId != null) {
          final createPartnerRes = await dio.post(
            ApiEndpoints.partners,
            data: {
              'userId': dbUserId,
              'location': location,
              'deviceInfo': 'Android Device',
            },
          );
          if (createPartnerRes.statusCode == 201 || createPartnerRes.statusCode == 200) {
            final partnerData = createPartnerRes.data['partner'];
            partnerId = partnerData['id'];
            profile = UserProfile(
              name: name,
              email: email,
              phone: phone,
              location: location,
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
      }

      if (partnerId != null && profile != null) {
        await _secureStorage.saveSession(
          token: partnerId,
          role: 'PARTNER',
          email: email,
          name: name,
          phone: phone,
          partnerId: partnerId,
        );
        return profile;
      }
    } catch (e) {
      print('[AuthService] Partner Login failed: $e');
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
