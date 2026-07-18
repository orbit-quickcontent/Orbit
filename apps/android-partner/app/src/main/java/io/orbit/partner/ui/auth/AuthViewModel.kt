package io.orbit.partner.ui.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import io.orbit.partner.domain.repository.PartnerRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class AuthUiState(
    val isLoading: Boolean = false,
    val email: String = "",
    val otp: String = "",
    val devOtp: String? = null,
    val otpSent: Boolean = false,
    val error: String? = null,
    val loginSuccess: Boolean = false
)

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val partnerRepository: PartnerRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    init {
        if (partnerRepository.isLoggedIn()) {
            _uiState.update { it.copy(loginSuccess = true) }
        }
    }

    fun onEmailChange(email: String) = _uiState.update { it.copy(email = email, error = null) }
    fun onOtpChange(otp: String) = _uiState.update { it.copy(otp = otp, error = null) }

    fun sendOtp() {
        val email = _uiState.value.email.trim()
        if (!email.contains("@")) {
            _uiState.update { it.copy(error = "Please enter a valid email address.") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            partnerRepository.sendOtp(email)
                .onSuccess { devOtp ->
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            otpSent = true,
                            devOtp = devOtp,
                            otp = devOtp ?: ""
                        )
                    }
                }
                .onFailure { err ->
                    _uiState.update { it.copy(isLoading = false, error = err.message) }
                }
        }
    }

    fun verifyOtp() {
        val email = _uiState.value.email.trim()
        val otp = _uiState.value.otp.trim()

        if (otp.length < 6) {
            _uiState.update { it.copy(error = "Please enter the full 6-digit OTP.") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            partnerRepository.loginWithOtp(email, otp)
                .onSuccess {
                    _uiState.update { it.copy(isLoading = false, loginSuccess = true) }
                }
                .onFailure { err ->
                    _uiState.update { it.copy(isLoading = false, error = err.message) }
                }
        }
    }
}
