package io.orbit.client.domain.repository

import io.orbit.client.domain.model.Booking

interface BookingRepository {
    suspend fun listBookings(email: String): Result<List<Booking>>
    suspend fun createBooking(
        userId: String,
        packageId: String,
        bookingDate: String,
        timeSlot: String,
        location: String?,
        notes: String?,
        paymentId: String?
    ): Result<Booking>
    suspend fun getBookingDetails(bookingId: String): Result<Booking>
    suspend fun trackBooking(bookingId: String): Result<String>
}
