import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../core/api_service.dart';
import '../../core/storage_service.dart';
import '../../core/websocket_service.dart';
import '../../models/partner_profile.dart';
import '../../models/booking.dart';
import '../work/work_detail_screen.dart';
import '../earnings/earnings_screen.dart';
import '../profile/profile_screen.dart';

final partnerProfileProvider = StateProvider<PartnerProfile?>((ref) => null);
final availableDispatchesProvider = StateProvider<List<BookingInfo>>((ref) => []);
final activeWorkBookingProvider = StateProvider<BookingInfo?>((ref) => null);

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _currentIndex = 0;
  final WebSocketService _wsService = WebSocketService();
  bool _isOnline = true;

  @override
  void initState() {
    super.initState();
    _loadProfileAndWork();
  }

  @override
  void dispose() {
    final profile = ref.read(partnerProfileProvider);
    if (profile != null) {
      _wsService.disconnect(profile.id);
    }
    super.dispose();
  }

  void _loadProfileAndWork() async {
    final storage = StorageService();
    final profile = await storage.getProfile();
    if (profile != null && mounted) {
      ref.read(partnerProfileProvider.notifier).state = profile;
      _isOnline = profile.availability;

      final api = ApiService();
      final dispatches = await api.fetchAvailableBookings(profile.id);
      ref.read(availableDispatchesProvider.notifier).state = dispatches;

      _connectWebSocket(profile.id);
    }
  }

  void _connectWebSocket(String partnerId) {
    _wsService.connect(
      partnerId: partnerId,
      isOnline: _isOnline,
      onBookingDispatched: (booking) {
        ref.read(availableDispatchesProvider.notifier).update((state) => [...state, booking]);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('🔔 New Job Dispatched: ${booking.packageName}'),
            backgroundColor: OrbitTheme.partnerPurple,
          ),
        );
      },
      onBookingAcceptedByOther: (bookingId) {
        ref.read(availableDispatchesProvider.notifier).update(
          (state) => state.where((b) => b.id != bookingId).toList(),
        );
      },
    );
  }

  void _toggleOnline(bool val) async {
    final profile = ref.read(partnerProfileProvider);
    if (profile == null) return;

    setState(() => _isOnline = val);
    final api = ApiService();
    final success = await api.updateAvailability(profile.id, val);

    if (success) {
      if (val) {
        _wsService.goOnline(profile.id);
      } else {
        _wsService.goOffline(profile.id);
      }
      ref.read(partnerProfileProvider.notifier).state = PartnerProfile(
        id: profile.id,
        userId: profile.userId,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        availability: val,
        isVerified: profile.isVerified,
        verificationStatus: profile.verificationStatus,
        deviceInfo: profile.deviceInfo,
        wallet: profile.wallet,
        bankAccount: profile.bankAccount,
      );
    }
  }

  void _logout() async {
    final storage = StorageService();
    await storage.clear();
    if (mounted) context.go('/login');
  }

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(partnerProfileProvider);
    if (profile == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final views = [
      _AvailableWorkFeed(partnerId: profile.id),
      const WorkDetailScreen(),
      const EarningsScreen(),
      ProfileScreen(profile: profile, onLogout: _logout),
    ];

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: OrbitTheme.partnerPurple,
                    child: Text(
                      profile.name.isNotEmpty ? profile.name[0].toUpperCase() : 'A',
                      style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.white),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          profile.name,
                           style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Colors.white),
                        ),
                        Row(
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: BoxDecoration(
                                color: _isOnline ? Colors.greenAccent : Colors.grey,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 6),
                            Text(
                              _isOnline ? 'Online' : 'Offline',
                              style: const TextStyle(fontSize: 10, color: OrbitTheme.textSecondary),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  // Online offline toggle
                  Switch(
                    value: _isOnline,
                    activeThumbColor: Colors.greenAccent,
                    onChanged: _toggleOnline,
                  ),
                ],
              ),
            ),
            const Divider(color: OrbitTheme.border),

            Expanded(child: views[_currentIndex]),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.only(bottom: 12, left: 16, right: 16, top: 4),
        color: Colors.transparent,
        child: Container(
          height: 64,
          decoration: BoxDecoration(
            color: const Color(0xCC050505),
            borderRadius: BorderRadius.circular(28),
            border: Border.all(color: OrbitTheme.partnerPurple.withValues(alpha: 0.12)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _BottomNavItem(
                icon: Icons.dashboard_outlined,
                activeIcon: Icons.dashboard,
                label: 'Home',
                isActive: _currentIndex == 0,
                onTap: () => setState(() => _currentIndex = 0),
              ),
              _BottomNavItem(
                icon: Icons.work_outline,
                activeIcon: Icons.work,
                label: 'Work',
                isActive: _currentIndex == 1,
                onTap: () => setState(() => _currentIndex = 1),
              ),
              _BottomNavItem(
                icon: Icons.wallet_outlined,
                activeIcon: Icons.wallet,
                label: 'Earnings',
                isActive: _currentIndex == 2,
                onTap: () => setState(() => _currentIndex = 2),
              ),
              _BottomNavItem(
                icon: Icons.person_outline,
                activeIcon: Icons.person,
                label: 'Profile',
                isActive: _currentIndex == 3,
                onTap: () => setState(() => _currentIndex = 3),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _BottomNavItem extends StatelessWidget {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _BottomNavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            isActive ? activeIcon : icon,
            color: isActive ? OrbitTheme.partnerPurple : OrbitTheme.textSecondary.withValues(alpha: 0.5),
            size: 22,
          ),
          const SizedBox(height: 3),
          Text(
            label,
            style: TextStyle(
              fontSize: 9,
              color: isActive ? OrbitTheme.partnerPurple : OrbitTheme.textSecondary.withValues(alpha: 0.5),
              fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Available Gigs Feed ──────────────────────────────────────────────────────
class _AvailableWorkFeed extends ConsumerWidget {
  final String partnerId;

  const _AvailableWorkFeed({required this.partnerId});

  void _acceptJob(BuildContext context, WidgetRef ref, BookingInfo booking) async {
    final api = ApiService();
    final updatedBooking = await api.acceptBooking(booking.id, partnerId);
    if (!context.mounted) return;
    if (updatedBooking != null) {
      ref.read(activeWorkBookingProvider.notifier).state = updatedBooking;
      ref.read(availableDispatchesProvider.notifier).update((state) => state.where((b) => b.id != booking.id).toList());
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('🎉 Gig Accepted! Navigate to location.'), backgroundColor: Colors.green),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Verification check failed or gig accepted by another partner.')),
      );
    }
  }

  void _declineJob(WidgetRef ref, BookingInfo booking) async {
    final api = ApiService();
    await api.declineBooking(booking.id, partnerId);
    ref.read(availableDispatchesProvider.notifier).update((state) => state.where((b) => b.id != booking.id).toList());
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dispatches = ref.watch(availableDispatchesProvider);

    if (dispatches.isEmpty) {
      return const Expanded(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.radar, size: 48, color: OrbitTheme.textMuted),
              SizedBox(height: 16),
              Text('Looking for dispatched shoots...', style: TextStyle(color: OrbitTheme.textSecondary)),
            ],
          ),
        ),
      );
    }

    return Expanded(
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: dispatches.length,
        itemBuilder: (context, index) {
          final gig = dispatches[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
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
                     Text(gig.packageName, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14)),
                    const Text('Salary: ₹700', style: TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 12)),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.pin_drop, size: 14, color: OrbitTheme.textSecondary),
                    const SizedBox(width: 6),
                    Expanded(child: Text(gig.location, style: const TextStyle(color: OrbitTheme.textSecondary, fontSize: 11))),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.access_time, size: 14, color: OrbitTheme.textSecondary),
                    const SizedBox(width: 6),
                    Text('${gig.bookingDate} @ ${gig.timeSlot}', style: const TextStyle(color: OrbitTheme.textSecondary, fontSize: 11)),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: OrbitTheme.border),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: () => _declineJob(ref, gig),
                        child: const Text('Decline', style: TextStyle(color: Colors.redAccent)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: OrbitTheme.partnerGradient,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            shadowColor: Colors.transparent,
                          ),
                          onPressed: () => _acceptJob(context, ref, gig),
                          child: const Text('Accept Gig', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
