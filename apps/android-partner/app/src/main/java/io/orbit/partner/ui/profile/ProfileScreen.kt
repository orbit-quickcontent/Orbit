package io.orbit.partner.ui.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.hilt.navigation.compose.hiltViewModel
import io.orbit.partner.ui.theme.LuminousDarkTheme

@Composable
fun ProfileScreen(
    viewModel: ProfileViewModel = hiltViewModel(),
    onLogout: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    var showLinkBankDialog by remember { mutableStateOf(false) }

    val user = uiState.user
    val profile = uiState.profile

    if (uiState.logoutComplete) {
        onLogout()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(LuminousDarkTheme.colors.background)
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Text(
            text = "KYC & Profile Profile",
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
            color = Color.White
        )

        uiState.error?.let {
            Text(text = it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodyMedium)
        }

        uiState.successMessage?.let {
            Text(text = it, color = LuminousDarkTheme.colors.neonGreen, style = MaterialTheme.typography.bodyMedium)
        }

        // Stats card
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, LuminousDarkTheme.colors.border, RoundedCornerShape(16.dp)),
            colors = CardDefaults.cardColors(containerColor = LuminousDarkTheme.colors.surfaceContainerLow)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = user?.name ?: "Creator",
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                    color = Color.White
                )
                Text(text = user?.email ?: "", style = MaterialTheme.typography.bodySmall, color = Color.Gray)

                Spacer(modifier = Modifier.height(16.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Column {
                        Text("Completed", style = MaterialTheme.typography.labelSmall, color = Color.Gray)
                        Text("${profile?.completedProjects ?: 0} Projects", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                    Column {
                        Text("KYC Status", style = MaterialTheme.typography.labelSmall, color = Color.Gray)
                        Text(
                            text = profile?.verificationStatus ?: "VERIFIED",
                            color = LuminousDarkTheme.colors.neonGreen,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // Bank details linkage card
        Text("Link Bank Details (Cashfree Verification)", style = MaterialTheme.typography.titleMedium, color = Color.White)
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, LuminousDarkTheme.colors.border, RoundedCornerShape(16.dp)),
            colors = CardDefaults.cardColors(containerColor = LuminousDarkTheme.colors.surfaceContainerLow)
        ) {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                if (profile?.encryptedAccountNumber != null) {
                    Text("Bank Account Linked", color = LuminousDarkTheme.colors.neonGreen, fontWeight = FontWeight.Bold)
                    Text("Holder: ${profile.accountHolderName}", color = Color.White)
                    Text("Bank Name: ${profile.bankName}", color = Color.White)
                    Text("IFSC Code: ${profile.ifscCode}", color = Color.White)
                } else {
                    Text("No bank details linked. Link bank account details via Cashfree penny-drop validator.", color = Color.Gray)
                }

                Spacer(modifier = Modifier.height(8.dp))

                Button(
                    onClick = { showLinkBankDialog = true },
                    modifier = Modifier.fillMaxWidth().height(48.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White)
                ) {
                    Text(
                        text = if (profile?.encryptedAccountNumber != null) "Update Details" else "Link Bank Account",
                        color = Color.Black,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        // Muted crimson Log out button
        Button(
            onClick = { viewModel.logout() },
            modifier = Modifier.fillMaxWidth().height(50.dp),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF93000A))
        ) {
            Text("Log Out", color = Color.White, fontWeight = FontWeight.Bold)
        }
    }

    if (showLinkBankDialog) {
        LinkBankDialog(
            onDismiss = { showLinkBankDialog = false },
            onSubmit = { name, acc, ifsc, bank, pan ->
                viewModel.linkBankAccount(name, acc, ifsc, bank, pan)
                showLinkBankDialog = false
            }
        )
    }
}

@Composable
fun LinkBankDialog(
    onDismiss: () -> Unit,
    onSubmit: (String, String, String, String, String?) -> Unit
) {
    var holderName by remember { mutableStateOf("") }
    var accountNo by remember { mutableStateOf("") }
    var ifscCode by remember { mutableStateOf("") }
    var bankName by remember { mutableStateOf("") }
    var panNumber by remember { mutableStateOf("") }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
                .border(1.dp, LuminousDarkTheme.colors.border, RoundedCornerShape(16.dp)),
            colors = CardDefaults.cardColors(containerColor = LuminousDarkTheme.colors.surfaceContainerLow)
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text("Link Bank Account", style = MaterialTheme.typography.titleLarge, color = Color.White)

                OutlinedTextField(
                    value = holderName,
                    onValueChange = { holderName = it },
                    label = { Text("Account Holder Name") },
                    modifier = Modifier.fillMaxWidth(),
                    colors = textFieldColors()
                )

                OutlinedTextField(
                    value = accountNo,
                    onValueChange = { accountNo = it },
                    label = { Text("Account Number") },
                    modifier = Modifier.fillMaxWidth(),
                    colors = textFieldColors()
                )

                OutlinedTextField(
                    value = ifscCode,
                    onValueChange = { ifscCode = it },
                    label = { Text("IFSC Code") },
                    modifier = Modifier.fillMaxWidth(),
                    colors = textFieldColors()
                )

                OutlinedTextField(
                    value = bankName,
                    onValueChange = { bankName = it },
                    label = { Text("Bank Name") },
                    modifier = Modifier.fillMaxWidth(),
                    colors = textFieldColors()
                )

                OutlinedTextField(
                    value = panNumber,
                    onValueChange = { panNumber = it },
                    label = { Text("PAN Card Number") },
                    modifier = Modifier.fillMaxWidth(),
                    colors = textFieldColors()
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedButton(onClick = onDismiss, modifier = Modifier.weight(1f)) {
                        Text("Cancel")
                    }
                    Button(
                        onClick = {
                            onSubmit(holderName, accountNo, ifscCode, bankName, panNumber.takeIf { it.isNotBlank() })
                        },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color.White)
                    ) {
                        Text("Validate", color = Color.Black, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun textFieldColors() = OutlinedTextFieldDefaults.colors(
    focusedBorderColor = LuminousDarkTheme.colors.neonGreen,
    unfocusedBorderColor = LuminousDarkTheme.colors.border,
    focusedTextColor = Color.White,
    unfocusedTextColor = Color.White,
    focusedLabelColor = LuminousDarkTheme.colors.neonGreen
)
