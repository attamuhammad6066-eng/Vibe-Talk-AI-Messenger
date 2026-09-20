package com.amdigitalhub.vibetalk

import android.app.Application
import com.amdigitalhub.vibetalk.core.di.ServiceLocator

class VibeTalkApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // Initialize clean ServiceLocator / DI container
        ServiceLocator.init(this)
    }
}
