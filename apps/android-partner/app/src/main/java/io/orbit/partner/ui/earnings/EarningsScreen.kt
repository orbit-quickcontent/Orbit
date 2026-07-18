package io.orbit.partner.ui.earnings

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.hilt.navigation.compose.hiltViewModel
import io.orbit.partner.domain.model.Transaction
import io.orbit.partner.ui.theme.LuminousDarkTheme

@Composable
fun EarningsScreen(
    viewModel: EarningsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var showWithdrawDialog by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(LuminousDarkTheme.colors.background)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Text(
            text = "Earnings Desk",
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
            color = Color.White
        )

        uiState.error?.let {
            Text(text = it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodyMedium)
        }

        uiState.successMessage?.let {
            Text(text = it, color = LuminousDarkTheme.colors.neonGreen, style = MaterialTheme.typography.bodyMedium)
        }

        // Wallet stats overview
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, LuminousDarkTheme.colors.border, RoundedCornerShape(16.dp)),
            colors = CardDefaults.cardColors(containerColor = LuminousDarkTheme.colors.surfaceContainerLow)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text("Wallet Balance", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                Text(
                    "₹${uiState.walletBalance}",
                    style = MaterialTheme.typography.displayMedium.copy(fontWeight = FontWeight.ExtraBold),
                    color = LuminousDarkTheme.colors.neonGreen
                )

                Spacer(modifier = Modifier.height(16.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Column {
                        Text("Pending", style = MaterialTheme.typography.labelSmall, color = Color.Gray)
                        Text("₹${uiState.pendingClearance}", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                    Column {
                        Text("Total Withdrawn", style = MaterialTheme.typography.labelSmall, color = Color.Gray)
                        Text("₹${uiState.totalWithdrawn}", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                Button(
                    onClick = { showWithdrawDialog = true },
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White)
                ) {
                    Text("Request Withdrawal", color = Color.Black, fontWeight = FontWeight.Bold)
                }
            }
        }

        // Transactions list
        Text("Transaction History", style = MaterialTheme.typography.titleMedium, color = Color.White)
        
        LazyColumn(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(uiState.transactions) { tx ->
                TransactionRow(tx)
            }
        }
    }

    if (showWithdrawDialog) {
        WithdrawDialog(
            maxAmount = uiState.walletBalance,
            onDismiss = { showWithdrawDialog = false },
            onSubmit = { amount ->
                viewModel.withdrawEarnings(amount)
                showWithdrawDialog = false
            }
        )
    }
}

@Composable
fun TransactionRow(tx: Transaction) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, LuminousDarkTheme.colors.border, RoundedCornerShape(12.dp)),
        colors = CardDefaults.cardColors(containerColor = LuminousDarkTheme.colors.surfaceContainerLow)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(tx.description ?: "Earnings Credit", color = Color.White, style = MaterialTheme.typography.titleMedium)
                Text(tx.createdAt, color = Color.Gray, style = MaterialTheme.typography.bodySmall)
            }
            Text(
                text = "${if (tx.amount > 0) "+" else ""}₹${tx.amount}",
                color = if (tx.amount > 0) LuminousDarkTheme.colors.neonGreen else Color.White,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
fun WithdrawDialog(
    maxAmount: Double,
    onDismiss: () -> Unit,
    onSubmit: (Double) -> Unit
) {
    var amountStr by remember { mutableStateOf("") }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
                .border(1.dp, LuminousDarkTheme.colors.border, RoundedCornerShape(16.dp)),
            colors = CardDefaults.cardColors(containerColor = LuminousDarkTheme.colors.surfaceContainerLow)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text("Confirm Bank Withdrawal", style = MaterialTheme.typography.titleLarge, color = Color.White)
                Text("Limit available: ₹$maxAmount", style = MaterialTheme.typography.bodySmall, color = Color.Gray)

                OutlinedTextField(
                    value = amountStr,
                    onValueChange = { amountStr = it },
                    label = { Text("Amount (INR)") },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = LuminousDarkTheme.colors.neonGreen,
                        unfocusedBorderColor = LuminousDarkTheme.colors.border,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedLabelColor = LuminousDarkTheme.colors.neonGreen
                    )
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
                            val amt = amountStr.toDoubleOrNull()
                            if (amt != null) onSubmit(amt)
                        },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color.White)
                    ) {
                        Text("Withdraw", color = Color.Black, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
