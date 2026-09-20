import { CodeFile } from '../types';

export const ANDROID_CODE_FILES: CodeFile[] = [
  {
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    category: 'Configuration',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.google.devtools.ksp")
}

android {
    namespace = "com.amdigitalhub.vibetalk"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.amdigitalhub.vibetalk"
        minSdk = 26
        targetSdk = 34
        versionCode = 2
        versionName = "2.0.0"
    }
    
    buildFeatures {
        compose = true
        buildConfig = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.14"
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform("androidx.compose:compose-bom:2024.05.00"))
    implementation("androidx.compose.material3:material3")
    implementation("androidx.navigation:navigation-compose:2.7.7")
    
    // Room DB for Local Caching
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    ksp("androidx.room:room-compiler:2.6.1")

    // Coroutines & StateFlow
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
    
    // Retrofit & OkHttp
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
}`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    category: 'Configuration',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:name=".VibeTalkApplication"
        android:label="@string/app_name"
        android:theme="@style/Theme.VibeTalkAIMessenger">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.VibeTalkAIMessenger">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
  },
  {
    path: 'app/src/main/java/com/amdigitalhub/vibetalk/data/local/entity/MessageEntity.kt',
    language: 'kotlin',
    category: 'Data Layer',
    content: `package com.amdigitalhub.vibetalk.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverters
import com.amdigitalhub.vibetalk.data.local.converter.MessagingConverters

@Entity(tableName = "messages")
data class MessageEntity(
    @PrimaryKey val id: String,
    val chatId: String,
    val senderId: String,
    val senderName: String,
    val type: String, // "text", "image", "video", "document", "audio", "voice_note"
    val content: String,
    val attachmentUrl: String? = null,
    val attachmentName: String? = null,
    val attachmentSize: String? = null,
    val attachmentDuration: String? = null,
    val timestamp: Long,
    val status: String, // "sending", "sent", "delivered", "read", "failed"
    val isEdited: Boolean = false,
    val isDeletedForEveryone: Boolean = false,
    val deletedForUsers: List<String> = emptyList(),
    val replyToMessageId: String? = null,
    val isForwarded: Boolean = false,
    val isPinned: Boolean = false,
    val isStarred: Boolean = false,
    val reactions: List<ReactionEntry> = emptyList(),
    val mentions: List<String> = emptyList()
)

data class ReactionEntry(
    val emoji: String,
    val count: Int,
    val users: List<String>
)`
  },
  {
    path: 'app/src/main/java/com/amdigitalhub/vibetalk/data/local/entity/ChatEntity.kt',
    language: 'kotlin',
    category: 'Data Layer',
    content: `package com.amdigitalhub.vibetalk.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "chats")
data class ChatEntity(
    @PrimaryKey val id: String,
    val isGroup: Boolean,
    val name: String,
    val avatar: String,
    val avatarBg: String,
    val unreadCount: Int = 0,
    val isPinned: Boolean = false,
    val isArchived: Boolean = false,
    val isMuted: Boolean = false,
    val isAiCopilot: Boolean = false,
    val pinnedMessageId: String? = null,
    val lastMessageId: String? = null,
    val updatedAt: Long = System.currentTimeMillis()
)`
  },
  {
    path: 'app/src/main/java/com/amdigitalhub/vibetalk/data/local/dao/MessageDao.kt',
    language: 'kotlin',
    category: 'Data Layer',
    content: `package com.amdigitalhub.vibetalk.data.local.dao

import androidx.room.*
import com.amdigitalhub.vibetalk.data.local.entity.MessageEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface MessageDao {
    @Query("SELECT * FROM messages WHERE chatId = :chatId ORDER BY timestamp ASC")
    fun getMessagesStream(chatId: String): Flow<List<MessageEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMessage(message: MessageEntity)

    @Query("UPDATE messages SET content = :newContent, isEdited = 1 WHERE id = :messageId")
    suspend fun updateMessageContent(messageId: String, newContent: String)

    @Query("UPDATE messages SET isDeletedForEveryone = 1, content = '🚫 This message was deleted' WHERE id = :messageId")
    suspend fun deleteForEveryone(messageId: String)

    @Query("UPDATE messages SET isPinned = NOT isPinned WHERE id = :messageId")
    suspend fun togglePin(messageId: String)

    @Query("UPDATE messages SET isStarred = NOT isStarred WHERE id = :messageId")
    suspend fun toggleStar(messageId: String)

    @Query("UPDATE messages SET status = :status WHERE id = :messageId")
    suspend fun updateStatus(messageId: String, status: String)

    @Query("SELECT * FROM messages WHERE chatId = :chatId AND content LIKE '%' || :query || '%'")
    suspend fun searchMessages(chatId: String, query: String): List<MessageEntity>
}`
  },
  {
    path: 'app/src/main/java/com/amdigitalhub/vibetalk/domain/repository/MessagingRepository.kt',
    language: 'kotlin',
    category: 'Architecture',
    content: `package com.amdigitalhub.vibetalk.domain.repository

import com.amdigitalhub.vibetalk.domain.model.*
import kotlinx.coroutines.flow.Flow

interface MessagingRepository {
    fun getChatsStream(filter: ChatFilter): Flow<List<Chat>>
    fun getMessagesStream(chatId: String): Flow<List<Message>>
    
    suspend fun sendMessage(chatId: String, content: String, type: MessageType, replyToId: String? = null): Result<Message>
    suspend fun editMessage(messageId: String, newContent: String): Result<Unit>
    suspend fun deleteMessage(messageId: String, deleteForEveryone: Boolean): Result<Unit>
    suspend fun toggleReaction(messageId: String, emoji: String): Result<Unit>
    suspend fun forwardMessage(messageId: String, targetChatIds: List<String>): Result<Unit>
    suspend fun togglePinMessage(messageId: String): Result<Unit>
    suspend fun toggleStarMessage(messageId: String): Result<Unit>
    
    suspend fun togglePinChat(chatId: String): Result<Unit>
    suspend fun toggleArchiveChat(chatId: String): Result<Unit>
    suspend fun toggleMuteChat(chatId: String): Result<Unit>
    suspend fun markChatAsRead(chatId: String): Result<Unit>
}`
  },
  {
    path: 'app/src/main/java/com/amdigitalhub/vibetalk/presentation/chat/ChatScreen.kt',
    language: 'kotlin',
    category: 'UI & Compose',
    content: `package com.amdigitalhub.vibetalk.presentation.chat

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier

@Composable
fun ChatScreen(
    chatId: String,
    viewModel: ChatViewModel,
    onBack: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            ChatTopBar(
                chat = uiState.chat,
                onBack = onBack,
                onSearchToggle = { viewModel.toggleSearch() },
                onMenuAction = { action -> viewModel.handleMenuAction(action) }
            )
        },
        bottomBar = {
            MessageInputBar(
                onSendMessage = { text, type, attach -> viewModel.sendMessage(text, type, attach) },
                onRecordVoice = { duration -> viewModel.sendVoiceNote(duration) },
                replyContext = uiState.activeReplyTarget
            )
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding)) {
            // Pinned message banner
            uiState.pinnedMessage?.let { pinMsg ->
                PinnedMessageBanner(message = pinMsg, onUnpin = { viewModel.unpinMessage(pinMsg.id) })
            }

            // Message list with reactions, media, ticks, and typing indicator
            LazyColumn(modifier = Modifier.weight(1f)) {
                items(uiState.messages, key = { it.id }) { message ->
                    MessageBubble(
                        message = message,
                        onReaction = { emoji -> viewModel.toggleReaction(message.id, emoji) },
                        onReply = { viewModel.setReplyTarget(message) },
                        onForward = { viewModel.openForwardDialog(message) },
                        onEdit = { viewModel.startEdit(message) },
                        onDelete = { forEveryone -> viewModel.deleteMessage(message.id, forEveryone) }
                    )
                }
                if (uiState.isPeerTyping) {
                    item { TypingIndicatorBubble(name = uiState.typingUserName) }
                }
            }
        }
    }
}`
  }
];
