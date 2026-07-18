package io.orbit.client.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// ============================================================
// Kinetic Noir Typography
// Montserrat (Headlines) | Plus Jakarta Sans (Body) | Space Grotesk (Labels)
// ============================================================

// Note: In a real project, add the .ttf files to res/font/
// These can be downloaded from Google Fonts and added to the assets

// Using system-safe fallbacks that match the design intent
// Replace FontFamily.Default with actual font resources when TTF files are added:
// val MontserratFamily = FontFamily(
//     Font(R.font.montserrat_regular, FontWeight.Normal),
//     Font(R.font.montserrat_semibold, FontWeight.SemiBold),
//     Font(R.font.montserrat_bold, FontWeight.Bold),
//     Font(R.font.montserrat_extrabold, FontWeight.ExtraBold),
// )
// val PlusJakartaSansFamily = FontFamily(
//     Font(R.font.plus_jakarta_sans_regular, FontWeight.Normal),
//     Font(R.font.plus_jakarta_sans_medium, FontWeight.Medium),
//     Font(R.font.plus_jakarta_sans_semibold, FontWeight.SemiBold),
//     Font(R.font.plus_jakarta_sans_bold, FontWeight.Bold),
// )
// val SpaceGroteskFamily = FontFamily(
//     Font(R.font.space_grotesk_regular, FontWeight.Normal),
//     Font(R.font.space_grotesk_bold, FontWeight.Bold),
// )

val MontserratFamily = FontFamily.Default      // replace with actual font
val PlusJakartaSansFamily = FontFamily.Default  // replace with actual font
val SpaceGroteskFamily = FontFamily.Default     // replace with actual font

val OrbitTypography = Typography(
    // Display - Hero sections (48px → 32px mobile)
    displayLarge = TextStyle(
        fontFamily = MontserratFamily,
        fontWeight = FontWeight.ExtraBold,
        fontSize = 48.sp,
        lineHeight = 52.8.sp,
        letterSpacing = (-0.02).sp
    ),
    displayMedium = TextStyle(
        fontFamily = MontserratFamily,
        fontWeight = FontWeight.ExtraBold,
        fontSize = 32.sp,
        lineHeight = 38.4.sp,
        letterSpacing = (-0.02).sp
    ),
    // Headlines
    headlineLarge = TextStyle(
        fontFamily = MontserratFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 28.sp,
        lineHeight = 36.4.sp
    ),
    headlineMedium = TextStyle(
        fontFamily = MontserratFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 24.sp,
        lineHeight = 31.2.sp
    ),
    headlineSmall = TextStyle(
        fontFamily = MontserratFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 20.sp,
        lineHeight = 26.sp
    ),
    // Titles
    titleLarge = TextStyle(
        fontFamily = PlusJakartaSansFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 18.sp,
        lineHeight = 27.sp
    ),
    titleMedium = TextStyle(
        fontFamily = PlusJakartaSansFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 16.sp,
        lineHeight = 24.sp
    ),
    titleSmall = TextStyle(
        fontFamily = PlusJakartaSansFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 14.sp,
        lineHeight = 21.sp
    ),
    // Body
    bodyLarge = TextStyle(
        fontFamily = PlusJakartaSansFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 18.sp,
        lineHeight = 28.8.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = PlusJakartaSansFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 21.sp
    ),
    bodySmall = TextStyle(
        fontFamily = PlusJakartaSansFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp,
        lineHeight = 18.sp
    ),
    // Labels (Space Grotesk)
    labelLarge = TextStyle(
        fontFamily = SpaceGroteskFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 14.sp,
        lineHeight = 14.sp,
        letterSpacing = 0.1.sp
    ),
    labelMedium = TextStyle(
        fontFamily = SpaceGroteskFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 12.sp,
        lineHeight = 12.sp,
        letterSpacing = 0.1.sp
    ),
    labelSmall = TextStyle(
        fontFamily = SpaceGroteskFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 10.sp,
        lineHeight = 10.sp,
        letterSpacing = 0.1.sp
    )
)
