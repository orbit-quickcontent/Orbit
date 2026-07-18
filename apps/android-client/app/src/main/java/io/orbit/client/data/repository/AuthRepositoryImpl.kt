package io.orbit.client.data.repository

import com.google.firebase.auth.FirebaseAuth
import io.orbit.client.data.local.SecurePrefs
import io.orbit.client.data.remote.OrbitApiService
import io.orbit.client.data.remote.dto.CreateUserRequest
import io.orbit.client.data.remote.dto.SendOtpRequest
import io.orbit.client.data.remote.dto.VerifyOtpRequest
import io.orbit.client.domain.model.User
import io.orbit.client.domain.repository.AuthRepository
import kotlinx.coroutines.tasks.await
import timber.log.Timber
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val api: OrbitApiService,
    private val securePrefs: SecurePrefs,
    private val firebaseAuth: FirebaseAuth
) : AuthRepository {

    override suspend fun sendOtp(email: String): Result<String?> = runCatching {
        val response = api.sendOtp(SendOtpRequest(email))
        if (response.isSuccessful) {
            val body = response.body()!!
            Timber.d("[Auth] OTP sent to $email. devOtp=${body.devOtp}")
            body.devOtp // returns devOtp in debug for easy testing
        } else {
            throw Exception(response.errorBody()?.string() ?: "Failed to send OTP")
        }
    }

    override suspend fun verifyOtp(email: String, otp: String): Result<User> = runCatching {
        val response = api.verifyOtp(VerifyOtpRequest(email, otp))
        if (!response.isSuccessful) {
            throw Exception(response.errorBody()?.string() ?: "Invalid OTP")
        }
        val body = response.body()!!

        if (body.newUser == true) {
            // Create new user
            val createResp = api.createUser(
                CreateUserRequest(email = email, role = "USER")
            )
            if (!createResp.isSuccessful) {
                throw Exception("Failed to create user account")
            }
            val user = createResp.body()!!.user.toDomain()
            signInWithFirebase(email)
            securePrefs.saveUser(user)
            user
        } else {
            val userDto = body.user ?: throw Exception("User data missing from response")
            val user = userDto.toDomain()
            signInWithFirebase(email)
            securePrefs.saveUser(user)
            user
        }
    }

    override fun getCurrentUser(): User? = securePrefs.getUser()

    override fun isLoggedIn(): Boolean = securePrefs.isLoggedIn()

    override suspend fun logout() {
        firebaseAuth.signOut()
        securePrefs.clearSession()
    }

    /**
     * Signs in with Firebase using custom token via email sign-in.
     * In production: use Firebase custom tokens from backend.
     * For dev: use email link or anonymous sign-in.
     */
    private suspend fun signInWithFirebase(email: String) {
        try {
            // Use anonymous sign-in if no custom token flow is set up
            // In production: backend should return a Firebase custom token
            if (firebaseAuth.currentUser == null) {
                firebaseAuth.signInAnonymously().await()
                Timber.d("[Firebase] Signed in anonymously for: $email")
            }
        } catch (e: Exception) {
            Timber.w("[Firebase] Auth failed (non-critical): ${e.message}")
        }
    }
}

// Extension: DTO → Domain model
fun io.orbit.client.data.remote.dto.UserDto.toDomain() = User(
    id = id,
    email = email,
    name = name,
    phone = phone,
    location = location,
    role = role ?: "USER",
    brandLogo = brandLogo,
    brandFont = brandFont,
    brandColor = brandColor,
    editorRequirements = editorRequirements,
    avatar = avatar,
    createdAt = createdAt
)
