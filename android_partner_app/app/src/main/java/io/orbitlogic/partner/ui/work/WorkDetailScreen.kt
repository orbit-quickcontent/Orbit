package io.orbitlogic.partner.ui.work

import androidx.camera.view.PreviewView
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.MyLocation
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.orbitlogic.partner.data.models.BookingInfo
import io.orbitlogic.partner.ui.theme.*
import kotlinx.coroutines.delay

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WorkDetailScreen(
    job: BookingInfo,
    onCompleteJob: (BookingInfo) -> Unit,
    onBack: () -> Unit
) {
    var stage by remember { mutableStateOf(1) } // 1: Navigation, 2: CameraX Shoot, 3: Sync Footage
    var syncPercentage by remember { mutableStateOf(0) }
    var isSyncing by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Active Gig: ${job.packageName}", fontSize = 16.sp, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(imageVector = Icons.Default.ArrowBack, contentDescription = null, tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBackground, titleContentColor = Color.White)
            )
        },
        containerColor = DarkBackground
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp)
        ) {
            // Stage Indicator Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                StageIndicatorItem(label = "Locate", active = stage == 1, done = stage > 1, modifier = Modifier.weight(1f))
                StageIndicatorItem(label = "Shoot", active = stage == 2, done = stage > 2, modifier = Modifier.weight(1f))
                StageIndicatorItem(label = "Sync", active = stage == 3, done = stage > 3, modifier = Modifier.weight(1f))
            }
            Spacer(modifier = Modifier.height(24.dp))

            when (stage) {
                1 -> {
                    // Navigation Noida Map Details Simulator
                    Text("Noida Shooting Coordinator", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp)
                            .background(DarkSurface, RoundedCornerShape(16.dp))
                            .border(1.dp, BorderColor, RoundedCornerShape(16.dp))
                            .padding(20.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(imageVector = Icons.Default.MyLocation, contentDescription = null, tint = PartnerPurple, modifier = Modifier.size(48.dp))
                            Spacer(modifier = Modifier.height(12.dp))
                            Text("GPS: Noida Sector 62", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                            Text("Target Address: ${job.location}", color = TextSecondary, fontSize = 11.sp)
                        }
                    }
                    Spacer(modifier = Modifier.height(36.dp))
                    Button(
                        onClick = { stage = 2 },
                        colors = ButtonDefaults.buttonColors(containerColor = PartnerPurple),
                        modifier = Modifier.fillMaxWidth().height(52.dp),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("ARRIVED AT LOCATION", color = Color.White, fontWeight = FontWeight.W900)
                    }
                }

                2 -> {
                    // CameraX surface preview placeholder
                    Text("CameraX Shooting Preview Simulator", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(260.dp)
                            .background(Color.Black, RoundedCornerShape(16.dp))
                            .border(1.dp, BorderColor, RoundedCornerShape(16.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        // Compose simulator surface
                        Text("Surface Camera View Active", color = Color.White, fontSize = 13.sp)
                    }
                    Spacer(modifier = Modifier.height(36.dp))
                    Button(
                        onClick = { stage = 3 },
                        colors = ButtonDefaults.buttonColors(containerColor = PartnerPurple),
                        modifier = Modifier.fillMaxWidth().height(52.dp),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("START SHOOTING", color = Color.White, fontWeight = FontWeight.W900)
                    }
                }

                3 -> {
                    // Raw Footage Sync checklist uploads progress simulator
                    Text("Footage Upload Sync Suite", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(12.dp))
                    
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Default.Check, contentDescription = null, tint = Color(0xFF2ECC71))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Shot 1: Brand Logo Overlay Intro", color = Color.White, fontSize = 13.sp)
                        }
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Default.Check, contentDescription = null, tint = Color(0xFF2ECC71))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Shot 2: Filmmaker Cinematic Pan Left", color = Color.White, fontSize = 13.sp)
                        }
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Default.Check, contentDescription = null, tint = Color(0xFF2ECC71))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Shot 3: Custom Backdrop Close-Up", color = Color.White, fontSize = 13.sp)
                        }
                    }

                    Spacer(modifier = Modifier.height(24.dp))
                    
                    if (isSyncing) {
                        Text("Uploading raw footage: $syncPercentage%", color = Color.White, fontSize = 12.sp)
                        Spacer(modifier = Modifier.height(6.dp))
                        LinearProgressIndicator(
                            progress = syncPercentage / 100f,
                            color = PartnerPurple,
                            trackColor = BorderColor,
                            modifier = Modifier.fillMaxWidth().height(8.dp).clip(RoundedCornerShape(4.dp))
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("Speed: 12.4 MB/s (Completed S3 chunk)", color = TextSecondary, fontSize = 10.sp)
                    }

                    LaunchedEffect(isSyncing) {
                        if (isSyncing) {
                            while (syncPercentage < 100) {
                                delay(300)
                                syncPercentage += 20
                            }
                            onCompleteJob(job)
                        }
                    }

                    Spacer(modifier = Modifier.height(36.dp))
                    Button(
                        onClick = { isSyncing = true },
                        colors = ButtonDefaults.buttonColors(containerColor = PartnerPurple),
                        modifier = Modifier.fillMaxWidth().height(52.dp),
                        shape = RoundedCornerShape(12.dp),
                        enabled = !isSyncing
                    ) {
                        Text("SYNC FOOTAGE", color = Color.White, fontWeight = FontWeight.W900)
                    }
                }
            }
        }
    }
}

@Composable
fun StageIndicatorItem(label: String, active: Boolean, done: Boolean, modifier: Modifier = Modifier) {
    val color = when {
        done -> Color(0xFF2ECC71)
        active -> PartnerPurple
        else -> BorderColor
    }
    Box(
        modifier = modifier
            .height(32.dp)
            .background(color.copy(alpha = 0.15f), RoundedCornerShape(8.dp))
            .border(1.dp, color, RoundedCornerShape(8.dp)),
        contentAlignment = Alignment.Center
    ) {
        Text(label, color = if (active || done) Color.White else TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
    }
}
