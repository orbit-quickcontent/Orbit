package io.orbit.partner.ui.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import io.orbit.partner.domain.model.PartnerProfile
import io.orbit.partner.domain.model.User
import io.orbit.partner.domain.repository.PartnerRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ProfileUiState(
    val user: User? = null,
    val profile: PartnerProfile? = null,
    val isLoading: Boolean = false,
    val successMessage: String? = null,
    val error: String? = null,
    val logoutComplete: Boolean = false
)

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val partnerRepository: PartnerRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(
        ProfileUiState(
            user = partnerRepository.getCachedUser(),
            profile = partnerRepository.getCachedProfile()
        )
    )
    val uiState: StateFlow<ProfileUiState> = _uiState.asStateFlow()

    fun loadProfile() {
        val pId = _uiState.value.profile?.id ?: return
        viewModelScope.launch {
            partnerRepository.getProfile(pId).onSuccess { fresh ->
                _uiState.update { it.copy(profile = fresh) }
            }
        }
    }

    fun linkBankAccount(
        holderName: String,
        accountNo: String,
        ifscCode: String,
        bankName: String,
        panNumber: String?
    ) {
        val pId = _uiState.value.profile?.id ?: return
        if (holderName.isBlank() || accountNo.isBlank() || ifscCode.isBlank() || bankName.isBlank()) {
            _uiState.update { it.copy(error = "All bank details fields are required.") }
            return
        }

        _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }

        viewModelScope.launch {
            partnerRepository.linkBankAccount(
                partnerId = pId,
                holderName = holderName,
                accountNo = accountNo,
                ifscCode = ifscCode,
                bankName = bankName,
                panNumber = panNumber
            ).onSuccess {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        successMessage = "Bank details linked & validated successfully via Cashfree Penny Drop!"
                    )
                }
                loadProfile() // refresh cache
            }.onFailure { err ->
                _uiState.update { it.copy(isLoading = false, error = err.message) }
            }
        }
    }

    fun logout() {
        partnerRepository.logout()
        _uiState.update { it.copy(logoutComplete = true) }
    }
}
