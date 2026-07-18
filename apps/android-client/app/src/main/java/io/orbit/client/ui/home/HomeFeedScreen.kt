package io.orbit.client.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import io.orbit.client.domain.model.Booking
import io.orbit.client.domain.model.Package
import io.orbit.client.ui.theme.KineticNoirTheme

@Composable
fun HomeFeedScreen(
    viewModel: HomeViewModel = hiltViewModel(),
    onNavigateToBooking: () -> Unit,
    onNavigateToTrack: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(KineticNoirTheme.colors.background)
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        // Welcome Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Welcome back,",
                    style = MaterialTheme.typography.titleSmall,
                    color = Color.Gray
                )
                Text(
                    text = uiState.user?.name ?: "Creator",
                    style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
                    color = Color.White
                )
            }
            // User Avatar Placeholder
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .background(Color.White.copy(alpha = 0.1f), RoundedCornerShape(22.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.Person, contentDescription = null, tint = Color.White)
            }
        }

        // Active Booking banner
        uiState.recentBooking?.let { booking ->
            ActiveBookingCard(booking = booking, onClick = onNavigateToTrack)
        }

        // Hero CTA button
        Button(
            onClick = onNavigateToBooking,
            modifier = Modifier
                .fillMaxWidth()
                .height(60.dp),
            shape = RoundedCornerShape(16.dp),
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
                    Icon(Icons.Default.Videocam, contentDescription = null, tint = Color.Black)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Book Cinematic Shoot Now", color = Color.Black, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
            }
        }

        // 2x2 Services Grid
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text(
                text = "Services Available",
                style = MaterialTheme.typography.titleMedium,
                color = Color.White
            )

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                ServiceGridItem(
                    title = "Cinematic Reels",
                    subtitle = "Creative storytelling",
                    icon = Icons.Default.Movie,
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToBooking
                )
                ServiceGridItem(
                    title = "Product Shoots",
                    subtitle = "Stunning highlights",
                    icon = Icons.Default.Storefront,
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToBooking
                )
            }

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                ServiceGridItem(
                    title = "Fast Editing",
                    subtitle = "Delivered in 120m",
                    icon = Icons.Default.OfflineBolt,
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToBooking
                )
                ServiceGridItem(
                    title = "UGC Content",
                    subtitle = "Viral organic video",
                    icon = Icons.Default.SmartDisplay,
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToBooking
                )
            }
        }

        // Horizontal Packages list
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text(
                text = "Pricing Packages",
                style = MaterialTheme.typography.titleMedium,
                color = Color.White
            )

            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                contentPadding = PaddingValues(end = 16.dp)
            ) {
                items(uiState.packages) { pkg ->
                    HorizontalPackageItem(pkg = pkg, onClick = onNavigateToBooking)
                }
            }
        }
    }
}

@Composable
fun ActiveBookingCard(booking: Booking, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, KineticNoirTheme.colors.cardBorder, RoundedCornerShape(16.dp))
            .clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = KineticNoirTheme.colors.surfaceContainerLow)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Active Session Track",
                    style = MaterialTheme.typography.labelMedium,
                    color = KineticNoirTheme.colors.neonBlue
                )
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .background(KineticNoirTheme.colors.statusOnline, RoundedCornerShape(4.dp))
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Current Status: ${booking.status.display}",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                color = Color.White
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "${booking.bookingDate} • ${booking.timeSlot}",
                style = MaterialTheme.typography.bodySmall,
                color = Color.Gray
            )
        }
    }
}

@Composable
fun ServiceGridItem(
    title: String,
    subtitle: String,
    icon: ImageVector,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .height(110.dp)
            .border(1.dp, KineticNoirTheme.colors.cardBorder, RoundedCornerShape(16.dp))
            .clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = KineticNoirTheme.colors.surfaceContainerLow)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Icon(icon, contentDescription = null, tint = KineticNoirTheme.colors.neonBlue, modifier = Modifier.size(28.dp))
            Column {
                Text(text = title, style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold), color = Color.White)
                Text(text = subtitle, style = MaterialTheme.typography.bodySmall, color = Color.Gray, maxLines = 1, overflow = TextOverflow.Ellipsis)
            }
        }
    }
}

@Composable
fun HorizontalPackageItem(
    pkg: Package,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(200.dp)
            .height(130.dp)
            .border(1.dp, KineticNoirTheme.colors.cardBorder, RoundedCornerShape(16.dp))
            .clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = KineticNoirTheme.colors.surfaceContainerLow)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(text = pkg.name, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = Color.White)
                Text(text = pkg.focus, style = MaterialTheme.typography.bodySmall, color = Color.Gray, maxLines = 2, overflow = TextOverflow.Ellipsis)
            }
            Text(
                text = "₹${pkg.price}",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                color = KineticNoirTheme.colors.neonPurple
            )
        }
    }
}
