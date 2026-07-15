import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:client_app/main.dart';

void main() {
  testWidgets('App smoke test - loads login screen', (WidgetTester tester) async {
    SharedPreferences.setMockInitialValues({});

    // Build our app and trigger a frame.
    await tester.pumpWidget(const ProviderScope(child: OrbitClientApp()));

    // Verify that our app builds and we have a MaterialApp router.
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
