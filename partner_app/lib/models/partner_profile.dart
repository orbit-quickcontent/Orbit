class BankAccount {
  final String id;
  final String bankName;
  final String accountNumber;
  final String ifscCode;
  final String accountHolderName;
  final bool isVerified;
  final String linkedAt;

  BankAccount({
    required this.id,
    required this.bankName,
    required this.accountNumber,
    required this.ifscCode,
    required this.accountHolderName,
    required this.isVerified,
    required this.linkedAt,
  });

  factory BankAccount.fromJson(Map<String, dynamic> json) {
    return BankAccount(
      id: json['id'] ?? '',
      bankName: json['bankName'] ?? '',
      accountNumber: json['accountNumber'] ?? json['encryptedAccountNumber'] ?? '',
      ifscCode: json['ifscCode'] ?? '',
      accountHolderName: json['accountHolderName'] ?? '',
      isVerified: (json['isVerified'] ?? false) || (json['verificationStatus'] == 'VERIFIED'),
      linkedAt: json['linkedAt'] ?? json['verifiedAt'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'bankName': bankName,
      'accountNumber': accountNumber,
      'ifscCode': ifscCode,
      'accountHolderName': accountHolderName,
      'isVerified': isVerified,
      'linkedAt': linkedAt,
    };
  }
}

class PartnerWallet {
  final double balance;
  final double pendingClearance;
  final double totalWithdrawn;

  PartnerWallet({
    this.balance = 0.0,
    this.pendingClearance = 0.0,
    this.totalWithdrawn = 0.0,
  });

  factory PartnerWallet.fromJson(Map<String, dynamic> json) {
    return PartnerWallet(
      balance: (json['walletBalance'] as num?)?.toDouble() ?? 0.0,
      pendingClearance: (json['pendingClearance'] as num?)?.toDouble() ?? 0.0,
      totalWithdrawn: (json['totalWithdrawn'] as num?)?.toDouble() ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'walletBalance': balance,
      'pendingClearance': pendingClearance,
      'totalWithdrawn': totalWithdrawn,
    };
  }
}

class PartnerProfile {
  final String id;
  final String userId;
  final String name;
  final String email;
  final String phone;
  final String location;
  final bool availability;
  final bool isVerified;
  final String verificationStatus;
  final double rating;
  final int completedProjects;
  final String deviceInfo;
  final PartnerWallet wallet;
  final BankAccount? bankAccount;

  PartnerProfile({
    required this.id,
    required this.userId,
    required this.name,
    required this.email,
    required this.phone,
    required this.location,
    required this.availability,
    required this.isVerified,
    required this.verificationStatus,
    this.rating = 0.0,
    this.completedProjects = 0,
    required this.deviceInfo,
    required this.wallet,
    this.bankAccount,
  });

  factory PartnerProfile.fromJson(Map<String, dynamic> json) {
    Map<String, dynamic> userMap = json['user'] ?? {};
    
    BankAccount? bank;
    if (json['accountHolderName'] != null || json['bankAccount'] != null) {
      bank = BankAccount.fromJson(json['bankAccount'] ?? json);
    }

    return PartnerProfile(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      name: userMap['name'] ?? json['name'] ?? '',
      email: userMap['email'] ?? json['email'] ?? '',
      phone: userMap['phone'] ?? json['phone'] ?? '',
      location: json['location'] ?? '',
      availability: json['availability'] ?? true,
      isVerified: json['isVerified'] ?? false,
      verificationStatus: json['verificationStatus'] ?? 'UNVERIFIED',
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      completedProjects: json['completedProjects'] ?? 0,
      deviceInfo: json['deviceInfo'] ?? '',
      wallet: PartnerWallet.fromJson(json),
      bankAccount: bank,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'name': name,
      'email': email,
      'phone': phone,
      'location': location,
      'availability': availability,
      'isVerified': isVerified,
      'verificationStatus': verificationStatus,
      'rating': rating,
      'completedProjects': completedProjects,
      'deviceInfo': deviceInfo,
      'walletBalance': wallet.balance,
      'pendingClearance': wallet.pendingClearance,
      'totalWithdrawn': wallet.totalWithdrawn,
      if (bankAccount != null) 'bankAccount': bankAccount!.toJson(),
    };
  }

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

class PartnerTransaction {
  final String id;
  final String? bookingId;
  final String type;
  final double amount;
  final String status;
  final String description;
  final String createdAt;

  PartnerTransaction({
    required this.id,
    this.bookingId,
    required this.type,
    required this.amount,
    required this.status,
    required this.description,
    required this.createdAt,
  });

  factory PartnerTransaction.fromJson(Map<String, dynamic> json) {
    return PartnerTransaction(
      id: json['id'] ?? '',
      bookingId: json['bookingId'],
      type: json['type'] ?? 'EARNING',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      status: json['status'] ?? 'COMPLETED',
      description: json['description'] ?? '',
      createdAt: json['createdAt'] ?? '',
    );
  }
}
