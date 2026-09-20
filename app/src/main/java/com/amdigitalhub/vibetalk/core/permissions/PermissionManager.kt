package com.amdigitalhub.vibetalk.core.permissions

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat

enum class AppPermission(val permission: String, val title: String, val rationale: String) {
    CAMERA(
        Manifest.permission.CAMERA,
        "Camera",
        "Required for video calls, photo sharing, and stories."
    ),
    RECORD_AUDIO(
        Manifest.permission.RECORD_AUDIO,
        "Microphone",
        "Required for crystal clear voice notes and audio calls."
    ),
    READ_CONTACTS(
        Manifest.permission.READ_CONTACTS,
        "Contacts",
        "Enables quick synchronization with friends on VibeTalk AI."
    ),
    NOTIFICATIONS(
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            Manifest.permission.POST_NOTIFICATIONS
        } else {
            ""
        },
        "Notifications",
        "Stay updated on incoming messages, calls, and AI summaries."
    )
}

class PermissionManager(private val context: Context) {
    fun isPermissionGranted(permission: AppPermission): Boolean {
        if (permission.permission.isEmpty()) return true
        return ContextCompat.checkSelfPermission(
            context,
            permission.permission
        ) == PackageManager.PERMISSION_GRANTED
    }

    fun getMissingCorePermissions(): List<AppPermission> {
        return AppPermission.values().filter { !isPermissionGranted(it) && it.permission.isNotEmpty() }
    }
}
