export type ScreenRoute =
  | 'splash'
  | 'welcome'
  | 'onboarding'
  | 'login'
  | 'otp'
  | 'profile'
  | 'home'
  | 'chat-detail'
  | 'settings'
  | 'about'
  | 'help'
  | 'backup-restore';

export type HomeTab = 'chats' | 'calls' | 'ai' | 'stories' | 'contacts';

export type MessageType =
  | 'text'
  | 'image'
  | 'video'
  | 'document'
  | 'audio'
  | 'voice_note'
  | 'poll';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs
}

export interface AttachmentData {
  url: string;
  name?: string;
  size?: string;
  duration?: string;
  thumbnailUrl?: string;
}

export interface PollOption {
  id: string;
  text: string;
  voterIds: string[];
}

export interface PollData {
  question: string;
  options: PollOption[];
  totalVotes: number;
  allowMultipleAnswers?: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  content: string; // text, caption or URL
  attachment?: AttachmentData;
  poll?: PollData;
  timestamp: number;
  timeFormatted: string;
  status: MessageStatus;
  isEdited?: boolean;
  isDeletedForEveryone?: boolean;
  deletedForUsers?: string[];
  replyToMessageId?: string;
  replyToMessage?: {
    id: string;
    senderName: string;
    content: string;
    type: MessageType;
  };
  isForwarded?: boolean;
  isPinned?: boolean;
  isStarred?: boolean;
  reactions: MessageReaction[];
  mentions?: string[]; // @handles
}

export interface ChatParticipant {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatarBg: string;
  isOnline: boolean;
  lastSeen: string;
  vibeStatus: string;
  isTyping?: boolean;
}

export interface GroupMember {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatarBg: string;
  isAdmin: boolean;
  isOwner?: boolean;
  joinedAt: string;
}

export interface GroupPermissions {
  canSendMessages: boolean;
  canSendMedia: boolean;
  canAddMembers: boolean;
  canEditGroupInfo: boolean;
}

export interface ChatConversation {
  id: string;
  isGroup: boolean;
  name: string;
  avatar: string;
  avatarBg: string;
  description?: string;
  groupPhoto?: string;
  adminIds?: string[];
  members?: GroupMember[];
  permissions?: GroupPermissions;
  participants: ChatParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  isMuted: boolean;
  isAiCopilot?: boolean;
  pinnedMessageId?: string;
  draftText?: string;
}

export interface ContactItem {
  id: string;
  name: string;
  username: string;
  phoneNumber: string;
  bio: string;
  avatar: string;
  avatarBg: string;
  isOnline: boolean;
  lastSeen: string;
  vibeStatus: string;
  isBlocked?: boolean;
  isReported?: boolean;
  chatId?: string;
}

export type StoryType = 'photo' | 'video' | 'text';
export type StoryPrivacy = 'everyone' | 'contacts' | 'selected' | 'nobody';

export interface StoryViewer {
  userId: string;
  name: string;
  avatar: string;
  viewedAt: string;
  reaction?: string;
}

export interface StoryItem {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorAvatarBg: string;
  type: StoryType;
  content: string; // text body or media caption
  mediaUrl?: string;
  bgGradient?: string;
  createdAt: number;
  timeAgo: string;
  viewCount: number;
  viewers: StoryViewer[];
  privacy: StoryPrivacy;
  isSelf?: boolean;
  isHidden?: boolean;
  reactions: { emoji: string; count: number; users: string[] }[];
}

export interface CountryCode {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  username: string;
  phoneNumber: string;
  bio: string;
  avatarUrl: string | null;
  vibeStatus: string;
  language: string;
  isOnline: boolean;
  accountCreated?: boolean;
  dpPrivacy?: 'everyone' | 'contacts' | 'nobody';
  storyPrivacy?: 'everyone' | 'contacts' | 'nobody';
  linkedGmail?: string | null;
  lastBackupTime?: string | null;
  backupSize?: string | null;
  autoBackupInterval?: 'none' | 'daily' | 'weekly' | 'monthly';
}

export interface AndroidPermission {
  id: string;
  name: string;
  description: string;
  granted: boolean;
  iconName: string;
}

export interface CodeFile {
  path: string;
  language: string;
  category: 'Configuration' | 'Architecture' | 'Data Layer' | 'UI & Compose';
  content: string;
}

export type CallType = 'voice' | 'video';
export type CallDirection = 'incoming' | 'outgoing';
export type CallState =
  | 'idle'
  | 'calling'
  | 'ringing'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'ended';

export type AudioOutputDevice = 'earpiece' | 'speaker' | 'bluetooth';
export type NetworkQuality = 'excellent' | 'good' | 'poor' | 'reconnecting';

export interface CallParticipant {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatarBg: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isSpeaking?: boolean;
  networkQuality: NetworkQuality;
  role?: 'host' | 'participant';
}

export interface CallSession {
  id: string;
  type: CallType;
  direction: CallDirection;
  state: CallState;
  contact: ContactItem;
  participants: CallParticipant[];
  startTime?: number;
  durationSeconds: number;
  isMuted: boolean;
  isVideoOn: boolean;
  isSpeaker: boolean;
  audioOutput: AudioOutputDevice;
  isFrontCamera: boolean;
  networkQuality: NetworkQuality;
  stats: {
    pingMs: number;
    packetLoss: number;
    bitrateKbps: number;
    resolution?: string;
    fps?: number;
  };
}

export interface CallHistoryItem {
  id: string;
  contactId: string;
  name: string;
  handle: string;
  avatar?: string;
  avatarBg?: string;
  type: CallType;
  direction: CallDirection;
  status: 'answered' | 'missed' | 'declined';
  duration: string;
  timestamp: number;
  time: string;
}

