import 'package:flutter/material.dart';

class BookingFlowScreen extends StatelessWidget {
  const BookingFlowScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Text(
          'Client Booking Flow',
          style: TextStyle(color: Colors.white, fontSize: 18),
        ),
      ),
    );
  }
}
