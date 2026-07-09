import 'package:flutter/material.dart';

class OrbitTheme {
  static const Color background = Color(0xFF000000);
  static const Color cardBackground = Color(0xFF0A0A0A);
  static const Color border = Color(0xFF1F1F1F);
  
  static const Color clientCyan = Color(0xFF00BFFF);
  static const Color clientPurple = Color(0xFFA020F0);
  
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFF888888);
  static const Color textMuted = Color(0xFF444444);

  static const LinearGradient clientGradient = LinearGradient(
    colors: [clientCyan, clientPurple],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static ThemeData get darkTheme {
    return ThemeData.dark().copyWith(
      scaffoldBackgroundColor: background,
      cardColor: cardBackground,
      dividerColor: border,
      colorScheme: const ColorScheme.dark(
        primary: clientCyan,
        secondary: clientPurple,
        surface: cardBackground,
        background: background,
      ),
      textTheme: const TextTheme(
        headlineLarge: TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: textPrimary),
        headlineMedium: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: textPrimary),
        bodyLarge: TextStyle(fontSize: 14, color: textPrimary),
        bodyMedium: TextStyle(fontSize: 12, color: textSecondary),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        centerTitle: true,
      ),
    );
  }
}
