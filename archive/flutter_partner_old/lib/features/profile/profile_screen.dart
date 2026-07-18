import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme.dart';
import '../../core/api_service.dart';
import '../../models/partner_profile.dart';
import '../home/home_screen.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  final PartnerProfile profile;
  final VoidCallback onLogout;

  const ProfileScreen({super.key, required this.profile, required this.onLogout});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  final _holderController = TextEditingController();
  final _accController = TextEditingController();
  final _ifscController = TextEditingController();
  final _panController = TextEditingController();
  bool _isLinking = false;

  @override
  void dispose() {
    _holderController.dispose();
    _accController.dispose();
    _ifscController.dispose();
    _panController.dispose();
    super.dispose();
  }

  void _showLinkBankDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: OrbitTheme.cardBackground,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom + 24,
          top: 24,
          left: 24,
          right: 24,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Link Bank Account', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
            const SizedBox(height: 6),
            const Text('Verified instantly via a ₹1 penny drop mock API check.', style: TextStyle(color: OrbitTheme.textSecondary, fontSize: 11)),
            const SizedBox(height: 20),
            TextField(controller: _holderController, decoration: const InputDecoration(labelText: 'Account Holder Name')),
            const SizedBox(height: 12),
            TextField(controller: _accController, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Bank Account Number')),
            const SizedBox(height: 12),
            TextField(controller: _ifscController, textCapitalization: TextCapitalization.characters, decoration: const InputDecoration(labelText: 'IFSC Code')),
            const SizedBox(height: 12),
            TextField(controller: _panController, textCapitalization: TextCapitalization.characters, decoration: const InputDecoration(labelText: 'PAN Number')),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: Container(
                decoration: BoxDecoration(gradient: OrbitTheme.partnerGradient, borderRadius: BorderRadius.circular(12)),
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.transparent, shadowColor: Colors.transparent),
                  onPressed: _linkBank,
                  child: _isLinking
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Link & Verify Account', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _linkBank() async {
    final holder = _holderController.text.trim();
    final acc = _accController.text.trim();
    final ifsc = _ifscController.text.trim();
    final pan = _panController.text.trim();

    if (holder.isEmpty || acc.isEmpty || ifsc.isEmpty || pan.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill out all fields.')),
      );
      return;
    }

    Navigator.pop(context); // close modal
    setState(() => _isLinking = true);

    final api = ApiService();
    final response = await api.linkBankAccount(
      holderName: holder,
      accNumber: acc,
      ifsc: ifsc,
      pan: pan,
    );

    setState(() => _isLinking = false);

    if (response != null && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('🎉 Bank account verified successfully! (Penny drop cleared)'), backgroundColor: Colors.green),
      );

      // Save bank verification locally in state
      ref.read(partnerProfileProvider.notifier).state = widget.profile.copyWith(
        verificationStatus: 'VERIFIED',
        bankAccount: BankAccount(
          id: 'bank-acc-1',
          bankName: 'State Bank of India',
          accountNumber: acc.substring(acc.length - 4), // masked
          ifscCode: ifsc,
          accountHolderName: holder,
          isVerified: true,
          linkedAt: DateTime.now().toIso8601String(),
        ),
      );
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Verification failed. Invalid Account or IFSC.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isLinked = widget.profile.bankAccount != null;

    return ListView(
      padding: const EdgeInsets.all(16.0),
      children: [
        // Avatar Verified Card
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: OrbitTheme.cardBackground,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: OrbitTheme.border),
          ),
          child: Column(
            children: [
              const CircleAvatar(
                radius: 36,
                backgroundColor: OrbitTheme.partnerPurple,
                child: Text('AS', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white)),
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(widget.profile.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
                  const SizedBox(width: 6),
                  const Icon(Icons.verified, color: Colors.greenAccent, size: 18),
                ],
              ),
              const SizedBox(height: 4),
              Text(widget.profile.email, style: const TextStyle(color: OrbitTheme.textSecondary, fontSize: 12)),
              const SizedBox(height: 4),
              Text(widget.profile.phone, style: const TextStyle(color: OrbitTheme.textSecondary, fontSize: 12)),
            ],
          ),
        ),

        const SizedBox(height: 20),

        // Statistics row
        Row(
          children: [
            Expanded(child: _buildMiniStat('Rating', '4.9 ★')),
            const SizedBox(width: 8),
            Expanded(child: _buildMiniStat('Projects', '42')),
            const SizedBox(width: 8),
            Expanded(child: _buildMiniStat('KYC', 'Verified')),
          ],
        ),

        const SizedBox(height: 24),
        const Text('Payout Bank Account', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),

        // Bank Card
        GestureDetector(
          onTap: isLinked ? null : _showLinkBankDialog,
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: OrbitTheme.cardBackground,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isLinked ? Colors.greenAccent.withValues(alpha: 0.2) : OrbitTheme.border,
                style: isLinked ? BorderStyle.solid : BorderStyle.none, // dashed if not linked
              ),
            ),
            child: isLinked
                ? Row(
                    children: [
                      const Icon(Icons.account_balance, color: Colors.greenAccent, size: 28),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(widget.profile.bankAccount!.bankName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                            const SizedBox(height: 2),
                            Text('A/C: **** **** ${widget.profile.bankAccount!.accountNumber}', style: const TextStyle(color: OrbitTheme.textSecondary, fontSize: 10)),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(color: Colors.greenAccent.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(6)),
                        child: const Text('LINKED', style: TextStyle(color: Colors.greenAccent, fontSize: 8, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  )
                : const Center(
                    child: Column(
                      children: [
                        Icon(Icons.add_card, color: OrbitTheme.textSecondary, size: 24),
                        SizedBox(height: 8),
                        Text('+ Link Bank Account', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        SizedBox(height: 2),
                        Text('Required to receive ₹700 payout credits', style: TextStyle(color: OrbitTheme.textSecondary, fontSize: 10)),
                      ],
                    ),
                  ),
          ),
        ),

        const SizedBox(height: 28),
        ListTile(
          leading: const Icon(Icons.shield_outlined, color: OrbitTheme.partnerPurple),
          title: const Text('Privacy Shield', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
          trailing: const Icon(Icons.chevron_right, size: 16),
          onTap: () {},
        ),
        const Divider(color: OrbitTheme.border),
        ListTile(
          leading: const Icon(Icons.settings_outlined, color: OrbitTheme.partnerPurple),
          title: const Text('App Settings', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
          trailing: const Icon(Icons.chevron_right, size: 16),
          onTap: () {},
        ),
        const Divider(color: OrbitTheme.border),
        ListTile(
          leading: const Icon(Icons.logout, color: Colors.redAccent),
          title: const Text('Log Out', style: TextStyle(color: Colors.redAccent, fontSize: 13, fontWeight: FontWeight.bold)),
          trailing: const Icon(Icons.chevron_right, size: 16),
          onTap: widget.onLogout,
        ),
      ],
    );
  }

  Widget _buildMiniStat(String label, String val) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: OrbitTheme.cardBackground,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: OrbitTheme.border),
      ),
      child: Column(
        children: [
          Text(label, style: const TextStyle(fontSize: 10, color: OrbitTheme.textSecondary)),
          const SizedBox(height: 4),
          Text(val, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

// Extension to allow copyWith on PartnerProfile
extension CopyPartnerProfile on PartnerProfile {
  PartnerProfile copyWith({
    String? id,
    String? userId,
    String? name,
    String? email,
    String? phone,
    String? location,
    bool? availability,
    bool? isVerified,
    String? verificationStatus,
    double? rating,
    int? completedProjects,
    String? deviceInfo,
    PartnerWallet? wallet,
    BankAccount? bankAccount,
  }) {
    return PartnerProfile(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      location: location ?? this.location,
      availability: availability ?? this.availability,
      isVerified: isVerified ?? this.isVerified,
      verificationStatus: verificationStatus ?? this.verificationStatus,
      rating: rating ?? this.rating,
      completedProjects: completedProjects ?? this.completedProjects,
      deviceInfo: deviceInfo ?? this.deviceInfo,
      wallet: wallet ?? this.wallet,
      bankAccount: bankAccount ?? this.bankAccount,
    );
  }
}
