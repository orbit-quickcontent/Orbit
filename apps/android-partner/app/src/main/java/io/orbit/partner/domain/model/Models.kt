package io.orbit.partner.domain.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.UUID

data class User(
    val id: String,
    val email: String,
    val name: String?,
    val phone: String?,
    val role: String?
)

data class Package(
    val id: String,
    val name: String,
    val tier: String,
    val price: Int,
    val focus: String
)

data class Booking(
    val id: String,
    val userId: String,
    val packageId: String,
    val partnerId: String?,
    val status: BookingStatus,
    val bookingDate: String,
    val timeSlot: String,
    val location: String?,
    val notes: String?,
    val syncPercentage: Int = 0,
    val footageUrls: List<String> = emptyList(),
    val masterReelUrl: String? = null,
    val user: User? = null,
    val packageInfo: Package? = null
)

enum class BookingStatus(val display: String, val step: Int) {
    PENDING("Booking Placed", 0),
    PAID("Payment Confirmed", 1),
    PARTNER_DISPATCHED("Dispatched", 2),
    EN_ROUTE("En Route", 3),
    SHOOTING("Shooting", 4),
    SYNCING("Syncing", 5),
    EDITING("Editing", 6),
    DELIVERED("Delivered", 7);

    companion object {
        fun fromString(value: String): BookingStatus =
            values().find { it.name == value } ?: PENDING
    }
}

data class PartnerProfile(
    val id: String,
    val userId: String,
    val location: String,
    val rating: Double,
    val completedProjects: Int,
    val walletBalance: Double,
    val pendingClearance: Double,
    val totalWithdrawn: Double,
    val verificationStatus: String, // UNVERIFIED | PENDING | VERIFIED
    val payoutEnabled: Boolean,
    val accountHolderName: String? = null,
    val encryptedAccountNumber: String? = null,
    val ifscCode: String? = null,
    val bankName: String? = null,
    val panNumber: String? = null
)

data class Transaction(
    val id: String,
    val partnerId: String,
    val bookingId: String?,
    val type: String, // EARNING | WITHDRAWAL
    val amount: Double,
    val status: String,
    val description: String?,
    val createdAt: String
)

// Offline Actions Queue table (Room DB entity)
@Entity(tableName = "pending_actions")
data class PendingAction(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val type: String,           // ACCEPT_BOOKING | UPDATE_STAGE | SYNC_COMPLETE
    val payload: String,        // JSON serialized object
    val bookingId: String,
    val createdAt: Long = System.currentTimeMillis()
)
