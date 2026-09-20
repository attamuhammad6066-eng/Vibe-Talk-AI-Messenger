package com.amdigitalhub.vibetalk.core.navigation

sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Welcome : Screen("welcome")
    object Onboarding : Screen("onboarding")
    object Login : Screen("login")
    object Otp : Screen("otp/{phoneNumber}") {
        fun createRoute(phoneNumber: String) = "otp/$phoneNumber"
    }
    object Profile : Screen("profile")
    object Home : Screen("home")
}

enum class HomeTab(val route: String, val title: String) {
    CHATS("tab_chats", "Chats"),
    CALLS("tab_calls", "Calls"),
    AI("tab_ai", "AI"),
    STORIES("tab_stories", "Stories"),
    CONTACTS("tab_contacts", "Contacts")
}
