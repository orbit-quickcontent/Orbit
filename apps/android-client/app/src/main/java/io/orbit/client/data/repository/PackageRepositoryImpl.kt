package io.orbit.client.data.repository

import io.orbit.client.data.remote.OrbitApiService
import io.orbit.client.domain.model.Package
import io.orbit.client.domain.repository.PackageRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PackageRepositoryImpl @Inject constructor(
    private val api: OrbitApiService
) : PackageRepository {

    override suspend fun listPackages(): Result<List<Package>> = runCatching {
        val response = api.listPackages()
        if (!response.isSuccessful) {
            throw Exception(response.errorBody()?.string() ?: "Failed to load packages")
        }
        response.body()?.map { pkg ->
            Package(
                id = pkg.id,
                name = pkg.name,
                tier = pkg.tier,
                price = pkg.price,
                focus = pkg.focus,
                deliveryTime = pkg.deliveryTime,
                features = pkg.features,
                popular = pkg.popular
            )
        } ?: emptyList()
    }
}
