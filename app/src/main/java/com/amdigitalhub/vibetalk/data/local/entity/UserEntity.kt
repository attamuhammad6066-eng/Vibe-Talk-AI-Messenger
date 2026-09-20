package com.amdigitalhub.vibetalk.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey
    val id: String,
    val displayName: String,
    val username: String,
    val phoneNumber: String,
    val bio: String,
    val avatarUrl: String?,
    val vibeStatus: String,
    val isOnline: Boolean = true,
    val createdAt: Long = System.currentTimeMillis()
)
