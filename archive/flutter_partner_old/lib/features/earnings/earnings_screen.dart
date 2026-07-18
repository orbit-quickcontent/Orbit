import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme.dart';
import '../../core/api_service.dart';
import '../home/home_screen.dart';
import '../../models/partner_profile.dart';

class EarningsScreen extends ConsumerStatefulWidget {
  const EarningsScreen({super.key});

  @override
  ConsumerState<EarningsScreen> createState() => _EarningsScreenState();
}

class _EarningsScreenState extends ConsumerState<EarningsScreen> {
  bool _isWithdrawing = false;

  void _withdrawFunds() async {
    final profile = ref.read(partnerProfileProvider);
    if (profile == null) return;

    if (profile.wallet.balance <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No available balance to withdraw.')),
      );
      return;
    }

    setState(() => _isWithdrawing = true);
    final api = ApiService();
    final success = await api.withdrawWallet(profile.id, profile.wallet.balance);
    setState(() => _isWithdrawing = false);

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('🎉 Withdrawal request submitted! Funds will clear in 24 hours.'), backgroundColor: Colors.green),
      );
      
      // Update local wallet balance
      ref.read(partnerProfileProvider.notifier).state = profile.copyWith(
        wallet: PartnerWallet(
          balance: 0.0,
          pendingClearance: profile.wallet.pendingClearance,
          totalWithdrawn: profile.wallet.totalWithdrawn + profile.wallet.balance,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(partnerProfileProvider);
    if (profile == null) return const Center(child: CircularProgressIndicator());

    final balance = profile.wallet.balance;
    final pending = profile.wallet.pendingClearance;
    final withdrawn = profile.wallet.totalWithdrawn;

    return ListView(
      padding: const EdgeInsets.all(16.0),
      children: [
        const Text('Earning Details', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
        const SizedBox(height: 16),

        // Wallet Balance Card (matches design images!)
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: LinearGradient(colors: [OrbitTheme.partnerPurple.withValues(alpha: 0.15), Colors.black]),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: OrbitTheme.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('AVAILABLE WALLET BALANCE', style: TextStyle(color: OrbitTheme.textSecondary, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
              const SizedBox(height: 8),
              Text(
                '₹${balance.toInt()}',
                style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w900, color: Colors.white),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  icon: const Icon(Icons.arrow_outward),
                  label: _isWithdrawing
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black))
                      : const Text('Withdraw Payouts', style: TextStyle(fontWeight: FontWeight.bold)),
                  onPressed: _isWithdrawing ? null : _withdrawFunds,
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // Double statistics row
        Row(
          children: [
            Expanded(
              child: _buildStatCard('Pending Clearance', '₹${pending.toInt()}', Colors.amberAccent),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard('Total Withdrawn', '₹${withdrawn.toInt()}', Colors.greenAccent),
            ),
          ],
        ),

        const SizedBox(height: 28),
        const Text('Shoot Transactions Log', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),

        // Transaction History Items showing flat ₹700 salary per completed order
        _buildTransactionItem('Shoot Payout (Noida Sector 62)', '₹700', '28 June 2026', true),
        _buildTransactionItem('Shoot Payout (Noida Sector 18)', '₹700', '25 June 2026', true),
        _buildTransactionItem('Wallet Cash Withdrawal', '-₹2100', '20 June 2026', false),
      ],
    );
  }

  Widget _buildStatCard(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: OrbitTheme.cardBackground,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: OrbitTheme.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 10, color: OrbitTheme.textSecondary)),
          const SizedBox(height: 6),
          Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: color)),
        ],
      ),
    );
  }

  Widget _buildTransactionItem(String title, String amount, String date, bool isEarning) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: OrbitTheme.cardBackground,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: OrbitTheme.border),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 4),
              Text(date, style: const TextStyle(color: OrbitTheme.textSecondary, fontSize: 10)),
            ],
          ),
          Text(
            amount,
            style: TextStyle(
              fontWeight: FontWeight.w900,
              fontSize: 14,
              color: isEarning ? Colors.greenAccent : Colors.redAccent,
            ),
          ),
        ],
      ),
    );
  }
}
