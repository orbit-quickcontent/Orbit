package io.orbitlogic.client.ui.booking

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.MyLocation
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.orbitlogic.client.data.models.PackageInfo
import io.orbitlogic.client.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BookingScreen(
    packages: List<PackageInfo>,
    onBookingComplete: (packageId: String, location: String, date: String, slot: String) -> Unit,
    onBack: () -> Unit
) {
    var step by remember { mutableStateOf(1) }
    var selectedPackage by remember { mutableStateOf(packages.firstOrNull()) }
    
    // Inputs state
    var logoUrl by remember { mutableStateOf("") }
    var fontStyle by remember { mutableStateOf("Cinematic Bold") }
    var brandColor by remember { mutableStateOf("#00BFFF") }
    var location by remember { mutableStateOf("") }
    var date by remember { mutableStateOf("2026-07-10") }
    var slot by remember { mutableStateOf("10:00 AM - 12:00 PM") }
    var notes by remember { mutableStateOf("") }
    var isSubmitting by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(
                    text = when(step) {
                        1 -> "Details & Branding"
                        2 -> "Schedule Shoot"
                        else -> "Mock Payment Check"
                    },
                    fontSize = 16.sp,
                    fontWeight = FontWeight.W900
                ) },
                navigationIcon = {
                    IconButton(onClick = {
                        if (step > 1) step-- else onBack()
                    }) {
                        Icon(imageVector = Icons.Default.ArrowBack, contentDescription = null, tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBackground, titleContentColor = Color.White)
            )
        },
        bottomBar = {
            Button(
                onClick = {
                    if (step < 3) {
                        step++
                    } else {
                        isSubmitting = true
                        onBookingComplete(
                            selectedPackage?.id ?: "",
                            location,
                            date,
                            slot
                        )
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = ClientCyan),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
                    .height(52.dp),
                shape = RoundedCornerShape(12.dp),
                enabled = !isSubmitting
            ) {
                if (isSubmitting) {
                    CircularProgressIndicator(color = Color.Black, modifier = Modifier.size(24.dp))
                } else {
                    Text(
                        text = if (step < 3) "Next Step" else "Verify & Book Now",
                        fontWeight = FontWeight.Bold,
                        color = Color.Black
                    )
                }
            }
        },
        containerColor = DarkBackground
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp)
        ) {
            when (step) {
                1 -> {
                    // Package Select
                    Text("Select Package", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    packages.forEach { pkg ->
                        val isSel = selectedPackage?.id == pkg.id
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 8.dp)
                                .background(DarkSurface, RoundedCornerShape(12.dp))
                                .border(1.dp, if (isSel) ClientCyan else BorderColor, RoundedCornerShape(12.dp))
                                .clickable { selectedPackage = pkg }
                                .padding(16.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(pkg.name, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                                    Text(pkg.focus, color = TextSecondary, fontSize = 11.sp)
                                }
                                Text("₹${pkg.price}", color = ClientCyan, fontSize = 15.sp, fontWeight = FontWeight.W900)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Brand DNA details
                    Text("Brand Customization", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    TextField(
                        value = logoUrl,
                        onValueChange = { logoUrl = it },
                        label = { Text("Logo File Link (Optional)", color = TextSecondary) },
                        colors = TextFieldDefaults.colors(focusedContainerColor = DarkSurface, unfocusedContainerColor = DarkSurface, focusedTextColor = Color.White, unfocusedTextColor = Color.White),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    TextField(
                        value = fontStyle,
                        onValueChange = { fontStyle = it },
                        label = { Text("Cinematic Font Preset", color = TextSecondary) },
                        colors = TextFieldDefaults.colors(focusedContainerColor = DarkSurface, unfocusedContainerColor = DarkSurface, focusedTextColor = Color.White, unfocusedTextColor = Color.White),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp)
                    )
                }

                2 -> {
                    // Location & coordinates simulation
                    Text("Location Details", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    TextField(
                        value = location,
                        onValueChange = { location = it },
                        label = { Text("Shoot Location Noida Address", color = TextSecondary) },
                        trailingIcon = {
                            Icon(
                                imageVector = Icons.Default.MyLocation,
                                contentDescription = null,
                                tint = ClientCyan,
                                modifier = Modifier.clickable {
                                    location = "Noida Sector 62, Coordinate (28.62, 77.36)"
                                }
                            )
                        },
                        colors = TextFieldDefaults.colors(focusedContainerColor = DarkSurface, unfocusedContainerColor = DarkSurface, focusedTextColor = Color.White, unfocusedTextColor = Color.White),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp)
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Date & slot scheduling
                    Text("Scheduling Date", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    TextField(
                        value = date,
                        onValueChange = { date = it },
                        label = { Text("YYYY-MM-DD", color = TextSecondary) },
                        colors = TextFieldDefaults.colors(focusedContainerColor = DarkSurface, unfocusedContainerColor = DarkSurface, focusedTextColor = Color.White, unfocusedTextColor = Color.White),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    TextField(
                        value = slot,
                        onValueChange = { slot = it },
                        label = { Text("Time Slot", color = TextSecondary) },
                        colors = TextFieldDefaults.colors(focusedContainerColor = DarkSurface, unfocusedContainerColor = DarkSurface, focusedTextColor = Color.White, unfocusedTextColor = Color.White),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp)
                    )
                }

                3 -> {
                    // Summary Payment check
                    Text("Review Details", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(12.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(DarkSurface, RoundedCornerShape(16.dp))
                            .border(1.dp, BorderColor, RoundedCornerShape(16.dp))
                            .padding(20.dp)
                    ) {
                        Column {
                            Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                                Text("Package Selection", color = TextSecondary, fontSize = 12.sp)
                                Text(selectedPackage?.name ?: "", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                            Spacer(Modifier.height(8.dp))
                            Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                                Text("Target Date", color = TextSecondary, fontSize = 12.sp)
                                Text(date, color = Color.White, fontSize = 12.sp)
                            }
                            Spacer(Modifier.height(8.dp))
                            Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                                Text("Location Noida", color = TextSecondary, fontSize = 12.sp)
                                Text(location.take(24) + "...", color = Color.White, fontSize = 12.sp)
                            }
                            Spacer(Modifier.height(16.dp))
                            Divider(color = BorderColor)
                            Spacer(Modifier.height(16.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("Total Amount", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                                Text("₹${selectedPackage?.price ?: 0}", color = ClientCyan, fontSize = 18.sp, fontWeight = FontWeight.W900)
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(24.dp))
                    Text("UPI Address / Mock Razorpay Gateway", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    TextField(
                        value = "orbit@paytm",
                        onValueChange = {},
                        label = { Text("Mock ID Check", color = TextSecondary) },
                        colors = TextFieldDefaults.colors(focusedContainerColor = DarkSurface, unfocusedContainerColor = DarkSurface, focusedTextColor = Color.White, unfocusedTextColor = Color.White),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp),
                        readOnly = true
                    )
                }
            }
        }
    }
}
