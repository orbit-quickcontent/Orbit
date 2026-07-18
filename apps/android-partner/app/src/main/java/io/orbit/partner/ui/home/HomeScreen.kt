package io.orbit.partner.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Assignment
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Payments
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import io.orbit.partner.ui.theme.LuminousDarkTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    parentNavController: NavHostController,
    onLogout: () -> Unit
) {
    val childNavController = rememberNavController()
    val homeViewModel: HomeViewModel = hiltViewModel()
    val uiState by homeViewModel.uiState.collectAsState()

    var selectedItem by remember { mutableStateOf(0) }

    val items = listOf("Gigs", "Work", "Earnings", "Profile")
    val icons = listOf(
        Icons.Default.Assignment,
        Icons.Default.CheckCircle,
        Icons.Default.Payments,
        Icons.Default.Person
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(end = 16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("ORBIT CREATOR", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = if (uiState.isOnline) "ONLINE" else "OFFLINE",
                                style = MaterialTheme.typography.labelMedium,
                                color = if (uiState.isOnline) LuminousDarkTheme.colors.neonGreen else Color.Gray,
                                modifier = Modifier.padding(end = 8.dp)
                            )
                            Switch(
                                checked = uiState.isOnline,
                                onCheckedChange = { homeViewModel.togglePresence() },
                                colors = SwitchDefaults.colors(
                                    checkedThumbColor = LuminousDarkTheme.colors.neonGreen,
                                    checkedTrackColor = LuminousDarkTheme.colors.neonGreen.copy(alpha = 0.3f),
                                    uncheckedThumbColor = Color.Gray,
                                    uncheckedTrackColor = Color.DarkGray
                                )
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.Black,
                    titleContentColor = Color.White
                )
            )
        },
        bottomBar = {
            NavigationBar(
                modifier = Modifier
                    .padding(16.dp)
                    .border(
                        width = 1.dp,
                        color = LuminousDarkTheme.colors.border,
                        shape = RoundedCornerShape(24.dp)
                    )
                    .background(Color.Transparent),
                containerColor = Color.Black.copy(alpha = 0.8f),
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
                                0 -> childNavController.navigate("gigs") { popUpTo(0) }
                                1 -> childNavController.navigate("work") { popUpTo(0) }
                                2 -> childNavController.navigate("earnings") { popUpTo(0) }
                                3 -> childNavController.navigate("profile") { popUpTo(0) }
                            }
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = LuminousDarkTheme.colors.neonGreen,
                            unselectedIconColor = Color.Gray,
                            selectedTextColor = LuminousDarkTheme.colors.neonGreen,
                            unselectedTextColor = Color.Gray,
                            indicatorColor = Color.Transparent
                        )
                    )
                }
            }
        },
        containerColor = LuminousDarkTheme.colors.background
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            NavHost(
                navController = childNavController,
                startDestination = "gigs"
            ) {
                composable("gigs") {
                    AvailableGigsScreen(
                        viewModel = homeViewModel,
                        onNavigateToWork = {
                            selectedItem = 1
                            childNavController.navigate("work") { popUpTo(0) }
                        }
                    )
                }
                composable("work") {
                    io.orbit.partner.ui.work.WorkDetailScreen()
                }
                composable("earnings") {
                    io.orbit.partner.ui.earnings.EarningsScreen()
                }
                composable("profile") {
                    io.orbit.partner.ui.profile.ProfileScreen(
                        onLogout = onLogout
                    )
                }
            }
        }
    }
}
