package io.orbit.client.ui.booking

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import io.orbit.client.domain.model.Booking
import io.orbit.client.domain.model.Package
import io.orbit.client.domain.repository.AuthRepository
import io.orbit.client.domain.repository.BookingRepository
import io.orbit.client.domain.repository.PackageRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.util.UUID
import javax.inject.Inject

data class BookingUiState(
    val step: Int = 1, // 1: Contact/Brand, 2: Date/Time/Location, 3: Package select/Summary
    val name: String = "",
    val phone: String = "",
    val brandLogo: String = "",
    val brandFont: String = "",
    val brandColor: String = "",
    val editorRequirements: String = "",
    val date: String = "",
    val timeSlot: String = "",
    val location: String = "",
    val selectedPackage: Package? = null,
    val packages: List<Package> = emptyList(),
    val isLoading: Boolean = false,
    val successBooking: Booking? = null,
    val error: String? = null
)

@HiltViewModel
class BookingViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val packageRepository: PackageRepository,
    private val bookingRepository: BookingRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(BookingUiState())
    val uiState: StateFlow<BookingUiState> = _uiState.asStateFlow()

    init {
        // Pre-fill user profile fields
        authRepository.getCurrentUser()?.let { user ->
            _uiState.update {
                it.copy(
                    name = user.name ?: "",
                    phone = user.phone ?: "",
                    brandLogo = user.brandLogo ?: "",
                    brandFont = user.brandFont ?: "",
                    brandColor = user.brandColor ?: "",
                    editorRequirements = user.editorRequirements ?: ""
                )
            }
        }
        loadPackages()
    }

    private fun loadPackages() {
        viewModelScope.launch {
            packageRepository.listPackages().onSuccess { pkgs ->
                _uiState.update { it.copy(packages = pkgs) }
            }
        }
    }

    fun onNameChange(value: String) = _uiState.update { it.copy(name = value) }
    fun onPhoneChange(value: String) = _uiState.update { it.copy(phone = value) }
    fun onBrandLogoChange(value: String) = _uiState.update { it.copy(brandLogo = value) }
    fun onBrandFontChange(value: String) = _uiState.update { it.copy(brandFont = value) }
    fun onBrandColorChange(value: String) = _uiState.update { it.copy(brandColor = value) }
    fun onEditorRequirementsChange(value: String) = _uiState.update { it.copy(editorRequirements = value) }
    fun onDateChange(value: String) = _uiState.update { it.copy(date = value) }
    fun onTimeSlotChange(value: String) = _uiState.update { it.copy(timeSlot = value) }
    fun onLocationChange(value: String) = _uiState.update { it.copy(location = value) }
    fun selectPackage(pkg: Package) = _uiState.update { it.copy(selectedPackage = pkg) }

    fun nextStep() {
        val current = _uiState.value.step
        if (current < 3) {
            _uiState.update { it.copy(step = current + 1) }
        }
    }

    fun prevStep() {
        val current = _uiState.value.step
        if (current > 1) {
            _uiState.update { it.copy(step = current - 1) }
        }
    }

    fun submitBooking() {
        val state = _uiState.value
        val user = authRepository.getCurrentUser() ?: return

        if (state.selectedPackage == null) {
            _uiState.update { it.copy(error = "Please select a package first") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            
            // Mock razorpay payment completion ID (or pass empty to trigger custom Razorpay flow)
            val paymentId = "pay_mock_${UUID.randomUUID().toString().take(8)}"

            bookingRepository.createBooking(
                userId = user.id,
                packageId = state.selectedPackage.id,
                bookingDate = state.date,
                timeSlot = state.timeSlot,
                location = state.location,
                notes = "Logo: ${state.brandLogo}, Font: ${state.brandFont}, Color: ${state.brandColor}. Details: ${state.editorRequirements}",
                paymentId = paymentId
            ).onSuccess { booking ->
                _uiState.update { it.copy(isLoading = false, successBooking = booking) }
            }.onFailure { err ->
                _uiState.update { it.copy(isLoading = false, error = err.message) }
            }
        }
    }
}
