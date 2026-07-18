package io.orbit.client.ui.tracking

import android.content.Intent
import android.net.Uri
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import io.orbit.client.domain.model.Booking
import io.orbit.client.domain.model.BookingStatus
import io.orbit.client.ui.theme.KineticNoirTheme

@Composable
fun TrackingScreen(
    viewModel: TrackingViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(KineticNoirTheme.colors.background)
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Live Project Tracker",
                style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
                color = Color.White
            )

            IconButton(onClick = {
                uiState.booking?.id?.let { viewModel.loadBookingDetails(it) }
            }) {
                Icon(Icons.Default.Refresh, contentDescription = "Refresh", tint = KineticNoirTheme.colors.neonBlue)
            }
        }

        // Socket status badge
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .background(
                        if (uiState.isWsConnected) KineticNoirTheme.colors.statusOnline
                        else Color.Red,
                        RoundedCornerShape(4.dp)
                    )
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = if (uiState.isWsConnected) "Real-time updates active" else "Connecting...",
                style = MaterialTheme.typography.bodySmall,
                color = Color.Gray
            )
        }

        if (uiState.booking == null) {
            Box(modifier = Modifier.fillMaxWidth().height(200.dp), contentAlignment = Alignment.Center) {
                if (uiState.isLoading) {
                    CircularProgressIndicator(color = KineticNoirTheme.colors.neonBlue)
                } else {
                    Text("No active bookings found.", color = Color.Gray)
                }
            }
        } else {
            val booking = uiState.booking!!

            // Payout confirmation banner for transparency
            PartnerAssignedBanner(booking = booking)

            // Dynamic reel downloader on DELIVERED
            AnimatedVisibility(visible = booking.status == BookingStatus.DELIVERED) {
                booking.masterReelUrl?.let { url ->
                    DownloadReelCard(url = url) {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        context.startActivity(intent)
                    }
                }
            }

            // Stepper view
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, KineticNoirTheme.colors.cardBorder, RoundedCornerShape(16.dp))
                    .background(KineticNoirTheme.colors.surfaceContainerLow)
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                BookingStatus.values().forEach { stepStatus ->
                    val isCompleted = booking.status.step >= stepStatus.step
                    val isActive = booking.status == stepStatus

                    StatusStepRow(
                        status = stepStatus,
                        isCompleted = isCompleted,
                        isActive = isActive,
                        booking = booking
                    )
                }
            }
        }
    }
}

@Composable
fun PartnerAssignedBanner(booking: Booking) {
    if (booking.partner != null) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, KineticNoirTheme.colors.cardBorder, RoundedCornerShape(12.dp)),
            colors = CardDefaults.cardColors(containerColor = KineticNoirTheme.colors.surfaceContainerLow)
        ) {
            Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .background(Color.White.copy(alpha = 0.1f), RoundedCornerShape(20.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Text("P", color = KineticNoirTheme.colors.neonPurple, fontWeight = FontWeight.Bold)
                }
                Spacer(modifier = Modifier.width(16.dp))
                Column {
                    Text(text = "Creator Assigned", style = MaterialTheme.typography.labelSmall, color = Color.Gray)
                    Text(text = booking.partner.user?.name ?: "Arjun Kapoor", style = MaterialTheme.typography.titleMedium, color = Color.White)
                    Text(text = "Rating: ${booking.partner.rating} ★", style = MaterialTheme.typography.bodySmall, color = KineticNoirTheme.colors.neonPurple)
                }
            }
        }
    }
}

@Composable
fun DownloadReelCard(url: String, onDownloadClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, KineticNoirTheme.colors.neonBlue, RoundedCornerShape(16.dp)),
        colors = CardDefaults.cardColors(containerColor = KineticNoirTheme.colors.surfaceContainerLow)
    ) {
        Column(modifier = Modifier.padding(20.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "Your Cinematic Reel is Ready!",
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                color = Color.White
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Download or stream the edited master file below.",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.Gray
            )
            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = onDownloadClick,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                contentPadding = PaddingValues()
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(KineticNoirTheme.colors.primaryGradient),
                    contentAlignment = Alignment.Center
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Download, contentDescription = null, tint = Color.Black)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Download Reel (MP4)", color = Color.Black, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun StatusStepRow(
    status: BookingStatus,
    isCompleted: Boolean,
    isActive: Boolean,
    booking: Booking
) {
    val tintColor = when {
        isActive -> KineticNoirTheme.colors.neonBlue
        isCompleted -> KineticNoirTheme.colors.neonPurple
        else -> Color.DarkGray
    }

    val textWeight = if (isActive) FontWeight.Bold else FontWeight.Normal
    val textColor = if (isActive || isCompleted) Color.White else Color.Gray

    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Step dot indicator
        Box(
            modifier = Modifier
                .size(16.dp)
                .background(tintColor, RoundedCornerShape(8.dp))
        )

        Spacer(modifier = Modifier.width(16.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = status.display,
                style = MaterialTheme.typography.bodyLarge.copy(fontWeight = textWeight),
                color = textColor
            )
            if (isActive) {
                // Stepper detail summaries
                val detailText = when (status) {
                    BookingStatus.PARTNER_DISPATCHED -> "Finding nearby content creator..."
                    BookingStatus.EN_ROUTE -> "Creator is heading to the location."
                    BookingStatus.SHOOTING -> "Raw clips checklist is being shot."
                    BookingStatus.SYNCING -> "Uploading raw clips to edit desk (${booking.syncPercentage}% synced)."
                    BookingStatus.EDITING -> "Adding color correction, transitions and branding."
                    else -> "Processing..."
                }
                Text(
                    text = detailText,
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.LightGray
                )
            }
        }
    }
}
