package io.orbitlogic.partner.ui.home

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.orbitlogic.partner.data.models.BookingInfo
import io.orbitlogic.partner.data.models.PartnerProfile
import io.orbitlogic.partner.ui.theme.*

@Composable
fun HomeScreen(
    profile: PartnerProfile,
    availableJobs: List<BookingInfo>,
    onAcceptJob: (BookingInfo) -> Unit,
    onNavigateToTab: (String) -> Unit
) {
    var isOnline by remember { mutableStateOf(profile.availability) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(16.dp)
    ) {
        // Partner Greeting Header (Deadpool Avatar style)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                // Circular initials avatar matching Deadpool styling colors
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .background(Color(0xFFE50914), CircleShape)
                        .border(1.5.dp, Color.Black, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text("DP", color = Color.White, fontWeight = FontWeight.Bold)
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(profile.name, color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.W900)
                        Spacer(modifier = Modifier.width(4.dp))
                        Icon(imageVector = Icons.Default.Verified, contentDescription = null, tint = Colors.GreenAccent, modifier = Modifier.size(16.dp))
                    }
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .background(if (isOnline) Colors.GreenAccent else Color.Gray, CircleShape)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(if (isOnline) "Active & Online" else "Offline", color = TextSecondary, fontSize = 11.sp)
                    }
                }
            }

            // Online Switch
            Switch(
                checked = isOnline,
                onCheckedChange = { isOnline = it },
                colors = SwitchDefaults.colors(
                    checkedThumbColor = Color.White,
                    checkedTrackColor = PartnerPurple,
                    uncheckedThumbColor = Color.Gray,
                    uncheckedTrackColor = DarkSurface
                )
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Open dispatches title
        Text(
            text = "Available Filmmaker Dispatches",
            color = Color.White,
            fontSize = 15.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(12.dp))

        if (availableJobs.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .background(DarkSurface, RoundedCornerShape(16.dp))
                    .border(1.dp, BorderColor, RoundedCornerShape(16.dp)),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(imageVector = Icons.Default.CloudQueue, contentDescription = null, tint = TextSecondary, modifier = Modifier.size(48.dp))
                    Spacer(modifier = Modifier.height(12.dp))
                    Text("No available dispatches nearby", color = TextSecondary, fontSize = 13.sp)
                    Text("Toggle Online status to receive live gigs", color = TextSecondary, fontSize = 11.sp)
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(availableJobs) { job ->
                    DispatchJobCard(job = job, onAccept = { onAcceptJob(job) })
                }
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))

        // Partner bottom navigation bar shortcuts
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(DarkSurface, RoundedCornerShape(16.dp))
                .border(1.dp, BorderColor, RoundedCornerShape(16.dp))
                .padding(8.dp),
            horizontalArrangement = Arrangement.SpaceAround
        ) {
            IconButton(onClick = { onNavigateToTab("home") }) {
                Icon(imageVector = Icons.Default.Work, contentDescription = null, tint = PartnerPurple)
            }
            IconButton(onClick = { onNavigateToTab("earnings") }) {
                Icon(imageVector = Icons.Default.AccountBalanceWallet, contentDescription = null, tint = Color.White)
            }
            IconButton(onClick = { onNavigateToTab("profile") }) {
                Icon(imageVector = Icons.Default.Person, contentDescription = null, tint = Color.White)
            }
        }
    }
}

@Composable
fun DispatchJobCard(job: BookingInfo, onAccept: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(DarkSurface, RoundedCornerShape(16.dp))
            .border(1.dp, BorderColor, RoundedCornerShape(16.dp))
            .padding(16.dp)
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(job.packageName, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.W900)
                Text("Salary: ₹700", color = Colors.GreenAccent, fontWeight = FontWeight.Bold, fontSize = 12.sp)
            }
            Spacer(modifier = Modifier.height(8.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(imageVector = Icons.Default.PinDrop, contentDescription = null, tint = TextSecondary, modifier = Modifier.size(14.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(job.location, color = TextSecondary, fontSize = 11.sp)
            }
            Spacer(modifier = Modifier.height(6.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(imageVector = Icons.Default.AccessTime, contentDescription = null, tint = TextSecondary, modifier = Modifier.size(14.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(job.timeSlot, color = TextSecondary, fontSize = 11.sp)
            }
            Spacer(modifier = Modifier.height(16.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = onAccept,
                    colors = ButtonDefaults.buttonColors(containerColor = PartnerPurple),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("Accept Dispatch", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
            }
        }
    }
}

object Colors {
    val GreenAccent = Color(0xFF2ECC71)
}
