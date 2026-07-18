package io.orbit.client.ui.packages

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
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
import io.orbit.client.domain.model.Package
import io.orbit.client.ui.home.HomeViewModel
import io.orbit.client.ui.theme.KineticNoirTheme

@Composable
fun PackagesScreen(
    viewModel: HomeViewModel = hiltViewModel(),
    onSelectPackage: (Package) -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(KineticNoirTheme.colors.background)
            .padding(16.dp)
    ) {
        Text(
            text = "Select a Package",
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
            color = Color.White,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            items(uiState.packages) { pkg ->
                PackageCard(pkg = pkg, onSelect = { onSelectPackage(pkg) })
            }
        }
    }
}

@Composable
fun PackageCard(
    pkg: Package,
    onSelect: () -> Unit
) {
    val outlineColor = if (pkg.popular) KineticNoirTheme.colors.neonPurple else KineticNoirTheme.colors.cardBorder
    
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, outlineColor, RoundedCornerShape(16.dp)),
        colors = CardDefaults.cardColors(containerColor = KineticNoirTheme.colors.surfaceContainerLow)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            if (pkg.popular) {
                Box(
                    modifier = Modifier
                        .background(KineticNoirTheme.colors.neonPurple, RoundedCornerShape(8.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                        .align(Alignment.End)
                ) {
                    Text("POPULAR", color = Color.Black, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
            }

            Text(
                text = pkg.name,
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                color = Color.White
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = pkg.focus,
                style = MaterialTheme.typography.bodyMedium,
                color = Color.Gray
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "₹${pkg.price}",
                style = MaterialTheme.typography.displayMedium.copy(fontWeight = FontWeight.ExtraBold),
                color = KineticNoirTheme.colors.neonBlue
            )

            Text(
                text = "Delivery in ${pkg.deliveryTime}",
                style = MaterialTheme.typography.bodySmall,
                color = Color.Gray
            )

            Spacer(modifier = Modifier.height(16.dp))

            Divider(color = Color.White.copy(alpha = 0.05f))

            Spacer(modifier = Modifier.height(16.dp))

            pkg.features.forEach { feature ->
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(bottom = 8.dp)
                ) {
                    Icon(
                        Icons.Default.Check,
                        contentDescription = null,
                        tint = KineticNoirTheme.colors.neonBlue,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = feature, style = MaterialTheme.typography.bodyMedium, color = Color.White)
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            Button(
                onClick = onSelect,
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
                    Text("Choose ${pkg.name}", color = Color.Black, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
