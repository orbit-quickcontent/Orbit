import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_core/firebase_core.dart';
import 'features/auth/auth_screen.dart';
import 'features/home/home_screen.dart';
import 'core/storage_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await Firebase.initializeApp();
  } catch (e) {
    debugPrint("[Firebase] Initialization skipped or already set: $e");
  }
  runApp(const ProviderScope(child: OrbitPartnerApp()));
}

final _router = GoRouter(
  initialLocation: '/',
  redirect: (context, state) async {
    final storage = StorageService();
    final profile = await storage.getProfile();
    final loggingIn = state.matchedLocation == '/login';
    if (profile == null && !loggingIn) {
      return '/login';
    }
    if (profile != null && loggingIn) {
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
  ],
);

class OrbitPartnerApp extends StatelessWidget {
  const OrbitPartnerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Orbit Partner',
      theme: ThemeData.dark(),
      debugShowCheckedModeBanner: false,
      routerConfig: _router,
    );
  }
}

