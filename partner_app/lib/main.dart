import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await Firebase.initializeApp();
  } catch (e) {
    print("[Firebase] Initialization skipped or already set: $e");
  }
  runApp(const OrbitPartnerApp());
}

class OrbitPartnerApp extends StatelessWidget {
  const OrbitPartnerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Orbit Partner',
      theme: ThemeData.dark(),
      debugShowCheckedModeBanner: false,
      home: const OrbitWebViewScreen(),
    );
  }
}

class OrbitWebViewScreen extends StatefulWidget {
  const OrbitWebViewScreen({super.key});

  @override
  State<OrbitWebViewScreen> createState() => _OrbitWebViewScreenState();
}

class _OrbitWebViewScreenState extends State<OrbitWebViewScreen> {
  late final WebViewController _controller;
  String? _pushToken;

  @override
  void initState() {
    super.initState();
    _initPermissionsAndPush();
    _initWebView();
  }

  Future<void> _initPermissionsAndPush() async {
    // Request location permissions
    try {
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        await Geolocator.requestPermission();
      }
    } catch (e) {
      print("[Geolocator] Permission check error: $e");
    }

    // Request notification permissions
    try {
      FirebaseMessaging messaging = FirebaseMessaging.instance;
      NotificationSettings settings = await messaging.requestPermission(
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        criticalAlert: false,
        provisional: false,
        sound: true,
      );
      if (settings.authorizationStatus == AuthorizationStatus.authorized) {
        _pushToken = await messaging.getToken();
        print("[Push] Token generated: $_pushToken");
        _injectPushToken();
      }
    } catch (e) {
      print("[Push] Permission or token error: $e");
    }
  }

  void _initWebView() {
    // Partner App loads the partner workspace root directly
    const webUrl = String.fromEnvironment('WEB_URL', defaultValue: 'http://10.0.2.2:3000/partner');
    
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0x00000000))
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageFinished: (String url) {
            _injectPushToken();
          },
        ),
      )
      ..addJavaScriptChannel(
        'OrbitNative',
        onMessageReceived: (JavaScriptMessage message) async {
          final data = jsonDecode(message.message);
          final action = data['action'] as String?;
          final callbackId = data['callbackId'] as String?;

          if (action == 'getLocation') {
            _handleGetLocation(callbackId);
          } else if (action == 'getPushToken') {
            _handleGetPushToken(callbackId);
          }
        },
      )
      ..loadRequest(Uri.parse(webUrl));
  }

  Future<void> _injectPushToken() async {
    if (_pushToken != null) {
      final js = "if (window.updatePushToken) { window.updatePushToken('$_pushToken'); }";
      try {
        await _controller.runJavaScript(js);
      } catch (e) {
        print("[JS-Inject-Err] Failed to inject token: $e");
      }
    }
  }

  Future<void> _handleGetLocation(String? callbackId) async {
    try {
      final pos = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      final result = {
        'success': true,
        'latitude': pos.latitude,
        'longitude': pos.longitude,
      };
      _sendCallback(callbackId, result);
    } catch (e) {
      _sendCallback(callbackId, {'success': false, 'error': e.toString()});
    }
  }

  void _handleGetPushToken(String? callbackId) {
    if (_pushToken != null) {
      _sendCallback(callbackId, {'success': true, 'token': _pushToken});
    } else {
      _sendCallback(callbackId, {'success': false, 'error': 'Token not available'});
    }
  }

  void _sendCallback(String? callbackId, Map<String, dynamic> data) {
    if (callbackId == null) return;
    final jsonStr = jsonEncode(data);
    final js = "if (window.onOrbitNativeCallback) { window.onOrbitNativeCallback('$callbackId', $jsonStr); }";
    _controller.runJavaScript(js).catchError((e) {
      print("[JS-Callback-Err] Failed callback: $e");
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: WebViewWidget(controller: _controller),
      ),
    );
  }
}
