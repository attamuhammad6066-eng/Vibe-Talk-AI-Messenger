package com.amdigitalhub.vibetalk.core.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = VibeEmeraldPrimary,
    onPrimary = ObsidianDarkBg,
    secondary = VibeCyanAccent,
    onSecondary = ObsidianDarkBg,
    tertiary = VibeVioletAura,
    background = ObsidianDarkBg,
    surface = ObsidianDarkSurface,
    surfaceVariant = ObsidianCard,
    onBackground = TextHighDark,
    onSurface = TextHighDark,
    onSurfaceVariant = TextMediumDark,
    outline = ObsidianBorder
)

private val LightColorScheme = lightColorScheme(
    primary = VibeEmeraldDark,
    onPrimary = CanvasLightBg,
    secondary = VibeCyanAccent,
    onSecondary = CanvasLightBg,
    tertiary = VibeVioletAura,
    background = CanvasLightBg,
    surface = CanvasLightSurface,
    surfaceVariant = CanvasLightCard,
    onBackground = TextHighLight,
    onSurface = TextHighLight,
    onSurfaceVariant = TextMediumLight,
    outline = CanvasLightBorder
)

@Composable
fun VibeTalkTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
