package io.orbitlogic.client.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.orbitlogic.client.data.models.PackageInfo
import io.orbitlogic.client.data.models.UserProfile
import io.orbitlogic.client.ui.theme.*

@Composable
fun HomeScreen(
    user: UserProfile,
    packages: List<PackageInfo>,
    onActionSelected: (String) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(16.dp)
    ) {
        // Custom Greeting Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .background(ClientCyan, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (user.name.isNotEmpty()) user.name[0].uppercase() else "U",
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text("Good morning", color = TextSecondary, fontSize = 11.sp)
                    Text("Hi, ${user.name.split(" ")[0]}", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.W900)
                }
            }
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                IconButton(onClick = {}) {
                    Icon(imageVector = Icons.Default.Search, contentDescription = null, tint = Color.White)
                }
                IconButton(onClick = {}) {
                    Icon(imageVector = Icons.Default.Notifications, contentDescription = null, tint = Color.White)
                }
            }
        }
        Spacer(modifier = Modifier.height(20.dp))

        // 2x2 Grid Actions
        Text("Quick Access", color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(10.dp))
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                GridCard(
                    title = "Book Now",
                    desc = "Schedule a session",
                    icon = Icons.Default.CalendarToday,
                    color = ClientCyan,
                    modifier = Modifier.weight(1f)
                ) { onActionSelected("booking") }
                GridCard(
                    title = "Track Order",
                    desc = "Live shooter updates",
                    icon = Icons.Default.Radar,
                    color = ClientPurple,
                    modifier = Modifier.weight(1f)
                ) { onActionSelected("tracking") }
            }
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                GridCard(
                    title = "Packages",
                    desc = "Check pricing options",
                    icon = Icons.Default.Inventory,
                    color = Color(0xFF2D6A4F),
                    modifier = Modifier.weight(1f)
                ) { onActionSelected("packages") }
                GridCard(
                    title = "Brand DNA",
                    desc = "Style presets",
                    icon = Icons.Default.AutoAwesome,
                    color = Color(0xFFFFB300),
                    modifier = Modifier.weight(1f)
                ) { onActionSelected("brand_dna") }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Packages horizontal row
        Text("Our Packages", color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(10.dp))
        LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            items(packages) { pkg ->
                PackagePreviewCard(pkg)
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Large Promo CTA Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    brush = Brush.linearGradient(
                        listOf(ClientCyan.copy(alpha = 0.15f), ClientPurple.copy(alpha = 0.15f))
                    ),
                    shape = RoundedCornerShape(16.dp)
                )
                .border(1.dp, BorderColor, RoundedCornerShape(16.dp))
                .padding(20.dp)
        ) {
            Column {
                Text(
                    text = "Ready to Create\nSomething Cinematic?",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.W900,
                    color = Color.White,
                    lineHeight = 22.sp
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Professional cinematic edits delivered directly to your device within 60 minutes.",
                    fontSize = 11.sp,
                    color = TextSecondary
                )
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = { onActionSelected("booking") },
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White)
                ) {
                    Text("Book Session", color = Color.Black, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun GridCard(
    title: String,
    desc: String,
    icon: ImageVector,
    color: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .height(100.dp)
            .background(DarkSurface, RoundedCornerShape(16.dp))
            .border(1.dp, BorderColor, RoundedCornerShape(16.dp))
            .clickable { onClick() }
            .padding(16.dp)
    ) {
        Column(verticalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxSize()) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(title, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.W900)
                Box(
                    modifier = Modifier
                        .size(28.dp)
                        .background(color.copy(alpha = 0.15f), RoundedCornerShape(8.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(imageVector = icon, contentDescription = null, tint = color, modifier = Modifier.size(16.dp))
                }
            }
            Text(desc, color = TextSecondary, fontSize = 10.sp)
        }
    }
}

@Composable
fun PackagePreviewCard(pkg: PackageInfo) {
    Box(
        modifier = Modifier
            .width(180.dp)
            .background(DarkSurface, RoundedCornerShape(16.dp))
            .border(1.dp, BorderColor, RoundedCornerShape(16.dp))
            .padding(16.dp)
    ) {
        Column {
            Text(pkg.name, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(4.dp))
            Text(pkg.focus, color = TextSecondary, fontSize = 10.sp)
            Spacer(modifier = Modifier.height(16.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("₹${pkg.price}", color = ClientCyan, fontSize = 14.sp, fontWeight = FontWeight.W900)
                Text(pkg.deliveryTime, color = TextSecondary, fontSize = 9.sp)
            }
        }
    }
}
