import 'package:flutter/material.dart';

class AppTheme {
  static const Color background = Color(0xFF09090B); // Slate Black
  static const Color surface = Color(0xFF18181B); // Slightly lighter card
  static const Color clientAccent = Color(0xFF00F0FF); // Electric Cyan
  static const Color partnerAccent = Color(0xFFA855F7); // Purple
  static const Color success = Color(0xFF00E676); // Neon Green
  static const Color textPrimary = Colors.white;
  static const Color textSecondary = Colors.grey;

  static ThemeData get clientTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: clientAccent,
      colorScheme: const ColorScheme.dark(
        primary: clientAccent,
        surface: surface,
        background: background,
      ),
      fontFamily: 'Inter', // Or standard sans-serif
      appBarTheme: const AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        centerTitle: true,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: clientAccent,
          foregroundColor: Colors.black,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: clientAccent, width: 1.5),
        ),
        labelStyle: const TextStyle(color: textSecondary),
      ),
      cardTheme: CardThemeData(
        color: surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: Color(0xFF27272A), width: 1), // Subtle border
        ),
        elevation: 0,
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: background,
        selectedItemColor: clientAccent,
        unselectedItemColor: textSecondary,
        type: BottomNavigationBarType.fixed,
      ),
    );
  }
}
