package io.orbit.client.domain.model

data class User(
    val id: String,
    val email: String,
    val name: String?,
    val phone: String?,
    val location: String?,
    val role: String = "USER",
    val brandLogo: String? = null,
    val brandFont: String? = null,
    val brandColor: String? = null,
    val editorRequirements: String? = null,
    val avatar: String? = null,
    val createdAt: String? = null
)

data class Package(
    val id: String,
    val name: String,
    val tier: String,        // PERSONALIZED | PROFESSIONAL
    val price: Int,          // INR
    val focus: String,
    val deliveryTime: String,
    val features: List<String>,
    val popular: Boolean = false
)

data class Booking(
    val id: String,
    val userId: String,
    val packageId: String,
    val partnerId: String? = null,
    val status: BookingStatus,
    val paymentStatus: String,
    val bookingDate: String,
    val timeSlot: String,
    val location: String? = null,
    val notes: String? = null,
    val syncPercentage: Int = 0,
    val footageUrls: List<String> = emptyList(),
    val masterReelUrl: String? = null,
    val deliveredAt: String? = null,
    val createdAt: String? = null,
    val user: User? = null,
    val partner: PartnerInfo? = null,
    val packageInfo: Package? = null
)

data class PartnerInfo(
    val id: String,
    val location: String,
    val rating: Double,
    val completedProjects: Int,
    val deviceInfo: String? = null,
    val user: User? = null
)

enum class BookingStatus(val display: String, val step: Int) {
    PENDING("Booking Placed", 0),
    PAID("Payment Confirmed", 1),
    PARTNER_DISPATCHED("Finding Partner", 2),
    EN_ROUTE("Partner En Route", 3),
    SHOOTING("Shooting in Progress", 4),
    SYNCING("Syncing Footage", 5),
    EDITING("Editing Your Reel", 6),
    DELIVERED("Reel Delivered!", 7);

    companion object {
        fun fromString(value: String): BookingStatus =
            values().find { it.name == value } ?: PENDING
    }
}

data class AuthState(
    val isLoading: Boolean = false,
    val email: String = "",
    val otp: String = "",
    val otpSent: Boolean = false,
    val user: User? = null,
    val error: String? = null,
    val isAuthenticated: Boolean = false
)
