package io.orbitlogic.client.data.storage

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.google.gson.Gson
import io.orbitlogic.client.data.models.UserProfile
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore("orbit_client_session")

class SessionManager(private val context: Context) {
    private val gson = Gson()

    companion object {
        private val TOKEN_KEY = stringPreferencesKey("auth_token")
        private val PROFILE_KEY = stringPreferencesKey("user_profile")
    }

    val authToken: Flow<String?> = context.dataStore.data.map { preferences ->
        preferences[TOKEN_KEY]
    }

    val userProfile: Flow<UserProfile?> = context.dataStore.data.map { preferences ->
        preferences[PROFILE_KEY]?.let { json ->
            try {
                gson.fromJson(json, UserProfile::class.java)
            } catch (e: Exception) {
                null
            }
        }
    }

    suspend fun saveSession(token: String, profile: UserProfile) {
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
