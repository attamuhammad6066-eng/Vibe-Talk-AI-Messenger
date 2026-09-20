package com.amdigitalhub.vibetalk.domain.model

data class User(
    val id: String,
    val displayName: String,
    val username: String,
    val phoneNumber: String,
    val bio: String,
    val avatarUrl: String?,
    val vibeStatus: String,
    val isOnline: Boolean = true
)
