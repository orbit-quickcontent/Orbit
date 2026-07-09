import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../core/api_service.dart';
import '../../core/storage_service.dart';
import '../../models/user.dart';

class OtpScreen extends ConsumerStatefulWidget {
  final String email;

  const OtpScreen({super.key, required this.email});

  @override
  ConsumerState<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends ConsumerState<OtpScreen> {
  final List<TextEditingController> _controllers = List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(6, (_) => FocusNode());
  bool _isLoading = false;
  String? _errorMsg;

  @override
  void dispose() {
    for (var c in _controllers) {
      c.dispose();
    }
    for (var f in _focusNodes) {
      f.dispose();
    }
    super.dispose();
  }

  void _verifyOtp() async {
    final code = _controllers.map((c) => c.text).join();
    if (code.length < 6) return;

    setState(() {
      _isLoading = true;
      _errorMsg = null;
    });

    final api = ApiService();
    final verified = await api.verifyOtp(widget.email, code);

    if (verified) {
      // Mock retrieve user details and register
      final user = await api.registerOrLoginUser(UserProfile(
        id: 'usr-${DateTime.now().millisecondsSinceEpoch}',
        name: 'Demo Client',
        email: widget.email,
        phone: '+919999988888',
        avatarType: 'color',
      ));

      if (user != null) {
        final storage = StorageService();
        await storage.saveUser(user);
        if (mounted) context.go('/');
      } else {
        setState(() => _errorMsg = 'Failed to link user profile. Try again.');
      }
    } else {
      setState(() {
        _errorMsg = 'Invalid OTP. Please try again.';
        for (var c in _controllers) {
          c.clear();
        }
        _focusNodes[0].requestFocus();
      });
    }
    setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 20),
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: OrbitTheme.clientCyan.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Center(
                child: Icon(Icons.security, color: OrbitTheme.clientCyan, size: 36),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Check Your Inbox',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 8),
            Text(
              'We sent a 6-digit verification code to\n${widget.email}',
              textAlign: TextAlign.center,
              style: const TextStyle(color: OrbitTheme.textSecondary, fontSize: 13, height: 1.4),
            ),
            const SizedBox(height: 36),

            // OTP Box inputs
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: List.generate(6, (index) {
                return SizedBox(
                  width: 48,
                  height: 56,
                  child: TextField(
                    controller: _controllers[index],
                    focusNode: _focusNodes[index],
                    keyboardType: TextInputType.number,
                    textAlign: TextAlign.center,
                    maxLength: 1,
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    decoration: InputDecoration(
                      counterText: '',
                      filled: true,
                      fillColor: OrbitTheme.cardBackground,
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: OrbitTheme.border),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: OrbitTheme.clientCyan, width: 2),
                      ),
                    ),
                    onChanged: (val) {
                      if (val.isNotEmpty && index < 5) {
                        _focusNodes[index + 1].requestFocus();
                      }
                      if (val.isEmpty && index > 0) {
                        _focusNodes[index - 1].requestFocus();
                      }
                      if (_controllers.every((c) => c.text.isNotEmpty)) {
                        _verifyOtp();
                      }
                    },
                  ),
                );
              }),
            ),

            const SizedBox(height: 24),
            if (_errorMsg != null)
              Text(_errorMsg!, style: const TextStyle(color: Colors.redAccent, fontSize: 13)),
            const SizedBox(height: 32),

            if (_isLoading)
              const CircularProgressIndicator(color: OrbitTheme.clientCyan)
            else
              TextButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Mock OTP Code is: 123456')),
                  );
                },
                child: const Text(
                  'Bypass with Mock Code (Dev Helper)',
                  style: TextStyle(color: OrbitTheme.clientCyan, fontWeight: FontWeight.bold),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
