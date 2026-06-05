// This is a basic Flutter widget test for Orbit Client app.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:orbit_client/main.dart';

void main() {
  testWidgets('MyApp renders custom home widget test', (WidgetTester tester) async {
    // Build our app with a stubbed home widget and trigger a frame.
    await tester.pumpWidget(const MyApp(
      home: Scaffold(
        body: Text('Orbit Client Test'),
      ),
    ));

    // Verify that the custom home widget is built successfully.
    expect(find.text('Orbit Client Test'), findsOneWidget);
  });
}
