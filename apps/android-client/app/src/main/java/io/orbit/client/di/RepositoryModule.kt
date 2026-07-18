package io.orbit.client.di

import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import io.orbit.client.data.repository.AuthRepositoryImpl
import io.orbit.client.data.repository.BookingRepositoryImpl
import io.orbit.client.data.repository.PackageRepositoryImpl
import io.orbit.client.domain.repository.AuthRepository
import io.orbit.client.domain.repository.BookingRepository
import io.orbit.client.domain.repository.PackageRepository
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindAuthRepository(
        authRepositoryImpl: AuthRepositoryImpl
    ): AuthRepository

    @Binds
    @Singleton
    abstract fun bindBookingRepository(
        bookingRepositoryImpl: BookingRepositoryImpl
    ): BookingRepository

    @Binds
    @Singleton
    abstract fun bindPackageRepository(
        packageRepositoryImpl: PackageRepositoryImpl
    ): PackageRepository
}
