import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'core/theme.dart';
import 'core/storage_service.dart';
import 'features/auth/auth_screen.dart';
import 'features/auth/otp_screen.dart';
import 'features/home/home_screen.dart';
import 'features/booking/booking_flow_screen.dart';

final storageProvider = Provider((ref) => StorageService());

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: OrbitClientApp()));
}

class OrbitClientApp extends ConsumerWidget {
  const OrbitClientApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = GoRouter(
      initialLocation: '/',
      redirect: (context, state) async {
        final storage = ref.read(storageProvider);
        final isAuth = await storage.isAuthenticated();
        
        final loggingIn = state.matchedLocation == '/login' || state.matchedLocation == '/otp';
        if (!isAuth && !loggingIn) return '/login';
        if (isAuth && loggingIn) return '/';
        return null;
      },
      routes: [
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
          path: '/',
          builder: (context, state) => const HomeScreen(),
        ),
        GoRoute(
          path: '/booking',
          builder: (context, state) => const BookingFlowScreen(),
        ),
      ],
    );

    return MaterialApp.router(
      title: 'Orbit Client',
      theme: OrbitTheme.darkTheme,
      darkTheme: OrbitTheme.darkTheme,
      themeMode: ThemeMode.dark,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}
