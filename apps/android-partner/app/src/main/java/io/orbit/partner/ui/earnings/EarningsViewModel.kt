package io.orbit.partner.ui.earnings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import io.orbit.partner.domain.model.Transaction
import io.orbit.partner.domain.repository.EarningsRepository
import io.orbit.partner.domain.repository.PartnerRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class EarningsUiState(
    val walletBalance: Double = 0.0,
    val pendingClearance: Double = 0.0,
    val totalWithdrawn: Double = 0.0,
    val transactions: List<Transaction> = emptyList(),
    val isLoading: Boolean = false,
    val successMessage: String? = null,
    val error: String? = null
)

@HiltViewModel
class EarningsViewModel @Inject constructor(
    private val partnerRepository: PartnerRepository,
    private val earningsRepository: EarningsRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(EarningsUiState())
    val uiState: StateFlow<EarningsUiState> = _uiState.asStateFlow()

    init {
        loadWalletSummary()
    }

    fun loadWalletSummary() {
        val profile = partnerRepository.getCachedProfile() ?: return
        _uiState.update { it.copy(isLoading = true, error = null) }

        viewModelScope.launch {
            earningsRepository.getWalletSummary(profile.id)
                .onSuccess { (balance, transactions) ->
                    _uiState.update {
                        it.copy(
                            walletBalance = balance,
                            transactions = transactions,
                            isLoading = false
                        )
                    }
                }
                .onFailure { err ->
                    _uiState.update { it.copy(error = err.message, isLoading = false) }
                }
        }
    }

    fun withdrawEarnings(amount: Double) {
        val profile = partnerRepository.getCachedProfile() ?: return
        if (amount <= 0 || amount > _uiState.value.walletBalance) {
            _uiState.update { it.copy(error = "Invalid withdrawal amount requested.") }
            return
        }

        _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }

        viewModelScope.launch {
            earningsRepository.requestWithdrawal(profile.id, amount)
                .onSuccess { newBalance ->
                    _uiState.update {
                        it.copy(
                            walletBalance = newBalance,
                            successMessage = "Withdrawal of ₹$amount successful!",
                            isLoading = false
                        )
                    }
                    loadWalletSummary() // reload tx
                }
                .onFailure { err ->
                    _uiState.update { it.copy(error = err.message, isLoading = false) }
                }
        }
    }
}
