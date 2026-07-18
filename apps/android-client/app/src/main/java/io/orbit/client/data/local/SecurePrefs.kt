package io.orbit.client.data.local

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.google.gson.Gson
import io.orbit.client.domain.model.User
import javax.inject.Inject
import javax.inject.Singleton

// ============================================================
// Secure local preferences using EncryptedSharedPreferences
// Stores: user session, auth tokens, preferences
// ============================================================

@Singleton
class SecurePrefs @Inject constructor(context: Context) {

    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val prefs = EncryptedSharedPreferences.create(
        context,
        "orbit_secure_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    private val gson = Gson()

    companion object {
        private const val KEY_USER = "user"
        private const val KEY_EMAIL = "email"
        private const val KEY_PARTNER_ID = "partner_id"
        private const val KEY_LAST_BOOKING_ID = "last_booking_id"
        private const val KEY_API_URL = "api_url"
    }

    fun saveUser(user: User) {
        prefs.edit().putString(KEY_USER, gson.toJson(user)).apply()
        prefs.edit().putString(KEY_EMAIL, user.email).apply()
    }

    fun getUser(): User? {
        val json = prefs.getString(KEY_USER, null) ?: return null
        return try {
            gson.fromJson(json, User::class.java)
        } catch (e: Exception) {
            null
        }
    }

    fun getEmail(): String? = prefs.getString(KEY_EMAIL, null)

    fun saveLastBookingId(bookingId: String) {
        prefs.edit().putString(KEY_LAST_BOOKING_ID, bookingId).apply()
    }

    fun getLastBookingId(): String? = prefs.getString(KEY_LAST_BOOKING_ID, null)

    fun clearSession() {
        prefs.edit().clear().apply()
    }

    fun isLoggedIn(): Boolean = getUser() != null
}
