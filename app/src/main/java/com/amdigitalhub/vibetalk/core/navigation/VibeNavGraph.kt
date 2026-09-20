package com.amdigitalhub.vibetalk.core.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.amdigitalhub.vibetalk.presentation.auth.LoginScreen
import com.amdigitalhub.vibetalk.presentation.auth.OtpScreen
import com.amdigitalhub.vibetalk.presentation.home.HomeScreen
import com.amdigitalhub.vibetalk.presentation.onboarding.OnboardingScreen
import com.amdigitalhub.vibetalk.presentation.profile.ProfileScreen
import com.amdigitalhub.vibetalk.presentation.splash.SplashScreen
import com.amdigitalhub.vibetalk.presentation.welcome.WelcomeScreen

@Composable
fun VibeNavGraph(
    navController: NavHostController,
    startDestination: String = Screen.Splash.route
) {
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(Screen.Splash.route) {
            SplashScreen(
                onSplashFinished = {
                    navController.navigate(Screen.Welcome.route) {
                        popUpTo(Screen.Splash.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Welcome.route) {
            WelcomeScreen(
                onGetStarted = {
                    navController.navigate(Screen.Onboarding.route)
                },
                onSkipToLogin = {
                    navController.navigate(Screen.Login.route)
                }
            )
        }

        composable(Screen.Onboarding.route) {
            OnboardingScreen(
                onCompleteOnboarding = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Welcome.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Login.route) {
            LoginScreen(
                onOtpRequested = { phone ->
                    navController.navigate(Screen.Otp.createRoute(phone))
                }
            )
        }

        composable(
            route = Screen.Otp.route,
            arguments = listOf(navArgument("phoneNumber") { type = NavType.StringType })
        ) { backStackEntry ->
            val phoneNumber = backStackEntry.arguments?.getString("phoneNumber") ?: ""
            OtpScreen(
                phoneNumber = phoneNumber,
                onVerificationSuccess = { isNewUser ->
                    if (isNewUser) {
                        navController.navigate(Screen.Profile.route) {
                            popUpTo(Screen.Login.route) { inclusive = true }
                        }
                    } else {
                        navController.navigate(Screen.Home.route) {
                            popUpTo(Screen.Login.route) { inclusive = true }
                        }
                    }
                }
            )
        }

        composable(Screen.Profile.route) {
            ProfileScreen(
                onProfileSaved = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Profile.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Home.route) {
            HomeScreen()
        }
    }
}
