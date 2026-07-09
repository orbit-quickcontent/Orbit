package io.orbitlogic.partner.ui.earnings

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.orbitlogic.partner.data.models.PartnerProfile
import io.orbitlogic.partner.data.models.PartnerTransaction
import io.orbitlogic.partner.ui.theme.*

@Composable
fun EarningsScreen(
    profile: PartnerProfile,
    transactions: List<PartnerTransaction>,
    onWithdrawalRequest: (Double) -> Unit,
    onBack: () -> Unit
) {
    var amountText by remember { mutableStateOf("") }
    var isSubmitting by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(imageVector = Icons.Default.ArrowBack, contentDescription = null, tint = Color.White)
            }
            Text("Earning Details", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.W900)
            Spacer(modifier = Modifier.width(48.dp))
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Wallet Card (matches HSL styling layout!)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    brush = Brush.linearGradient(listOf(PartnerPurple.copy(alpha = 0.15f), Color.Black)),
                    shape = RoundedCornerShape(20.dp)
                )
                .border(1.dp, BorderColor, RoundedCornerShape(20.dp))
                .padding(24.dp)
        ) {
            Column {
                Text("AVAILABLE WALLET BALANCE", color = TextSecondary, fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
                Spacer(modifier = Modifier.height(8.dp))
                Text("₹${profile.wallet.balance.toInt()}", color = Color.White, fontSize = 36.sp, fontWeight = FontWeight.W900)
                Spacer(modifier = Modifier.height(20.dp))
                
                // Quick Withdraw form
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = {
                            if (profile.wallet.balance >= 700.0) {
                                onWithdrawalRequest(profile.wallet.balance)
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                        modifier = Modifier.fillMaxWidth().height(48.dp),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Default.AccountBalance, contentDescription = null, tint = Color.Black)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Withdraw to Bank", color = Color.Black, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Stats grid
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            StatsCard(label = "Pending Clearance", value = "₹${profile.wallet.pendingClearance.toInt()}", modifier = Modifier.weight(1f))
            StatsCard(label = "Total Withdrawn", value = "₹${profile.wallet.totalWithdrawn.toInt()}", modifier = Modifier.weight(1f))
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Payout history list
        Text("Payout History", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(12.dp))

        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(transactions) { tx ->
                TransactionItem(tx)
            }
        }
    }
}

@Composable
fun StatsCard(label: String, value: String, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .background(DarkSurface, RoundedCornerShape(16.dp))
            .border(1.dp, BorderColor, RoundedCornerShape(16.dp))
            .padding(16.dp)
    ) {
        Column {
            Text(label, color = TextSecondary, fontSize = 10.sp)
            Spacer(modifier = Modifier.height(6.dp))
            Text(value, color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.W900)
        }
    }
}

@Composable
fun TransactionItem(tx: PartnerTransaction) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(DarkSurface, RoundedCornerShape(12.dp))
            .border(1.dp, BorderColor, RoundedCornerShape(12.dp))
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(tx.description, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(4.dp))
                Text(tx.createdAt, color = TextSecondary, fontSize = 10.sp)
            }
            Text(
                text = if (tx.type == "EARNING") "+₹${tx.amount.toInt()}" else "-₹${tx.amount.toInt()}",
                color = if (tx.type == "EARNING") Color(0xFF2ECC71) else Color(0xFFE74C3C),
                fontSize = 14.sp,
                fontWeight = FontWeight.W900
            )
        }
    }
}
