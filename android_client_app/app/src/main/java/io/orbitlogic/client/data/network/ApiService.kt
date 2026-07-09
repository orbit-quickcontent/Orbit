package io.orbitlogic.client.data.network

import io.orbitlogic.client.data.models.*
import retrofit2.http.*

interface ApiService {
    @FormUrlEncoded
    @POST("auth/otp-mock")
    suspend fun getMockOtp(
        @Field("email") email: String,
        @Field("role") role: String = "client"
    ): AuthResponse

    @FormUrlEncoded
    @POST("auth/verify-otp-mock")
    suspend fun verifyMockOtp(
        @Field("email") email: String,
        @Field("code") code: String,
        @Field("role") role: String = "client"
    ): UserResponse

    @GET("users/profile")
    suspend fun getProfile(
        @Header("Authorization") token: String
    ): UserResponse

    @PUT("users/profile")
    suspend fun updateProfile(
        @Header("Authorization") token: String,
        @Body profile: UserProfile
    ): UserResponse

    @GET("packages")
    suspend fun getPackages(
        @Header("Authorization") token: String
    ): List<PackageInfo>

    @GET("bookings")
    suspend fun getBookings(
        @Header("Authorization") token: String
    ): List<BookingInfo>

    @POST("bookings")
    suspend fun createBooking(
        @Header("Authorization") token: String,
        @Body bookingData: Map<String, String>
    ): BookingResponse

    @POST("bookings/{id}/pay")
    suspend fun payBooking(
        @Header("Authorization") token: String,
        @Path("id") bookingId: String,
        @Body paymentData: Map<String, String>
    ): BookingResponse
}
