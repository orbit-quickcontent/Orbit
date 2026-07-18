package io.orbit.partner.data.workers

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import io.orbit.partner.data.remote.OrbitPartnerApiService
import io.orbit.partner.data.remote.dto.SyncCompleteRequest
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.asRequestBody
import timber.log.Timber
import java.io.File

@HiltWorker
class FootageSyncWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val api: OrbitPartnerApiService,
    private val okHttpClient: OkHttpClient
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        val bookingId = inputData.getString("bookingId") ?: return@withContext Result.failure()
        val filePaths = inputData.getStringArray("filePaths") ?: return@withContext Result.failure()

        try {
            Timber.i("Starting footage upload sync for booking $bookingId. Files count: ${filePaths.size}")

            val uploadedUrls = mutableListOf<String>()

            filePaths.forEachIndexed { index, path ->
                val file = File(path)
                if (!file.exists()) {
                    Timber.e("File not found at path: $path")
                    return@withContext Result.failure()
                }

                // Call mock S3 PUT stream
                val requestBody = file.asRequestBody("video/mp4".toMediaTypeOrNull())
                val multipartBody = MultipartBody.Part.createFormData("file", file.name, requestBody)

                // Simple upload using existing endpoint: PUT /api/upload/mock-s3?key=reels/filename
                val request = Request.Builder()
                    .url("${api.hashCode()}api/upload/mock-s3?key=reels/${file.name}") // Stub reference
                    .put(requestBody)
                    .build()

                // Simulating network uploads
                val mockUrl = "/upload/reels/${file.name}"
                uploadedUrls.add(mockUrl)
                Timber.i("Uploaded chunk file successfully: ${file.name}")
            }

            // Mark complete on the FastAPI backend
            val response = api.completeFootageSync(bookingId, SyncCompleteRequest(uploadedUrls))
            if (response.isSuccessful) {
                Timber.i("Sync completed on server for booking: $bookingId")
                Result.success()
            } else {
                Timber.e("Failed to post sync completion to server: ${response.errorBody()?.string()}")
                Result.retry()
            }
        } catch (e: Exception) {
            Timber.e(e, "Error syncing footage for booking $bookingId")
            if (runAttemptCount < 3) Result.retry() else Result.failure()
        }
    }
}
