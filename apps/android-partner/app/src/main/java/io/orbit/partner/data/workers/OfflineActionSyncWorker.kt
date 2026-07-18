package io.orbit.partner.data.workers

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.google.gson.Gson
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import io.orbit.partner.data.local.PendingActionDao
import io.orbit.partner.data.remote.OrbitPartnerApiService
import io.orbit.partner.data.remote.dto.DeclineBookingRequest
import io.orbit.partner.data.remote.dto.SyncCompleteRequest
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import timber.log.Timber

@HiltWorker
class OfflineActionSyncWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val pendingActionDao: PendingActionDao,
    private val api: OrbitPartnerApiService,
    private val gson: Gson
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        try {
            val pendingActions = pendingActionDao.getAllPendingActions()
            Timber.i("Scanning offline sync queue. Pending tasks: ${pendingActions.size}")

            for (action in pendingActions) {
                Timber.i("Processing offline action: ${action.type} for booking ${action.bookingId}")
                
                val success = when (action.type) {
                    "DECLINE_BOOKING" -> {
                        val req = gson.fromJson(action.payload, DeclineBookingRequest::class.java)
                        val res = api.declineBooking(action.bookingId, req)
                        res.isSuccessful
                    }
                    "UPDATE_STAGE" -> {
                        val req = gson.fromJson(action.payload, Map::class.java) as Map<String, Any>
                        val res = api.updateBookingStage(action.bookingId, req)
                        res.isSuccessful
                    }
                    "SYNC_COMPLETE" -> {
                        val req = gson.fromJson(action.payload, SyncCompleteRequest::class.java)
                        val res = api.completeFootageSync(action.bookingId, req)
                        res.isSuccessful
                    }
                    else -> false
                }

                if (success) {
                    pendingActionDao.deleteAction(action)
                    Timber.i("Offline action synchronized successfully: ${action.id}")
                } else {
                    Timber.w("Failed to synchronize offline action: ${action.id}. Will retry later.")
                    return@withContext Result.retry()
                }
            }
            Result.success()
        } catch (e: Exception) {
            Timber.e(e, "Error synchronizing offline queue")
            Result.retry()
        }
    }
}
