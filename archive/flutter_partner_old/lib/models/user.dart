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
      'isOnline': isOnline,
    };
  }
}
