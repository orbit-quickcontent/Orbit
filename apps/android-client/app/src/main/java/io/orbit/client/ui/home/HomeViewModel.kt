package io.orbit.client.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import io.orbit.client.domain.model.Booking
import io.orbit.client.domain.model.Package
import io.orbit.client.domain.model.User
import io.orbit.client.domain.repository.AuthRepository
import io.orbit.client.domain.repository.BookingRepository
import io.orbit.client.domain.repository.PackageRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HomeUiState(
    val isLoading: Boolean = false,
    val user: User? = null,
    val packages: List<Package> = emptyList(),
    val recentBooking: Booking? = null,
    val error: String? = null
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val packageRepository: PackageRepository,
    private val bookingRepository: BookingRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        loadDashboardData()
    }

    fun loadDashboardData() {
        val currentUser = authRepository.getCurrentUser()
        _uiState.update { it.copy(user = currentUser, isLoading = true, error = null) }

        viewModelScope.launch {
            try {
                // Fetch packages
                packageRepository.listPackages().onSuccess { pkgs ->
                    _uiState.update { it.copy(packages = pkgs) }
                }

                // Fetch recent booking if user is logged in
                currentUser?.email?.let { email ->
                    bookingRepository.listBookings(email).onSuccess { bookings ->
                        val latest = bookings.firstOrNull()
                        _uiState.update { it.copy(recentBooking = latest) }
                    }
                }
            } catch (e: Exception) {
                _uiState.update { it.copy(error = e.message) }
            } finally {
                _uiState.update { it.copy(isLoading = false) }
            }
        }
    }
}
