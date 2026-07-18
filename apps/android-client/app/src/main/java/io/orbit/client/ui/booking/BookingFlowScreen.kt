package io.orbit.client.ui.booking

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
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ChevronRight
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
import io.orbit.client.ui.theme.KineticNoirTheme

@OptIn(ExperimentalAnimationApi::class, ExperimentalMaterial3Api::class)
@Composable
fun BookingFlowScreen(
    viewModel: BookingViewModel = hiltViewModel(),
    onNavigateBack: () -> Unit,
    onNavigateToTrack: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    // Successful booking redirect
    if (uiState.successBooking != null) {
        onNavigateToTrack()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Book a Session — Step ${uiState.step} of 3") },
                navigationIcon = {
                    IconButton(onClick = {
                        if (uiState.step > 1) viewModel.prevStep() else onNavigateBack()
                    }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.Black,
                    titleContentColor = Color.White
                )
            )
        },
        containerColor = KineticNoirTheme.colors.background
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(KineticNoirTheme.colors.background)
        ) {
            // Step content container
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                AnimatedContent(targetState = uiState.step) { step ->
                    when (step) {
                        1 -> Step1ContactDetails(viewModel, uiState)
                        2 -> Step2DateAndLocation(viewModel, uiState)
                        3 -> Step3PackageSelection(viewModel, uiState)
                    }
                }
            }

            // Bottom action buttons
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                if (uiState.step > 1) {
                    OutlinedButton(
                        onClick = { viewModel.prevStep() },
                        modifier = Modifier
                            .weight(1f)
                            .height(50.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White),
                        border = ButtonDefaults.outlinedButtonBorder.copy(width = 1.dp)
                    ) {
                        Text("Back")
                    }
                }

                Button(
                    onClick = {
                        if (uiState.step < 3) viewModel.nextStep() else viewModel.submitBooking()
                    },
                    modifier = Modifier
                        .weight(1f)
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
                        if (uiState.isLoading) {
                            CircularProgressIndicator(color = Color.Black, modifier = Modifier.size(24.dp))
                        } else {
                            Text(
                                text = if (uiState.step < 3) "Next" else "Pay & Place Booking",
                                color = Color.Black,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun Step1ContactDetails(viewModel: BookingViewModel, state: BookingUiState) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("Your Information", style = MaterialTheme.typography.titleMedium, color = Color.White)
        
        OutlinedTextField(
            value = state.name,
            onValueChange = { viewModel.onNameChange(it) },
            label = { Text("Full Name") },
            modifier = Modifier.fillMaxWidth(),
            colors = textFieldColors()
        )

        OutlinedTextField(
            value = state.phone,
            onValueChange = { viewModel.onPhoneChange(it) },
            label = { Text("Contact Number") },
            modifier = Modifier.fillMaxWidth(),
            colors = textFieldColors()
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text("Brand DNA (Reels customization)", style = MaterialTheme.typography.titleMedium, color = Color.White)

        OutlinedTextField(
            value = state.brandLogo,
            onValueChange = { viewModel.onBrandLogoChange(it) },
            label = { Text("Brand Logo URL") },
            modifier = Modifier.fillMaxWidth(),
            colors = textFieldColors()
        )

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            OutlinedTextField(
                value = state.brandFont,
                onValueChange = { viewModel.onBrandFontChange(it) },
                label = { Text("Brand Font Name") },
                modifier = Modifier.weight(1f),
                colors = textFieldColors()
            )
            OutlinedTextField(
                value = state.brandColor,
                onValueChange = { viewModel.onBrandColorChange(it) },
                label = { Text("Brand Hex Color") },
                modifier = Modifier.weight(1f),
                colors = textFieldColors()
            )
        }

        OutlinedTextField(
            value = state.editorRequirements,
            onValueChange = { viewModel.onEditorRequirementsChange(it) },
            label = { Text("Special requirements for Editor") },
            modifier = Modifier.fillMaxWidth(),
            maxLines = 4,
            colors = textFieldColors()
        )
    }
}

@Composable
fun Step2DateAndLocation(viewModel: BookingViewModel, state: BookingUiState) {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("Schedule Session", style = MaterialTheme.typography.titleMedium, color = Color.White)

        OutlinedTextField(
            value = state.date,
            onValueChange = { viewModel.onDateChange(it) },
            label = { Text("Date (YYYY-MM-DD)") },
            placeholder = { Text("2026-07-20") },
            modifier = Modifier.fillMaxWidth(),
            colors = textFieldColors()
        )

        OutlinedTextField(
            value = state.timeSlot,
            onValueChange = { viewModel.onTimeSlotChange(it) },
            label = { Text("Time Slot") },
            placeholder = { Text("10:00 AM") },
            modifier = Modifier.fillMaxWidth(),
            colors = textFieldColors()
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text("Location", style = MaterialTheme.typography.titleMedium, color = Color.White)

        OutlinedTextField(
            value = state.location,
            onValueChange = { viewModel.onLocationChange(it) },
            label = { Text("Shoot Address") },
            modifier = Modifier.fillMaxWidth(),
            colors = textFieldColors()
        )
    }
}

@Composable
fun Step3PackageSelection(viewModel: BookingViewModel, state: BookingUiState) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("Select Package Summary", style = MaterialTheme.typography.titleMedium, color = Color.White)

        state.packages.forEach { pkg ->
            val isSelected = state.selectedPackage?.id == pkg.id
            val borderColor = if (isSelected) KineticNoirTheme.colors.neonPurple else KineticNoirTheme.colors.cardBorder

            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, borderColor, RoundedCornerShape(12.dp))
                    .clickable { viewModel.selectPackage(pkg) },
                colors = CardDefaults.cardColors(containerColor = KineticNoirTheme.colors.surfaceContainerLow)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(pkg.name, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = Color.White)
                        Text("₹${pkg.price}", style = MaterialTheme.typography.bodyMedium, color = KineticNoirTheme.colors.neonBlue)
                    }
                    RadioButton(
                        selected = isSelected,
                        onClick = { viewModel.selectPackage(pkg) },
                        colors = RadioButtonDefaults.colors(selectedColor = KineticNoirTheme.colors.neonPurple)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Summary details
        Text("Booking Summary", style = MaterialTheme.typography.titleMedium, color = Color.White)
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, KineticNoirTheme.colors.cardBorder, RoundedCornerShape(12.dp)),
            colors = CardDefaults.cardColors(containerColor = KineticNoirTheme.colors.surfaceContainerLow)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Name: ${state.name}", color = Color.Gray, style = MaterialTheme.typography.bodyMedium)
                Text("Phone: ${state.phone}", color = Color.Gray, style = MaterialTheme.typography.bodyMedium)
                Text("Date: ${state.date}", color = Color.Gray, style = MaterialTheme.typography.bodyMedium)
                Text("Time Slot: ${state.timeSlot}", color = Color.Gray, style = MaterialTheme.typography.bodyMedium)
                Text("Location: ${state.location}", color = Color.Gray, style = MaterialTheme.typography.bodyMedium, maxLines = 1)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun textFieldColors() = OutlinedTextFieldDefaults.colors(
    focusedBorderColor = KineticNoirTheme.colors.neonBlue,
    unfocusedBorderColor = KineticNoirTheme.colors.cardBorder,
    focusedLabelColor = KineticNoirTheme.colors.neonBlue,
    unfocusedLabelColor = Color.Gray,
    focusedTextColor = Color.White,
    unfocusedTextColor = Color.White
)
