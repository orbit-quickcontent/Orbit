package io.orbitlogic.partner.data.network

import io.orbitlogic.partner.data.models.*
import retrofit2.http.*

interface ApiService {
    @FormUrlEncoded
    @POST("auth/otp-mock")
    suspend fun getMockOtp(
        @Field("email") email: String,
        @Field("role") role: String = "partner"
    ): AuthResponse

    @FormUrlEncoded
    @POST("auth/verify-otp-mock")
    suspend fun verifyMockOtp(
        @Field("email") email: String,
        @Field("code") code: String,
        @Field("role") role: String = "partner"
    ): ProfileResponse

    @GET("partners/profile")
    suspend fun getProfile(
        @Header("Authorization") token: String
    ): ProfileResponse

    @POST("partners/link-bank")
    suspend fun linkBankAccount(
        @Header("Authorization") token: String,
        @Body bankDetails: Map<String, String>
    ): ProfileResponse

    @POST("partners/withdraw")
    suspend fun requestWithdrawal(
        @Header("Authorization") token: String,
        @Body amountDetails: Map<String, Double>
    ): WalletResponse

    @GET("bookings/available")
    suspend fun getAvailableBookings(
        @Header("Authorization") token: String
    ): List<BookingInfo>

    @POST("bookings/{id}/accept")
    suspend fun acceptBooking(
        @Header("Authorization") token: String,
        @Path("id") bookingId: String
    ): BookingInfo

    @POST("bookings/{id}/decline")
    suspend fun declineBooking(
        @Header("Authorization") token: String,
        @Path("id") bookingId: String
    ): GenericResponse

    @POST("bookings/{id}/arrive")
    suspend fun arriveAtLocation(
        @Header("Authorization") token: String,
        @Path("id") bookingId: String
    ): BookingInfo

    @POST("bookings/{id}/start-shoot")
    suspend fun startShooting(
        @Header("Authorization") token: String,
        @Path("id") bookingId: String
    ): BookingInfo

    @POST("bookings/{id}/sync-footage")
    suspend fun syncFootage(
        @Header("Authorization") token: String,
        @Path("id") bookingId: String,
        @Body footageData: Map<String, String>
    ): BookingInfo
}
