import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../storage/secure_storage_service.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/bookings/presentation/dashboard_home_screen.dart';
import '../../features/bookings/presentation/booking_flow_screen.dart';
import '../../features/tracking/presentation/tracking_screen.dart';
import '../../features/auth/presentation/profile_screen.dart';

class AppRouter {
  static final SecureStorageService _secureStorage = SecureStorageService();

  static final GoRouter router = GoRouter(
    initialLocation: '/',
    redirect: (BuildContext context, GoRouterState state) async {
      final isLoggedIn = await _secureStorage.hasSession();
      final isLoggingIn = state.matchedLocation == '/auth';

      if (!isLoggedIn) {
        return '/auth';
      }

      if (isLoggedIn && isLoggingIn) {
        return '/';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/auth',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/',
        builder: (context, state) => const DashboardHomeScreen(),
      ),
      GoRoute(
        path: '/booking',
        builder: (context, state) => const BookingFlowScreen(),
      ),
      GoRoute(
        path: '/tracking',
        builder: (context, state) => const TrackingScreen(),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
    ],
  );
}
