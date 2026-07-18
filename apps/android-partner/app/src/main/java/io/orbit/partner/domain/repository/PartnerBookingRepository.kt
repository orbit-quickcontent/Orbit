package io.orbit.partner.domain.repository

import io.orbit.partner.domain.model.Booking

interface PartnerBookingRepository {
    suspend fun fetchAvailableGigs(partnerId: String): Result<List<Booking>>
    suspend fun acceptGig(bookingId: String, partnerId: String): Result<Booking>
    suspend fun declineGig(bookingId: String, partnerId: String): Result<Boolean>
    suspend fun updateShootStage(bookingId: String, stage: String): Result<Booking>
    suspend fun uploadFootageSync(bookingId: String, footageUrls: List<String>): Result<Boolean>
}
