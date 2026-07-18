package io.orbit.partner.data.remote

import io.orbit.partner.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.*

interface OrbitPartnerApiService {

    // --- Auth ---
    @POST("api/auth/send-otp")
    suspend fun sendOtp(@Body body: SendOtpRequest): Response<SendOtpResponse>

    @POST("api/auth/verify-otp")
    suspend fun verifyOtp(@Body body: VerifyOtpRequest): Response<VerifyOtpResponse>

    @POST("api/users")
    suspend fun createUser(@Body body: Map<String, String>): Response<VerifyOtpResponse>

    // --- Profile & Bank Verification ---
    @GET("api/partners/{partnerId}")
    suspend fun getPartnerDetails(@Path("partnerId") partnerId: String): Response<PartnerDetailsResponse>

    @PATCH("api/partners/{partnerId}")
    suspend fun updatePartnerProfile(
        @Path("partnerId") partnerId: String,
        @Body body: Map<String, Any>
    ): Response<PartnerDetailsResponse>

    @POST("api/partners/link-bank")
    suspend fun linkBank(@Body body: LinkBankRequest): Response<Map<String, Any>>

    // --- Bookings & Gigs ---
    @GET("api/bookings/available")
    suspend fun listAvailableGigs(@Query("partnerId") partnerId: String): Response<BookingListResponse>

    @POST("api/bookings/{bookingId}/accept")
    suspend fun acceptBooking(
        @Path("bookingId") bookingId: String,
        @Body body: AcceptBookingRequest
    ): Response<BookingResponse>

    @POST("api/bookings/{bookingId}/decline")
    suspend fun declineBooking(
        @Path("bookingId") bookingId: String,
        @Body body: DeclineBookingRequest
    ): Response<Map<String, Any>>

    @PATCH("api/bookings/{bookingId}")
    suspend fun updateBookingStage(
        @Path("bookingId") bookingId: String,
        @Body body: Map<String, Any>
    ): Response<BookingResponse>

    @POST("api/bookings/{bookingId}/sync-complete")
    suspend fun completeFootageSync(
        @Path("bookingId") bookingId: String,
        @Body body: SyncCompleteRequest
    ): Response<Map<String, Any>>

    // --- Earnings & Withdrawals ---
    @GET("api/partners/{partnerId}/wallet")
    suspend fun getWalletDetails(@Path("partnerId") partnerId: String): Response<WalletResponse>

    @POST("api/partners/{partnerId}/withdraw")
    suspend fun withdrawEarnings(
        @Path("partnerId") partnerId: String,
        @Body body: WithdrawRequest
    ): Response<Map<String, Any>>
}
