package io.orbitlogic.partner.data.models

data class BankAccount(
    val id: String,
    val bankName: String,
    val accountNumber: String,
    val ifscCode: String,
    val accountHolderName: String,
    val isVerified: Boolean = false,
    val linkedAt: String = ""
)

data class PartnerWallet(
    val balance: Double = 0.0,
    val pendingClearance: Double = 0.0,
    val totalWithdrawn: Double = 0.0
)

data class PartnerProfile(
    val id: String,
    val userId: String,
    val name: String,
    val email: String,
    val phone: String,
    val location: String,
    val availability: Boolean = true,
    val isVerified: Boolean = false,
    val verificationStatus: String = "UNVERIFIED",
    val rating: Double = 0.0,
    val completedProjects: Int = 0,
    val deviceInfo: String = "",
    val wallet: PartnerWallet = PartnerWallet(),
    val bankAccount: BankAccount? = null
)

data class PartnerTransaction(
    val id: String,
    val bookingId: String? = null,
    val type: String, // EARNING, WITHDRAWAL
    val amount: Double,
    val status: String, // PENDING, COMPLETED, FAILED
    val description: String,
    val createdAt: String
)

data class BookingInfo(
    val id: String,
    val packageName: String,
    val packagePrice: Int,
    val status: String,
    val location: String,
    val bookingDate: String,
    val timeSlot: String,
    val clientName: String? = null,
    val clientPhone: String? = null,
    val notes: String? = null
)

// API response wrappers
data class AuthResponse(val devOtp: String? = null, val error: String? = null)
data class ProfileResponse(val profile: PartnerProfile)
data class WalletResponse(val wallet: PartnerWallet)
data class TransactionsResponse(val transactions: List<PartnerTransaction>)
data class BookingsResponse(val bookings: List<BookingInfo>)
data class GenericResponse(val success: Boolean = true, val error: String? = null)
