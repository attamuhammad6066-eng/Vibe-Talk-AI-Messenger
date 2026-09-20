package com.amdigitalhub.vibetalk.data.remote

import com.amdigitalhub.vibetalk.data.remote.dto.AuthResponse
import com.amdigitalhub.vibetalk.data.remote.dto.LoginRequest
import com.amdigitalhub.vibetalk.data.remote.dto.LoginResponse
import com.amdigitalhub.vibetalk.data.remote.dto.OtpVerifyRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface VibeApiService {
    @POST("api/v1/auth/request-otp")
    suspend fun requestOtp(@Body request: LoginRequest): Response<LoginResponse>

    @POST("api/v1/auth/verify-otp")
    suspend fun verifyOtp(@Body request: OtpVerifyRequest): Response<AuthResponse>
}
