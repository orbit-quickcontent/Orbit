package io.orbit.partner.data.remote.dto

import com.google.gson.annotations.SerializedName

// Requests
data class SendOtpRequest(val email: String)
data class VerifyOtpRequest(val email: String, val otp: String)
data class AcceptBookingRequest(val partnerId: String)
data class DeclineBookingRequest(val partnerId: String)
data class LinkBankRequest(
    val partnerId: String,
    val accountHolderName: String,
    val accountNumber: String,
    val ifscCode: String,
    val bankName: String,
    val branchName: String? = null,
    val panNumber: String? = null
)
data class WithdrawRequest(val amount: Double)
data class SyncCompleteRequest(
    val footageUrls: List<String>,
    val proxyFootageUrl: String? = null
)

// Responses
data class UserDto(
    val id: String,
    val email: String,
    val name: String?,
    val phone: String?,
    val role: String?
)

data class VerifyOtpResponse(
    val success: Boolean,
    val role: String?,
    val user: UserDto?,
    val partnerProfile: PartnerProfileDto?,
    val email: String?,
    val newUser: Boolean?
)

data class PackageDto(
    val id: String,
    val name: String,
    val tier: String,
    val price: Int,
    val focus: String
)

data class PartnerProfileDto(
    val id: String,
    @SerializedName("userId") val userId: String,
    val location: String,
    val rating: Double,
    @SerializedName("completedProjects") val completedProjects: Int,
    @SerializedName("walletBalance") val walletBalance: Double,
    @SerializedName("pendingClearance") val pendingClearance: Double,
    @SerializedName("totalWithdrawn") val totalWithdrawn: Double,
    @SerializedName("verificationStatus") val verificationStatus: String,
    @SerializedName("payoutEnabled") val payoutEnabled: Boolean,
    @SerializedName("accountHolderName") val accountHolderName: String?,
    @SerializedName("encryptedAccountNumber") val encryptedAccountNumber: String?,
    @SerializedName("ifscCode") val ifscCode: String?,
    @SerializedName("bankName") val bankName: String?,
    @SerializedName("panNumber") val panNumber: String?
)

data class BookingDto(
    val id: String,
    val userId: String,
    val packageId: String,
    val partnerId: String?,
    val status: String,
    val bookingDate: String,
    val timeSlot: String,
    val location: String?,
    val notes: String?,
    val syncPercentage: Int?,
    val footageUrls: List<String>?,
    val masterReelUrl: String?,
    val user: UserDto?,
    val packageInfo: PackageDto?
)

data class BookingListResponse(val bookings: List<BookingDto>)
data class BookingResponse(val booking: BookingDto)
data class PartnerDetailsResponse(val partner: PartnerProfileDto)

data class WalletResponse(
    val balance: Double,
    val pendingClearance: Double,
    val totalWithdrawn: Double,
    val transactions: List<TransactionDto>
)

data class TransactionDto(
    val id: String,
    val partnerId: String,
    val bookingId: String?,
    val type: String,
    val amount: Double,
    val status: String,
    val description: String?,
    val createdAt: String
)

// Socket events
data class WsBookingDispatched(
    val booking: BookingDto,
    val dispatchId: String,
    val round: Int
)

data class WsBookingAcceptedByOther(
    val bookingId: String,
    val acceptedByPartnerId: String
)
