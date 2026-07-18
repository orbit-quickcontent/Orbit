package io.orbit.partner.ui.work

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.ExperimentalAnimationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Sync
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import io.orbit.partner.ui.theme.LuminousDarkTheme

@OptIn(ExperimentalAnimationApi::class)
@Composable
fun WorkDetailScreen(
    viewModel: WorkViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(LuminousDarkTheme.colors.background)
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Text(
            text = "Current Shoot Task",
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
            color = Color.White
        )

        uiState.error?.let {
            Text(
                text = it,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodyMedium
            )
        }

        AnimatedContent(targetState = uiState.currentWorkflowStage) { stage ->
            when (stage) {
                0 -> NavigateStageView(onNext = { viewModel.markArrived() })
                1 -> ArriveStageView(onNext = { viewModel.markArrived() }) // Transitions state
                2 -> ShootChecklistStageView(uiState.checklistItems, viewModel) {
                    // Send mock file paths to trigger WorkManager upload worker
                    val mockFiles = arrayOf("/sdcard/DCIM/clip1.mp4", "/sdcard/DCIM/clip2.mp4")
                    viewModel.startFootageSync(mockFiles)
                }
                3 -> SyncingStageView(uiState.syncPercentage)
            }
        }
    }
}

@Composable
fun NavigateStageView(onNext: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, LuminousDarkTheme.colors.border, RoundedCornerShape(16.dp)),
        colors = CardDefaults.cardColors(containerColor = LuminousDarkTheme.colors.surfaceContainerLow)
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                Icons.Default.LocationOn,
                contentDescription = null,
                tint = LuminousDarkTheme.colors.neonPurple,
                modifier = Modifier.size(60.dp)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text("Stage 1: En Route", style = MaterialTheme.typography.titleLarge, color = Color.White)
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                "Navigate to the client's address. Use your external maps for GPS routing.",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.Gray,
                modifier = Modifier.padding(horizontal = 16.dp),
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )
            Spacer(modifier = Modifier.height(24.dp))
            Button(
                onClick = onNext,
                modifier = Modifier.fillMaxWidth().height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.White)
            ) {
                Text("I Have Arrived", color = Color.Black, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun ArriveStageView(onNext: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, LuminousDarkTheme.colors.border, RoundedCornerShape(16.dp)),
        colors = CardDefaults.cardColors(containerColor = LuminousDarkTheme.colors.surfaceContainerLow)
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                Icons.Default.Check,
                contentDescription = null,
                tint = LuminousDarkTheme.colors.neonGreen,
                modifier = Modifier.size(60.dp)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text("Stage 2: Arrived at Studio", style = MaterialTheme.typography.titleLarge, color = Color.White)
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                "Confirm with the client that you are ready. Setup brand requirements.",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.Gray,
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )
            Spacer(modifier = Modifier.height(24.dp))
            Button(
                onClick = onNext,
                modifier = Modifier.fillMaxWidth().height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.White)
            ) {
                Text("Start Shooting", color = Color.Black, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun ShootChecklistStageView(
    items: List<ChecklistItem>,
    viewModel: WorkViewModel,
    onSyncFootage: () -> Unit
) {
    val allChecked = items.all { it.checked }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, LuminousDarkTheme.colors.border, RoundedCornerShape(16.dp)),
        colors = CardDefaults.cardColors(containerColor = LuminousDarkTheme.colors.surfaceContainerLow)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Text(
                text = "Shoot Checklist Tasks",
                style = MaterialTheme.typography.titleLarge,
                color = Color.White,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            items.forEach { item ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { viewModel.toggleChecklistItem(item.id) }
                        .padding(vertical = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = item.prompt, color = if (item.checked) Color.White else Color.Gray)
                    Checkbox(
                        checked = item.checked,
                        onCheckedChange = { viewModel.toggleChecklistItem(item.id) },
                        colors = CheckboxDefaults.colors(checkedColor = LuminousDarkTheme.colors.neonGreen)
                    )
                }
                Divider(color = Color.White.copy(alpha = 0.05f))
            }

            Spacer(modifier = Modifier.height(20.dp))

            Button(
                onClick = onSyncFootage,
                enabled = allChecked,
                modifier = Modifier.fillMaxWidth().height(50.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (allChecked) Color.White else Color.DarkGray
                )
            ) {
                Text("Sync Raw Footage to desk", color = if (allChecked) Color.Black else Color.Gray, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun SyncingStageView(progress: Int) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, LuminousDarkTheme.colors.border, RoundedCornerShape(16.dp)),
        colors = CardDefaults.cardColors(containerColor = LuminousDarkTheme.colors.surfaceContainerLow)
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                Icons.Default.Sync,
                contentDescription = null,
                tint = LuminousDarkTheme.colors.neonGreen,
                modifier = Modifier.size(60.dp)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text("Syncing Raw Clips to Edit Desk", style = MaterialTheme.typography.titleLarge, color = Color.White)
            Spacer(modifier = Modifier.height(16.dp))

            LinearProgressIndicator(
                progress = progress / 100f,
                modifier = Modifier.fillMaxWidth().height(8.dp),
                color = LuminousDarkTheme.colors.neonGreen,
                trackColor = Color.DarkGray
            )

            Spacer(modifier = Modifier.height(8.dp))
            Text("$progress% uploaded", style = MaterialTheme.typography.bodySmall, color = Color.Gray)

            if (progress == 100) {
                Spacer(modifier = Modifier.height(16.dp))
                Text("Sync Successful! Payout of ₹700 will clear shortly.", color = LuminousDarkTheme.colors.neonGreen, fontWeight = FontWeight.Bold)
            }
        }
    }
}
