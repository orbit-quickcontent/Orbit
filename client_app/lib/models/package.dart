class PackageInfo {
  final String id;
  final String name;
  final String tier;
  final int price;
  final String focus;
  final String deliveryTime;
  final List<String> features;
  final bool popular;

  PackageInfo({
    required this.id,
    required this.name,
    required this.tier,
    required this.price,
    required this.focus,
    required this.deliveryTime,
    required this.features,
    this.popular = false,
  });

  factory PackageInfo.fromJson(Map<String, dynamic> json) {
    return PackageInfo(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      tier: json['tier'] ?? '',
      price: json['price'] ?? 0,
      focus: json['focus'] ?? '',
      deliveryTime: json['deliveryTime'] ?? '',
      features: List<String>.from(json['features'] ?? []),
      popular: json['popular'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'tier': tier,
      'price': price,
      'focus': focus,
      'deliveryTime': deliveryTime,
      'features': features,
      'popular': popular,
    };
  }
}
