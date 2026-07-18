package io.orbit.partner.ui.work

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.work.*
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import io.orbit.partner.data.local.SecurePrefs
import io.orbit.partner.data.workers.FootageSyncWorker
import io.orbit.partner.domain.model.Booking
import io.orbit.partner.domain.model.BookingStatus
import io.orbit.partner.domain.repository.PartnerBookingRepository
import io.orbit.partner.domain.repository.PartnerRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.util.concurrent.TimeUnit
import javax.inject.Inject

data class WorkUiState(
    val activeBooking: Booking? = null,
    val currentWorkflowStage: Int = 0, // 0: Navigate, 1: Arrive, 2: Checklist, 3: Syncing
    val checklistItems: List<ChecklistItem> = emptyList(),
    val syncPercentage: Int = 0,
    val isLoading: Boolean = false,
    val error: String? = null
)

data class ChecklistItem(val id: Int, val prompt: String, val checked: Boolean = false)

@HiltViewModel
class WorkViewModel @Inject constructor(
    @ApplicationContext private val context: Context,
    private val partnerRepository: PartnerRepository,
    private val bookingRepository: PartnerBookingRepository,
    private val securePrefs: SecurePrefs
) : ViewModel() {

    private val _uiState = MutableStateFlow(WorkUiState())
    val uiState: StateFlow<WorkUiState> = _uiState.asStateFlow()

    init {
        loadActiveBooking()
    }

    private fun loadActiveBooking() {
        val bId = securePrefs.getActiveBookingId() ?: return
        _uiState.update { it.copy(isLoading = true, error = null) }
        
        viewModelScope.launch {
            bookingRepository.updateShootStage(bId, BookingStatus.EN_ROUTE.name) // Make sure status aligns
            
            // Build default checklist items for UGC packages
            val list = listOf(
                ChecklistItem(1, "Creative Wide panning intro shot"),
                ChecklistItem(2, "Close-up detail product / venue highlight"),
                ChecklistItem(3, "Tilt-shift ambient view"),
                ChecklistItem(4, "Fast action transition motion segment"),
                ChecklistItem(5, "Cinematic brand DNA outro overlay segment")
            )

            _uiState.update { state ->
                state.copy(
                    currentWorkflowStage = 0,
                    checklistItems = list,
                    isLoading = false
                )
            }
        }
    }

    fun startNavigating() {
        _uiState.update { it.copy(currentWorkflowStage = 0) }
    }

    fun markArrived() {
        val bId = securePrefs.getActiveBookingId() ?: return
        viewModelScope.launch {
            bookingRepository.updateShootStage(bId, BookingStatus.SHOOTING.name)
            _uiState.update { it.copy(currentWorkflowStage = 1) }
        }
    }

    fun toggleChecklistItem(id: Int) {
        _uiState.update { state ->
            val updated = state.checklistItems.map {
                if (it.id == id) it.copy(checked = !it.checked) else it
            }
            state.copy(checklistItems = updated)
        }
    }

    fun startFootageSync(filePaths: Array<String>) {
        val bookingId = securePrefs.getActiveBookingId() ?: return
        _uiState.update { it.copy(currentWorkflowStage = 3, syncPercentage = 0) }

        // Start resumable WorkManager footage sync upload task (Constraint: network connected)
        val constraints = Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()

        val data = workDataOf(
            "bookingId" to bookingId,
            "filePaths" to filePaths
        )

        val uploadRequest = OneTimeWorkRequestBuilder<FootageSyncWorker>()
            .setConstraints(constraints)
            .setInputData(data)
            .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 30, TimeUnit.SECONDS)
            .build()

        WorkManager.getInstance(context).enqueueUniqueWork(
            "footage_upload_$bookingId",
            ExistingWorkPolicy.REPLACE,
            uploadRequest
        )

        // Listen to work updates
        observeSyncProgress(uploadRequest.id)
    }

    private fun observeSyncProgress(workId: java.util.UUID) {
        WorkManager.getInstance(context).getWorkInfoByIdLiveData(workId)
            .observeForever { info ->
                if (info != null) {
                    when (info.state) {
                        WorkInfo.State.RUNNING -> {
                            val progress = info.progress.getInt("progress", 25)
                            _uiState.update { it.copy(syncPercentage = progress) }
                        }
                        WorkInfo.State.SUCCEEDED -> {
                            _uiState.update { it.copy(syncPercentage = 100) }
                            securePrefs.saveActiveBookingId(null) // clear
                        }
                        WorkInfo.State.FAILED -> {
                            _uiState.update { it.copy(error = "Sync failed. Will retry automatically when online.") }
                        }
                        else -> {}
                    }
                }
            }
    }
}
