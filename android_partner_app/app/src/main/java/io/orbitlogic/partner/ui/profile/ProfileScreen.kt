package io.orbitlogic.partner.ui.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.orbitlogic.partner.data.models.BankAccount
import io.orbitlogic.partner.data.models.PartnerProfile
import io.orbitlogic.partner.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    profile: PartnerProfile,
    onLinkBank: (holder: String, account: String, ifsc: String) -> Unit,
    onBack: () -> Unit
) {
    var showDialog by remember { mutableStateOf(false) }
    var holderName by remember { mutableStateOf("") }
    var accountNumber by remember { mutableStateOf("") }
    var ifscCode by remember { mutableStateOf("") }

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
            Text("Partner Profile", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.W900)
            Spacer(modifier = Modifier.width(48.dp))
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Profile Deadpool Badge Card
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(DarkSurface, RoundedCornerShape(16.dp))
                .border(1.dp, BorderColor, RoundedCornerShape(16.dp))
                .padding(20.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Box(
                    modifier = Modifier
                        .size(72.dp)
                        .background(Color(0xFFE50914), CircleShape)
                        .border(2.dp, Color.Black, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text("DP", color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.Bold)
                }
                Spacer(modifier = Modifier.height(12.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(profile.name, color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.W900)
                    Spacer(modifier = Modifier.width(6.dp))
                    Icon(imageVector = Icons.Default.Verified, contentDescription = null, tint = Color(0xFF2ECC71), modifier = Modifier.size(18.dp))
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(profile.email, color = TextSecondary, fontSize = 12.sp)
                Text(profile.phone, color = TextSecondary, fontSize = 12.sp)
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Link Bank status section
        Text("Payout Options", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(12.dp))

        if (profile.bankAccount == null) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DarkSurface, RoundedCornerShape(16.dp))
                    .border(1.dp, BorderColor, RoundedCornerShape(16.dp))
                    .padding(20.dp)
            ) {
                Column {
                    Text("No Bank Account Linked", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text("Link your account to receive immediate automated ₹700 completed gig withdrawals.", color = TextSecondary, fontSize = 11.sp)
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = { showDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = PartnerPurple),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text("Link Bank Account", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            }
        } else {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DarkSurface, RoundedCornerShape(16.dp))
                    .border(1.dp, BorderColor, RoundedCornerShape(16.dp))
                    .padding(20.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Linked Bank Details", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                        Icon(imageVector = Icons.Default.CheckCircle, contentDescription = null, tint = Color(0xFF2ECC71))
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                        Text("Bank Name", color = TextSecondary, fontSize = 12.sp)
                        Text(profile.bankAccount.bankName, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                        Text("Account Number", color = TextSecondary, fontSize = 12.sp)
                        Text("******" + profile.bankAccount.accountNumber.takeLast(4), color = Color.White, fontSize = 12.sp)
                    }
                }
            }
        }

        // Pop up Dialog for Payout Setup Form
        if (showDialog) {
            AlertDialog(
                onDismissRequest = { showDialog = false },
                title = { Text("Link Bank Account", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White) },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text("Verified instantly via a ₹1 penny drop mock check.", color = TextSecondary, fontSize = 11.sp)
                        TextField(
                            value = holderName,
                            onValueChange = { holderName = it },
                            label = { Text("Account Holder Name") },
                            colors = TextFieldDefaults.colors(focusedContainerColor = DarkBackground, unfocusedContainerColor = DarkBackground, focusedTextColor = Color.White, unfocusedTextColor = Color.White)
                        )
                        TextField(
                            value = accountNumber,
                            onValueChange = { accountNumber = it },
                            label = { Text("Account Number") },
                            colors = TextFieldDefaults.colors(focusedContainerColor = DarkBackground, unfocusedContainerColor = DarkBackground, focusedTextColor = Color.White, unfocusedTextColor = Color.White)
                        )
                        TextField(
                            value = ifscCode,
                            onValueChange = { ifscCode = it },
                            label = { Text("IFSC Code") },
                            colors = TextFieldDefaults.colors(focusedContainerColor = DarkBackground, unfocusedContainerColor = DarkBackground, focusedTextColor = Color.White, unfocusedTextColor = Color.White)
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            if (holderName.isNotEmpty() && accountNumber.isNotEmpty()) {
                                onLinkBank(holderName, accountNumber, ifscCode)
                                showDialog = false
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = PartnerPurple)
                    ) {
                        Text("Link Now")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showDialog = false }) {
                        Text("Cancel", color = Color.White)
                    }
                },
                containerColor = DarkSurface
            )
        }
    }
}
