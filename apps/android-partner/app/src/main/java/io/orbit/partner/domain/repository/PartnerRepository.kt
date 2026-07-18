package io.orbit.partner.domain.repository

import io.orbit.partner.domain.model.PartnerProfile
import io.orbit.partner.domain.model.User

interface PartnerRepository {
    suspend fun loginWithOtp(email: String, otp: String): Result<Pair<User, PartnerProfile?>>
    suspend fun sendOtp(email: String): Result<String?>
    suspend fun getProfile(partnerId: String): Result<PartnerProfile>
    suspend fun linkBankAccount(
        partnerId: String,
        holderName: String,
        accountNo: String,
        ifscCode: String,
        bankName: String,
        panNumber: String?
    ): Result<Boolean>
    fun getCachedUser(): User?
    fun getCachedProfile(): PartnerProfile?
    fun isLoggedIn(): Boolean
    fun logout()
}
