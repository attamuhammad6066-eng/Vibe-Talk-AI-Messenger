package com.amdigitalhub.vibetalk.domain.repository

import com.amdigitalhub.vibetalk.domain.model.User
import kotlinx.coroutines.flow.Flow

interface AuthRepository {
    suspend fun requestOtp(phoneNumber: String): Result<String>
    suspend fun verifyOtp(phoneNumber: String, code: String): Result<Pair<String, Boolean>>
    fun isUserLoggedIn(): Boolean
    fun logout()
}

interface UserRepository {
    fun getCurrentUser(): Flow<User?>
    suspend fun saveUserProfile(user: User): Result<Unit>
    fun getContacts(): Flow<List<User>>
}
