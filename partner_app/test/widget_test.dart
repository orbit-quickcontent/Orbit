import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:partner_app/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const OrbitPartnerApp());

    // Verify that the MaterialApp is built successfully.
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
