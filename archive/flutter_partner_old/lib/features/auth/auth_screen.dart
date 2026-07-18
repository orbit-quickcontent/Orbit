import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../core/storage_service.dart';
import '../../models/partner_profile.dart';

class AuthScreen extends ConsumerStatefulWidget {
  const AuthScreen({super.key});

  @override
  ConsumerState<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends ConsumerState<AuthScreen> {
  bool _isLoading = false;

  void _socialMockLogin(String provider) async {
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 1));
    
    // Seed default partner (Arjun) to match database seeder!
    final profile = PartnerProfile(
      id: 'partner-arjun-123',
      userId: 'usr-arjun-partner',
      name: 'Arjun Sharma',
      email: 'arjun@orbitlogic.io',
      phone: '+919999911111',
      location: 'Noida, Sector 62',
      availability: true,
      isVerified: true,
      verificationStatus: 'VERIFIED',
      deviceInfo: 'Android Simulator',
      wallet: PartnerWallet(balance: 1400.0, pendingClearance: 700.0, totalWithdrawn: 2100.0),
    );

    final storage = StorageService();
    await storage.saveProfile(profile);

    setState(() => _isLoading = false);
    if (mounted) context.go('/');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: const BoxDecoration(
                    color: OrbitTheme.partnerPurple,
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
              'Partner Portal',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 6),
            const Text(
              'Sign in to receive dispatched filmmaker gigs near you',
              style: TextStyle(color: OrbitTheme.textSecondary, fontSize: 13),
            ),
            const SizedBox(height: 48),

            if (_isLoading)
              const CircularProgressIndicator(color: OrbitTheme.partnerPurple)
            else ...[
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  icon: const Icon(Icons.g_mobiledata, size: 28, color: Colors.red),
                  label: const Text('Sign in with Google', style: TextStyle(fontWeight: FontWeight.bold)),
                  onPressed: () => _socialMockLogin('Google'),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.black,
                    foregroundColor: Colors.white,
                    side: const BorderSide(color: OrbitTheme.border),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  icon: const Icon(Icons.apple, size: 20),
                  label: const Text('Sign in with Apple', style: TextStyle(fontWeight: FontWeight.bold)),
                  onPressed: () => _socialMockLogin('Apple'),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
