package io.orbit.client.data.remote

import io.orbit.client.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.*

// ============================================================
// Orbit REST API — Retrofit Interface
// All endpoints map exactly to the existing FastAPI backend
// Base URL: https://api.orbitlogic.io/ (prod) or http://10.0.2.2:5000/ (local)
// ============================================================

interface OrbitApiService {

    // --- Auth ---
    @POST("api/auth/send-otp")
    suspend fun sendOtp(@Body body: SendOtpRequest): Response<SendOtpResponse>

    @POST("api/auth/verify-otp")
    suspend fun verifyOtp(@Body body: VerifyOtpRequest): Response<VerifyOtpResponse>

    // --- Users ---
    @GET("api/users")
    suspend fun getUser(@Query("email") email: String): Response<CreateUserResponse>

    @POST("api/users")
    suspend fun createUser(@Body body: CreateUserRequest): Response<CreateUserResponse>

    @PATCH("api/users/{userId}")
    suspend fun updateUser(
        @Path("userId") userId: String,
        @Body body: Map<String, Any>
    ): Response<CreateUserResponse>

    // --- Packages ---
    @GET("api/packages")
    suspend fun listPackages(): Response<List<PackageDto>>

    // --- Bookings ---
    @GET("api/bookings")
    suspend fun listBookings(@Query("email") email: String? = null): Response<BookingListResponse>

    @POST("api/bookings")
    suspend fun createBooking(@Body body: CreateBookingRequest): Response<BookingResponse>

    @GET("api/bookings/{bookingId}")
    suspend fun getBooking(@Path("bookingId") bookingId: String): Response<BookingResponse>

    @PATCH("api/bookings/{bookingId}")
    suspend fun updateBooking(
        @Path("bookingId") bookingId: String,
        @Body body: Map<String, Any>
    ): Response<BookingResponse>

    @GET("api/bookings/{bookingId}/track")
    suspend fun trackBooking(@Path("bookingId") bookingId: String): Response<Map<String, Any>>
}
