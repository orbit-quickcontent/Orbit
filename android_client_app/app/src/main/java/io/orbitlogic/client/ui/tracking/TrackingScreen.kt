package io.orbitlogic.client.ui.tracking

import androidx.annotation.OptIn
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.media3.common.MediaItem
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.PlayerView
import io.orbitlogic.client.data.models.BookingInfo
import io.orbitlogic.client.ui.theme.*

@Composable
fun TrackingScreen(
    booking: BookingInfo,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val currentStep = remember(booking.status) {
        when (booking.status) {
            "PAID" -> 0
            "PARTNER_DISPATCHED" -> 1
            "EN_ROUTE" -> 2
            "SHOOTING" -> 3
            "SYNCING" -> 4
            "EDITING" -> 5
            "DELIVERED" -> 6
            else -> 0
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(imageVector = Icons.Default.ArrowBack, contentDescription = null, tint = Color.White)
            }
            Text("Track Order Status", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.W900)
            Spacer(modifier = Modifier.width(48.dp))
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Booking status summary card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(DarkSurface, RoundedCornerShape(20.dp))
                .border(1.dp, BorderColor, RoundedCornerShape(20.dp))
                .padding(20.dp)
        ) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(booking.packageName, color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    Surface(
                        color = ClientCyan.copy(alpha = 0.15f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            text = booking.status,
                            color = ClientCyan,
                            fontSize = 11.sp,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
                Spacer(modifier = Modifier.height(6.dp))
                Text("Noida Center, Scheduled Slot: ${booking.timeSlot}", color = TextSecondary, fontSize = 11.sp)
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Live Stepper Status Steps
        Text("Order Timeline", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(12.dp))
        
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            TimelineItem(label = "Booking Confirmed & Paid", isDone = currentStep >= 0, icon = Icons.Default.CheckCircle)
            TimelineItem(label = "Filmmaker Dispatched & On Way", isDone = currentStep >= 2, icon = Icons.Default.DirectionsCar)
            TimelineItem(label = "Shoot Session Active In Noida", isDone = currentStep >= 3, icon = Icons.Default.Videocam)
            TimelineItem(label = "Syncing Footage To Editing Suite", isDone = currentStep >= 4, icon = Icons.Default.CloudUpload)
            TimelineItem(label = "Editing Reel Compilation", isDone = currentStep >= 5, icon = Icons.Default.HourglassBottom)
            TimelineItem(label = "Edited Cinematic Reel Delivered", isDone = currentStep >= 6, icon = Icons.Default.LocalActivity)
        }

        if (booking.status == "EDITING") {
            Spacer(modifier = Modifier.height(24.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(ClientPurple.copy(alpha = 0.1f), RoundedCornerShape(12.dp))
                    .border(1.dp, ClientPurple.copy(alpha = 0.3f), RoundedCornerShape(12.dp))
                    .padding(16.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.HourglassEmpty, contentDescription = null, tint = ClientPurple)
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text("Cinematic Editing Suite Active", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Text("~${booking.editCountdown ?: 45} mins remaining until delivery", color = ClientPurple, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        if (booking.status == "DELIVERED") {
            Spacer(modifier = Modifier.height(24.dp))
            Text("Reel Playback Player", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(12.dp))
            
            // ExoPlayer media play view using Media3 wrapper
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .background(Color.Black, RoundedCornerShape(12.dp))
                    .border(1.dp, BorderColor, RoundedCornerShape(12.dp))
            ) {
                AndroidView(
                    modifier = Modifier.fillMaxSize(),
                    factory = { ctx ->
                        val exoPlayer = ExoPlayer.Builder(ctx).build().apply {
                            val mediaItem = MediaItem.fromUri("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4")
                            setMediaItem(mediaItem)
                            prepare()
                        }
                        PlayerView(ctx).apply {
                            player = exoPlayer
                        }
                    }
                )
            }
            Spacer(modifier = Modifier.height(12.dp))
            Button(
                onClick = {},
                colors = ButtonDefaults.buttonColors(containerColor = ClientCyan),
                modifier = Modifier.fillMaxWidth().height(48.dp),
                shape = RoundedCornerShape(8.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.Download, contentDescription = null, tint = Color.Black)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Download Cinematic Reel", color = Color.Black, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun TimelineItem(label: String, isDone: Boolean, icon: ImageVector) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = if (isDone) ClientCyan else Color.Gray,
            modifier = Modifier.size(20.dp)
        )
        Spacer(modifier = Modifier.width(12.dp))
        Text(
            text = label,
            color = if (isDone) Color.White else Color.Gray,
            fontSize = 13.sp,
            fontWeight = if (isDone) FontWeight.SemiBold else FontWeight.Normal
        )
    }
}
