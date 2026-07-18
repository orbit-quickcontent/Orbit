package io.orbit.partner.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import io.orbit.partner.domain.model.Booking
import io.orbit.partner.ui.theme.LuminousDarkTheme

@Composable
fun AvailableGigsScreen(
    viewModel: HomeViewModel,
    onNavigateToWork: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(uiState.activeGig) {
        if (uiState.activeGig != null) {
            onNavigateToWork()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(LuminousDarkTheme.colors.background)
            .padding(16.dp)
    ) {
        Text(
            text = "Available Shoots Nearby",
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
            color = Color.White,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        uiState.error?.let {
            Text(
                text = it,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.padding(bottom = 12.dp)
            )
        }

        if (!uiState.isOnline) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Go online to start receiving work dispatches.",
                    style = MaterialTheme.typography.bodyLarge,
                    color = Color.Gray
                )
            }
        } else if (uiState.availableGigs.isEmpty()) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                if (uiState.isLoading) {
                    CircularProgressIndicator(color = LuminousDarkTheme.colors.neonGreen)
                } else {
                    Text(
                        text = "Waiting for dispatches from client bookings...",
                        style = MaterialTheme.typography.bodyLarge,
                        color = Color.Gray
                    )
                }
            }
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(uiState.availableGigs) { gig ->
                    GigCard(
                        gig = gig,
                        onAccept = { viewModel.acceptGig(gig) },
                        onDecline = { viewModel.declineGig(gig) }
                    )
                }
            }
        }
    }
}

@Composable
fun GigCard(
    gig: Booking,
    onAccept: () -> Unit,
    onDecline: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, LuminousDarkTheme.colors.border, RoundedCornerShape(16.dp)),
        colors = CardDefaults.cardColors(containerColor = LuminousDarkTheme.colors.surfaceContainerLow)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = gig.packageInfo?.name ?: "Personalized",
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                    color = Color.White
                )
                // ₹700 payout value prominently (Salary payout for shoots)
                Text(
                    text = "₹700.00",
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.ExtraBold),
                    color = LuminousDarkTheme.colors.neonGreen
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = "Client: ${gig.user?.name ?: "Business Partner"}",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.LightGray
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Location: ${gig.location ?: "Mumbai Studio"}",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.LightGray
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Schedule: ${gig.bookingDate} • ${gig.timeSlot}",
                style = MaterialTheme.typography.bodySmall,
                color = Color.Gray
            )

            Spacer(modifier = Modifier.height(20.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedButton(
                    onClick = onDecline,
                    modifier = Modifier.weight(1f).height(48.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White),
                    border = ButtonDefaults.outlinedButtonBorder.copy(width = 1.dp)
                ) {
                    Text("Decline")
                }

                Button(
                    onClick = onAccept,
                    modifier = Modifier.weight(1f).height(48.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White) // High-contrast White for acceptance
                ) {
                    Text("Accept Gig", color = Color.Black, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
