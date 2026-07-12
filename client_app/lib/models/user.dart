class UserProfile {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String? location;
  final String? avatar;
  final String avatarType;
  final String? avatarEmoji;
  final String? avatarPhotoUrl;
  final String? avatarImage;
  final String? brandLogo;
  final String? brandFont;
  final String? brandColor;
  final String? editorRequirements;
  final bool isOnline;

  UserProfile({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    this.location,
    this.avatar,
    required this.avatarType,
    this.avatarEmoji,
    this.avatarPhotoUrl,
    this.avatarImage,
    this.brandLogo,
    this.brandFont,
    this.brandColor,
    this.editorRequirements,
    this.isOnline = true,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      location: json['location'],
      avatar: json['avatar'],
      avatarType: json['avatarType'] ?? 'color',
      avatarEmoji: json['avatarEmoji'],
      avatarPhotoUrl: json['avatarPhotoUrl'],
      avatarImage: json['avatarImage'],
      brandLogo: json['brandLogo'],
      brandFont: json['brandFont'],
      brandColor: json['brandColor'],
      editorRequirements: json['editorRequirements'],
      isOnline: json['isOnline'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'location': location,
      'avatar': avatar,
      'avatarType': avatarType,
      'avatarEmoji': avatarEmoji,
      'avatarPhotoUrl': avatarPhotoUrl,
      'avatarImage': avatarImage,
      'brandLogo': brandLogo,
      'brandFont': brandFont,
      'brandColor': brandColor,
      'editorRequirements': editorRequirements,
      'isOnline': isOnline,
    };
  }

  UserProfile copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    String? location,
    String? avatar,
    String? avatarType,
    String? avatarEmoji,
    String? avatarPhotoUrl,
    String? avatarImage,
    String? brandLogo,
    String? brandFont,
    String? brandColor,
    String? editorRequirements,
    bool? isOnline,
  }) {
    return UserProfile(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      location: location ?? this.location,
      avatar: avatar ?? this.avatar,
      avatarType: avatarType ?? this.avatarType,
      avatarEmoji: avatarEmoji ?? this.avatarEmoji,
      avatarPhotoUrl: avatarPhotoUrl ?? this.avatarPhotoUrl,
      avatarImage: avatarImage ?? this.avatarImage,
      brandLogo: brandLogo ?? this.brandLogo,
      brandFont: brandFont ?? this.brandFont,
      brandColor: brandColor ?? this.brandColor,
      editorRequirements: editorRequirements ?? this.editorRequirements,
      isOnline: isOnline ?? this.isOnline,
    );
  }
}
