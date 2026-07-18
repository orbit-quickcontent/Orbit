package io.orbit.client.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import io.orbit.client.ui.theme.KineticNoirTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    parentNavController: NavHostController,
    onLogout: () -> Unit
) {
    val childNavController = rememberNavController()
    var selectedItem by remember { mutableStateOf(0) }

    val items = listOf("Home", "Packages", "Track", "Profile")
    val icons = listOf(
        Icons.Default.Home,
        Icons.Default.List,
        Icons.Default.Info,
        Icons.Default.Person
    )

    Scaffold(
        bottomBar = {
            NavigationBar(
                modifier = Modifier
                    .padding(16.dp)
                    .border(
                        width = 1.dp,
                        color = KineticNoirTheme.colors.cardBorder,
                        shape = RoundedCornerShape(24.dp)
                    )
                    .background(Color.Transparent),
                containerColor = Color.Black.copy(alpha = 0.7f),
                tonalElevation = 8.dp
            ) {
                items.forEachIndexed { index, item ->
                    NavigationBarItem(
                        icon = { Icon(icons[index], contentDescription = item) },
                        label = { Text(item) },
                        selected = selectedItem == index,
                        onClick = {
                            selectedItem = index
                            when (index) {
                                0 -> childNavController.navigate("feed") { popUpTo(0) }
                                1 -> childNavController.navigate("packages") { popUpTo(0) }
                                2 -> childNavController.navigate("track") { popUpTo(0) }
                                3 -> childNavController.navigate("profile") { popUpTo(0) }
                            }
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = KineticNoirTheme.colors.neonBlue,
                            unselectedIconColor = Color.Gray,
                            selectedTextColor = KineticNoirTheme.colors.neonBlue,
                            unselectedTextColor = Color.Gray,
                            indicatorColor = Color.Transparent
                        )
                    )
                }
            }
        },
        containerColor = KineticNoirTheme.colors.background
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            NavHost(
                navController = childNavController,
                startDestination = "feed"
            ) {
                composable("feed") {
                    HomeFeedScreen(
                        onNavigateToBooking = { parentNavController.navigate("booking_flow") },
                        onNavigateToTrack = {
                            selectedItem = 2
                            childNavController.navigate("track") { popUpTo(0) }
                        }
                    )
                }
                composable("packages") {
                    io.orbit.client.ui.packages.PackagesScreen(
                        onSelectPackage = { parentNavController.navigate("booking_flow") }
                    )
                }
                composable("track") {
                    io.orbit.client.ui.tracking.TrackingScreen()
                }
                composable("profile") {
                    io.orbit.client.ui.profile.ProfileScreen(
                        onLogout = onLogout
                    )
                }
            }
        }
    }
}
