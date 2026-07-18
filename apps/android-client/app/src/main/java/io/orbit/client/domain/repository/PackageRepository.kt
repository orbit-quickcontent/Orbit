package io.orbit.client.domain.repository

import io.orbit.client.domain.model.Package

interface PackageRepository {
    suspend fun listPackages(): Result<List<Package>>
}
