import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../core/theme.dart';
import '../../core/api_service.dart';
import '../home/home_screen.dart';
import 'widgets/booking_ui.dart';

class BookingFlowScreen extends ConsumerStatefulWidget {
  const BookingFlowScreen({super.key});

  @override
  ConsumerState<BookingFlowScreen> createState() => _BookingFlowScreenState();
}

class _BookingFlowScreenState extends ConsumerState<BookingFlowScreen> {
  int _currentStep = 0;
  bool _isSubmitting = false;

  // Form Fields
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _locationController = TextEditingController();
  final _notesController = TextEditingController();

  // Brand DNA
  String _brandLogoName = '';
  String _brandFont = 'Inter';

  // Date/Time
  DateTime? _selectedDate;
  String _selectedTimeSlot = '10:00 AM';
  bool _bookRightNow = false;

  // Package
  String _selectedPackageId = 'pkg-personalized';
  String _selectedPackageName = 'Personalized Shoot';
  int _selectedPackagePrice = 1999;

  @override
  void initState() {
    super.initState();
    // Prefill form from current authenticated user profile
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final user = ref.read(userProfileProvider);
      if (user != null) {
        _nameController.text = user.name;
        _emailController.text = user.email;
        _phoneController.text = user.phone;
      }
    });
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _locationController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep == 0) {
      if (_nameController.text.isEmpty ||
          _emailController.text.isEmpty ||
          _phoneController.text.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please fill out all contact details.')),
        );
        return;
      }
    }
    if (_currentStep == 1) {
      if (!_bookRightNow && _selectedDate == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please choose a date or select "Book Right Now".'),
          ),
        );
        return;
      }
      if (_locationController.text.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please enter a location coordinates/address.'),
          ),
        );
        return;
      }
    }
    setState(() => _currentStep++);
  }

  void _prevStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
    } else {
      context.pop();
    }
  }

  void _submitBooking() async {
    setState(() => _isSubmitting = true);
    final user = ref.read(userProfileProvider);
    if (user == null) return;

    final bookingDateStr = _bookRightNow
        ? DateFormat('yyyy-MM-dd').format(DateTime.now())
        : DateFormat('yyyy-MM-dd').format(_selectedDate!);
    final slotStr = _bookRightNow ? 'RIGHT_NOW' : _selectedTimeSlot;

    String notes = _notesController.text;
    if (_selectedPackageId == 'pkg-professional') {
      notes += '\nBrand Logo: $_brandLogoName | Font: $_brandFont';
    }

    final api = ApiService();
    final booking = await api.createBooking(
      userId: user.id,
      packageId: _selectedPackageId,
      bookingDate: bookingDateStr,
      timeSlot: slotStr,
      location: _locationController.text,
      notes: notes,
    );

    setState(() => _isSubmitting = false);
    if (booking != null && mounted) {
      // Reload bookings and route back
      final updatedBookings = await api.fetchClientBookings(user.id);
      if (!mounted) return;
      ref.read(bookingsListProvider.notifier).state = updatedBookings;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('🎉 Session Booked Successfully!'),
          backgroundColor: Colors.green,
        ),
      );
      context.go('/');
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to submit booking. Try again.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final stepsTitle = ['Details', 'Schedule', 'Payment'];

    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 86,
        title: Column(
          children: [
            const Text(
              'Book Your Session',
              style: TextStyle(fontWeight: FontWeight.w900, fontSize: 21),
            ),
            const SizedBox(height: 3),
            Text(
              '${_currentStep + 1} of 3 · ${stepsTitle[_currentStep]}',
              style: const TextStyle(color: OrbitTheme.textSecondary, fontSize: 12),
            ),
          ],
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: _prevStep,
        ),
      ),
      body: _isSubmitting
          ? const Center(
              child: CircularProgressIndicator(color: OrbitTheme.clientCyan),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const BookingHeader(
                    title: 'Book your shoot',
                    subtitle: 'A cinematic session, built around your brief.',
                  ),
                  const SizedBox(height: 28),
                  ProgressStepper(currentStep: _currentStep),
                  const SizedBox(height: 30),

                  if (_currentStep == 0) _buildStepDetails(),
                  if (_currentStep == 1) _buildStepSchedule(),
                  if (_currentStep == 2) _buildStepPayment(),

                  const SizedBox(height: 40),

                  // Actions row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      if (_currentStep > 0)
                        OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: OrbitTheme.border),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 24,
                              vertical: 16,
                            ),
                          ),
                          onPressed: _prevStep,
                          child: const Text(
                            'Back',
                            style: TextStyle(color: Colors.white),
                          ),
                        )
                      else
                        const SizedBox(),

                      Container(
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
                            padding: const EdgeInsets.symmetric(
                              horizontal: 28,
                              vertical: 16,
                            ),
                          ),
                          onPressed: _currentStep == 2
                              ? _submitBooking
                              : _nextStep,
                          child: Row(
                            children: [
                              Text(
                                _currentStep == 2
                                    ? 'Complete Payment'
                                    : 'Next Step',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Icon(
                                Icons.arrow_forward,
                                size: 16,
                                color: Colors.white,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildStepDetails() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Contact Information',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _nameController,
          decoration: const InputDecoration(
            labelText: 'Full Name *',
            prefixIcon: Icon(Icons.person),
          ),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _emailController,
          decoration: const InputDecoration(
            labelText: 'Email *',
            prefixIcon: Icon(Icons.email),
          ),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _phoneController,
          decoration: const InputDecoration(
            labelText: 'Phone *',
            prefixIcon: Icon(Icons.phone),
          ),
        ),
        const SizedBox(height: 32),
        const Text(
          'Select Tier Package',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),

        // Package Selector cards
        _buildPackageCard(
          id: 'pkg-personalized',
          name: 'Personalized Plan',
          price: 1999,
          desc: '1 Cinematic Reel • ideal for casuals',
        ),
        const SizedBox(height: 12),
        _buildPackageCard(
          id: 'pkg-professional',
          name: 'Professional Plan (UGC)',
          price: 4999,
          desc: '3 Cinematic Reels • customized Brand DNA assets',
        ),

        if (_selectedPackageId == 'pkg-professional') ...[
          const SizedBox(height: 32),
          const Text(
            'Brand DNA assets',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          TextField(
            decoration: const InputDecoration(
              labelText: 'Brand Logo Title',
              helperText: 'Shown at start of Reels',
            ),
            onChanged: (val) => _brandLogoName = val,
          ),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(
            initialValue: _brandFont,
            decoration: const InputDecoration(labelText: 'Preferred Typeface'),
            items: const [
              DropdownMenuItem(value: 'Inter', child: Text('Inter Sans')),
              DropdownMenuItem(
                value: 'SpaceGrotesk',
                child: Text('Space Grotesk'),
              ),
              DropdownMenuItem(
                value: 'CinematicSerif',
                child: Text('Playfair Serif'),
              ),
            ],
            onChanged: (val) => setState(() => _brandFont = val ?? 'Inter'),
          ),
        ],
      ],
    );
  }

  Widget _buildPackageCard({
    required String id,
    required String name,
    required int price,
    required String desc,
  }) {
    final isSelected = _selectedPackageId == id;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedPackageId = id;
          _selectedPackageName = name;
          _selectedPackagePrice = price;
        });
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected
              ? OrbitTheme.clientCyan.withValues(alpha: 0.06)
              : OrbitTheme.cardBackground,
          border: Border.all(
            color: isSelected ? OrbitTheme.clientCyan : OrbitTheme.border,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            Icon(
              isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
              color: isSelected
                  ? OrbitTheme.clientCyan
                  : OrbitTheme.textSecondary,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    desc,
                    style: const TextStyle(
                      fontSize: 11,
                      color: OrbitTheme.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            Text(
              '₹$price',
              style: const TextStyle(
                fontWeight: FontWeight.w900,
                color: OrbitTheme.clientCyan,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepSchedule() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Book right now instant lightning card
        GestureDetector(
          onTap: () => setState(() => _bookRightNow = !_bookRightNow),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: _bookRightNow
                  ? const LinearGradient(
                      colors: [Color(0xFFFFB300), Color(0xFFFF6D00)],
                    )
                  : null,
              color: _bookRightNow ? null : OrbitTheme.cardBackground,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: _bookRightNow ? Colors.amberAccent : OrbitTheme.border,
              ),
            ),
            child: Row(
              children: [
                const Icon(Icons.flash_on, color: Colors.white, size: 32),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Book Right Now!',
                        style: TextStyle(
                          fontWeight: FontWeight.w900,
                          fontSize: 16,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Partner accepts and dispatches immediately.',
                        style: TextStyle(
                          fontSize: 11,
                          color: _bookRightNow
                              ? Colors.white70
                              : OrbitTheme.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                Checkbox(
                  value: _bookRightNow,
                  activeColor: Colors.white,
                  checkColor: Colors.amber,
                  onChanged: (val) =>
                      setState(() => _bookRightNow = val ?? false),
                ),
              ],
            ),
          ),
        ),

        if (!_bookRightNow) ...[
          const SizedBox(height: 28),
          const Text(
            'Choose Date & Time Slot',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          ListTile(
            title: Text(
              _selectedDate == null
                  ? 'Select Booking Date'
                  : DateFormat('EEE, dd MMMM yyyy').format(_selectedDate!),
            ),
            trailing: const Icon(Icons.calendar_month),
            shape: RoundedRectangleBorder(
              side: const BorderSide(color: OrbitTheme.border),
              borderRadius: BorderRadius.circular(12),
            ),
            onTap: () async {
              final date = await showDatePicker(
                context: context,
                initialDate: DateTime.now(),
                firstDate: DateTime.now(),
                lastDate: DateTime.now().add(const Duration(days: 30)),
              );
              if (date != null) {
                setState(() => _selectedDate = date);
              }
            },
          ),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(
            initialValue: _selectedTimeSlot,
            decoration: const InputDecoration(
              labelText: 'Time Slot hour/minute',
            ),
            items: const [
              DropdownMenuItem(
                value: '10:00 AM',
                child: Text('10:00 AM - 11:30 AM'),
              ),
              DropdownMenuItem(
                value: '12:00 PM',
                child: Text('12:00 PM - 01:30 PM'),
              ),
              DropdownMenuItem(
                value: '03:00 PM',
                child: Text('03:00 PM - 04:30 PM'),
              ),
            ],
            onChanged: (val) =>
                setState(() => _selectedTimeSlot = val ?? '10:00 AM'),
          ),
        ],

        const SizedBox(height: 32),
        const Text(
          'Shoot Location',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _locationController,
          decoration: InputDecoration(
            labelText: 'Search location / Address *',
            prefixIcon: const Icon(Icons.pin_drop),
            suffixIcon: TextButton(
              onPressed: () {
                _locationController.text = 'Orbit Studio @ Noida Sector 62';
              },
              child: const Text(
                'LOCATE ME',
                style: TextStyle(
                  color: OrbitTheme.clientCyan,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _notesController,
          maxLines: 3,
          decoration: const InputDecoration(
            labelText: 'Additional shoot instructions / notes',
            alignLabelWithHint: true,
          ),
        ),
      ],
    );
  }

  Widget _buildStepPayment() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Confirm & Pay',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: OrbitTheme.cardBackground,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: OrbitTheme.border),
          ),
          child: Column(
            children: [
              _buildReviewRow('Selected Package', _selectedPackageName),
              const Divider(color: OrbitTheme.border, height: 24),
              _buildReviewRow(
                'Scheduled Slot',
                _bookRightNow
                    ? 'Instant Dispatch'
                    : DateFormat(
                        'yyyy-MM-dd',
                      ).format(_selectedDate ?? DateTime.now()),
              ),
              const Divider(color: OrbitTheme.border, height: 24),
              _buildReviewRow('Location', _locationController.text),
              const Divider(color: OrbitTheme.border, height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Total Amount',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text(
                    '₹$_selectedPackagePrice',
                    style: const TextStyle(
                      fontWeight: FontWeight.w900,
                      fontSize: 18,
                      color: OrbitTheme.clientCyan,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),
        const Text(
          'UPI ID / Mock Payment Method',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        TextField(
          decoration: InputDecoration(
            hintText: 'Enter UPI ID (e.g. user@paytm)',
            filled: true,
            fillColor: OrbitTheme.cardBackground,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildReviewRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(color: OrbitTheme.textSecondary, fontSize: 12),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Text(
            value,
            textAlign: TextAlign.end,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
          ),
        ),
      ],
    );
  }
}
