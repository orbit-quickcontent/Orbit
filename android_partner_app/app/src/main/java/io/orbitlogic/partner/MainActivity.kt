package io.orbitlogic.partner

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import io.orbitlogic.partner.data.models.*
import io.orbitlogic.partner.ui.auth.AuthScreen
import io.orbitlogic.partner.ui.earnings.EarningsScreen
import io.orbitlogic.partner.ui.home.HomeScreen
import io.orbitlogic.partner.ui.profile.ProfileScreen
import io.orbitlogic.partner.ui.theme.OrbitTheme
import io.orbitlogic.partner.ui.work.WorkDetailScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            OrbitTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    PartnerAppNavGraph()
                }
            }
        }
    }
}

@Composable
fun PartnerAppNavGraph() {
    val navController = rememberNavController()

    var partnerProfile by remember {
        mutableStateOf<PartnerProfile?>(null)
    }

    var availableBookingsList = remember {
        mutableStateListOf(
            BookingInfo(
                id = "booking_987",
                packageName = "Personalized Cinema",
                packagePrice = 1999,
                status = "PAID",
                location = "Noida Sector 62, Coordinate (28.62, 77.36)",
                bookingDate = "2026-07-10",
                timeSlot = "10:00 AM - 12:00 PM"
            )
        )
    }

    val transactionsList = remember {
        mutableStateListOf<PartnerTransaction>()
    }

    var activeJob by remember {
        mutableStateOf<BookingInfo?>(null)
    }

    NavHost(navController = navController, startDestination = "auth") {
        composable("auth") {
            AuthScreen(
                onLoginSuccess = { email ->
                    partnerProfile = PartnerProfile(
                        id = "partner_123",
                        userId = "user_456",
                        name = "Filmmaker Deadpool",
                        email = email,
                        phone = "+91 9898989898",
                        location = "Noida NCR",
                        availability = true,
                        isVerified = true,
                        verificationStatus = "VERIFIED",
                        wallet = PartnerWallet(balance = 0.0, pendingClearance = 0.0, totalWithdrawn = 0.0)
                    )
                    navController.navigate("home") {
                        popUpTo("auth") { inclusive = true }
                    }
                }
            )
        }

        composable("home") {
            partnerProfile?.let { profile ->
                HomeScreen(
                    profile = profile,
                    availableJobs = availableBookingsList,
                    onAcceptJob = { job ->
                        activeJob = job
                        availableBookingsList.remove(job)
                        navController.navigate("work_detail")
                    },
                    onNavigateToTab = { tab ->
                        when (tab) {
                            "home" -> {}
                            "earnings" -> navController.navigate("earnings")
                            "profile" -> navController.navigate("profile")
                        }
                    }
                )
            }
        }

        composable("work_detail") {
            activeJob?.let { job ->
                WorkDetailScreen(
                    job = job,
                    onCompleteJob = { completedJob ->
                        // Add flat ₹700 payout salary on completion
                        partnerProfile?.let { profile ->
                            partnerProfile = profile.copy(
                                wallet = profile.wallet.copy(
                                    balance = profile.wallet.balance + 700.0
                                )
                            )
                        }
                        
                        // Add history log transaction
                        transactionsList.add(
                            PartnerTransaction(
                                id = "tx_${System.currentTimeMillis()}",
                                bookingId = completedJob.id,
                                type = "EARNING",
                                amount = 700.0,
                                status = "COMPLETED",
                                description = "Completed: ${completedJob.packageName}",
                                createdAt = "Today"
                            )
                        )

                        activeJob = null
                        navController.navigate("home") {
                            popUpTo("home") { inclusive = true }
                        }
                    },
                    onBack = {
                        navController.popBackStack()
                    }
                )
            }
        }

        composable("earnings") {
            partnerProfile?.let { profile ->
                EarningsScreen(
                    profile = profile,
                    transactions = transactionsList,
                    onWithdrawalRequest = { amount ->
                        // Process withdrawal request and deduct balance
                        partnerProfile = profile.copy(
                            wallet = profile.wallet.copy(
                                balance = profile.wallet.balance - amount,
                                totalWithdrawn = profile.wallet.totalWithdrawn + amount
                            )
                        )
                        transactionsList.add(
                            PartnerTransaction(
                                id = "tx_${System.currentTimeMillis()}",
                                type = "WITHDRAWAL",
                                amount = amount,
                                status = "COMPLETED",
                                description = "Bank Withdrawal Transfer",
                                createdAt = "Just Now"
                            )
                        )
                    },
                    onBack = {
                        navController.navigate("home") {
                            popUpTo("home") { inclusive = true }
                        }
                    }
                )
            }
        }

        composable("profile") {
            partnerProfile?.let { profile ->
                ProfileScreen(
                    profile = profile,
                    onLinkBank = { holder, account, ifsc ->
                        partnerProfile = profile.copy(
                            bankAccount = BankAccount(
                                id = "bank_999",
                                bankName = "HDFC Bank",
                                accountNumber = account,
                                ifscCode = ifsc,
                                accountHolderName = holder,
                                isVerified = true,
                                linkedAt = "Just Now"
                            )
                        )
                    },
                    onBack = {
                        navController.navigate("home") {
                            popUpTo("home") { inclusive = true }
                        }
                    }
                )
            }
        }
    }
}
