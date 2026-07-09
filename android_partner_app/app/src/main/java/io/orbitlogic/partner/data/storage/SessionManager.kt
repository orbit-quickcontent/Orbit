package io.orbitlogic.partner.data.storage

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.google.gson.Gson
import io.orbitlogic.partner.data.models.PartnerProfile
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore("orbit_partner_session")

class SessionManager(private val context: Context) {
    private val gson = Gson()

    companion object {
        private val TOKEN_KEY = stringPreferencesKey("auth_token")
        private val PROFILE_KEY = stringPreferencesKey("partner_profile")
    }

    val authToken: Flow<String?> = context.dataStore.data.map { preferences ->
        preferences[TOKEN_KEY]
    }

    val partnerProfile: Flow<PartnerProfile?> = context.dataStore.data.map { preferences ->
        preferences[PROFILE_KEY]?.let { json ->
            try {
                gson.fromJson(json, PartnerProfile::class.java)
            } catch (e: Exception) {
                null
            }
        }
    }

    suspend fun saveSession(token: String, profile: PartnerProfile) {
        context.dataStore.edit { preferences ->
            preferences[TOKEN_KEY] = token
            preferences[PROFILE_KEY] = gson.toJson(profile)
        }
    }

    suspend fun clearSession() {
        context.dataStore.edit { preferences ->
            preferences.clear()
        }
    }
}
