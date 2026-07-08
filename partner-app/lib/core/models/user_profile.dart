class PartnerWallet {
  final double balance;
  final double pendingClearance;
  final double totalWithdrawn;
  final String? lastWithdrawnAt;

  PartnerWallet({
    required this.balance,
    required this.pendingClearance,
    required this.totalWithdrawn,
    this.lastWithdrawnAt,
  });

  factory PartnerWallet.fromJson(Map<String, dynamic> json) {
    return PartnerWallet(
      balance: (json['balance'] ?? 0).toDouble(),
      pendingClearance: (json['pendingClearance'] ?? 0).toDouble(),
      totalWithdrawn: (json['totalWithdrawn'] ?? 0).toDouble(),
      lastWithdrawnAt: json['lastWithdrawnAt'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'balance': balance,
        'pendingClearance': pendingClearance,
        'totalWithdrawn': totalWithdrawn,
        'lastWithdrawnAt': lastWithdrawnAt,
      };
}

class PartnerSettings {
  final bool notificationsEnabled;
  final bool newBookingAlerts;
  final bool paymentAlerts;
  final bool autoSyncOnWifi;
  final bool highQualityUpload;
  final bool locationTracking;

  PartnerSettings({
    required this.notificationsEnabled,
    required this.newBookingAlerts,
    required this.paymentAlerts,
    required this.autoSyncOnWifi,
    required this.highQualityUpload,
    required this.locationTracking,
  });

  factory PartnerSettings.fromJson(Map<String, dynamic> json) {
    return PartnerSettings(
      notificationsEnabled: json['notificationsEnabled'] ?? true,
      newBookingAlerts: json['newBookingAlerts'] ?? true,
      paymentAlerts: json['paymentAlerts'] ?? true,
      autoSyncOnWifi: json['autoSyncOnWifi'] ?? true,
      highQualityUpload: json['highQualityUpload'] ?? false,
      locationTracking: json['locationTracking'] ?? true,
    );
  }

  Map<String, dynamic> toJson() => {
        'notificationsEnabled': notificationsEnabled,
        'newBookingAlerts': newBookingAlerts,
        'paymentAlerts': paymentAlerts,
        'autoSyncOnWifi': autoSyncOnWifi,
        'highQualityUpload': highQualityUpload,
        'locationTracking': locationTracking,
      };
}

class BankAccount {
  final String? id;
  final String bankName;
  final String accountNumber;
  final String ifscCode;
  final String accountHolderName;
  final bool isVerified;
  final String? linkedAt;

  BankAccount({
    this.id,
    required this.bankName,
    required this.accountNumber,
    required this.ifscCode,
    required this.accountHolderName,
    required this.isVerified,
    this.linkedAt,
  });

  factory BankAccount.fromJson(Map<String, dynamic> json) {
    return BankAccount(
      id: json['id'] as String?,
      bankName: json['bankName'] ?? '',
      accountNumber: json['accountNumber'] ?? '',
      ifscCode: json['ifscCode'] ?? '',
      accountHolderName: json['accountHolderName'] ?? '',
      isVerified: json['isVerified'] ?? false,
      linkedAt: json['linkedAt'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'bankName': bankName,
        'accountNumber': accountNumber,
        'ifscCode': ifscCode,
        'accountHolderName': accountHolderName,
        'isVerified': isVerified,
        'linkedAt': linkedAt,
      };
}

class UserProfile {
  final String name;
  final String email;
  final String phone;
  final String location;
  final String? avatar;
  final String? avatarType;
  final String? avatarEmoji;
  final String? avatarPhotoUrl;
  final bool isOnline;
  final bool isVerified;
  final PartnerWallet wallet;
  final BankAccount? bankAccount;
  final PartnerSettings settings;

  UserProfile({
    required this.name,
    required this.email,
    required this.phone,
    required this.location,
    this.avatar,
    this.avatarType,
    this.avatarEmoji,
    this.avatarPhotoUrl,
    required this.isOnline,
    required this.isVerified,
    required this.wallet,
    this.bankAccount,
    required this.settings,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      location: json['location'] ?? '',
      avatar: json['avatar'] as String?,
      avatarType: json['avatarType'] as String?,
      avatarEmoji: json['avatarEmoji'] as String?,
      avatarPhotoUrl: json['avatarPhotoUrl'] as String?,
      isOnline: json['isOnline'] ?? true,
      isVerified: json['isVerified'] ?? false,
      wallet: PartnerWallet.fromJson(json['wallet'] ?? {}),
      bankAccount: json['bankAccount'] != null ? BankAccount.fromJson(json['bankAccount']) : null,
      settings: PartnerSettings.fromJson(json['settings'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'email': email,
        'phone': phone,
        'location': location,
        'avatar': avatar,
        'avatarType': avatarType,
        'avatarEmoji': avatarEmoji,
        'avatarPhotoUrl': avatarPhotoUrl,
        'isOnline': isOnline,
        'isVerified': isVerified,
        'wallet': wallet.toJson(),
        'bankAccount': bankAccount?.toJson(),
        'settings': settings.toJson(),
      };

  UserProfile copyWith({
    String? name,
    String? email,
    String? phone,
    String? location,
    String? avatar,
    String? avatarType,
    String? avatarEmoji,
    String? avatarPhotoUrl,
    bool? isOnline,
    bool? isVerified,
    PartnerWallet? wallet,
    BankAccount? bankAccount,
    PartnerSettings? settings,
  }) {
    return UserProfile(
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      location: location ?? this.location,
      avatar: avatar ?? this.avatar,
      avatarType: avatarType ?? this.avatarType,
      avatarEmoji: avatarEmoji ?? this.avatarEmoji,
      avatarPhotoUrl: avatarPhotoUrl ?? this.avatarPhotoUrl,
      isOnline: isOnline ?? this.isOnline,
      isVerified: isVerified ?? this.isVerified,
      wallet: wallet ?? this.wallet,
      bankAccount: bankAccount ?? this.bankAccount,
      settings: settings ?? this.settings,
    );
  }
}
