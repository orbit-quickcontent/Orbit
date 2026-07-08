import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/routing/app_router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF09090B),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  runApp(
    const ProviderScope(
      child: OrbitPartnerApp(),
    ),
  );
}

class OrbitPartnerApp extends StatelessWidget {
  const OrbitPartnerApp({super.key});

  @override
  Widget build(BuildContext context) {
    const Color partnerAccent = Color(0xFFA855F7); // Purple accent

    return MaterialApp.router(
      title: 'ORBIT Partner',
      debugShowCheckedModeBanner: false,
      routerConfig: AppRouter.router,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF09090B), // Slate Black
        primaryColor: partnerAccent,
        colorScheme: const ColorScheme.dark(
          primary: partnerAccent,
          secondary: partnerAccent,
          background: Color(0xFF09090B),
          surface: Color(0xFF18181B),
          error: Colors.redAccent,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF09090B),
          elevation: 0,
          centerTitle: true,
          titleTextStyle: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.2,
          ),
        ),
        useMaterial3: true,
      ),
    );
  }
}
