package io.orbit.partner.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

// ============================================================
// Luminous Dark Material3 Theme
// ============================================================

private val LuminousDarkColorScheme = darkColorScheme(
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

val PartnerGradient = Brush.linearGradient(
    colors = listOf(GradientGreen, GradientPurple)
)

data class PartnerColors(
    val background: Color = Background,
    val surface: Color = Surface,
    val surfaceContainerLow: Color = SurfaceContainerLow,
    val surfaceContainerHigh: Color = SurfaceContainerHigh,
    val border: Color = Outline,
    val partnerGradient: Brush = PartnerGradient,
    val statusOnline: Color = StatusOnline,
    val statusOffline: Color = StatusOffline,
    val statusPending: Color = StatusPending,
    val neonGreen: Color = GradientGreen,
    val neonPurple: Color = GradientPurple
)

val LocalPartnerColors = staticCompositionLocalOf { PartnerColors() }

object LuminousDarkTheme {
    val colors: PartnerColors
        @Composable get() = LocalPartnerColors.current
}

@Composable
fun LuminousDarkTheme(
    content: @Composable () -> Unit
) {
    CompositionLocalProvider(LocalPartnerColors provides PartnerColors()) {
        MaterialTheme(
            colorScheme = LuminousDarkColorScheme,
            typography = PartnerTypography,
            content = content
        )
    }
}
