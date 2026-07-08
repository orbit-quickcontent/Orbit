import 'package:flutter/material.dart';

class DashboardHomeScreen extends StatelessWidget {
  const DashboardHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Text(
          'Client Dashboard Home',
          style: TextStyle(color: Colors.white, fontSize: 18),
        ),
      ),
    );
  }
}
