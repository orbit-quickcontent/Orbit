class BookingInfo {
  final String id;
  final String packageId;
  final String packageName;
  final double packagePrice;
  final String status; // PENDING, ASSIGNED, ARRIVED, SHOOTING, EDITING, DELIVERED, CANCELLED
  final String paymentStatus; // UNPAID, PAID, REFUNDED
  final String bookingDate;
  final String timeSlot;
  final String location;
  final int syncPercentage;
  final int? editCountdown;
  final String? partnerName;
  final String notes;
  final String? deliveredAt;
  final bool downloaded;
  final String? cancelledBy;
  final String? reelUrl;
  final String? masterReelUrl;
  final String? hlsPlaylistUrl;
  final String? proxyFootageUrl;

  BookingInfo({
    required this.id,
    required this.packageId,
    required this.packageName,
    required this.packagePrice,
    required this.status,
    required this.paymentStatus,
    required this.bookingDate,
    required this.timeSlot,
    required this.location,
    required this.syncPercentage,
    this.editCountdown,
    this.partnerName,
    required this.notes,
    this.deliveredAt,
    required this.downloaded,
    this.cancelledBy,
    this.reelUrl,
    this.masterReelUrl,
    this.hlsPlaylistUrl,
    this.proxyFootageUrl,
  });

  factory BookingInfo.fromJson(Map<String, dynamic> json) {
    String rawStatus = json['status'] ?? 'PENDING';
    if (rawStatus == 'READY_TO_EDIT') rawStatus = 'EDITING';

    return BookingInfo(
      id: json['id'] ?? '',
      packageId: json['packageId'] ?? '',
      packageName: json['packageName'] ?? (json['package']?['name'] ?? ''),
      packagePrice: (json['packagePrice'] ?? (json['package']?['price'] ?? 0)).toDouble(),
      status: rawStatus,
      paymentStatus: json['paymentStatus'] ?? 'UNPAID',
      bookingDate: json['bookingDate'] ?? '',
      timeSlot: json['timeSlot'] ?? '',
      location: json['location'] ?? '',
      syncPercentage: json['syncPercentage'] ?? 0,
      editCountdown: json['editCountdown'] as int?,
      partnerName: json['partnerName'] ?? (json['partner']?['user']?['name'] as String?),
      notes: json['notes'] ?? '',
      deliveredAt: json['deliveredAt'] as String?,
      downloaded: json['downloaded'] ?? false,
      cancelledBy: json['cancelledBy'] as String?,
      reelUrl: json['reelUrl'] as String?,
      masterReelUrl: json['masterReelUrl'] as String?,
      hlsPlaylistUrl: json['hlsPlaylistUrl'] as String?,
      proxyFootageUrl: json['proxyFootageUrl'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'packageId': packageId,
        'packageName': packageName,
        'packagePrice': packagePrice,
        'status': status,
        'paymentStatus': paymentStatus,
        'bookingDate': bookingDate,
        'timeSlot': timeSlot,
        'location': location,
        'syncPercentage': syncPercentage,
        'editCountdown': editCountdown,
        'partnerName': partnerName,
        'notes': notes,
        'deliveredAt': deliveredAt,
        'downloaded': downloaded,
        'cancelledBy': cancelledBy,
        'reelUrl': reelUrl,
        'masterReelUrl': masterReelUrl,
        'hlsPlaylistUrl': hlsPlaylistUrl,
        'proxyFootageUrl': proxyFootageUrl,
      };

  BookingInfo copyWith({
    String? status,
    String? paymentStatus,
    int? syncPercentage,
    int? editCountdown,
    String? partnerName,
    String? reelUrl,
    String? masterReelUrl,
    String? hlsPlaylistUrl,
    String? proxyFootageUrl,
    bool? downloaded,
  }) {
    return BookingInfo(
      id: id,
      packageId: packageId,
      packageName: packageName,
      packagePrice: packagePrice,
      status: status ?? this.status,
      paymentStatus: paymentStatus ?? this.paymentStatus,
      bookingDate: bookingDate,
      timeSlot: timeSlot,
      location: location,
      syncPercentage: syncPercentage ?? this.syncPercentage,
      editCountdown: editCountdown ?? this.editCountdown,
      partnerName: partnerName ?? this.partnerName,
      notes: notes,
      deliveredAt: deliveredAt,
      downloaded: downloaded ?? this.downloaded,
      cancelledBy: cancelledBy,
      reelUrl: reelUrl ?? this.reelUrl,
      masterReelUrl: masterReelUrl ?? this.masterReelUrl,
      hlsPlaylistUrl: hlsPlaylistUrl ?? this.hlsPlaylistUrl,
      proxyFootageUrl: proxyFootageUrl ?? this.proxyFootageUrl,
    );
  }
}
