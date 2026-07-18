package io.orbit.partner.domain.repository

import io.orbit.partner.domain.model.Transaction

interface EarningsRepository {
    suspend fun getWalletSummary(partnerId: String): Result<Pair<Double, List<Transaction>>>
    suspend fun requestWithdrawal(partnerId: String, amount: Double): Result<Double>
}
