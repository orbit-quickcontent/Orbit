import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../storage/secure_storage_service.dart';

class DioClient {
  final SecureStorageService _secureStorage;
  late final Dio _dio;

  static const String defaultBaseUrl = 'https://orbit-qgpock90x-orbit-quickcontents-projects.vercel.app';

  DioClient({SecureStorageService? secureStorage})
      : _secureStorage = secureStorage ?? SecureStorageService() {
    _dio = Dio(
      BaseOptions(
        baseUrl: defaultBaseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Dynamic base URL resolution
          final prefs = await SharedPreferences.getInstance();
          final customUrl = prefs.getString('custom_api_url');
          if (customUrl != null && customUrl.isNotEmpty) {
            options.baseUrl = customUrl;
          }

          // Auth token injection
          final token = await _secureStorage.getToken();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }

          // Local development bypass header
          options.headers['Bypass-Tunnel-Reminder'] = 'true';

          print('[DioRequest] ${options.method} ${options.baseUrl}${options.path}');
          return handler.next(options);
        },
        onResponse: (response, handler) {
          print('[DioResponse] Status ${response.statusCode} from ${response.requestOptions.path}');
          return handler.next(response);
        },
        onError: (DioException e, handler) {
          print('[DioError] ${e.type} - ${e.message} from ${e.requestOptions.path}');
          return handler.next(e);
        },
      ),
    );
  }

  Dio get instance => _dio;

  Future<void> updateBaseUrl(String newUrl) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('custom_api_url', newUrl);
  }
  
  Future<String> getBaseUrl() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('custom_api_url') ?? defaultBaseUrl;
  }
}
