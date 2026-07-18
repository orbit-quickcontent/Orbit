package io.orbit.partner.data.repository

import io.orbit.partner.data.remote.OrbitPartnerApiService
import io.orbit.partner.data.remote.dto.WithdrawRequest
import io.orbit.partner.domain.model.Transaction
import io.orbit.partner.domain.repository.EarningsRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class EarningsRepositoryImpl @Inject constructor(
    private val api: OrbitPartnerApiService
) : EarningsRepository {

    override suspend fun getWalletSummary(partnerId: String): Result<Pair<Double, List<Transaction>>> = runCatching {
        val response = api.getWalletDetails(partnerId)
        if (!response.isSuccessful) {
            throw Exception(response.errorBody()?.string() ?: "Failed to load wallet details")
        }
        val body = response.body()!!
        
        val transactions = body.transactions.map {
            Transaction(
                id = it.id,
                partnerId = it.partnerId,
                bookingId = it.bookingId,
                type = it.type,
                amount = it.amount,
                status = it.status,
                description = it.description,
                createdAt = it.createdAt
            )
        }
        Pair(body.balance, transactions)
    }

    override suspend fun requestWithdrawal(partnerId: String, amount: Double): Result<Double> = runCatching {
        val response = api.withdrawEarnings(partnerId, WithdrawRequest(amount))
        if (!response.isSuccessful) {
            throw Exception(response.errorBody()?.string() ?: "Failed to process withdrawal request")
        }
        response.body()?.get("newBalance")?.toString()?.toDouble() ?: 0.0
    }
}
