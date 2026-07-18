class BookingInfo {
  final String id;
  final String userId;
  final String packageId;
  final String packageName;
  final int packagePrice;
  final String? partnerId;
  final String? partnerName;
  final String status; // PENDING, PAID, PARTNER_DISPATCHED, EN_ROUTE, SHOOTING, SYNCING, EDITING, DELIVERED, CANCELLED
  final String paymentStatus;
  final String bookingDate;
  final String timeSlot;
  final String location;
  final int syncPercentage;
  final int? editCountdown;
  final String? notes;
  final String? footageUrls;
  final String? masterReelUrl;
  final String? deliveredAt;

  BookingInfo({
    required this.id,
    required this.userId,
    required this.packageId,
    required this.packageName,
    required this.packagePrice,
    this.partnerId,
    this.partnerName,
    required this.status,
    required this.paymentStatus,
    required this.bookingDate,
    required this.timeSlot,
    required this.location,
    this.syncPercentage = 0,
    this.editCountdown,
    this.notes,
    this.footageUrls,
    this.masterReelUrl,
    this.deliveredAt,
  });

  factory BookingInfo.fromJson(Map<String, dynamic> json) {
    // Check if package details are embedded
    Map<String, dynamic> pkg = json['package'] ?? {};
    String pkgName = pkg['name'] ?? json['packageName'] ?? 'Cinematic Shoot';
    int pkgPrice = pkg['price'] ?? json['packagePrice'] ?? 1999;

    // Check if partner details are embedded
    Map<String, dynamic>? partner = json['partner'];
    Map<String, dynamic>? partnerUser = partner?['user'];
    String? prtName = partnerUser?['name'] ?? json['partnerName'];

    return BookingInfo(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      packageId: json['packageId'] ?? '',
      packageName: pkgName,
      packagePrice: pkgPrice,
      partnerId: json['partnerId'],
      partnerName: prtName,
      status: json['status'] ?? 'PENDING',
      paymentStatus: json['paymentStatus'] ?? 'UNPAID',
      bookingDate: json['bookingDate'] ?? '',
      timeSlot: json['timeSlot'] ?? '',
      location: json['location'] ?? '',
      syncPercentage: json['syncPercentage'] ?? 0,
      editCountdown: json['editCountdown'],
      notes: json['notes'],
      footageUrls: json['footageUrls'],
      masterReelUrl: json['masterReelUrl'] ?? json['reelUrl'], // fallback
      deliveredAt: json['deliveredAt'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'packageId': packageId,
      'packageName': packageName,
      'packagePrice': packagePrice,
      'partnerId': partnerId,
      'partnerName': partnerName,
      'status': status,
      'paymentStatus': paymentStatus,
      'bookingDate': bookingDate,
      'timeSlot': timeSlot,
      'location': location,
      'syncPercentage': syncPercentage,
      'editCountdown': editCountdown,
      'notes': notes,
      'footageUrls': footageUrls,
      'masterReelUrl': masterReelUrl,
      'deliveredAt': deliveredAt,
    };
  }

  BookingInfo copyWith({
    String? id,
    String? userId,
    String? packageId,
    String? packageName,
    int? packagePrice,
    String? partnerId,
    String? partnerName,
    String? status,
    String? paymentStatus,
    String? bookingDate,
    String? timeSlot,
    String? location,
    int? syncPercentage,
    int? editCountdown,
    String? notes,
    String? footageUrls,
    String? masterReelUrl,
    String? deliveredAt,
  }) {
    return BookingInfo(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      packageId: packageId ?? this.packageId,
      packageName: packageName ?? this.packageName,
      packagePrice: packagePrice ?? this.packagePrice,
      partnerId: partnerId ?? this.partnerId,
      partnerName: partnerName ?? this.partnerName,
      status: status ?? this.status,
      paymentStatus: paymentStatus ?? this.paymentStatus,
      bookingDate: bookingDate ?? this.bookingDate,
      timeSlot: timeSlot ?? this.timeSlot,
      location: location ?? this.location,
      syncPercentage: syncPercentage ?? this.syncPercentage,
      editCountdown: editCountdown ?? this.editCountdown,
      notes: notes ?? this.notes,
      footageUrls: footageUrls ?? this.footageUrls,
      masterReelUrl: masterReelUrl ?? this.masterReelUrl,
      deliveredAt: deliveredAt ?? this.deliveredAt,
    );
  }
}
