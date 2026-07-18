package io.orbit.client.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Brush

// ============================================================
// Kinetic Noir — Material3 Dark Color Scheme
// ============================================================

private val KineticNoirColorScheme = darkColorScheme(
    primary = Primary,
    onPrimary = OnPrimary,
    primaryContainer = PrimaryContainer,
    onPrimaryContainer = OnPrimaryContainer,
    inversePrimary = InversePrimary,
    secondary = Secondary,
    onSecondary = OnSecondary,
    secondaryContainer = SecondaryContainer,
    onSecondaryContainer = OnSecondaryContainer,
    tertiary = Tertiary,
    onTertiary = OnTertiary,
    tertiaryContainer = TertiaryContainer,
    onTertiaryContainer = OnTertiaryContainer,
    error = Error,
    onError = OnError,
    errorContainer = ErrorContainer,
    onErrorContainer = OnErrorContainer,
    background = Background,
    onBackground = OnSurface,
    surface = Surface,
    onSurface = OnSurface,
    onSurfaceVariant = OnSurfaceVariant,
    inverseSurface = InverseSurface,
    inverseOnSurface = InverseOnSurface,
    surfaceTint = SurfaceTint,
    outline = Outline,
    outlineVariant = OutlineVariant,
    surfaceVariant = SurfaceContainerHigh,
)

// Gradient brush for primary CTA buttons and active states
val PrimaryGradient = Brush.linearGradient(
    colors = listOf(GradientBlue, GradientPurple)
)

val BackgroundGradient = Brush.radialGradient(
    colors = listOf(SurfaceContainer, Background),
    radius = 800f
)

// Expose custom colors via CompositionLocal
data class OrbitColors(
    val background: androidx.compose.ui.graphics.Color = Background,
    val surface: androidx.compose.ui.graphics.Color = Surface,
    val surfaceContainerLow: androidx.compose.ui.graphics.Color = SurfaceContainerLow,
    val surfaceContainerHigh: androidx.compose.ui.graphics.Color = SurfaceContainerHigh,
    val cardBorder: androidx.compose.ui.graphics.Color = CardBorder,
    val primaryGradient: Brush = PrimaryGradient,
    val statusOnline: androidx.compose.ui.graphics.Color = StatusOnline,
    val statusError: androidx.compose.ui.graphics.Color = StatusError,
    val statusWarning: androidx.compose.ui.graphics.Color = StatusWarning,
    val neonBlue: androidx.compose.ui.graphics.Color = GradientBlue,
    val neonPurple: androidx.compose.ui.graphics.Color = GradientPurple,
)

val LocalOrbitColors = staticCompositionLocalOf { OrbitColors() }

object KineticNoirTheme {
    val colors: OrbitColors
        @Composable get() = LocalOrbitColors.current
}

@Composable
fun KineticNoirTheme(
    content: @Composable () -> Unit
) {
    CompositionLocalProvider(LocalOrbitColors provides OrbitColors()) {
        MaterialTheme(
            colorScheme = KineticNoirColorScheme,
            typography = OrbitTypography,
            content = content
        )
    }
}
