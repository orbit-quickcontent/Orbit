package io.orbit.client.navigation

import androidx.compose.runtime.Composable
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import io.orbit.client.ui.auth.AuthScreen
import io.orbit.client.ui.auth.AuthViewModel
import io.orbit.client.ui.booking.BookingFlowScreen
import io.orbit.client.ui.home.HomeScreen

@Composable
fun NavGraph() {
    val navController = rememberNavController()
    val authViewModel: AuthViewModel = hiltViewModel()

    val startDest = if (authViewModel.uiState.value.loginSuccess) "home" else "auth"

    NavHost(
        navController = navController,
        startDestination = startDest
    ) {
        composable("auth") {
            AuthScreen(
                viewModel = authViewModel,
                onNavigateToHome = {
                    navController.navigate("home") {
                        popUpTo("auth") { inclusive = true }
                    }
                }
            )
        }

        composable("home") {
            HomeScreen(
                parentNavController = navController,
                onLogout = {
                    navController.navigate("auth") {
                        popUpTo("home") { inclusive = true }
                    }
                }
            )
        }

        composable("booking_flow") {
            BookingFlowScreen(
                onNavigateBack = { navController.popBackStack() },
                onNavigateToTrack = {
                    navController.navigate("home") {
                        popUpTo("booking_flow") { inclusive = true }
                    }
                }
            )
        }
    }
}
