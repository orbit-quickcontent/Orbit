class PackageInfo {
  final String id;
  final String name;
  final String tier;
  final double price;
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
    required this.popular,
  });

  factory PackageInfo.fromJson(Map<String, dynamic> json) {
    var featuresFromJson = json['features'];
    List<String> featuresList = [];
    if (featuresFromJson is List) {
      featuresList = List<String>.from(featuresFromJson);
    } else if (featuresFromJson is String) {
      featuresList = List<String>.from(
          featuresFromJson.replaceAll('[', '').replaceAll(']', '').replaceAll('"', '').split(',').map((s) => s.trim()));
    }
    return PackageInfo(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      tier: json['tier'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      focus: json['focus'] ?? '',
      deliveryTime: json['deliveryTime'] ?? '',
      features: featuresList,
      popular: json['popular'] ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
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
