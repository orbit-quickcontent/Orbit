import 'package:flutter/material.dart';

class PartnerDashboardScreen extends StatelessWidget {
  const PartnerDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Text(
          'Partner Dashboard Feed',
          style: TextStyle(color: Colors.white, fontSize: 18),
        ),
      ),
    );
  }
}
