import 'package:flutter/material.dart';

class PartnerWorkScreen extends StatelessWidget {
  const PartnerWorkScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Text(
          'Partner Active Work',
          style: TextStyle(color: Colors.white, fontSize: 18),
        ),
      ),
    );
  }
}
