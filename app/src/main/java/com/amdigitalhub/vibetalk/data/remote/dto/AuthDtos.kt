package com.amdigitalhub.vibetalk.data.remote.dto

data class LoginRequest(
    val phoneNumber: String
)

data class LoginResponse(
    val success: Boolean,
    val message: String,
    val verificationId: String?
)

data class OtpVerifyRequest(
    val phoneNumber: String,
    val code: String
)

data class AuthResponse(
    val token: String,
    val userId: String,
    val isNewUser: Boolean
)
