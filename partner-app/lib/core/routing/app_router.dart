import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../storage/secure_storage_service.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/partner/presentation/partner_dashboard_screen.dart';
import '../../features/partner/presentation/partner_work_screen.dart';
import '../../features/partner/presentation/partner_earnings_screen.dart';
import '../../features/partner/presentation/partner_settings_screen.dart';

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
        builder: (context, state) => const PartnerDashboardScreen(),
      ),
      GoRoute(
        path: '/work',
        builder: (context, state) => const PartnerWorkScreen(),
      ),
      GoRoute(
        path: '/earnings',
        builder: (context, state) => const PartnerEarningsScreen(),
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const PartnerSettingsScreen(),
      ),
    ],
  );
}
