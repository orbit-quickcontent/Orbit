import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/partner_profile.dart';

class StorageService {
  static const String _profileKey = 'orbit_partner_profile';
  static const String _authKey = 'orbit_partner_authenticated';
  static const String _partnerIdKey = 'orbit_partner_id';

  Future<void> saveProfile(PartnerProfile profile) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_profileKey, json.encode(profile.toJson()));
    await prefs.setBool(_authKey, true);
    await prefs.setString(_partnerIdKey, profile.id);
  }

  Future<PartnerProfile?> getProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_profileKey);
    if (raw == null) return null;
    try {
      return PartnerProfile.fromJson(json.decode(raw));
    } catch (_) {
      return null;
    }
  }

  Future<String?> getPartnerId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_partnerIdKey);
  }

  Future<bool> isAuthenticated() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_authKey) ?? false;
  }

  Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_profileKey);
    await prefs.remove(_authKey);
    await prefs.remove(_partnerIdKey);
  }
}
