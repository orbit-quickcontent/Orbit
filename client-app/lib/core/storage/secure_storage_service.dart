import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  final FlutterSecureStorage _storage;

  SecureStorageService({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage(
          aOptions: AndroidOptions(encryptedSharedPreferences: true),
        );

  static const String _keyToken = 'auth_token';
  static const String _keyRole = 'user_role';
  static const String _keyEmail = 'user_email';
  static const String _keyName = 'user_name';
  static const String _keyPhone = 'user_phone';
  static const String _keyPartnerId = 'partner_id';

  Future<void> saveSession({
    required String token,
    required String role,
    required String email,
    String? name,
    String? phone,
    String? partnerId,
  }) async {
    await _storage.write(key: _keyToken, value: token);
    await _storage.write(key: _keyRole, value: role);
    await _storage.write(key: _keyEmail, value: email);
    if (name != null) await _storage.write(key: _keyName, value: name);
    if (phone != null) await _storage.write(key: _keyPhone, value: phone);
    if (partnerId != null) await _storage.write(key: _keyPartnerId, value: partnerId);
  }

  Future<String?> getToken() async => await _storage.read(key: _keyToken);
  Future<String?> getRole() async => await _storage.read(key: _keyRole);
  Future<String?> getEmail() async => await _storage.read(key: _keyEmail);
  Future<String?> getName() async => await _storage.read(key: _keyName);
  Future<String?> getPhone() async => await _storage.read(key: _keyPhone);
  Future<String?> getPartnerId() async => await _storage.read(key: _keyPartnerId);

  Future<void> clearSession() async {
    await _storage.delete(key: _keyToken);
    await _storage.delete(key: _keyRole);
    await _storage.delete(key: _keyEmail);
    await _storage.delete(key: _keyName);
    await _storage.delete(key: _keyPhone);
    await _storage.delete(key: _keyPartnerId);
  }

  Future<bool> hasSession() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }
}
