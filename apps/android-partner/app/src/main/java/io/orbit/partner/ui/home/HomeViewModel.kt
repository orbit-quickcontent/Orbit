package io.orbit.partner.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import io.orbit.partner.BuildConfig
import io.orbit.partner.data.local.SecurePrefs
import io.orbit.partner.data.remote.PartnerWebSocketClient
import io.orbit.partner.data.remote.PartnerWsEvent
import io.orbit.partner.domain.model.Booking
import io.orbit.partner.domain.repository.PartnerBookingRepository
import io.orbit.partner.domain.repository.PartnerRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject

data class HomeUiState(
    val isOnline: Boolean = false,
    val availableGigs: List<Booking> = emptyList(),
    val activeGig: Booking? = null,
    val isLoading: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val partnerRepository: PartnerRepository,
    private val bookingRepository: PartnerBookingRepository,
    private val socketClient: PartnerWebSocketClient,
    private val securePrefs: SecurePrefs
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        val profile = partnerRepository.getCachedProfile()
        if (profile != null) {
            _uiState.update { it.copy(isOnline = securePrefs.isOnline()) }
            fetchGigs(profile.id)
            connectSocket(profile.id)
        }
        observeWebSocket()
    }

    private fun connectSocket(partnerId: String) {
        socketClient.connect(BuildConfig.WS_URL, partnerId)
        if (_uiState.value.isOnline) {
            socketClient.goOnline()
        }
    }

    fun togglePresence() {
        val profile = partnerRepository.getCachedProfile() ?: return
        val currentOnline = _uiState.value.isOnline
        val nextOnline = !currentOnline

        viewModelScope.launch {
            _uiState.update { it.copy(isOnline = nextOnline) }
            securePrefs.setOnline(nextOnline)

            if (nextOnline) {
                socketClient.goOnline()
                fetchGigs(profile.id)
            } else {
                socketClient.goOffline()
                _uiState.update { it.copy(availableGigs = emptyList()) }
            }
        }
    }

    fun fetchGigs(partnerId: String) {
        if (!_uiState.value.isOnline) return
        _uiState.update { it.copy(isLoading = true, error = null) }
        viewModelScope.launch {
            bookingRepository.fetchAvailableGigs(partnerId)
                .onSuccess { list ->
                    _uiState.update { it.copy(availableGigs = list, isLoading = false) }
                }
                .onFailure { err ->
                    _uiState.update { it.copy(error = err.message, isLoading = false) }
                }
        }
    }

    fun acceptGig(booking: Booking) {
        val profile = partnerRepository.getCachedProfile() ?: return
        _uiState.update { it.copy(isLoading = true, error = null) }
        viewModelScope.launch {
            bookingRepository.acceptGig(booking.id, profile.id)
                .onSuccess { acceptedBooking ->
                    _uiState.update { state ->
                        state.copy(
                            activeGig = acceptedBooking,
                            availableGigs = state.availableGigs.filter { it.id != booking.id },
                            isLoading = false
                        )
                    }
                    securePrefs.saveActiveBookingId(acceptedBooking.id)
                }
                .onFailure { err ->
                    _uiState.update { it.copy(error = err.message, isLoading = false) }
                }
        }
    }

    fun declineGig(booking: Booking) {
        val profile = partnerRepository.getCachedProfile() ?: return
        viewModelScope.launch {
            bookingRepository.declineGig(booking.id, profile.id)
            _uiState.update { state ->
                state.copy(availableGigs = state.availableGigs.filter { it.id != booking.id })
            }
        }
    }

    private fun observeWebSocket() {
        viewModelScope.launch {
            socketClient.events.collect { wsEvent ->
                when (wsEvent) {
                    is PartnerWsEvent.GigDispatched -> {
                        // Insert dispatched gig card
                        val gig = wsEvent.data.booking.toDomain()
                        _uiState.update { state ->
                            val current = state.availableGigs.toMutableList()
                            if (current.none { it.id == gig.id }) {
                                current.add(gig)
                            }
                            state.copy(availableGigs = current)
                        }
                    }
                    is PartnerWsEvent.GigAcceptedByOther -> {
                        // Remove card if accepted by someone else
                        val bId = wsEvent.data.bookingId
                        _uiState.update { state ->
                            state.copy(availableGigs = state.availableGigs.filter { it.id != bId })
                        }
                    }
                    else -> {}
                }
            }
        }
    }

    override fun onCleared() {
        super.onCleared()
        socketClient.disconnect()
    }
}

// Map extensions
fun io.orbit.partner.data.remote.dto.BookingDto.toDomain() = Booking(
    id = id,
    userId = userId,
    packageId = packageId,
    partnerId = partnerId,
    status = BookingStatus.fromString(status),
    bookingDate = bookingDate,
    timeSlot = timeSlot,
    location = location,
    notes = notes,
    syncPercentage = syncPercentage ?: 0,
    footageUrls = footageUrls ?: emptyList(),
    masterReelUrl = masterReelUrl,
    user = user?.let { User(it.id, it.email, it.name, it.phone, it.role) },
    packageInfo = packageInfo?.let { Package(it.id, it.name, it.tier, it.price, it.focus) }
)
