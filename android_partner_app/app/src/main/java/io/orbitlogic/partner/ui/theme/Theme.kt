package io.orbitlogic.partner.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val DarkBackground = Color(0xFF000000)
val DarkSurface = Color(0xFF0E0E10)
val PartnerPurple = Color(0xFFA020F0)
val PartnerGradientStart = Color(0xFFA020F0)
val PartnerGradientEnd = Color(0xFF7010C0)
val BorderColor = Color(0xFF1E1E24)
val TextPrimary = Color(0xFFFFFFFF)
val TextSecondary = Color(0xFF8E8E93)

private val DarkColorScheme = darkColorScheme(
    primary = PartnerPurple,
    secondary = PartnerPurple,
    background = DarkBackground,
    surface = DarkSurface,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onBackground = TextPrimary,
    onSurface = TextPrimary
)

@Composable
fun OrbitTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
