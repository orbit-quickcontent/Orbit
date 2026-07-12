import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../core/api_service.dart';
import '../../core/storage_service.dart';
import '../../models/user.dart';
import '../../models/booking.dart';
import '../booking/booking_flow_screen.dart';
import '../tracking/tracking_view.dart';

final userProfileProvider = StateProvider<UserProfile?>((ref) => null);
final bookingsListProvider = StateProvider<List<BookingInfo>>((ref) => []);

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadProfileAndBookings();
  }

  void _loadProfileAndBookings() async {
    final storage = StorageService();
    final profile = await storage.getUser();
    if (profile != null && mounted) {
      ref.read(userProfileProvider.notifier).state = profile;
      
      final api = ApiService();
      final bookings = await api.fetchClientBookings(profile.id);
      ref.read(bookingsListProvider.notifier).state = bookings;
    }
  }

  void _logout() async {
    final storage = StorageService();
    await storage.clear();
    if (mounted) context.go('/login');
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(userProfileProvider);
    if (user == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final views = [
      _HomeFeed(user: user, onNavigate: (index) => setState(() => _currentIndex = index)),
      const _PackagesView(),
      const TrackingView(),
      _ProfileView(user: user, onLogout: _logout),
    ];

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Custom Header Navbar (matches design images!)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
              child: Row(
                children: [
                  // Avatar with initials
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: OrbitTheme.clientCyan,
                    child: Text(
                      user.name.isNotEmpty ? user.name[0].toUpperCase() : 'U',
                      style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.white, fontSize: 14),
                    ),
                  ),
                  const SizedBox(width: 12),
                  // Greetings
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Good morning', style: TextStyle(color: OrbitTheme.textSecondary, fontSize: 11)),
                        Text(
                          'Hi, ${user.name.split(' ')[0]}',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white),
                        ),
                      ],
                    ),
                  ),
                  // Actions buttons row
                  Row(
                    children: [
                      _NavIconBtn(icon: Icons.search, onTap: () {}),
                      const SizedBox(width: 8),
                      _NavIconBtn(icon: Icons.notifications, onTap: () {}),
                      const SizedBox(width: 8),
                      _NavIconBtn(
                        icon: Icons.keyboard_arrow_down,
                        onTap: () {
                          // Dropdown overlay
                          showModalBottomSheet(
                            context: context,
                            backgroundColor: OrbitTheme.cardBackground,
                            shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
                            builder: (context) => Container(
                              padding: const EdgeInsets.all(24),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  ListTile(
                                    leading: const Icon(Icons.person, color: OrbitTheme.clientCyan),
                                    title: const Text('My Profile', style: TextStyle(fontWeight: FontWeight.bold)),
                                    onTap: () {
                                      Navigator.pop(context);
                                      setState(() => _currentIndex = 3);
                                    },
                                  ),
                                  const Divider(color: OrbitTheme.border),
                                  ListTile(
                                    leading: const Icon(Icons.logout, color: Colors.redAccent),
                                    title: const Text('Log Out', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
                                    onTap: () {
                                      Navigator.pop(context);
                                      _logout();
                                    },
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            // Subtitle
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.0),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Ready to create something cinematic?',
                  style: TextStyle(color: OrbitTheme.textSecondary, fontSize: 13),
                ),
              ),
            ),
            const SizedBox(height: 12),

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
            border: Border.all(color: OrbitTheme.clientCyan.withOpacity(0.12)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _BottomNavItem(
                icon: Icons.home_outlined,
                activeIcon: Icons.home,
                label: 'Home',
                isActive: _currentIndex == 0,
                onTap: () => setState(() => _currentIndex = 0),
              ),
              _BottomNavItem(
                icon: Icons.wallet_giftcard_outlined,
                activeIcon: Icons.wallet_giftcard,
                label: 'Packages',
                isActive: _currentIndex == 1,
                onTap: () => setState(() => _currentIndex = 1),
              ),
              _BottomNavItem(
                icon: Icons.radar,
                activeIcon: Icons.radar,
                label: 'Track',
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

class _NavIconBtn extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _NavIconBtn({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 38,
        height: 38,
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.08),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: Colors.white, size: 20),
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
            color: isActive ? OrbitTheme.clientCyan : OrbitTheme.textSecondary.withOpacity(0.5),
            size: 22,
          ),
          const SizedBox(height: 3),
          Text(
            label,
            style: TextStyle(
              fontSize: 9,
              color: isActive ? OrbitTheme.clientCyan : OrbitTheme.textSecondary.withOpacity(0.5),
              fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Home Feed ────────────────────────────────────────────────────────────────
class _HomeFeed extends ConsumerWidget {
  final UserProfile user;
  final Function(int) onNavigate;

  const _HomeFeed({required this.user, required this.onNavigate});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bookings = ref.watch(bookingsListProvider);
    final hasActive = bookings.any((b) => b.status != 'DELIVERED' && b.status != 'CANCELLED');

    return ListView(
      padding: const EdgeInsets.all(16.0),
      children: [
        // 2x2 Grid Actions
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.25,
          children: [
            _GridCard(
              icon: Icons.calendar_today,
              color: const Color(0xFF00BFFF),
              title: 'Book Now',
              desc: 'Schedule a session',
              onTap: () => context.push('/booking'),
            ),
            _GridCard(
              icon: Icons.radar,
              color: const Color(0xFFA020F0),
              title: 'Track Order',
              desc: hasActive ? 'Active Shoot' : 'No active',
              onTap: () => onNavigate(2),
            ),
            _GridCard(
              icon: Icons.card_giftcard,
              color: const Color(0xFF2D6A4F),
              title: 'Packages',
              desc: 'View pricing',
              onTap: () => onNavigate(1),
            ),
            _GridCard(
              icon: Icons.bolt,
              color: const Color(0xFFFFB300),
              title: 'Brand DNA',
              desc: 'Customize style',
              onTap: () => onNavigate(1),
            ),
          ],
        ),
        
        const SizedBox(height: 28),
        
        // Horizontal list packages preview
        const Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Our Packages', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            Text('View All >', style: TextStyle(color: OrbitTheme.clientCyan, fontSize: 12)),
          ],
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 140,
          child: ListView(
            scrollDirection: Axis.horizontal,
            children: [
              _PkgItemCard(
                title: 'Personalized',
                price: '₹1,999/session',
                bullet: '1 Cinematic Reel',
                color: OrbitTheme.clientCyan.withOpacity(0.05),
              ),
              const SizedBox(width: 12),
              _PkgItemCard(
                title: 'Professional (UGC)',
                price: '₹4,999/session',
                bullet: '3 Cinematic Reels',
                color: OrbitTheme.clientPurple.withOpacity(0.05),
                isPopular: true,
              ),
            ],
          ),
        ),

        const SizedBox(height: 28),

        // Statistics bar
        Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: OrbitTheme.cardBackground,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: OrbitTheme.border),
          ),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              Column(
                children: [
                  Text('60 min', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: OrbitTheme.clientCyan)),
                  SizedBox(height: 4),
                  Text('Delivery Guarantee', style: TextStyle(fontSize: 10, color: OrbitTheme.textSecondary)),
                ],
              ),
              Column(
                children: [
                  Text('4K HDR', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: OrbitTheme.clientCyan)),
                  SizedBox(height: 4),
                  Text('Native Quality', style: TextStyle(fontSize: 10, color: OrbitTheme.textSecondary)),
                ],
              ),
              Column(
                children: [
                  Text('500+', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: OrbitTheme.clientCyan)),
                  SizedBox(height: 4),
                  Text('Reels Delivered', style: TextStyle(fontSize: 10, color: OrbitTheme.textSecondary)),
                ],
              ),
            ],
          ),
        ),
        
        const SizedBox(height: 24),
        
        // Large Promo CTA Card
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [OrbitTheme.clientCyan.withOpacity(0.2), OrbitTheme.clientPurple.withOpacity(0.2)],
            ),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: OrbitTheme.clientCyan.withOpacity(0.2)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Ready to Create\nSomething Cinematic?',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, height: 1.2),
              ),
              const SizedBox(height: 8),
              const Text(
                'Professional cinematic edits delivered directly to your device within 60 minutes.',
                style: TextStyle(fontSize: 12, color: OrbitTheme.textSecondary),
              ),
              const SizedBox(height: 20),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: Colors.black,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                ),
                icon: const Icon(Icons.bolt, color: OrbitTheme.clientCyan),
                label: const Text('Book a Session Now', style: TextStyle(fontWeight: FontWeight.bold)),
                onPressed: () => context.push('/booking'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
      ],
    );
  }
}

class _GridCard extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final String desc;
  final VoidCallback onTap;

  const _GridCard({
    required this.icon,
    required this.color,
    required this.title,
    required this.desc,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: OrbitTheme.cardBackground,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: OrbitTheme.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(height: 12),
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white)),
            const SizedBox(height: 2),
            Text(desc, style: const TextStyle(color: OrbitTheme.textSecondary, fontSize: 10)),
          ],
        ),
      ),
    );
  }
}

class _PkgItemCard extends StatelessWidget {
  final String title;
  final String price;
  final String bullet;
  final Color color;
  final bool isPopular;

  const _PkgItemCard({
    required this.title,
    required this.price,
    required this.bullet,
    required this.color,
    this.isPopular = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 180,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: OrbitTheme.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13)),
              if (isPopular)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(color: OrbitTheme.clientPurple, borderRadius: BorderRadius.circular(4)),
                  child: const Text('POPULAR', style: TextStyle(fontSize: 7, fontWeight: FontWeight.bold)),
                ),
            ],
          ),
          const SizedBox(height: 6),
          Text(price, style: const TextStyle(color: OrbitTheme.clientCyan, fontSize: 12, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Row(
            children: [
              const Icon(Icons.check_circle_outline, color: Colors.greenAccent, size: 12),
              const SizedBox(width: 6),
              Text(bullet, style: const TextStyle(fontSize: 10, color: OrbitTheme.textSecondary)),
            ],
          ),
        ],
      ),
    );
  }
}

// ─── Placeholder Packages ─────────────────────────────────────────────────────
class _PackagesView extends StatelessWidget {
  const _PackagesView();

  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('Packages Screen Details Here'));
  }
}

// ─── Placeholder Tracking ─────────────────────────────────────────────────────
class _TrackingView extends StatelessWidget {
  const _TrackingView();

  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('Order Status Tracking Here'));
  }
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
class _ProfileView extends StatelessWidget {
  final UserProfile user;
  final VoidCallback onLogout;

  const _ProfileView({required this.user, required this.onLogout});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16.0),
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: OrbitTheme.cardBackground,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: OrbitTheme.border),
          ),
          child: Column(
            children: [
              CircleAvatar(
                radius: 36,
                backgroundColor: OrbitTheme.clientCyan,
                child: Text(user.name.isNotEmpty ? user.name[0].toUpperCase() : 'U', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white)),
              ),
              const SizedBox(height: 12),
              Text(user.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
              const SizedBox(height: 4),
              Text(user.email, style: const TextStyle(color: OrbitTheme.textSecondary, fontSize: 12)),
              if (user.phone.isNotEmpty) ...[
                const SizedBox(height: 4),
                Text(user.phone, style: const TextStyle(color: OrbitTheme.textSecondary, fontSize: 12)),
              ],
            ],
          ),
        ),
        const SizedBox(height: 24),
        ListTile(
          leading: const Icon(Icons.shield_outlined, color: OrbitTheme.clientCyan),
          title: const Text('Privacy Shield', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
          trailing: const Icon(Icons.chevron_right, size: 16),
          onTap: () {},
        ),
        const Divider(color: OrbitTheme.border),
        ListTile(
          leading: const Icon(Icons.settings_outlined, color: OrbitTheme.clientCyan),
          title: const Text('App Settings', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
          trailing: const Icon(Icons.chevron_right, size: 16),
          onTap: () {},
        ),
        const Divider(color: OrbitTheme.border),
        ListTile(
          leading: const Icon(Icons.logout, color: Colors.redAccent),
          title: const Text('Log Out', style: TextStyle(color: Colors.redAccent, fontSize: 13, fontWeight: FontWeight.bold)),
          trailing: const Icon(Icons.chevron_right, size: 16),
          onTap: onLogout,
        ),
      ],
    );
  }
}
