package io.orbit.partner.di

import android.content.Context
import com.google.firebase.auth.FirebaseAuth
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import io.orbit.partner.BuildConfig
import io.orbit.partner.data.local.OrbitPartnerDatabase
import io.orbit.partner.data.local.PendingActionDao
import io.orbit.partner.data.local.SecurePrefs
import io.orbit.partner.data.remote.OrbitPartnerApiService
import io.orbit.partner.data.remote.PartnerWebSocketClient
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.tasks.await
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideGson(): Gson = GsonBuilder().setLenient().create()

    @Provides
    @Singleton
    fun provideFirebaseAuth(): FirebaseAuth = FirebaseAuth.getInstance()

    @Provides
    @Singleton
    fun provideAuthInterceptor(firebaseAuth: FirebaseAuth): Interceptor = Interceptor { chain ->
        val request = chain.request()
        val path = request.url.encodedPath

        val isPublic = path.contains("send-otp") || path.contains("verify-otp")

        if (isPublic) {
            chain.proceed(request)
        } else {
            val token = try {
                runBlocking {
                    firebaseAuth.currentUser?.getIdToken(false)?.await()?.token
                }
            } catch (e: Exception) {
                null
            }

            if (token != null) {
                chain.proceed(
                    request.newBuilder()
                        .addHeader("Authorization", "Bearer $token")
                        .build()
                )
            } else {
                chain.proceed(request)
            }
        }
    }

    @Provides
    @Singleton
    fun provideOkHttpClient(authInterceptor: Interceptor): OkHttpClient {
        val logging = HttpLoggingInterceptor().apply {
            level = if (BuildConfig.DEBUG) HttpLoggingInterceptor.Level.BODY else HttpLoggingInterceptor.Level.NONE
        }
        return OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(logging)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient, gson: Gson): Retrofit =
        Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()

    @Provides
    @Singleton
    fun provideApiService(retrofit: Retrofit): OrbitPartnerApiService =
        retrofit.create(OrbitPartnerApiService::class.java)

    @Provides
    @Singleton
    fun provideSocketClient(gson: Gson): PartnerWebSocketClient =
        PartnerWebSocketClient(gson)

    @Provides
    @Singleton
    fun provideSecurePrefs(@ApplicationContext context: Context): SecurePrefs =
        SecurePrefs(context)

    // Local DB hooks
    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): OrbitPartnerDatabase =
        OrbitPartnerDatabase.getDatabase(context)

    @Provides
    @Singleton
    fun providePendingActionDao(db: OrbitPartnerDatabase): PendingActionDao =
        db.pendingActionDao()
}
