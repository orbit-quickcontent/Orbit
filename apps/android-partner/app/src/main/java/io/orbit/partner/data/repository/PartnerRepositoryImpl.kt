package io.orbit.partner.data.repository

import com.google.firebase.auth.FirebaseAuth
import io.orbit.partner.data.local.SecurePrefs
import io.orbit.partner.data.remote.OrbitPartnerApiService
import io.orbit.partner.data.remote.dto.LinkBankRequest
import io.orbit.partner.data.remote.dto.SendOtpRequest
import io.orbit.partner.data.remote.dto.VerifyOtpRequest
import io.orbit.partner.domain.model.PartnerProfile
import io.orbit.partner.domain.model.User
import io.orbit.partner.domain.repository.PartnerRepository
import kotlinx.coroutines.tasks.await
import timber.log.Timber
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PartnerRepositoryImpl @Inject constructor(
    private val api: OrbitPartnerApiService,
    private val securePrefs: SecurePrefs,
    private val firebaseAuth: FirebaseAuth
) : PartnerRepository {

    override suspend fun sendOtp(email: String): Result<String?> = runCatching {
        val response = api.sendOtp(SendOtpRequest(email))
        if (!response.isSuccessful) {
            throw Exception(response.errorBody()?.string() ?: "Failed to send OTP")
        }
        response.body()?.devOtp
    }

    override suspend fun loginWithOtp(email: String, otp: String): Result<Pair<User, PartnerProfile?>> = runCatching {
        val response = api.verifyOtp(VerifyOtpRequest(email, otp))
        if (!response.isSuccessful) {
            throw Exception(response.errorBody()?.string() ?: "Invalid credentials")
        }
        val body = response.body()!!

        if (body.newUser == true) {
            // Create user
            val map = mapOf("email" to email, "role" to "PARTNER")
            val createResp = api.createUser(map)
            if (!createResp.isSuccessful) {
                throw Exception("Failed to provision account")
            }
            val newUser = createResp.body()!!.user.toDomain()
            signInFirebase(email)
            securePrefs.saveUser(newUser)
            Pair(newUser, null)
        } else {
            val user = body.user!!.toDomain()
            val profile = body.partnerProfile?.toDomain()
            signInFirebase(email)
            securePrefs.saveUser(user)
            profile?.let { securePrefs.saveProfile(it) }
            Pair(user, profile)
        }
    }

    override suspend fun getProfile(partnerId: String): Result<PartnerProfile> = runCatching {
        val response = api.getPartnerDetails(partnerId)
        if (!response.isSuccessful) {
            throw Exception(response.errorBody()?.string() ?: "Failed to get profile")
        }
        val profile = response.body()!!.partner.toDomain()
        securePrefs.saveProfile(profile)
        profile
    }

    override suspend fun linkBankAccount(
        partnerId: String,
        holderName: String,
        accountNo: String,
        ifscCode: String,
        bankName: String,
        panNumber: String?
    ): Result<Boolean> = runCatching {
        val request = LinkBankRequest(
            partnerId = partnerId,
            accountHolderName = holderName,
            accountNumber = accountNo,
            ifscCode = ifscCode,
            bankName = bankName,
            panNumber = panNumber
        )
        val response = api.linkBank(request)
        if (!response.isSuccessful) {
            throw Exception(response.errorBody()?.string() ?: "Failed to verify bank details")
        }
        
        // Refresh local cache profiles
        getProfile(partnerId)
        true
    }

    override fun getCachedUser(): User? = securePrefs.getUser()
    override fun getCachedProfile(): PartnerProfile? = securePrefs.getProfile()
    override fun isLoggedIn(): Boolean = securePrefs.getUser() != null

    override fun logout() {
        firebaseAuth.signOut()
        securePrefs.clearSession()
    }

    private suspend fun signInFirebase(email: String) {
        try {
            if (firebaseAuth.currentUser == null) {
                firebaseAuth.signInAnonymously().await()
                Timber.d("[Firebase] Signed anonymously for Partner: $email")
            }
        } catch (e: Exception) {
            Timber.w("Partner firebase login warning: ${e.message}")
        }
    }
}

// Extensions for Partner Profile mappings
fun io.orbit.partner.data.remote.dto.UserDto.toDomain() = User(
    id = id,
    email = email,
    name = name,
    phone = phone,
    role = role
)

fun io.orbit.partner.data.remote.dto.PartnerProfileDto.toDomain() = PartnerProfile(
    id = id,
    userId = userId,
    location = location,
    rating = rating,
    completedProjects = completedProjects,
    walletBalance = walletBalance,
    pendingClearance = pendingClearance,
    totalWithdrawn = totalWithdrawn,
    verificationStatus = verificationStatus,
    payoutEnabled = payoutEnabled,
    accountHolderName = accountHolderName,
    encryptedAccountNumber = encryptedAccountNumber,
    ifscCode = ifscCode,
    bankName = bankName,
    panNumber = panNumber
)
