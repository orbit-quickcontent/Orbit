package io.orbitlogic.client.data.models

data class UserProfile(
    val id: String,
    val name: String,
    val email: String,
    val phone: String,
    val location: String? = null,
    val avatar: String? = null,
    val avatarType: String = "color",
    val avatarEmoji: String? = null,
    val avatarPhotoUrl: String? = null,
    val brandLogo: String? = null,
    val brandFont: String? = null,
    val brandColor: String? = null,
    val editorRequirements: String? = null,
    val isOnline: Boolean = true
)

data class PackageInfo(
    val id: String,
    val name: String,
    val tier: String,
    val price: Int,
    val focus: String,
    val deliveryTime: String,
    val features: List<String>,
    val popular: Boolean = false
)

data class BookingInfo(
    val id: String,
    val userId: String,
    val packageId: String,
    val packageName: String,
    val packagePrice: Int,
    val partnerId: String? = null,
    val partnerName: String? = null,
    val status: String, // PENDING, PAID, PARTNER_DISPATCHED, EN_ROUTE, SHOOTING, SYNCING, EDITING, DELIVERED, CANCELLED
    val paymentStatus: String,
    val bookingDate: String,
    val timeSlot: String,
    val location: String,
    val syncPercentage: Int = 0,
    val editCountdown: Int? = null,
    val notes: String? = null,
    val footageUrls: String? = null,
    val masterReelUrl: String? = null,
    val deliveredAt: String? = null
)

// Wrapper objects for Retrofit API responses
data class AuthResponse(val devOtp: String? = null, val error: String? = null)
data class UserResponse(val user: UserProfile)
data class PackagesResponse(val packages: List<PackageInfo>)
data class BookingsResponse(val bookings: List<BookingInfo>)
data class BookingResponse(val booking: BookingInfo)
data class GenericResponse(val success: Boolean = true, val error: String? = null)
