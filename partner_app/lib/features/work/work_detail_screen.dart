import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme.dart';
import '../../core/api_service.dart';
import '../../models/booking.dart';
import '../../models/partner_profile.dart';
import '../home/home_screen.dart';

class WorkDetailScreen extends ConsumerStatefulWidget {
  const WorkDetailScreen({super.key});

  @override
  ConsumerState<WorkDetailScreen> createState() => _WorkDetailScreenState();
}

class _WorkDetailScreenState extends ConsumerState<WorkDetailScreen> {
  int _activeStage = 0; // 0 = Navigating, 1 = Arrived, 2 = Shooting, 3 = Syncing
  final Set<String> _completedClips = {};
  double _syncProgress = 0.0;
  double _syncSpeed = 0.0;
  String _currentSyncFile = '';
  Timer? _syncTimer;

  final List<String> _requiredClips = [
    'Establishing Wide Pan shot (4K/60fps)',
    'Subject Cinematic tracking shot (4K/60fps)',
    'Close-up high-fps motion detail (4K/120fps)',
    'Slow tilt-shift lighting transition (4K/60fps)',
    'Final hero outro pan (4K/60fps)',
  ];

  void _arriveAtLocation() {
    setState(() => _activeStage = 1);
  }

  void _startShooting() {
    setState(() => _activeStage = 2);
  }

  void _toggleClip(String clip) {
    setState(() {
      if (_completedClips.contains(clip)) {
        _completedClips.remove(clip);
      } else {
        _completedClips.add(clip);
      }
    });
  }

  void _startFootageSync() {
    if (_completedClips.length < _requiredClips.length) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please capture and tick off all required checklist shots first.')),
      );
      return;
    }

    setState(() {
      _activeStage = 3;
      _syncProgress = 0.0;
      _syncSpeed = 12.4;
      _currentSyncFile = 'clip_001_4k.mov';
    });

    int fileIndex = 0;
    _syncTimer = Timer.periodic(const Duration(milliseconds: 150), (timer) async {
      setState(() {
        _syncProgress += 5.0;
        _syncSpeed = 12.0 + (5.0 - (timer.tick % 5));
        
        if (_syncProgress >= 100.0) {
          _syncProgress = 100.0;
          _syncTimer?.cancel();
          _completeUpload();
        } else {
          // Cycle mock files
          int newIndex = (_syncProgress / 20.0).floor();
          if (newIndex != fileIndex && newIndex < 5) {
            fileIndex = newIndex;
            _currentSyncFile = 'clip_00${fileIndex + 1}_4k.mov';
          }
        }
      });
    });
  }

  void _completeUpload() async {
    final activeBooking = ref.read(activeWorkBookingProvider);
    if (activeBooking == null) return;

    final api = ApiService();
    final urls = List.generate(5, (index) => 'https://mock-s3.orbit.io/raw-footage/clip_00${index + 1}_4k.mov');
    final success = await api.syncComplete(activeBooking.id, urls);

    if (success && mounted) {
      ref.read(activeWorkBookingProvider.notifier).state = null;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('🎉 Raw footage successfully synced! Sent to editing pool.'), backgroundColor: Colors.green),
      );
      
      // Update wallet balance for partner in profile
      final profile = ref.read(partnerProfileProvider);
      if (profile != null) {
        ref.read(partnerProfileProvider.notifier).state = PartnerProfile(
          id: profile.id,
          userId: profile.userId,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
          availability: profile.availability,
          isVerified: profile.isVerified,
          verificationStatus: profile.verificationStatus,
          deviceInfo: profile.deviceInfo,
          wallet: PartnerWallet(
            balance: profile.wallet.balance + 700.0,
            pendingClearance: profile.wallet.pendingClearance,
            totalWithdrawn: profile.wallet.totalWithdrawn,
          ),
          bankAccount: profile.bankAccount,
        );
      }
      
      setState(() {
        _activeStage = 0;
        _completedClips.clear();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final activeBooking = ref.watch(activeWorkBookingProvider);

    if (activeBooking == null) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.work_off_outlined, size: 48, color: OrbitTheme.textMuted),
            SizedBox(height: 16),
            Text('No active shoots in progress', style: TextStyle(color: OrbitTheme.textSecondary, fontWeight: FontWeight.bold)),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Active job header card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: OrbitTheme.cardBackground,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: OrbitTheme.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(activeBooking.packageName, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14)),
                    const Text('Salary: ₹700', style: TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.pin_drop, size: 14, color: OrbitTheme.textSecondary),
                    const SizedBox(width: 6),
                    Expanded(child: Text(activeBooking.location, style: const TextStyle(color: OrbitTheme.textSecondary, fontSize: 11))),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.person_outline, size: 14, color: OrbitTheme.textSecondary),
                    const SizedBox(width: 6),
                    Text('Client: ${activeBooking.packageName.contains("Pro") ? "Pro Tier Client" : "Personalized Client"}', style: const TextStyle(color: OrbitTheme.textSecondary, fontSize: 11)),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Render stages
          if (_activeStage == 0) _buildStageNavigating(activeBooking),
          if (_activeStage == 1) _buildStageArrived(activeBooking),
          if (_activeStage == 2) _buildStageShooting(activeBooking),
          if (_activeStage == 3) _buildStageSyncing(activeBooking),
        ],
      ),
    );
  }

  Widget _buildStageNavigating(BookingInfo booking) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Shoot Stage: Navigating', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        const SizedBox(height: 12),
        // Mock Map Frame
        Container(
          height: 200,
          decoration: BoxDecoration(
            color: const Color(0xFF151525),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: OrbitTheme.border),
          ),
          child: const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.navigation, color: OrbitTheme.partnerPurple, size: 36),
                SizedBox(height: 12),
                Text('GPS Tracking active. Simulating route...', style: TextStyle(color: OrbitTheme.textSecondary, fontSize: 11)),
              ],
            ),
          ),
        ),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          height: 52,
          child: Container(
            decoration: BoxDecoration(
              gradient: OrbitTheme.partnerGradient,
              borderRadius: BorderRadius.circular(12),
            ),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
              ),
              onPressed: _arriveAtLocation,
              child: const Text('ARRIVED AT LOCATION', style: TextStyle(fontWeight: FontWeight.w900, color: Colors.white)),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStageArrived(BookingInfo booking) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Shoot Stage: Arrived', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: OrbitTheme.cardBackground,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: OrbitTheme.border),
          ),
          child: const Column(
            children: [
              Icon(Icons.location_on, color: Colors.greenAccent, size: 44),
              SizedBox(height: 12),
              Text('You have arrived at the Noida Sector 62 coordinates!', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13), textAlign: TextAlign.center),
              SizedBox(height: 6),
              Text('Unpack camera gimbal rig. Ensure phone camera is set to 4K 60fps.', style: TextStyle(color: OrbitTheme.textSecondary, fontSize: 11), textAlign: TextAlign.center),
            ],
          ),
        ),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          height: 52,
          child: Container(
            decoration: BoxDecoration(gradient: OrbitTheme.partnerGradient, borderRadius: BorderRadius.circular(12)),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
              ),
              onPressed: _startShooting,
              child: const Text('START SHOOTING', style: TextStyle(fontWeight: FontWeight.w900, color: Colors.white)),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStageShooting(BookingInfo booking) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Shoot Stage: Capture Checklist', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        const SizedBox(height: 12),

        ..._requiredClips.map((clip) {
          final isDone = _completedClips.contains(clip);
          return Card(
            color: OrbitTheme.cardBackground,
            margin: const EdgeInsets.only(bottom: 8),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: BorderSide(color: isDone ? OrbitTheme.partnerPurple : OrbitTheme.border),
            ),
            child: ListTile(
              leading: Icon(
                isDone ? Icons.check_box : Icons.check_box_outline_blank,
                color: isDone ? OrbitTheme.partnerPurple : OrbitTheme.textSecondary,
              ),
              title: Text(clip, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              onTap: () => _toggleClip(clip),
            ),
          );
        }).toList(),

        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          height: 52,
          child: Container(
            decoration: BoxDecoration(gradient: OrbitTheme.partnerGradient, borderRadius: BorderRadius.circular(12)),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
              ),
              onPressed: _startFootageSync,
              child: const Text('SYNC FOOTAGE', style: TextStyle(fontWeight: FontWeight.w900, color: Colors.white)),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStageSyncing(BookingInfo booking) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: OrbitTheme.cardBackground,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: OrbitTheme.partnerPurple.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Syncing: $_currentSyncFile', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              Text('${_syncProgress.toInt()}%', style: const TextStyle(fontWeight: FontWeight.bold, color: OrbitTheme.partnerPurple)),
            ],
          ),
          const SizedBox(height: 12),
          LinearProgressIndicator(
            value: _syncProgress / 100.0,
            backgroundColor: OrbitTheme.border,
            color: OrbitTheme.partnerPurple,
            borderRadius: BorderRadius.circular(4),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Speed:', style: TextStyle(color: OrbitTheme.textSecondary, fontSize: 10)),
              Text('${_syncSpeed.toStringAsFixed(1)} MB/s', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.greenAccent, fontSize: 10)),
            ],
          ),
          const SizedBox(height: 6),
          const Text('Uploading raw 4K footage securely to our Cloud Studio pipeline.', style: TextStyle(fontSize: 9, color: OrbitTheme.textSecondary)),
        ],
      ),
    );
  }
}
