package io.orbit.partner.data.local

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.google.gson.Gson
import io.orbit.partner.domain.model.PartnerProfile
import io.orbit.partner.domain.model.User
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SecurePrefs @Inject constructor(context: Context) {

    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val prefs = EncryptedSharedPreferences.create(
        context,
        "orbit_partner_secure_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    private val gson = Gson()

    companion object {
        private const val KEY_USER = "user"
        private const val KEY_PROFILE = "profile"
        private const val KEY_PARTNER_ONLINE = "partner_online"
        private const val KEY_ACTIVE_BOOKING_ID = "active_booking_id"
    }

    fun saveUser(user: User) {
        prefs.edit().putString(KEY_USER, gson.toJson(user)).apply()
    }

    fun getUser(): User? {
        val json = prefs.getString(KEY_USER, null) ?: return null
        return try {
            gson.fromJson(json, User::class.java)
        } catch (e: Exception) {
            null
        }
    }

    fun saveProfile(profile: PartnerProfile) {
        prefs.edit().putString(KEY_PROFILE, gson.toJson(profile)).apply()
    }

    fun getProfile(): PartnerProfile? {
        val json = prefs.getString(KEY_PROFILE, null) ?: return null
        return try {
            gson.fromJson(json, PartnerProfile::class.java)
        } catch (e: Exception) {
            null
        }
    }

    fun setOnline(online: Boolean) {
        prefs.edit().putBoolean(KEY_PARTNER_ONLINE, online).apply()
    }

    fun isOnline(): Boolean = prefs.getBoolean(KEY_PARTNER_ONLINE, false)

    fun saveActiveBookingId(bookingId: String?) {
        prefs.edit().putString(KEY_ACTIVE_BOOKING_ID, bookingId).apply()
    }

    fun getActiveBookingId(): String? = prefs.getString(KEY_ACTIVE_BOOKING_ID, null)

    fun clearSession() {
        prefs.edit().clear().apply()
    }
}
