package com.amdigitalhub.vibetalk.data.repository

import com.amdigitalhub.vibetalk.core.storage.SecureStorageManager
import com.amdigitalhub.vibetalk.data.local.dao.UserDao
import com.amdigitalhub.vibetalk.data.local.entity.UserEntity
import com.amdigitalhub.vibetalk.domain.model.User
import com.amdigitalhub.vibetalk.domain.repository.UserRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class UserRepositoryImpl(
    private val userDao: UserDao,
    private val secureStorage: SecureStorageManager
) : UserRepository {

    override fun getCurrentUser(): Flow<User?> {
        val currentUserId = secureStorage.getUserId() ?: ""
        return userDao.getUserById(currentUserId).map { entity ->
            entity?.let {
                User(
                    id = it.id,
                    displayName = it.displayName,
                    username = it.username,
                    phoneNumber = it.phoneNumber,
                    bio = it.bio,
                    avatarUrl = it.avatarUrl,
                    vibeStatus = it.vibeStatus,
                    isOnline = it.isOnline
                )
            }
        }
    }

    override suspend fun saveUserProfile(user: User): Result<Unit> {
        return try {
            userDao.insertUser(
                UserEntity(
                    id = user.id,
                    displayName = user.displayName,
                    username = user.username,
                    phoneNumber = user.phoneNumber,
                    bio = user.bio,
                    avatarUrl = user.avatarUrl,
                    vibeStatus = user.vibeStatus,
                    isOnline = user.isOnline
                )
            )
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override fun getContacts(): Flow<List<User>> {
        return userDao.getAllContacts().map { list ->
            list.map {
                User(
                    id = it.id,
                    displayName = it.displayName,
                    username = it.username,
                    phoneNumber = it.phoneNumber,
                    bio = it.bio,
                    avatarUrl = it.avatarUrl,
                    vibeStatus = it.vibeStatus,
                    isOnline = it.isOnline
                )
            }
        }
    }
}
