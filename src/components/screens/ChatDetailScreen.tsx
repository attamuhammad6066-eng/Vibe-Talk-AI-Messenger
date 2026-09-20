import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Search,
  X,
  Pin,
  PinOff,
  Star,
  CornerUpLeft,
  Share2,
  Edit2,
  Trash2,
  Check,
  CheckCheck,
  AlertCircle,
  Paperclip,
  Smile,
  Mic,
  Send,
  FileText,
  Play,
  Pause,
  Image as ImageIcon,
  Volume2,
  Sparkles,
  Users,
  BellOff,
  Bell,
  Archive,
  ArchiveRestore,
  BarChart2,
  Globe,
  HelpCircle,
  Scan,
  RefreshCw,
  ChevronDown,
  Download
} from 'lucide-react';
import {
  ChatConversation,
  Message,
  MessageType,
  MessageStatus,
  UserProfile,
  ContactItem,
  CallSession
} from '../../types';
import { CURRENT_USER_ID } from '../../data/mockMessagingData';
import { messagingRepository } from '../../services/messagingRepository';
import { webrtcCallService } from '../../services/webrtcCallService';
import { aiCoreService } from '../../services/aiCoreService';
import { securityEngine } from '../../security/AdvancedSecurityEngine';
import { ForwardModal } from '../ForwardModal';
import { GroupInfoModal } from '../GroupInfoModal';
import { CreatePollModal } from '../CreatePollModal';
import { ContactProfileModal } from '../ContactProfileModal';
import { ActiveCallModal } from '../ActiveCallModal';
import { IncomingCallModal } from '../IncomingCallModal';
import { VoiceRecorderDock } from '../VoiceRecorderDock';
import { VoiceNoteBubble } from '../VoiceNoteBubble';
import { AIMessageAssistantModal } from '../AIMessageAssistantModal';
import { AITranslateModal } from '../AITranslateModal';
import { AIVisionDocModal } from '../AIVisionDocModal';

interface ChatDetailScreenProps {
  chatId: string;
  user: UserProfile;
  isDark: boolean;
  onBack: () => void;
}

const COMMON_REACTIONS = ['❤️', '👍', '🔥', '😂', '😮', '⚡'];
const QUICK_EMOJIS = ['😊', '🚀', '💡', '💯', '🙏', '🎉', '👏', '✨'];

export function ChatDetailScreen({
  chatId,
  user,
  isDark,
  onBack
}: ChatDetailScreenProps) {
  const [chat, setChat] = useState<ChatConversation | undefined>(() =>
    messagingRepository.getChat(chatId)
  );
  const [messages, setMessages] = useState<Message[]>(() =>
    messagingRepository.getMessages(chatId)
  );
  const [inputText, setInputText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyTarget, setReplyTarget] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [activeActionMenuMsgId, setActiveActionMenuMsgId] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [forwardingMessage, setForwardingMessage] = useState<Message | null>(null);
  const [allChats, setAllChats] = useState<ChatConversation[]>([]);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showContactProfile, setShowContactProfile] = useState(false);
  const [callSession, setCallSession] = useState<CallSession | null>(() =>
    webrtcCallService.getCurrentSession()
  );

  // AI Core States
  const [showAiAssistModal, setShowAiAssistModal] = useState(false);
  const [aiAssistInitialText, setAiAssistInitialText] = useState('');
  const [aiAssistContext, setAiAssistContext] = useState('');
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [translateSourceText, setTranslateSourceText] = useState('');
  const [showVisionDocModal, setShowVisionDocModal] = useState(false);
  const [visionDocMediaUrl, setVisionDocMediaUrl] = useState<string | undefined>(undefined);
  const [visionDocMime, setVisionDocMime] = useState<string>('image/jpeg');
  const [smartReplies, setSmartReplies] = useState<string[]>([
    'Sounds great! 👍',
    'Let me check on that',
    'Thanks for the update! ✨',
    'Got it! 🚀'
  ]);
  const [isFetchingSmartReplies, setIsFetchingSmartReplies] = useState(false);
  const [translatedMessages, setTranslatedMessages] = useState<Record<string, string>>({});
  const [showScrollBottomArrow, setShowScrollBottomArrow] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Context-Aware Smart Replies loader
  useEffect(() => {
    if (messages.length > 0 && chat) {
      const recent = messages.slice(-5).map((m) => ({
        senderName: m.senderName,
        content: m.content
      }));
      setIsFetchingSmartReplies(true);
      aiCoreService
        .getSmartReplies(recent, chat.name)
        .then((replies) => {
          if (replies && replies.length > 0) {
            setSmartReplies(replies);
          }
        })
        .catch(() => {})
        .finally(() => setIsFetchingSmartReplies(false));
    }
  }, [messages.length, chat?.name]);

  // Subscribe to repository updates (Live Flow/Room caching)
  useEffect(() => {
    messagingRepository.markChatAsRead(chatId);
    const update = () => {
      setChat(messagingRepository.getChat(chatId));
      setMessages(messagingRepository.getMessages(chatId));
      setAllChats(messagingRepository.getChats());
    };
    update();
    const unsubscribe = messagingRepository.subscribe(update);
    return () => unsubscribe();
  }, [chatId]);

  // Subscribe to call session updates
  useEffect(() => {
    const unsubscribe = webrtcCallService.subscribe((session) => {
      setCallSession(session);
    });
    return () => unsubscribe();
  }, []);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center">
        <p className="text-xs text-slate-400">Conversation not found in local Room storage.</p>
        <button onClick={onBack} className="mt-3 text-xs font-bold text-emerald-400">
          Return to Chats
        </button>
      </div>
    );
  }

  // Active typing participant check
  const typingParticipant = chat.participants.find((p) => p.isTyping);

  // Filter messages for in-chat search
  const filteredMessages = searchQuery.trim()
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    if (editingMessage) {
      messagingRepository.editMessage(editingMessage.id, trimmed);
      setEditingMessage(null);
      setInputText('');
      return;
    }

    // Check for mentions
    const mentionsMatches = trimmed.match(/@\w+/g) || undefined;

    messagingRepository.sendMessage({
      chatId: chat.id,
      content: trimmed,
      type: 'text',
      replyToMessageId: replyTarget?.id,
      mentions: mentionsMatches ? Array.from(mentionsMatches) : undefined
    });

    setInputText('');
    setReplyTarget(null);
    setShowEmojiPicker(false);
  };

  const handleSendAttachment = (type: MessageType, url: string, name: string, size?: string) => {
    messagingRepository.sendMessage({
      chatId: chat.id,
      content: name,
      type,
      attachment: {
        url,
        name,
        size: size || '1.4 MB'
      }
    });
    setShowAttachMenu(false);
  };

  const handleSendVoiceNote = (audioUrl: string, durationFormatted: string) => {
    messagingRepository.sendMessage({
      chatId: chat.id,
      content: `Voice note (${durationFormatted})`,
      type: 'voice_note',
      attachment: {
        url: audioUrl,
        duration: durationFormatted,
        size: '280 KB'
      }
    });
    setIsRecordingVoice(false);
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    messagingRepository.toggleReaction(msgId, emoji, CURRENT_USER_ID);
    setActiveActionMenuMsgId(null);
  };

  const handleTogglePinMessage = (msg: Message) => {
    messagingRepository.togglePinMessage(msg.id);
    setActiveActionMenuMsgId(null);
  };

  const handleToggleStarMessage = (msg: Message) => {
    messagingRepository.toggleStarMessage(msg.id);
    setActiveActionMenuMsgId(null);
  };

  const handleDeleteMessage = (msg: Message, mode: 'for_me' | 'for_everyone') => {
    messagingRepository.deleteMessage(msg.id, mode, CURRENT_USER_ID);
    setActiveActionMenuMsgId(null);
  };

  const handleStartEdit = (msg: Message) => {
    setEditingMessage(msg);
    setInputText(msg.content);
    setReplyTarget(null);
    setActiveActionMenuMsgId(null);
    inputRef.current?.focus();
  };

  const handleStartReply = (msg: Message) => {
    setReplyTarget(msg);
    setEditingMessage(null);
    setActiveActionMenuMsgId(null);
    inputRef.current?.focus();
  };

  const handleExportChat = () => {
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        conversationId: chat.id,
        conversationName: chat.name,
        isGroupChat: chat.isGroup,
        participants: chat.participants.map((p) => ({
          id: p.id,
          name: p.name,
          username: p.username,
          vibeStatus: p.vibeStatus
        })),
        totalMessages: messages.length,
        messages: messages.map((m) => ({
          id: m.id,
          senderId: m.senderId,
          senderName: m.senderName,
          timestamp: m.timestamp,
          content: m.content,
          type: m.type,
          status: m.status,
          isPinned: chat.pinnedMessageId === m.id,
          isStarred: m.isStarred,
          reactions: m.reactions,
          attachment: m.attachment ? {
            name: m.attachment.name,
            url: m.attachment.url,
            duration: m.attachment.duration,
            size: m.attachment.size
          } : undefined
        }))
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      const safeName = chat.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      link.href = url;
      link.download = `${safeName}_chat_export.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Trigger export toast success overlay
      setShowExportSuccess(true);
      setTimeout(() => setShowExportSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to export conversation:', e);
    }
  };

  const pinnedMessage = chat.pinnedMessageId
    ? messages.find((m) => m.id === chat.pinnedMessageId)
    : undefined;

  const renderStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case 'sending':
        return <div className="w-2.5 h-2.5 border border-slate-400 border-t-transparent rounded-full animate-spin" />;
      case 'sent':
        return <Check className="w-3 h-3 text-slate-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-slate-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-emerald-400 font-bold" />;
      case 'failed':
        return <AlertCircle className="w-3 h-3 text-rose-500 cursor-pointer" />;
      default:
        return null;
    }
  };

  const primaryParticipant = chat.participants.find((p) => p.id !== CURRENT_USER_ID) || chat.participants[0];
  const primaryContact: ContactItem | null = primaryParticipant
    ? {
        id: primaryParticipant.id,
        name: primaryParticipant.name,
        username: primaryParticipant.username,
        phoneNumber: '+1 (555) 234-8901',
        bio: 'Connected via VibeTalk AI',
        avatar: primaryParticipant.avatar,
        avatarBg: primaryParticipant.avatarBg,
        isOnline: primaryParticipant.isOnline,
        lastSeen: primaryParticipant.lastSeen,
        vibeStatus: primaryParticipant.vibeStatus,
        chatId: chat.id
      }
    : null;

  return (
    <div
      className={`h-full w-full flex flex-col justify-between select-none overflow-hidden transition-colors duration-300 relative ${
        isDark ? 'bg-[#090C12] text-slate-100' : 'bg-[#F4F6F9] text-slate-900'
      }`}
    >
      {/* Top Header Bar */}
      <div
        className={`px-3 py-2.5 border-b flex items-center justify-between z-20 ${
          isDark ? 'bg-[#0F141C] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center space-x-2 min-w-0">
          <button
            onClick={onBack}
            className={`w-7 h-7 rounded-xl flex items-center justify-center border cursor-pointer ${
              isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Clickable Header Info: Opens Group Info or Contact Profile */}
          <div
            onClick={() => {
              if (chat.isGroup) {
                setShowGroupInfo(true);
              } else if (primaryContact) {
                setShowContactProfile(true);
              }
            }}
            className="flex items-center space-x-2 min-w-0 cursor-pointer hover:opacity-90 transition-opacity"
            title={chat.isGroup ? 'View Group Info & Members' : 'View Contact Profile'}
          >
            {/* Avatar & Presence */}
            <div className="relative">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${chat.avatarBg} p-[2px] flex items-center justify-center shrink-0`}
              >
                <div
                  className={`w-full h-full rounded-[10px] flex items-center justify-center text-xs font-bold ${
                    isDark ? 'bg-[#0F141C] text-white' : 'bg-white text-slate-900'
                  }`}
                >
                  {chat.avatar}
                </div>
              </div>
              {chat.participants.some((p) => p.isOnline) && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0F141C]" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 truncate">
                <h3 className="text-xs font-black truncate">{chat.name}</h3>
                {chat.isMuted && <BellOff className="w-3 h-3 text-slate-400 shrink-0" />}
                {chat.isPinned && <Pin className="w-3 h-3 text-emerald-400 shrink-0 rotate-45" />}
              </div>
              <p className="text-[10px] text-emerald-400 truncate">
                {typingParticipant
                  ? `${typingParticipant.name.split(' ')[0]} is typing...`
                  : chat.isGroup
                  ? `${chat.participants.length} members • ${chat.participants.filter((p) => p.isOnline).length} online`
                  : chat.participants[0]?.lastSeen || 'Active now'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-1 shrink-0">
          {!chat.isGroup && (
            <>
              <button
                onClick={() => {
                  if (primaryContact) {
                    webrtcCallService.startCall(primaryContact, 'voice');
                  }
                }}
                className={`p-1.5 rounded-lg border cursor-pointer ${
                  isDark ? 'border-slate-800 text-slate-400 hover:text-cyan-400' : 'border-slate-200 text-slate-600 hover:text-cyan-600'
                }`}
                title="Voice Call"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  if (primaryContact) {
                    webrtcCallService.startCall(primaryContact, 'video');
                  }
                }}
                className={`p-1.5 rounded-lg border cursor-pointer ${
                  isDark ? 'border-slate-800 text-slate-400 hover:text-purple-400' : 'border-slate-200 text-slate-600 hover:text-purple-600'
                }`}
                title="Video Call"
              >
                <Video className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {chat.isGroup && (
            <button
              onClick={() => setShowGroupInfo(true)}
              className={`p-1.5 rounded-lg border cursor-pointer ${
                isDark ? 'border-slate-800 text-slate-400 hover:text-emerald-400' : 'border-slate-200 text-slate-600 hover:text-emerald-600'
              }`}
              title="Group Info & Settings"
            >
              <Users className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1.5 rounded-lg border cursor-pointer ${
              showSearch
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : isDark
                ? 'border-slate-800 text-slate-400 hover:text-white'
                : 'border-slate-200 text-slate-600 hover:text-black'
            }`}
            title="Search Messages"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowChatMenu(!showChatMenu)}
            className={`p-1.5 rounded-lg border cursor-pointer ${
              isDark ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-600'
            }`}
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* In-Chat Message Search Bar */}
      {showSearch && (
        <div
          className={`px-3 py-1.5 border-b flex items-center justify-between text-xs animate-fade-in ${
            isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2 flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search in this chat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-xs"
              autoFocus
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-slate-400">
              {filteredMessages.length} results
            </span>
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchQuery('');
              }}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Pinned Message Banner */}
      {pinnedMessage && (
        <div
          className={`px-3.5 py-1.5 border-b flex items-center justify-between text-xs ${
            isDark ? 'bg-[#151C2A] border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
          }`}
        >
          <div className="flex items-center space-x-2 min-w-0">
            <Pin className="w-3 h-3 text-emerald-400 shrink-0 rotate-45" />
            <div className="truncate">
              <span className="text-[10px] font-bold text-emerald-400 mr-1">PINNED:</span>
              <span className="text-[11px] truncate text-slate-300">
                {pinnedMessage.content}
              </span>
            </div>
          </div>
          <button
            onClick={() => handleTogglePinMessage(pinnedMessage)}
            className="text-[10px] text-slate-400 hover:text-emerald-400 cursor-pointer shrink-0 ml-2"
          >
            Unpin
          </button>
        </div>
      )}

      {/* Chat Options Dropdown Menu */}
      {showChatMenu && (
        <div
          className={`absolute right-3 top-13 z-30 w-48 rounded-2xl border shadow-xl py-1 divide-y animate-scale-up ${
            isDark ? 'bg-[#121824] border-slate-800 divide-slate-800/80 text-slate-200' : 'bg-white border-slate-200 divide-slate-100 text-slate-800'
          }`}
        >
          {chat.isGroup ? (
            <button
              onClick={() => {
                setShowGroupInfo(true);
                setShowChatMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-xs flex items-center space-x-2 hover:bg-slate-500/10 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Group Info & Members</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setShowContactProfile(true);
                setShowChatMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-xs flex items-center space-x-2 hover:bg-slate-500/10 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Contact Profile</span>
            </button>
          )}

          <button
            onClick={() => {
              messagingRepository.togglePinChat(chat.id);
              setShowChatMenu(false);
            }}
            className="w-full px-3 py-2 text-left text-xs flex items-center space-x-2 hover:bg-slate-500/10 cursor-pointer"
          >
            {chat.isPinned ? <PinOff className="w-3.5 h-3.5 text-amber-400" /> : <Pin className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{chat.isPinned ? 'Unpin Conversation' : 'Pin to Top'}</span>
          </button>

          <button
            onClick={() => {
              messagingRepository.toggleMuteChat(chat.id);
              setShowChatMenu(false);
            }}
            className="w-full px-3 py-2 text-left text-xs flex items-center space-x-2 hover:bg-slate-500/10 cursor-pointer"
          >
            {chat.isMuted ? <Bell className="w-3.5 h-3.5 text-cyan-400" /> : <BellOff className="w-3.5 h-3.5 text-slate-400" />}
            <span>{chat.isMuted ? 'Unmute Notifications' : 'Mute Notifications'}</span>
          </button>

          <button
            onClick={() => {
              messagingRepository.toggleArchiveChat(chat.id);
              setShowChatMenu(false);
              onBack();
            }}
            className="w-full px-3 py-2 text-left text-xs flex items-center space-x-2 hover:bg-slate-500/10 cursor-pointer"
          >
            {chat.isArchived ? <ArchiveRestore className="w-3.5 h-3.5 text-emerald-400" /> : <Archive className="w-3.5 h-3.5 text-amber-400" />}
            <span>{chat.isArchived ? 'Unarchive Chat' : 'Archive Chat'}</span>
          </button>

          <button
            onClick={() => {
              handleExportChat();
              setShowChatMenu(false);
            }}
            className="w-full px-3 py-2 text-left text-xs flex items-center space-x-2 hover:bg-slate-500/10 cursor-pointer text-emerald-400 font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Chat History</span>
          </button>
        </div>
      )}

      {/* Main Messages List Area */}
      <div
        ref={scrollContainerRef}
        onScroll={(e) => {
          const target = e.currentTarget;
          const isScrolledUp = target.scrollHeight - target.scrollTop - target.clientHeight > 200;
          setShowScrollBottomArrow(isScrolledUp);
        }}
        className="flex-1 overflow-y-auto px-3.5 py-3 space-y-2.5 relative whatsapp-scrollbar"
        onClick={() => {
          setActiveActionMenuMsgId(null);
          setShowAttachMenu(false);
          setShowEmojiPicker(false);
          setShowChatMenu(false);
        }}
      >
        {/* End-to-End Encryption Banner */}
        <div className="flex justify-center my-2">
          <div
            className={`px-3 py-1 rounded-full text-[9px] font-medium border flex items-center space-x-1.5 ${
              isDark ? 'bg-[#0F141C] border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Messages are secured with AES-256 E2E quantum encryption</span>
          </div>
        </div>

        {filteredMessages.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No messages found. Send your first message below!
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isMe = msg.senderId === CURRENT_USER_ID;
            const isMenuOpen = activeActionMenuMsgId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col relative ${isMe ? 'items-end' : 'items-start'}`}
              >
                {/* Group Sender Name */}
                {chat.isGroup && !isMe && (
                  <span className="text-[10px] font-bold text-emerald-400 ml-1 mb-0.5">
                    {msg.senderName}
                  </span>
                )}

                {/* Message Bubble Container */}
                <div className="relative group max-w-[85%]">
                  {/* Forwarded Tag */}
                  {msg.isForwarded && (
                    <div className="flex items-center space-x-1 text-[9px] text-slate-400 italic mb-0.5">
                      <Share2 className="w-2.5 h-2.5" />
                      <span>Forwarded</span>
                    </div>
                  )}

                  {/* Quoted Reply Target */}
                  {msg.replyToMessage && (
                    <div
                      className={`p-2 mb-1 rounded-xl text-[10px] border-l-2 border-emerald-400 text-slate-300 ${
                        isDark ? 'bg-black/30' : 'bg-white/40'
                      }`}
                    >
                      <span className="font-bold text-emerald-400 block truncate">
                        {msg.replyToMessage.senderName}
                      </span>
                      <span className="truncate block opacity-80">
                        {securityEngine.decryptMessage(msg.replyToMessage.content)}
                      </span>
                    </div>
                  )}

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveActionMenuMsgId(isMenuOpen ? null : msg.id);
                    }}
                    className={`rounded-2xl px-3.5 py-2 text-xs transition-all cursor-pointer shadow-xs ${
                      isMe
                        ? 'bg-gradient-to-r from-[#00E5A3] to-[#00C2FF] text-black font-medium rounded-tr-xs'
                        : isDark
                        ? 'bg-[#121824] border border-slate-800 text-slate-100 rounded-tl-xs'
                        : 'bg-white border border-slate-200 text-slate-900 rounded-tl-xs'
                    }`}
                  >
                    {/* Image Attachment */}
                    {msg.type === 'image' && msg.attachment && (
                      <div className="mb-1.5 rounded-xl overflow-hidden border border-black/10">
                        <img
                          src={msg.attachment.url}
                          alt="Attachment"
                          className="w-full h-36 object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Video Attachment */}
                    {msg.type === 'video' && msg.attachment && (
                      <div className="mb-1.5 relative rounded-xl overflow-hidden bg-black/40 flex items-center justify-center h-32">
                        <img
                          src={msg.attachment.url}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute w-10 h-10 rounded-full bg-emerald-400 text-black flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 ml-0.5 fill-black" />
                        </div>
                        <span className="absolute bottom-1 right-2 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                          {msg.attachment.duration || '0:15'}
                        </span>
                      </div>
                    )}

                    {/* Document Attachment */}
                    {msg.type === 'document' && msg.attachment && (
                      <div className="flex items-center space-x-2 p-2 rounded-xl bg-black/10 mb-1">
                        <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-[11px] truncate">
                            {msg.attachment.name || 'Document.pdf'}
                          </p>
                          <span className="text-[9px] opacity-70">
                            {msg.attachment.size || '2.4 MB'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Voice Note / Audio Attachment with Interactive Waveform & Speed Control */}
                    {msg.type === 'voice_note' && msg.attachment && (
                      <VoiceNoteBubble
                        attachment={msg.attachment}
                        isMe={isMe}
                        isDark={isDark}
                      />
                    )}

                    {/* Poll Rendering */}
                    {msg.type === 'poll' && msg.poll && (
                      <div className="space-y-2.5 py-1 min-w-[240px]">
                        <div className="flex items-center space-x-1.5 font-bold text-xs">
                          <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{msg.poll.question}</span>
                        </div>
                        <div className="space-y-1.5">
                          {msg.poll.options.map((opt) => {
                            const hasVoted = opt.voterIds.includes(CURRENT_USER_ID);
                            const total = msg.poll?.totalVotes || 0;
                            const pct =
                              total > 0 ? Math.round((opt.voterIds.length / total) * 100) : 0;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  messagingRepository.votePoll(msg.id, opt.id);
                                }}
                                className={`w-full text-left relative p-2.5 rounded-xl border text-xs cursor-pointer overflow-hidden transition-all ${
                                  hasVoted
                                    ? isMe
                                      ? 'border-black bg-black/20 font-bold'
                                      : 'border-emerald-400 bg-emerald-500/15 font-bold text-emerald-300'
                                    : isMe
                                    ? 'border-black/20 hover:bg-black/10'
                                    : 'border-white/10 hover:bg-white/5'
                                }`}
                              >
                                <div
                                  className={`absolute inset-y-0 left-0 transition-all duration-300 ${
                                    isMe ? 'bg-black/20' : 'bg-emerald-400/20'
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                                <div className="relative z-10 flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                        hasVoted
                                          ? isMe
                                            ? 'border-black bg-black text-white'
                                            : 'border-emerald-400 bg-emerald-400 text-black'
                                          : isMe
                                          ? 'border-black/40'
                                          : 'border-white/30'
                                      }`}
                                    >
                                      {hasVoted && <Check className="w-2.5 h-2.5" />}
                                    </div>
                                    <span>{opt.text}</span>
                                  </div>
                                  <span className="text-[10px] font-mono opacity-85">
                                    {pct}% ({opt.voterIds.length})
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex items-center justify-between text-[10px] opacity-75 pt-1 border-t border-current/10">
                          <span>{msg.poll.totalVotes} total votes</span>
                          <span>Tap to vote / change</span>
                        </div>
                      </div>
                    )}

                    {/* Text Content with Mentions Highlight */}
                    {msg.type === 'text' && (() => {
                      const displayContent = securityEngine.decryptMessage(msg.content);
                      return (
                        <p className="leading-relaxed break-words whitespace-pre-wrap">
                          {displayContent.split(' ').map((word, idx) => {
                            if (word.startsWith('@')) {
                              return (
                                <span
                                  key={idx}
                                  className="font-extrabold text-emerald-400 underline mr-1"
                                >
                                  {word}{' '}
                                </span>
                              );
                            }
                            return word + ' ';
                          })}
                        </p>
                      );
                    })()}

                    {/* Inline AI Translated Text if present */}
                    {translatedMessages[msg.id] && (
                      <div className="mt-2 pt-1.5 border-t border-current/20 text-xs leading-relaxed">
                        <div className="flex items-center space-x-1 text-[9px] font-bold text-cyan-400 mb-0.5">
                          <Globe className="w-2.5 h-2.5" />
                          <span>AI Translated</span>
                        </div>
                        <p className="whitespace-pre-wrap">{translatedMessages[msg.id]}</p>
                      </div>
                    )}

                    {/* Metadata Footer: Time, Edited, Star, Status */}
                    <div className="flex items-center justify-end space-x-1.5 text-[9px] opacity-75 mt-1">
                      {msg.isStarred && <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />}
                      {msg.isPinned && <Pin className="w-2.5 h-2.5 rotate-45" />}
                      {msg.isEdited && <span>(edited)</span>}
                      <span>{msg.timeFormatted}</span>
                      {isMe && renderStatusIcon(msg.status)}
                    </div>
                  </div>

                  {/* Reaction Badges Container */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 px-1">
                      {msg.reactions.map((r, i) => {
                        const hasReacted = r.users.includes(CURRENT_USER_ID);
                        return (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleReaction(msg.id, r.emoji);
                            }}
                            className={`px-1.5 py-0.5 rounded-full text-[10px] flex items-center space-x-1 border cursor-pointer transition-all ${
                              hasReacted
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 font-bold'
                                : isDark
                                ? 'bg-[#121824] border-slate-800 text-slate-300'
                                : 'bg-white border-slate-200 text-slate-700 shadow-xs'
                            }`}
                          >
                            <span>{r.emoji}</span>
                            <span>{r.count}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Popover Action Menu for Selected Message */}
                  {isMenuOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className={`absolute ${
                        isMe ? 'right-0' : 'left-0'
                      } -top-12 z-30 p-1 rounded-2xl border shadow-xl flex items-center space-x-1 animate-scale-up ${
                        isDark ? 'bg-[#151C2A] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      {/* Reaction Emojis Quick Picker */}
                      <div className="flex items-center space-x-1 px-1 border-r border-slate-700/40">
                        {COMMON_REACTIONS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(msg.id, emoji)}
                            className="w-6 h-6 rounded-full hover:bg-slate-500/20 flex items-center justify-center text-xs cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>

                      {/* Reply */}
                      <button
                        onClick={() => handleStartReply(msg)}
                        title="Reply"
                        className="p-1.5 rounded-lg hover:bg-slate-500/20 text-slate-300 cursor-pointer"
                      >
                        <CornerUpLeft className="w-3.5 h-3.5" />
                      </button>

                      {/* Forward */}
                      <button
                        onClick={() => {
                          setForwardingMessage(msg);
                          setActiveActionMenuMsgId(null);
                        }}
                        title="Forward"
                        className="p-1.5 rounded-lg hover:bg-slate-500/20 text-slate-300 cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Pin */}
                      <button
                        onClick={() => handleTogglePinMessage(msg)}
                        title={msg.isPinned ? 'Unpin' : 'Pin'}
                        className="p-1.5 rounded-lg hover:bg-slate-500/20 text-slate-300 cursor-pointer"
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      {/* Star */}
                      <button
                        onClick={() => handleToggleStarMessage(msg)}
                        title={msg.isStarred ? 'Unstar' : 'Star'}
                        className="p-1.5 rounded-lg hover:bg-slate-500/20 text-slate-300 cursor-pointer"
                      >
                        <Star className={`w-3.5 h-3.5 ${msg.isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>

                      {/* Edit (only if me and text) */}
                      {isMe && msg.type === 'text' && !msg.isDeletedForEveryone && (
                        <button
                          onClick={() => handleStartEdit(msg)}
                          title="Edit"
                          className="p-1.5 rounded-lg hover:bg-slate-500/20 text-slate-300 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* AI Action Divider */}
                      <div className="h-4 w-px bg-slate-700/40" />

                      {/* AI Translate Button */}
                      <button
                        onClick={() => {
                          setTranslateSourceText(msg.content);
                          setShowTranslateModal(true);
                          setActiveActionMenuMsgId(null);
                        }}
                        title="AI Translate (11 languages)"
                        className="p-1.5 rounded-lg hover:bg-slate-500/20 text-cyan-400 cursor-pointer"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </button>

                      {/* AI Message Assistant Button */}
                      <button
                        onClick={() => {
                          setAiAssistInitialText(msg.content);
                          setAiAssistContext(`Message by ${msg.senderName}: "${msg.content}"`);
                          setShowAiAssistModal(true);
                          setActiveActionMenuMsgId(null);
                        }}
                        title="AI Message Assistant"
                        className="p-1.5 rounded-lg hover:bg-slate-500/20 text-emerald-400 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>

                      {/* Read Aloud (Voice TTS) */}
                      <button
                        onClick={() => {
                          aiCoreService.speakText(msg.content);
                          setActiveActionMenuMsgId(null);
                        }}
                        title="Read Aloud (Voice TTS)"
                        className="p-1.5 rounded-lg hover:bg-slate-500/20 text-purple-400 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Vision / Doc OCR if attachment exists */}
                      {msg.attachment && (
                        <button
                          onClick={() => {
                            setVisionDocMediaUrl(msg.attachment?.url);
                            setVisionDocMime(msg.attachment?.name?.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
                            setShowVisionDocModal(true);
                            setActiveActionMenuMsgId(null);
                          }}
                          title="Analyze Media with Vision AI / OCR"
                          className="p-1.5 rounded-lg hover:bg-slate-500/20 text-indigo-400 cursor-pointer"
                        >
                          <Scan className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteMessage(msg, isMe ? 'for_everyone' : 'for_me')}
                        title={isMe ? 'Delete for Everyone' : 'Delete for Me'}
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Live Typing Indicator */}
        {typingParticipant && (
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 pl-1 animate-pulse">
            <div className="flex space-x-1 bg-slate-800/40 px-3 py-1.5 rounded-full border border-slate-700/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-200" />
            </div>
            <span className="text-[10px]">{typingParticipant.name} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply or Edit Context Bar */}
      {(replyTarget || editingMessage) && (
        <div
          className={`px-3 py-1.5 border-t flex items-center justify-between text-xs ${
            editingMessage
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}
        >
          <div className="flex items-center space-x-2 truncate">
            {editingMessage ? (
              <>
                <Edit2 className="w-3.5 h-3.5 shrink-0" />
                <span className="font-bold">Editing Message:</span>
                <span className="truncate opacity-80">{editingMessage.content}</span>
              </>
            ) : (
              <>
                <CornerUpLeft className="w-3.5 h-3.5 shrink-0" />
                <span className="font-bold">Replying to {replyTarget?.senderName}:</span>
                <span className="truncate opacity-80">{replyTarget?.content}</span>
              </>
            )}
          </div>
          <button
            onClick={() => {
              setReplyTarget(null);
              setEditingMessage(null);
              setInputText('');
            }}
            className="text-slate-400 hover:text-white cursor-pointer ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quick Attachment Sheet Popover */}
      {showAttachMenu && (
        <div
          className={`px-4 py-3 border-t grid grid-cols-4 gap-2 animate-slide-up ${
            isDark ? 'bg-[#121824] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <button
            onClick={() =>
              handleSendAttachment(
                'image',
                'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
                'vibetalk_architecture.png'
              )
            }
            className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-500/10 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Image</span>
          </button>

          <button
            onClick={() =>
              handleSendAttachment(
                'video',
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
                'compose_animation.mp4'
              )
            }
            className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-500/10 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-1">
              <Play className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Video</span>
          </button>

          <button
            onClick={() =>
              handleSendAttachment(
                'document',
                '#',
                'Security_Audit_Report.pdf',
                '3.8 MB'
              )
            }
            className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-500/10 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mb-1">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Document</span>
          </button>

          <button
            onClick={() =>
              handleSendAttachment(
                'audio',
                '#',
                'Podcast_Ep_12.mp3',
                '14.2 MB'
              )
            }
            className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-500/10 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-1">
              <Volume2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Audio</span>
          </button>

          {/* Vision AI / OCR */}
          <button
            onClick={() => {
              setShowAttachMenu(false);
              setVisionDocMediaUrl(undefined);
              setShowVisionDocModal(true);
            }}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-500/10 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-1">
              <Scan className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Vision AI</span>
          </button>

          {chat.isGroup && (
            <button
              onClick={() => {
                setShowAttachMenu(false);
                setShowCreatePoll(true);
              }}
              className="flex flex-col items-center p-2 rounded-xl hover:bg-slate-500/10 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1">
                <BarChart2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">Create Poll</span>
            </button>
          )}
        </div>
      )}

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div
          className={`p-2 border-t flex flex-wrap gap-1.5 justify-center ${
            isDark ? 'bg-[#121824] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setInputText((prev) => prev + emoji)}
              className="w-8 h-8 rounded-lg hover:bg-slate-500/20 text-base flex items-center justify-center cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Context-Aware Smart Replies Dock */}
      {smartReplies.length > 0 && !isRecordingVoice && (
        <div
          className={`px-3 py-1.5 border-t flex items-center space-x-1.5 overflow-x-auto no-scrollbar z-10 ${
            isDark ? 'bg-[#0A0E17] border-slate-800' : 'bg-slate-100/80 border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-1 text-emerald-400 shrink-0 mr-0.5">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-wider">Quick:</span>
          </div>
          {smartReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(reply);
                inputRef.current?.focus();
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap border cursor-pointer transition-all active:scale-95 shadow-2xs ${
                isDark
                  ? 'bg-[#151C2A] border-slate-800 text-slate-200 hover:border-emerald-400 hover:text-emerald-400'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-500 hover:text-emerald-600'
              }`}
            >
              {reply}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              if (messages.length > 0) {
                setIsFetchingSmartReplies(true);
                const recent = messages.slice(-5).map((m) => ({
                  senderName: m.senderName,
                  content: m.content
                }));
                aiCoreService
                  .getSmartReplies(recent, chat.name)
                  .then((r) => setSmartReplies(r))
                  .finally(() => setIsFetchingSmartReplies(false));
              }
            }}
            className="p-1 rounded-full text-slate-400 hover:text-emerald-400 cursor-pointer shrink-0"
            title="Regenerate Smart Replies"
          >
            <RefreshCw className={`w-3 h-3 ${isFetchingSmartReplies ? 'animate-spin' : ''}`} />
          </button>
        </div>
      )}

      {/* Scroll to Bottom Floating Arrow Indicator (WhatsApp Style) */}
      {showScrollBottomArrow && (
        <button
          onClick={() => {
            scrollContainerRef.current?.scrollTo({
              top: scrollContainerRef.current.scrollHeight,
              behavior: 'smooth'
            });
          }}
          className={`absolute right-4 bottom-[72px] z-40 w-8 h-8 rounded-full border shadow-lg flex items-center justify-center cursor-pointer transition-all active:scale-90 hover:opacity-100 ${
            isDark
              ? 'bg-[#151C2A] border-slate-700/60 text-emerald-400 hover:bg-[#1a2334] hover:text-emerald-300'
              : 'bg-white border-slate-200 text-emerald-500 hover:bg-slate-50 hover:text-emerald-600'
          }`}
          title="Scroll to bottom"
        >
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      )}

      {/* Bottom Message Input Bar */}
      <div
        className={`px-3 py-2 border-t flex items-center space-x-1.5 z-20 ${
          isDark ? 'bg-[#0F141C] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        {isRecordingVoice ? (
          <VoiceRecorderDock
            isDark={isDark}
            onSend={handleSendVoiceNote}
            onCancel={() => setIsRecordingVoice(false)}
          />
        ) : (
          <>
            {/* Attachment Button */}
            <button
              id="btn-attach"
              onClick={() => {
                setShowAttachMenu(!showAttachMenu);
                setShowEmojiPicker(false);
              }}
              className={`p-2 rounded-xl border cursor-pointer transition-colors ${
                showAttachMenu
                  ? 'border-emerald-400 bg-emerald-500/10 text-emerald-400'
                  : isDark
                  ? 'border-slate-800 text-slate-400 hover:text-white'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Emoji Button */}
            <button
              id="btn-emoji"
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowAttachMenu(false);
              }}
              className={`p-2 rounded-xl border cursor-pointer transition-colors ${
                showEmojiPicker
                  ? 'border-emerald-400 bg-emerald-500/10 text-emerald-400'
                  : isDark
                  ? 'border-slate-800 text-slate-400 hover:text-white'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <Smile className="w-4 h-4" />
            </button>

            {/* AI Message Assistant Trigger */}
            <button
              id="btn-ai-assist"
              type="button"
              onClick={() => {
                setAiAssistInitialText(
                  inputText || (replyTarget?.content ? `In response to "${replyTarget.content}": ` : '')
                );
                setAiAssistContext(
                  messages.slice(-3).map((m) => `${m.senderName}: ${m.content}`).join('\n')
                );
                setShowAiAssistModal(true);
              }}
              className="p-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer transition-all active:scale-95"
              title="AI Message Assistant (Rewrite, Tone, Translate, Explain, Polish)"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Input Field */}
            <form onSubmit={handleSend} className="flex-1">
              <input
                ref={inputRef}
                id="input-message"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  editingMessage
                    ? 'Edit message content...'
                    : `Message ${chat.name}...`
                }
                className={`w-full px-3.5 py-2 rounded-xl text-xs outline-none border transition-colors ${
                  isDark
                    ? 'bg-[#121824] border-slate-800 text-white focus:border-emerald-400'
                    : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-emerald-500'
                }`}
              />
            </form>

            {/* Send or Voice Note Button */}
            {inputText.trim() ? (
              <button
                id="btn-send-message"
                onClick={() => handleSend()}
                className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00E5A3] to-[#00C2FF] text-black flex items-center justify-center font-bold shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="btn-record-voice"
                onClick={() => setIsRecordingVoice(true)}
                className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 active:scale-95 cursor-pointer"
                title="Tap to record voice note (pause, preview, waveform)"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Forward Modal */}
      <ForwardModal
        isOpen={!!forwardingMessage}
        onClose={() => setForwardingMessage(null)}
        chats={allChats}
        onForward={(targetIds) => {
          if (forwardingMessage) {
            messagingRepository.forwardMessage(forwardingMessage.id, targetIds);
            setForwardingMessage(null);
          }
        }}
        isDark={isDark}
      />

      {/* Group Info & Permissions Modal */}
      {chat.isGroup && (
        <GroupInfoModal
          chat={chat}
          isOpen={showGroupInfo}
          onClose={() => setShowGroupInfo(false)}
          isDark={isDark}
        />
      )}

      {/* Create Poll Modal */}
      {chat.isGroup && (
        <CreatePollModal
          chatId={chat.id}
          isOpen={showCreatePoll}
          onClose={() => setShowCreatePoll(false)}
          isDark={isDark}
        />
      )}

      {/* Contact Profile Modal (for 1-on-1 chat) */}
      <ContactProfileModal
        contact={primaryContact}
        isOpen={showContactProfile}
        onClose={() => setShowContactProfile(false)}
        isDark={isDark}
        onStartChat={() => setShowContactProfile(false)}
        onStartCall={(c, isVideo) => {
          webrtcCallService.startCall(c, isVideo ? 'video' : 'voice');
        }}
      />

      {/* Active & Incoming Call Modals */}
      {callSession && (
        callSession.direction === 'incoming' && callSession.state === 'ringing' ? (
          <IncomingCallModal session={callSession} isDark={isDark} />
        ) : (
          <ActiveCallModal
            session={callSession}
            isDark={isDark}
            onClose={() => webrtcCallService.endCall()}
          />
        )
      )}

      {/* AI Message Assistant Modal */}
      <AIMessageAssistantModal
        isOpen={showAiAssistModal}
        onClose={() => setShowAiAssistModal(false)}
        initialText={aiAssistInitialText}
        chatContext={aiAssistContext}
        isDark={isDark}
        onApply={(refinedText: string, sendImmediately: boolean) => {
          if (sendImmediately) {
            messagingRepository.sendMessage({
              chatId,
              content: refinedText,
              replyToMessageId: replyTarget?.id
            });
            setInputText('');
            setReplyTarget(null);
          } else {
            setInputText(refinedText);
            inputRef.current?.focus();
          }
        }}
      />

      {/* AI Translate Modal */}
      <AITranslateModal
        isOpen={showTranslateModal}
        onClose={() => setShowTranslateModal(false)}
        sourceText={translateSourceText}
        isDark={isDark}
        onInsertToInput={(translatedText: string) => {
          if (activeActionMenuMsgId) {
            setTranslatedMessages((prev) => ({
              ...prev,
              [activeActionMenuMsgId]: translatedText
            }));
          } else {
            setInputText(translatedText);
            inputRef.current?.focus();
          }
        }}
      />

      {/* AI Vision & Document AI Modal */}
      <AIVisionDocModal
        isOpen={showVisionDocModal}
        onClose={() => setShowVisionDocModal(false)}
        isDark={isDark}
        initialMediaUrl={visionDocMediaUrl}
        initialMimeType={visionDocMime}
        onInsertToInput={(extracted: string) => {
          setInputText((prev) => (prev ? `${prev}\n${extracted}` : extracted));
          inputRef.current?.focus();
        }}
      />

      {/* Export Success Toast notification */}
      {showExportSuccess && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg animate-bounce duration-500">
          <Download className="w-4 h-4 animate-pulse" />
          <span>Chat Conversation History Exported Successfully!</span>
        </div>
      )}
    </div>
  );
}
