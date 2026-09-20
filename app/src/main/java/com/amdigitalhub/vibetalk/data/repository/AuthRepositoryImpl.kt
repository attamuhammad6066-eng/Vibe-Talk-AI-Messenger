package com.amdigitalhub.vibetalk.data.repository

import com.amdigitalhub.vibetalk.core.storage.SecureStorageManager
import com.amdigitalhub.vibetalk.data.remote.VibeApiService
import com.amdigitalhub.vibetalk.domain.repository.AuthRepository
import kotlinx.coroutines.delay

class AuthRepositoryImpl(
    private val apiService: VibeApiService,
    private val secureStorage: SecureStorageManager
) : AuthRepository {

    override suspend fun requestOtp(phoneNumber: String): Result<String> {
        return try {
            // Clean interface simulation for Phase 0 foundation
            delay(600)
            Result.success("OTP sent to $phoneNumber")
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun verifyOtp(phoneNumber: String, code: String): Result<Pair<String, Boolean>> {
        return try {
            delay(700)
            if (code == "123456" || code.length == 6) {
                val token = "vbt_jwt_${System.currentTimeMillis()}"
                val userId = "usr_${phoneNumber.takeLast(4)}"
                secureStorage.saveAuthToken(token)
                secureStorage.saveUserId(userId)
                // Return Pair(userId, isNewUser)
                Result.success(Pair(userId, true))
            } else {
                Result.failure(Exception("Invalid verification code"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override fun isUserLoggedIn(): Boolean {
        return secureStorage.getAuthToken() != null
    }

    override fun logout() {
        secureStorage.clearAll()
    }
}
