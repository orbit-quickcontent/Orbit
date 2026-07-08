import 'package:flutter/material.dart';

class TrackingScreen extends StatelessWidget {
  const TrackingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Text(
          'Client Tracking Live Map',
          style: TextStyle(color: Colors.white, fontSize: 18),
        ),
      ),
    );
  }
}
