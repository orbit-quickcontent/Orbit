package io.orbit.client.data.remote.dto

import com.google.gson.annotations.SerializedName

// ============================================================
// Request DTOs
// ============================================================

data class SendOtpRequest(
    @SerializedName("email") val email: String
)

data class VerifyOtpRequest(
    @SerializedName("email") val email: String,
    @SerializedName("otp") val otp: String
)

data class CreateUserRequest(
    @SerializedName("email") val email: String,
    @SerializedName("name") val name: String? = null,
    @SerializedName("phone") val phone: String? = null,
    @SerializedName("location") val location: String? = null,
    @SerializedName("role") val role: String = "USER",
    @SerializedName("brandLogo") val brandLogo: String? = null,
    @SerializedName("brandFont") val brandFont: String? = null,
    @SerializedName("brandColor") val brandColor: String? = null,
    @SerializedName("editorRequirements") val editorRequirements: String? = null
)

data class CreateBookingRequest(
    @SerializedName("userId") val userId: String,
    @SerializedName("packageId") val packageId: String,
    @SerializedName("bookingDate") val bookingDate: String,
    @SerializedName("timeSlot") val timeSlot: String,
    @SerializedName("location") val location: String? = null,
    @SerializedName("notes") val notes: String? = null,
    @SerializedName("razorpayPaymentId") val razorpayPaymentId: String? = null,
    @SerializedName("type") val type: String = "delivery"
)

// ============================================================
// Response DTOs
// ============================================================

data class SendOtpResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("message") val message: String,
    @SerializedName("devOtp") val devOtp: String? = null   // debug only
)

data class UserDto(
    @SerializedName("id") val id: String,
    @SerializedName("email") val email: String,
    @SerializedName("name") val name: String?,
    @SerializedName("phone") val phone: String?,
    @SerializedName("location") val location: String?,
    @SerializedName("role") val role: String?,
    @SerializedName("brandLogo") val brandLogo: String?,
    @SerializedName("brandFont") val brandFont: String?,
    @SerializedName("brandColor") val brandColor: String?,
    @SerializedName("editorRequirements") val editorRequirements: String?,
    @SerializedName("avatar") val avatar: String?,
    @SerializedName("createdAt") val createdAt: String?
)

data class VerifyOtpResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("role") val role: String?,
    @SerializedName("user") val user: UserDto?,
    @SerializedName("email") val email: String?,
    @SerializedName("newUser") val newUser: Boolean?
)

data class CreateUserResponse(
    @SerializedName("user") val user: UserDto
)

data class PackageDto(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("tier") val tier: String,
    @SerializedName("price") val price: Int,
    @SerializedName("focus") val focus: String,
    @SerializedName("deliveryTime") val deliveryTime: String,
    @SerializedName("features") val features: List<String>,
    @SerializedName("popular") val popular: Boolean
)

data class PartnerInfoDto(
    @SerializedName("id") val id: String,
    @SerializedName("location") val location: String?,
    @SerializedName("rating") val rating: Double?,
    @SerializedName("completedProjects") val completedProjects: Int?,
    @SerializedName("deviceInfo") val deviceInfo: String?,
    @SerializedName("user") val user: UserDto?
)

data class BookingDto(
    @SerializedName("id") val id: String,
    @SerializedName("userId") val userId: String,
    @SerializedName("packageId") val packageId: String,
    @SerializedName("partnerId") val partnerId: String?,
    @SerializedName("status") val status: String,
    @SerializedName("paymentStatus") val paymentStatus: String,
    @SerializedName("bookingDate") val bookingDate: String,
    @SerializedName("timeSlot") val timeSlot: String,
    @SerializedName("location") val location: String?,
    @SerializedName("notes") val notes: String?,
    @SerializedName("syncPercentage") val syncPercentage: Int?,
    @SerializedName("footageUrls") val footageUrls: List<String>?,
    @SerializedName("masterReelUrl") val masterReelUrl: String?,
    @SerializedName("deliveredAt") val deliveredAt: String?,
    @SerializedName("createdAt") val createdAt: String?,
    @SerializedName("user") val user: UserDto?,
    @SerializedName("partner") val partner: PartnerInfoDto?,
    @SerializedName("package") val packageInfo: PackageDto?
)

data class BookingListResponse(
    @SerializedName("bookings") val bookings: List<BookingDto>
)

data class BookingResponse(
    @SerializedName("booking") val booking: BookingDto
)

// WebSocket events
data class WsBookingStatusUpdate(
    @SerializedName("bookingId") val bookingId: String,
    @SerializedName("status") val status: String,
    @SerializedName("previousStatus") val previousStatus: String?,
    @SerializedName("reelUrl") val reelUrl: String?,
    @SerializedName("deliveredAt") val deliveredAt: String?
)

data class WsPartnerAssigned(
    @SerializedName("bookingId") val bookingId: String,
    @SerializedName("partnerId") val partnerId: String,
    @SerializedName("partnerName") val partnerName: String
)
