import 'package:flutter/material.dart';

class PartnerEarningsScreen extends StatelessWidget {
  const PartnerEarningsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Text(
          'Partner Earnings & Bank Linking',
          style: TextStyle(color: Colors.white, fontSize: 18),
        ),
      ),
    );
  }
}
