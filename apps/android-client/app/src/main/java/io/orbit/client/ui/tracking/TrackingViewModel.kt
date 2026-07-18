package io.orbit.client.ui.tracking

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import io.orbit.client.BuildConfig
import io.orbit.client.data.local.SecurePrefs
import io.orbit.client.data.remote.OrbitSocketClient
import io.orbit.client.data.remote.WsEvent
import io.orbit.client.domain.model.Booking
import io.orbit.client.domain.model.BookingStatus
import io.orbit.client.domain.repository.BookingRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject

data class TrackingUiState(
    val isLoading: Boolean = false,
    val booking: Booking? = null,
    val error: String? = null,
    val isWsConnected: Boolean = false
)

@HiltViewModel
class TrackingViewModel @Inject constructor(
    private val bookingRepository: BookingRepository,
    private val socketClient: OrbitSocketClient,
    private val securePrefs: SecurePrefs
) : ViewModel() {

    private val _uiState = MutableStateFlow(TrackingUiState())
    val uiState: StateFlow<TrackingUiState> = _uiState.asStateFlow()

    init {
        // Load latest booking if cached
        val lastBookingId = securePrefs.getLastBookingId()
        if (lastBookingId != null) {
            loadBookingDetails(lastBookingId)
        } else {
            loadMostRecentBooking()
        }
        observeWebSocket()
    }

    fun loadBookingDetails(bookingId: String) {
        _uiState.update { it.copy(isLoading = true, error = null) }
        viewModelScope.launch {
            bookingRepository.getBookingDetails(bookingId)
                .onSuccess { b ->
                    _uiState.update { it.copy(booking = b, isLoading = false) }
                    securePrefs.saveLastBookingId(b.id)
                    connectWebSocket(b.id)
                }
                .onFailure { err ->
                    _uiState.update { it.copy(error = err.message, isLoading = false) }
                }
        }
    }

    private fun loadMostRecentBooking() {
        val user = securePrefs.getUser() ?: return
        viewModelScope.launch {
            bookingRepository.listBookings(user.email)
                .onSuccess { bookings ->
                    val latest = bookings.firstOrNull()
                    if (latest != null) {
                        _uiState.update { it.copy(booking = latest) }
                        securePrefs.saveLastBookingId(latest.id)
                        connectWebSocket(latest.id)
                    }
                }
        }
    }

    private fun connectWebSocket(bookingId: String) {
        socketClient.connect(BuildConfig.WS_URL)
        socketClient.subscribeToBooking(bookingId)
    }

    private fun observeWebSocket() {
        viewModelScope.launch {
            socketClient.events.collect { wsEvent ->
                when (wsEvent) {
                    is WsEvent.Connected -> {
                        _uiState.update { it.copy(isWsConnected = true) }
                        Timber.d("Socket.IO connected: ${wsEvent.socketId}")
                    }
                    is WsEvent.Disconnected -> {
                        _uiState.update { it.copy(isWsConnected = false) }
                        Timber.d("Socket.IO disconnected")
                    }
                    is WsEvent.BookingStatusUpdate -> {
                        val payload = wsEvent.data
                        Timber.d("WebSocket Booking Status Update: ${payload.status}")
                        _uiState.update { state ->
                            val updatedBooking = state.booking?.copy(
                                status = BookingStatus.fromString(payload.status),
                                masterReelUrl = payload.reelUrl ?: state.booking.masterReelUrl,
                                deliveredAt = payload.deliveredAt ?: state.booking.deliveredAt
                            )
                            state.copy(booking = updatedBooking)
                        }
                    }
                    is WsEvent.PartnerAssigned -> {
                        val payload = wsEvent.data
                        Timber.d("WebSocket Partner Assigned: ${payload.partnerName}")
                        // Refresh data to grab full partner profile objects
                        _uiState.value.booking?.id?.let { loadBookingDetails(it) }
                    }
                    is WsEvent.Error -> {
                        Timber.e("WS Error: ${wsEvent.message}")
                    }
                }
            }
        }
    }

    override fun onCleared() {
        super.onCleared()
        socketClient.disconnect()
    }
}
