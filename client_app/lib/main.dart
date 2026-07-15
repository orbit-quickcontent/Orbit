import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_core/firebase_core.dart';
import 'features/auth/auth_screen.dart';
import 'features/auth/otp_screen.dart';
import 'features/booking/booking_flow_screen.dart';
import 'features/home/home_screen.dart';
import 'core/storage_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await Firebase.initializeApp();
  } catch (e) {
    debugPrint("[Firebase] Initialization skipped or already set: $e");
  }
  runApp(const ProviderScope(child: OrbitClientApp()));
}

final _router = GoRouter(
  initialLocation: '/',
  redirect: (context, state) async {
    final storage = StorageService();
    final user = await storage.getUser();
    final loggingIn = state.matchedLocation == '/login' || state.matchedLocation == '/otp';
    if (user == null && !loggingIn) {
      return '/login';
    }
    if (user != null && loggingIn) {
      return '/';
    }
    return null;
  },
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const AuthScreen(),
    ),
    GoRoute(
      path: '/otp',
      builder: (context, state) {
        final email = state.extra as String? ?? '';
        return OtpScreen(email: email);
      },
    ),
    GoRoute(
      path: '/booking',
      builder: (context, state) => const BookingFlowScreen(),
    ),
  ],
);

class OrbitClientApp extends StatelessWidget {
  const OrbitClientApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Orbit Client',
      theme: ThemeData.dark(),
      debugShowCheckedModeBanner: false,
      routerConfig: _router,
    );
  }
}

