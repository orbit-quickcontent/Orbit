package io.orbit.partner.di

import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import io.orbit.partner.data.repository.EarningsRepositoryImpl
import io.orbit.partner.data.repository.PartnerBookingRepositoryImpl
import io.orbit.partner.data.repository.PartnerRepositoryImpl
import io.orbit.partner.domain.repository.EarningsRepository
import io.orbit.partner.domain.repository.PartnerBookingRepository
import io.orbit.partner.domain.repository.PartnerRepository
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindPartnerRepository(
        partnerRepositoryImpl: PartnerRepositoryImpl
    ): PartnerRepository

    @Binds
    @Singleton
    abstract fun bindBookingRepository(
        bookingRepositoryImpl: PartnerBookingRepositoryImpl
    ): PartnerBookingRepository

    @Binds
    @Singleton
    abstract fun bindEarningsRepository(
        earningsRepositoryImpl: EarningsRepositoryImpl
    ): EarningsRepository
}
