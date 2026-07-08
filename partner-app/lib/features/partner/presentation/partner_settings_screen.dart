import 'package:flutter/material.dart';

class PartnerSettingsScreen extends StatelessWidget {
  const PartnerSettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Text(
          'Partner Settings & Profile',
          style: TextStyle(color: Colors.white, fontSize: 18),
        ),
      ),
    );
  }
}
