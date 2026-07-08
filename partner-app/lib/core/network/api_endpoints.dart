class ApiEndpoints {
  static const String users = '/api/users';
  static const String partners = '/api/partners';
  static const String packages = '/api/packages';
  static const String bookings = '/api/bookings';
  static const String linkBank = '/api/partners/link-bank';

  static String partnerDetail(String id) => '/api/partners/$id';
  static String partnerWallet(String id) => '/api/partners/$id/wallet';
  static String partnerWithdraw(String id) => '/api/partners/$id/withdraw';
  static String availableBookings(String partnerId) => '/api/bookings/available?partnerId=$partnerId';
  
  static String bookingDetail(String id) => '/api/bookings/$id';
  static String acceptBooking(String id) => '/api/bookings/$id/accept';
  static String declineBooking(String id) => '/api/bookings/$id/decline';
  static String startSync(String id) => '/api/bookings/$id/sync';
}
