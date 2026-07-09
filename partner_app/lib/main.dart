import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'core/theme.dart';
import 'core/storage_service.dart';
import 'features/auth/auth_screen.dart';
import 'features/home/home_screen.dart';
import 'features/work/work_detail_screen.dart';

final storageProvider = Provider((ref) => StorageService());

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: OrbitPartnerApp()));
}

class OrbitPartnerApp extends ConsumerWidget {
  const OrbitPartnerApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = GoRouter(
      initialLocation: '/',
      redirect: (context, state) async {
        final storage = ref.read(storageProvider);
        final isAuth = await storage.isAuthenticated();
        
        final loggingIn = state.matchedLocation == '/login';
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
          path: '/',
          builder: (context, state) => const HomeScreen(),
        ),
        GoRoute(
          path: '/work-detail',
          builder: (context, state) => const WorkDetailScreen(),
        ),
      ],
    );

    return MaterialApp.router(
      title: 'Orbit Partner',
      theme: OrbitTheme.darkTheme,
      darkTheme: OrbitTheme.darkTheme,
      themeMode: ThemeMode.dark,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}
