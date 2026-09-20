package com.amdigitalhub.vibetalk.core.di

import android.content.Context
import com.amdigitalhub.vibetalk.core.permissions.PermissionManager
import com.amdigitalhub.vibetalk.core.storage.SecureStorageManager
import com.amdigitalhub.vibetalk.data.local.VibeTalkDatabase
import com.amdigitalhub.vibetalk.data.remote.VibeApiService
import com.amdigitalhub.vibetalk.data.repository.AuthRepositoryImpl
import com.amdigitalhub.vibetalk.data.repository.UserRepositoryImpl
import com.amdigitalhub.vibetalk.domain.repository.AuthRepository
import com.amdigitalhub.vibetalk.domain.repository.UserRepository
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ServiceLocator {
    private var applicationContext: Context? = null

    fun init(context: Context) {
        applicationContext = context.applicationContext
    }

    private val context: Context
        get() = applicationContext ?: throw IllegalStateException("ServiceLocator is not initialized!")

    val permissionManager: PermissionManager by lazy {
        PermissionManager(context)
    }

    val secureStorageManager: SecureStorageManager by lazy {
        SecureStorageManager(context)
    }

    private val okHttpClient: OkHttpClient by lazy {
        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }
        OkHttpClient.Builder()
            .addInterceptor(logging)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build()
    }

    private val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl("https://api.vibetalk.amdigitalhub.com/")
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    val apiService: VibeApiService by lazy {
        retrofit.create(VibeApiService::class.java)
    }

    val database: VibeTalkDatabase by lazy {
        VibeTalkDatabase.getDatabase(context)
    }

    val authRepository: AuthRepository by lazy {
        AuthRepositoryImpl(apiService, secureStorageManager)
    }

    val userRepository: UserRepository by lazy {
        UserRepositoryImpl(database.userDao(), secureStorageManager)
    }
}
