package io.orbitlogic.client

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
import io.orbitlogic.client.data.models.BookingInfo
import io.orbitlogic.client.data.models.PackageInfo
import io.orbitlogic.client.data.models.UserProfile
import io.orbitlogic.client.ui.auth.AuthScreen
import io.orbitlogic.client.ui.booking.BookingScreen
import io.orbitlogic.client.ui.home.HomeScreen
import io.orbitlogic.client.ui.theme.OrbitTheme
import io.orbitlogic.client.ui.tracking.TrackingScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            OrbitTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    ClientAppNavGraph()
                }
            }
        }
    }
}

@Composable
fun ClientAppNavGraph() {
    val navController = rememberNavController()
    
    // In-memory mock profiles and package options mapping the Node.js backend patterns
    var currentUser by remember {
        mutableStateOf<UserProfile?>(null)
    }

    val mockPackagesList = remember {
        listOf(
            PackageInfo(
                id = "pkg_personal",
                name = "Personalized Cinema",
                tier = "Personal",
                price = 1999,
                focus = "Cinematic Reels & Vlogs",
                deliveryTime = "60 Minutes Guarantee",
                features = listOf("60 min shoot", "4K HDR quality", "Custom music backing"),
                popular = true
            ),
            PackageInfo(
                id = "pkg_professional",
                name = "Professional Production",
                tier = "Professional",
                price = 4999,
                focus = "Brand Ad & Ads Production",
                deliveryTime = "24 Hour Delivery",
                features = listOf("3 Hours shoot", "Cinematic drone shots", "Pro sound design"),
                popular = false
            )
        )
    }

    var currentActiveBooking by remember {
        mutableStateOf<BookingInfo?>(null)
    }

    NavHost(navController = navController, startDestination = "auth") {
        composable("auth") {
            AuthScreen(
                onLoginSuccess = { email ->
                    currentUser = UserProfile(
                        id = "user_123",
                        name = "Utkarsh Sharma",
                        email = email,
                        phone = "+91 9988776655"
                    )
                    navController.navigate("home") {
                        popUpTo("auth") { inclusive = true }
                    }
                }
            )
        }

        composable("home") {
            currentUser?.let { user ->
                HomeScreen(
                    user = user,
                    packages = mockPackagesList,
                    onActionSelected = { action ->
                        when (action) {
                            "booking" -> navController.navigate("booking")
                            "tracking" -> {
                                if (currentActiveBooking == null) {
                                    // Create a mock active booking if none exists for quick demo testing
                                    currentActiveBooking = BookingInfo(
                                        id = "booking_987",
                                        userId = "user_123",
                                        packageId = "pkg_personal",
                                        packageName = "Personalized Cinema",
                                        packagePrice = 1999,
                                        status = "SHOOTING",
                                        paymentStatus = "PAID",
                                        bookingDate = "2026-07-10",
                                        timeSlot = "10:00 AM - 12:00 PM",
                                        location = "Noida Sector 62, Coordinate (28.62, 77.36)"
                                    )
                                }
                                navController.navigate("tracking")
                            }
                        }
                    }
                )
            }
        }

        composable("booking") {
            BookingScreen(
                packages = mockPackagesList,
                onBookingComplete = { packageId, location, date, slot ->
                    val pkg = mockPackagesList.first { it.id == packageId }
                    currentActiveBooking = BookingInfo(
                        id = "booking_987",
                        userId = "user_123",
                        packageId = packageId,
                        packageName = pkg.name,
                        packagePrice = pkg.price,
                        status = "PAID",
                        paymentStatus = "PAID",
                        bookingDate = date,
                        timeSlot = slot,
                        location = location
                    )
                    navController.navigate("tracking") {
                        popUpTo("home")
                    }
                },
                onBack = {
                    navController.popBackStack()
                }
            )
        }

        composable("tracking") {
            val booking = currentActiveBooking ?: BookingInfo(
                id = "booking_987",
                userId = "user_123",
                packageId = "pkg_personal",
                packageName = "Personalized Cinema",
                packagePrice = 1999,
                status = "PAID",
                paymentStatus = "PAID",
                bookingDate = "2026-07-10",
                timeSlot = "10:00 AM - 12:00 PM",
                location = "Noida Sector 62, Coordinate (28.62, 77.36)"
            )
            TrackingScreen(
                booking = booking,
                onBack = {
                    navController.navigate("home") {
                        popUpTo("home") { inclusive = true }
                    }
                }
            )
        }
    }
}
