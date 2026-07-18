# Orbit Unified REST API contracts

All request / response structures align with the FastAPI backend layer.

## Base URLs
- **Production**: `https://api.orbitlogic.io/`
- **Development**: `http://localhost:5000/`

---

## 1. Authentication

### Send OTP
* **Endpoint**: `POST /api/auth/send-otp`
* **Request**:
```json
{
  "email": "creator@orbit.io"
}
```
* **Response**:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "devOtp": "123456"
}
```

### Verify OTP
* **Endpoint**: `POST /api/auth/verify-otp`
* **Request**:
```json
{
  "email": "creator@orbit.io",
  "otp": "123456"
}
```
* **Response**:
```json
{
  "success": true,
  "role": "USER",
  "user": {
    "id": "usr-demo",
    "email": "creator@orbit.io",
    "name": "Arjun Kapoor"
  },
  "newUser": false
}
```

---

## 2. Bookings

### Create Booking
* **Endpoint**: `POST /api/bookings`
* **Request**:
```json
{
  "userId": "usr-demo",
  "packageId": "pkg-personalized",
  "bookingDate": "2026-07-20",
  "timeSlot": "12:00 PM",
  "location": "Bandra West, Mumbai",
  "notes": "Color correction overlay profile",
  "razorpayPaymentId": "pay_mock_123"
}
```
* **Response**:
```json
{
  "booking": {
    "id": "bok-abc",
    "status": "PARTNER_DISPATCHED",
    "bookingDate": "2026-07-20"
  }
}
```

### Accept Booking (Partner)
* **Endpoint**: `POST /api/bookings/{bookingId}/accept`
* **Request**:
```json
{
  "partnerId": "prt-demo"
}
```
* **Response**:
```json
{
  "booking": {
    "id": "bok-abc",
    "status": "EN_ROUTE",
    "partnerId": "prt-demo"
  }
}
```

### Complete Sync (Partner)
* **Endpoint**: `POST /api/bookings/{bookingId}/sync-complete`
* **Request**:
```json
{
  "footageUrls": [
    "/upload/reels/clip1.mp4",
    "/upload/reels/clip2.mp4"
  ]
}
```
* **Response**:
```json
{
  "success": true
}
```
*(Triggers automated salary payout of ₹700 credit to partner account)*
