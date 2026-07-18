package io.orbit.client.domain.repository

import io.orbit.client.domain.model.User

interface AuthRepository {
    suspend fun sendOtp(email: String): Result<String?>
    suspend fun verifyOtp(email: String, otp: String): Result<User>
    fun getCurrentUser(): User?
    fun isLoggedIn(): Boolean
    suspend fun logout()
}
