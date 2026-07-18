package io.orbit.client.data.repository

import io.orbit.client.data.remote.OrbitApiService
import io.orbit.client.data.remote.dto.CreateBookingRequest
import io.orbit.client.domain.model.Booking
import io.orbit.client.domain.model.BookingStatus
import io.orbit.client.domain.model.Package
import io.orbit.client.domain.model.PartnerInfo
import io.orbit.client.domain.repository.BookingRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class BookingRepositoryImpl @Inject constructor(
    private val api: OrbitApiService
) : BookingRepository {

    override suspend fun listBookings(email: String): Result<List<Booking>> = runCatching {
        val response = api.listBookings(email)
        if (!response.isSuccessful) {
            throw Exception(response.errorBody()?.string() ?: "Failed to list bookings")
        }
        response.body()?.bookings?.map { it.toDomain() } ?: emptyList()
    }

    override suspend fun createBooking(
        userId: String,
        packageId: String,
        bookingDate: String,
        timeSlot: String,
        location: String?,
        notes: String?,
        paymentId: String?
    ): Result<Booking> = runCatching {
        val response = api.createBooking(
            CreateBookingRequest(
                userId = userId,
                packageId = packageId,
                bookingDate = bookingDate,
                timeSlot = timeSlot,
                location = location,
                notes = notes,
                razorpayPaymentId = paymentId
            )
        )
        if (!response.isSuccessful) {
            throw Exception(response.errorBody()?.string() ?: "Failed to create booking")
        }
        response.body()!!.booking.toDomain()
    }

    override suspend fun getBookingDetails(bookingId: String): Result<Booking> = runCatching {
        val response = api.getBooking(bookingId)
        if (!response.isSuccessful) {
            throw Exception(response.errorBody()?.string() ?: "Failed to get booking details")
        }
        response.body()!!.booking.toDomain()
    }

    override suspend fun trackBooking(bookingId: String): Result<String> = runCatching {
        val response = api.trackBooking(bookingId)
        if (!response.isSuccessful) {
            throw Exception(response.errorBody()?.string() ?: "Failed to track booking")
        }
        response.body()?.get("status")?.toString() ?: "PENDING"
    }
}

// Extension functions to convert Dto to Domain models
fun io.orbit.client.data.remote.dto.BookingDto.toDomain() = Booking(
    id = id,
    userId = userId,
    packageId = packageId,
    partnerId = partnerId,
    status = BookingStatus.fromString(status),
    paymentStatus = paymentStatus,
    bookingDate = bookingDate,
    timeSlot = timeSlot,
    location = location,
    notes = notes,
    syncPercentage = syncPercentage ?: 0,
    footageUrls = footageUrls ?: emptyList(),
    masterReelUrl = masterReelUrl,
    deliveredAt = deliveredAt,
    createdAt = createdAt,
    user = user?.toDomain(),
    partner = partner?.let { p ->
        PartnerInfo(
            id = p.id,
            location = p.location ?: "",
            rating = p.rating ?: 5.0,
            completedProjects = p.completedProjects ?: 0,
            deviceInfo = p.deviceInfo,
            user = p.user?.toDomain()
        )
    },
    packageInfo = packageInfo?.let { pkg ->
        Package(
            id = pkg.id,
            name = pkg.name,
            tier = pkg.tier,
            price = pkg.price,
            focus = pkg.focus,
            deliveryTime = pkg.deliveryTime,
            features = pkg.features,
            popular = pkg.popular
        )
    }
)
