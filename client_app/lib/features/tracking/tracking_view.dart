import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:intl/intl.dart';
import '../../core/theme.dart';
import '../../core/api_service.dart';
import '../../core/websocket_service.dart';
import '../../models/booking.dart';
import '../home/home_screen.dart';

class TrackingView extends ConsumerStatefulWidget {
  const TrackingView({super.key});

  @override
  ConsumerState<TrackingView> createState() => _TrackingViewState();
}

class _TrackingViewState extends ConsumerState<TrackingView> {
  final WebSocketService _wsService = WebSocketService();
  Timer? _countdownTimer;

  @override
  void initState() {
    super.initState();
    _connectWebSocket();
    _startTimer();
  }

  @override
  void dispose() {
    _wsService.disconnect();
    _countdownTimer?.cancel();
    super.dispose();
  }

  void _connectWebSocket() {
    final user = ref.read(userProfileProvider);
    if (user == null) return;

    _wsService.connect(
      onPartnerAssigned: (bookingId, partnerId, partnerName) {
        _reloadBookings();
      },
      onNotifyClient: (event, data) {
        debugPrint("[Tracking] Live WebSocket Update: $event -> $data");
        _reloadBookings();
      },
    );

    // Subscribe to all bookings
    final bookings = ref.read(bookingsListProvider);
    for (var b in bookings) {
      _wsService.subscribeToBooking(b.id);
    }
  }

  void _reloadBookings() async {
    final user = ref.read(userProfileProvider);
    if (user != null && mounted) {
      final api = ApiService();
      final bookings = await api.fetchClientBookings(user.id);
      ref.read(bookingsListProvider.notifier).state = bookings;
    }
  }

  void _startTimer() {
    _countdownTimer = Timer.periodic(const Duration(seconds: 10), (timer) {
      _reloadBookings();
    });
  }

  int _getStatusStep(String status) {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'PAID':
        return 1;
      case 'PARTNER_DISPATCHED':
        return 2;
      case 'EN_ROUTE':
        return 3;
      case 'SHOOTING':
        return 4;
      case 'SYNCING':
        return 5;
      case 'EDITING':
      case 'READY_TO_EDIT':
        return 6;
      case 'DELIVERED':
        return 7;
      default:
        return 0;
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'CANCELLED':
        return Colors.redAccent;
      case 'DELIVERED':
        return Colors.greenAccent;
      default:
        return OrbitTheme.clientCyan;
    }
  }

  @override
  Widget build(BuildContext context) {
    final bookings = ref.watch(bookingsListProvider);
    if (bookings.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.radar, size: 48, color: OrbitTheme.textMuted),
            SizedBox(height: 16),
            Text(
              'No bookings found',
              style: TextStyle(
                color: OrbitTheme.textSecondary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      );
    }

    final activeBooking = bookings.firstWhere(
      (b) => b.status != 'DELIVERED' && b.status != 'CANCELLED',
      orElse: () => bookings.first,
    );

    final currentStep = _getStatusStep(activeBooking.status);

    return ListView(
      padding: const EdgeInsets.all(16.0),
      children: [
        const Text(
          'Track Order Status',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 16),

        // Booking Info Card
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: OrbitTheme.cardBackground,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: OrbitTheme.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    activeBooking.packageName,
                    style: const TextStyle(
                      fontWeight: FontWeight.w900,
                      fontSize: 15,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: _getStatusColor(
                        activeBooking.status,
                      ).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      activeBooking.status,
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: _getStatusColor(activeBooking.status),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                'Scheduled: ${activeBooking.bookingDate} @ ${activeBooking.timeSlot}',
                style: const TextStyle(
                  color: OrbitTheme.textSecondary,
                  fontSize: 11,
                ),
              ),
              const SizedBox(height: 20),

              // Live Status Timeline Stepper
              Row(
                children: List.generate(8, (index) {
                  final isDone = index <= currentStep;
                  final isCurrent = index == currentStep;
                  return Expanded(
                    child: Row(
                      children: [
                        Container(
                          width: 16,
                          height: 16,
                          decoration: BoxDecoration(
                            color: isDone
                                ? OrbitTheme.clientCyan
                                : OrbitTheme.border,
                            shape: BoxShape.circle,
                            border: isCurrent
                                ? Border.all(color: Colors.white, width: 2)
                                : null,
                          ),
                          child: isDone
                              ? const Icon(
                                  Icons.check,
                                  size: 10,
                                  color: Colors.black,
                                )
                              : null,
                        ),
                        if (index < 7)
                          Expanded(
                            child: Container(
                              height: 2,
                              color: isDone
                                  ? OrbitTheme.clientCyan
                                  : OrbitTheme.border,
                            ),
                          ),
                      ],
                    ),
                  );
                }),
              ),
              const SizedBox(height: 12),
              const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Booked',
                    style: TextStyle(
                      fontSize: 9,
                      color: OrbitTheme.textSecondary,
                    ),
                  ),
                  Text(
                    'Dispatched',
                    style: TextStyle(
                      fontSize: 9,
                      color: OrbitTheme.textSecondary,
                    ),
                  ),
                  Text(
                    'Shooting',
                    style: TextStyle(
                      fontSize: 9,
                      color: OrbitTheme.textSecondary,
                    ),
                  ),
                  Text(
                    'Delivered',
                    style: TextStyle(
                      fontSize: 9,
                      color: OrbitTheme.textSecondary,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),

        // Custom status feedback view (Syncing progress/Editing countdown/Delivered video player)
        const SizedBox(height: 24),
        if (activeBooking.status == 'SYNCING')
          _buildSyncProgressCard(activeBooking)
        else if (activeBooking.status == 'EDITING' ||
            activeBooking.status == 'READY_TO_EDIT')
          _buildEditingCountdownCard(activeBooking)
        else if (activeBooking.status == 'DELIVERED')
          _buildDeliveredVideoCard(activeBooking)
        else
          _buildWaitingPartnerCard(activeBooking),

        const SizedBox(height: 28),
        const Text(
          'Booking History',
          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),

        // History items
        ...bookings.map((booking) => _buildHistoryItem(booking)),
      ],
    );
  }

  Widget _buildSyncProgressCard(BookingInfo booking) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: OrbitTheme.cardBackground,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: OrbitTheme.clientCyan.withValues(alpha: 0.2)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Raw footage syncing...',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              Text(
                '${booking.syncPercentage}%',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  color: OrbitTheme.clientCyan,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          LinearProgressIndicator(
            value: booking.syncPercentage / 100.0,
            backgroundColor: OrbitTheme.border,
            color: OrbitTheme.clientCyan,
            borderRadius: BorderRadius.circular(4),
          ),
          const SizedBox(height: 8),
          const Text(
            'Uploading high-quality files securely to our editing studio.',
            style: TextStyle(fontSize: 10, color: OrbitTheme.textSecondary),
          ),
        ],
      ),
    );
  }

  Widget _buildEditingCountdownCard(BookingInfo booking) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: OrbitTheme.cardBackground,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: OrbitTheme.clientPurple.withValues(alpha: 0.2)),
      ),
      child: Column(
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.hourglass_bottom, color: OrbitTheme.clientPurple),
              SizedBox(width: 8),
              Text(
                'Professional Editing Pipeline Active',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            '~${booking.editCountdown ?? 45} mins remaining',
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w900,
              color: OrbitTheme.clientPurple,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Our custom editor team is crafting your cinematic reels.',
            style: TextStyle(fontSize: 10, color: OrbitTheme.textSecondary),
          ),
        ],
      ),
    );
  }

  Widget _buildDeliveredVideoCard(BookingInfo booking) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF0F1A13),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.greenAccent.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.check_circle, color: Colors.greenAccent),
              SizedBox(width: 8),
              Text(
                'Your Cinematic Reel is Ready!',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Mock Video Frame
          Container(
            height: 180,
            decoration: BoxDecoration(
              color: Colors.black,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: OrbitTheme.border),
            ),
            child: const Center(
              child: Icon(
                Icons.play_circle_fill,
                color: Colors.white,
                size: 54,
              ),
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.greenAccent,
                foregroundColor: Colors.black,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              icon: const Icon(Icons.download),
              label: const Text(
                'Download Edited Reel',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              onPressed: () async {
                final url = Uri.parse(booking.masterReelUrl ?? '');
                if (await canLaunchUrl(url)) {
                  await launchUrl(url, mode: LaunchMode.externalApplication);
                } else {
                  if (!mounted) return;
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Downloading video file...')),
                  );
                }
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWaitingPartnerCard(BookingInfo booking) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: OrbitTheme.cardBackground,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: OrbitTheme.border),
      ),
      child: Row(
        children: [
          const Icon(Icons.info_outline, color: OrbitTheme.clientCyan),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              booking.status == 'PENDING'
                  ? 'Waiting for payment confirmation.'
                  : 'Assigning nearest filmmaker partner to your slot.',
              style: const TextStyle(
                fontSize: 12,
                color: OrbitTheme.textSecondary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHistoryItem(BookingInfo booking) {
    final date = DateFormat(
      'dd MMM',
    ).format(DateTime.parse(booking.bookingDate));
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: OrbitTheme.cardBackground,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: OrbitTheme.border),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            decoration: BoxDecoration(
              color: OrbitTheme.border,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              date,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  booking.packageName,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  booking.location.split('@')[0],
                  style: const TextStyle(
                    color: OrbitTheme.textSecondary,
                    fontSize: 10,
                  ),
                ),
              ],
            ),
          ),
          Text(
            booking.status == 'DELIVERED' ? 'Completed' : 'Active',
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: booking.status == 'DELIVERED'
                  ? Colors.greenAccent
                  : OrbitTheme.clientCyan,
            ),
          ),
        ],
      ),
    );
  }
}
