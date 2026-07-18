package io.orbit.partner.data.repository

import com.google.gson.Gson
import io.orbit.partner.data.local.ConnectivityMonitor
import io.orbit.partner.data.local.PendingActionDao
import io.orbit.partner.data.remote.OrbitPartnerApiService
import io.orbit.partner.data.remote.dto.AcceptBookingRequest
import io.orbit.partner.data.remote.dto.DeclineBookingRequest
import io.orbit.partner.data.remote.dto.SyncCompleteRequest
import io.orbit.partner.domain.model.Booking
import io.orbit.partner.domain.model.BookingStatus
import io.orbit.partner.domain.model.Package
import io.orbit.partner.domain.model.PendingAction
import io.orbit.partner.domain.model.User
import io.orbit.partner.domain.repository.PartnerBookingRepository
import timber.log.Timber
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PartnerBookingRepositoryImpl @Inject constructor(
    private val api: OrbitPartnerApiService,
    private val pendingActionDao: PendingActionDao,
    private val connectivityMonitor: ConnectivityMonitor,
    private val gson: Gson
) : PartnerBookingRepository {

    override suspend fun fetchAvailableGigs(partnerId: String): Result<List<Booking>> = runCatching {
        val response = api.listAvailableGigs(partnerId)
        if (!response.isSuccessful) {
            throw Exception(response.errorBody()?.string() ?: "Failed to load gigs")
        }
        response.body()?.bookings?.map { it.toDomain() } ?: emptyList()
    }

    override suspend fun acceptGig(bookingId: String, partnerId: String): Result<Booking> = runCatching {
        if (!connectivityMonitor.isOnline.value) {
            // Cannot accept gigs while offline (must verify live allocation & Cashfree status)
            throw Exception("Network connection required to accept cinematic shoots.")
        }
        val response = api.acceptBooking(bookingId, AcceptBookingRequest(partnerId))
        if (!response.isSuccessful) {
            throw Exception(response.errorBody()?.string() ?: "Failed to accept booking")
        }
        response.body()!!.booking.toDomain()
    }

    override suspend fun declineGig(bookingId: String, partnerId: String): Result<Boolean> = runCatching {
        if (connectivityMonitor.isOnline.value) {
            val response = api.declineBooking(bookingId, DeclineBookingRequest(partnerId))
            response.isSuccessful
        } else {
            // Queue offline decline action
            val payload = gson.toJson(DeclineBookingRequest(partnerId))
            pendingActionDao.insertAction(
                PendingAction(
                    type = "DECLINE_BOOKING",
                    payload = payload,
                    bookingId = bookingId
                )
            )
            Timber.i("Offline queue: decline action registered for $bookingId")
            true
        }
    }

    override suspend fun updateShootStage(bookingId: String, stage: String): Result<Booking> = runCatching {
        val updateMap = mapOf("status" to stage)
        if (connectivityMonitor.isOnline.value) {
            val response = api.updateBookingStage(bookingId, updateMap)
            if (!response.isSuccessful) {
                throw Exception(response.errorBody()?.string() ?: "Failed to update stage")
            }
            response.body()!!.booking.toDomain()
        } else {
            // Queue stage updates locally
            val payload = gson.toJson(updateMap)
            pendingActionDao.insertAction(
                PendingAction(
                    type = "UPDATE_STAGE",
                    payload = payload,
                    bookingId = bookingId
                )
            )
            Timber.i("Offline queue: stage update ($stage) registered for $bookingId")
            
            // Mock a local status booking update
            Booking(
                id = bookingId,
                userId = "",
                packageId = "",
                partnerId = null,
                status = BookingStatus.fromString(stage),
                bookingDate = "",
                timeSlot = "",
                location = null,
                notes = null
            )
        }
    }

    override suspend fun uploadFootageSync(bookingId: String, footageUrls: List<String>): Result<Boolean> = runCatching {
        val request = SyncCompleteRequest(footageUrls = footageUrls)
        if (connectivityMonitor.isOnline.value) {
            val response = api.completeFootageSync(bookingId, request)
            if (!response.isSuccessful) {
                throw Exception(response.errorBody()?.string() ?: "Failed to sync footage")
            }
            true
        } else {
            // Queue complete upload sync trigger
            val payload = gson.toJson(request)
            pendingActionDao.insertAction(
                PendingAction(
                    type = "SYNC_COMPLETE",
                    payload = payload,
                    bookingId = bookingId
                )
            )
            Timber.i("Offline queue: sync-complete action registered for $bookingId")
            true
        }
    }
}

// Mappings Dto → Domain
fun io.orbit.partner.data.remote.dto.BookingDto.toDomain() = Booking(
    id = id,
    userId = userId,
    packageId = packageId,
    partnerId = partnerId,
    status = BookingStatus.fromString(status),
    bookingDate = bookingDate,
    timeSlot = timeSlot,
    location = location,
    notes = notes,
    syncPercentage = syncPercentage ?: 0,
    footageUrls = footageUrls ?: emptyList(),
    masterReelUrl = masterReelUrl,
    user = user?.let { User(it.id, it.email, it.name, it.phone, it.role) },
    packageInfo = packageInfo?.let { Package(it.id, it.name, it.tier, it.price, it.focus) }
)
