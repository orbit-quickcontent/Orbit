import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../core/api_service.dart';
import '../../core/storage_service.dart';
import '../../models/user.dart';

final apiServiceProvider = Provider((ref) => ApiService());

class AuthScreen extends ConsumerStatefulWidget {
  const AuthScreen({super.key});

  @override
  ConsumerState<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends ConsumerState<AuthScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  bool _isLoading = false;
  String _selectedAvatarPreset = '🚀';

  final List<String> _presets = ['🚀', '🌟', '🎬', '🔥', '⚡', '🎮'];

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _socialMockLogin(String provider) async {
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 1));
    final email = '${provider.toLowerCase()}user@orbitlogic.io';
    final name = '$provider User';

    final api = ref.read(apiServiceProvider);
    final user = await api.registerOrLoginUser(
      UserProfile(
        id: 'usr-${DateTime.now().millisecondsSinceEpoch}',
        name: name,
        email: email,
        phone: '+919999988888',
        avatarType: 'color',
        avatar: 'from-orbit-cyan to-orbit-purple',
        avatarEmoji: _selectedAvatarPreset,
      ),
    );

    if (user != null) {
      final storage = StorageService();
      await storage.saveUser(user);
      if (mounted) context.go('/');
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to sign in. Please try again.')),
        );
      }
    }
    setState(() => _isLoading = false);
  }

  void _handleEmailSubmit() async {
    final email = _emailController.text.trim();
    final name = _nameController.text.trim();
    final phone = _phoneController.text.trim();

    if (name.isEmpty || email.isEmpty || phone.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill out all fields.')),
      );
      return;
    }

    setState(() => _isLoading = true);
    final api = ref.read(apiServiceProvider);
    final otp = await api.sendOtp(email);

    setState(() => _isLoading = false);
    if (otp != null && mounted) {
      // Save temp state inside ref or pass user
      context.push('/otp', extra: email);
    } else {
      // Offline / permission mock bypass fallback
      final storage = StorageService();
      await storage.saveUser(
        UserProfile(
          id: 'usr-demo',
          name: name,
          email: email,
          phone: phone,
          avatarType: 'color',
          avatarEmoji: _selectedAvatarPreset,
        ),
      );
      if (mounted) context.go('/');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 48.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 40),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: const BoxDecoration(
                    color: OrbitTheme.clientCyan,
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: Icon(Icons.circle, color: Colors.white, size: 24),
                  ),
                ),
                const SizedBox(width: 12),
                const Text(
                  'ORBIT',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.5,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            const Text(
              'Join the Orbit',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 6),
            const Text(
              'Sign in or create your account to get started',
              style: TextStyle(color: OrbitTheme.textSecondary, fontSize: 13),
            ),
            const SizedBox(height: 32),

            // Social Login Buttons
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    icon: const Icon(
                      Icons.g_mobiledata,
                      size: 28,
                      color: Colors.red,
                    ),
                    label: const Text(
                      'Google',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    onPressed: _isLoading
                        ? null
                        : () => _socialMockLogin('Google'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: const BorderSide(color: OrbitTheme.border),
                      ),
                    ),
                    icon: const Icon(Icons.apple, size: 20),
                    label: const Text(
                      'Apple',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    onPressed: _isLoading
                        ? null
                        : () => _socialMockLogin('Apple'),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),
            const Row(
              children: [
                Expanded(child: Divider(color: OrbitTheme.border)),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16.0),
                  child: Text(
                    'OR EMAIL',
                    style: TextStyle(
                      color: OrbitTheme.textMuted,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Expanded(child: Divider(color: OrbitTheme.border)),
              ],
            ),
            const SizedBox(height: 24),

            // Avatar Presets Picker
            const Text(
              'Choose Your Profile Emoji',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              children: _presets.map((preset) {
                final isSelected = _selectedAvatarPreset == preset;
                return GestureDetector(
                  onTap: () => setState(() => _selectedAvatarPreset = preset),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? OrbitTheme.clientCyan.withValues(alpha: 0.15)
                          : OrbitTheme.cardBackground,
                      border: Border.all(
                        color: isSelected
                            ? OrbitTheme.clientCyan
                            : OrbitTheme.border,
                      ),
                      shape: BoxShape.circle,
                    ),
                    child: Text(preset, style: const TextStyle(fontSize: 20)),
                  ),
                );
              }).toList(),
            ),

            const SizedBox(height: 32),

            // Input Fields
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: 'Full Name *',
                filled: true,
                fillColor: OrbitTheme.cardBackground,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: InputDecoration(
                labelText: 'Email *',
                filled: true,
                fillColor: OrbitTheme.cardBackground,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _phoneController,
              keyboardType: TextInputType.phone,
              decoration: InputDecoration(
                labelText: 'Phone *',
                prefixText: '+91 ',
                filled: true,
                fillColor: OrbitTheme.cardBackground,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 32),

            SizedBox(
              width: double.infinity,
              height: 52,
              child: Container(
                decoration: BoxDecoration(
                  gradient: OrbitTheme.clientGradient,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onPressed: _isLoading ? null : _handleEmailSubmit,
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Verify & Continue',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: Colors.white,
                              ),
                            ),
                            SizedBox(width: 8),
                            Icon(Icons.arrow_forward, color: Colors.white),
                          ],
                        ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
