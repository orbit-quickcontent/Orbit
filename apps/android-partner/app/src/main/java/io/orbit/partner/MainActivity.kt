package io.orbit.partner

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import dagger.hilt.android.AndroidEntryPoint
import io.orbit.partner.navigation.NavGraph
import io.orbit.partner.ui.theme.LuminousDarkTheme

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            LuminousDarkTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = LuminousDarkTheme.colors.background
                ) {
                    NavGraph()
                }
            }
        }
    }
}
