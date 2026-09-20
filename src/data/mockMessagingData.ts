import { ChatConversation, Message, ContactItem, StoryItem } from '../types';

export const CURRENT_USER_ID = 'usr_current_001';

export const INITIAL_CHATS: ChatConversation[] = [
  {
    id: 'c_atta',
    isGroup: false,
    name: 'Atta Muhammad',
    avatar: 'AM',
    avatarBg: 'from-cyan-400 to-blue-500',
    unreadCount: 0,
    isPinned: true,
    isArchived: false,
    isMuted: false,
    pinnedMessageId: 'm_atta_pin',
    participants: [
      {
        id: 'usr_atta_lead',
        name: 'Atta Muhammad',
        username: 'atta_dev',
        avatar: 'AM',
        avatarBg: 'from-cyan-400 to-blue-500',
        isOnline: true,
        lastSeen: 'Active now',
        vibeStatus: 'Deep Focus ⚡'
      }
    ]
  },
  {
    id: 'c_group_core',
    isGroup: true,
    name: 'AM Digital Hub Core ⚡',
    avatar: 'DH',
    avatarBg: 'from-purple-500 via-indigo-500 to-cyan-500',
    description: 'Official core engineering, product craft & architecture hub for AM Digital Hub.',
    unreadCount: 2,
    isPinned: true,
    isArchived: false,
    isMuted: false,
    pinnedMessageId: 'm_grp_pin',
    adminIds: ['usr_atta_lead', CURRENT_USER_ID],
    permissions: {
      canSendMessages: true,
      canSendMedia: true,
      canAddMembers: true,
      canEditGroupInfo: false
    },
    members: [
      {
        id: 'usr_atta_lead',
        name: 'Atta Muhammad',
        username: 'atta_dev',
        avatar: 'AM',
        avatarBg: 'from-cyan-400 to-blue-500',
        isAdmin: true,
        isOwner: true,
        joinedAt: 'Jan 2026'
      },
      {
        id: CURRENT_USER_ID,
        name: 'You',
        username: 'current_user',
        avatar: 'ME',
        avatarBg: 'from-emerald-400 to-cyan-500',
        isAdmin: true,
        isOwner: false,
        joinedAt: 'Jan 2026'
      },
      {
        id: 'usr_elena',
        name: 'Dr. Elena Rostova',
        username: 'elena_sec',
        avatar: 'ER',
        avatarBg: 'from-pink-400 to-rose-500',
        isAdmin: false,
        isOwner: false,
        joinedAt: 'Feb 2026'
      },
      {
        id: 'usr_marcus',
        name: 'Marcus Vance',
        username: 'marcus_eng',
        avatar: 'MV',
        avatarBg: 'from-amber-400 to-orange-500',
        isAdmin: false,
        isOwner: false,
        joinedAt: 'Feb 2026'
      },
      {
        id: 'usr_sophia',
        name: 'Sophia Chen',
        username: 'sophia_ui',
        avatar: 'SC',
        avatarBg: 'from-emerald-400 to-teal-500',
        isAdmin: false,
        isOwner: false,
        joinedAt: 'Feb 2026'
      }
    ],
    participants: [
      {
        id: 'usr_atta_lead',
        name: 'Atta Muhammad',
        username: 'atta_dev',
        avatar: 'AM',
        avatarBg: 'from-cyan-400 to-blue-500',
        isOnline: true,
        lastSeen: 'Active now',
        vibeStatus: 'Building 🛠️'
      },
      {
        id: 'usr_elena',
        name: 'Dr. Elena Rostova',
        username: 'elena_sec',
        avatar: 'ER',
        avatarBg: 'from-pink-400 to-rose-500',
        isOnline: true,
        lastSeen: 'Active now',
        vibeStatus: 'Quantum Sec 🔐'
      },
      {
        id: 'usr_marcus',
        name: 'Marcus Vance',
        username: 'marcus_eng',
        avatar: 'MV',
        avatarBg: 'from-amber-400 to-orange-500',
        isOnline: false,
        lastSeen: 'Last seen 15m ago',
        vibeStatus: 'Reviewing PRs ⚡'
      },
      {
        id: 'usr_sophia',
        name: 'Sophia Chen',
        username: 'sophia_ui',
        avatar: 'SC',
        avatarBg: 'from-emerald-400 to-teal-500',
        isOnline: true,
        lastSeen: 'Active now',
        vibeStatus: 'Material 3 Craft 🎨'
      }
    ]
  },
  {
    id: 'c_ai',
    isGroup: false,
    name: 'VibeTalk AI Copilot',
    avatar: 'AI',
    avatarBg: 'from-emerald-400 to-cyan-500',
    unreadCount: 1,
    isPinned: true,
    isArchived: false,
    isMuted: false,
    isAiCopilot: true,
    participants: [
      {
        id: 'usr_ai_copilot',
        name: 'VibeTalk AI Copilot',
        username: 'vibetalk_ai',
        avatar: 'AI',
        avatarBg: 'from-emerald-400 to-cyan-500',
        isOnline: true,
        lastSeen: 'Always Online',
        vibeStatus: 'Neural Engine 🤖'
      }
    ]
  },
  {
    id: 'c_elena',
    isGroup: false,
    name: 'Dr. Elena Rostova',
    avatar: 'ER',
    avatarBg: 'from-pink-400 to-rose-500',
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    isMuted: true,
    participants: [
      {
        id: 'usr_elena',
        name: 'Dr. Elena Rostova',
        username: 'elena_sec',
        avatar: 'ER',
        avatarBg: 'from-pink-400 to-rose-500',
        isOnline: false,
        lastSeen: 'Last seen 42m ago',
        vibeStatus: 'Offline 💤'
      }
    ]
  },
  {
    id: 'c_sophia',
    isGroup: false,
    name: 'Sophia Chen',
    avatar: 'SC',
    avatarBg: 'from-emerald-400 to-teal-500',
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    isMuted: false,
    participants: [
      {
        id: 'usr_sophia',
        name: 'Sophia Chen',
        username: 'sophia_ui',
        avatar: 'SC',
        avatarBg: 'from-emerald-400 to-teal-500',
        isOnline: true,
        lastSeen: 'Active now',
        vibeStatus: 'Design Flow 🎨'
      }
    ]
  },
  {
    id: 'c_archived_1',
    isGroup: false,
    name: 'Legacy Node Server Sync',
    avatar: 'LN',
    avatarBg: 'from-slate-600 to-slate-800',
    unreadCount: 0,
    isPinned: false,
    isArchived: true,
    isMuted: true,
    participants: [
      {
        id: 'usr_legacy',
        name: 'Server Telemetry',
        username: 'node_daemon',
        avatar: 'LN',
        avatarBg: 'from-slate-600 to-slate-800',
        isOnline: false,
        lastSeen: 'Archived',
        vibeStatus: 'Muted 🔕'
      }
    ]
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  c_atta: [
    {
      id: 'm_atta_pin',
      chatId: 'c_atta',
      senderId: 'usr_atta_lead',
      senderName: 'Atta Muhammad',
      type: 'text',
      content: '📌 Clean Architecture principle: Core business rules are independent of UI and database drivers.',
      timestamp: Date.now() - 3600000 * 5,
      timeFormatted: '10:15 AM',
      status: 'read',
      isPinned: true,
      isStarred: true,
      reactions: [{ emoji: '🔥', count: 2, users: [CURRENT_USER_ID, 'usr_atta_lead'] }]
    },
    {
      id: 'm_atta_1',
      chatId: 'c_atta',
      senderId: 'usr_atta_lead',
      senderName: 'Atta Muhammad',
      type: 'text',
      content: 'Welcome to VibeTalk AI! The Android foundation and Material 3 design system are running at 60 FPS.',
      timestamp: Date.now() - 3600000 * 2,
      timeFormatted: '11:20 AM',
      status: 'read',
      reactions: [{ emoji: '❤️', count: 1, users: [CURRENT_USER_ID] }]
    },
    {
      id: 'm_atta_2',
      chatId: 'c_atta',
      senderId: CURRENT_USER_ID,
      senderName: 'You',
      type: 'text',
      content: 'Phase 2 Messaging Core is live, now moving to Phase 3: Groups, Contacts, and Stories!',
      timestamp: Date.now() - 3600000 * 1,
      timeFormatted: '11:35 AM',
      status: 'read',
      reactions: [{ emoji: '⚡', count: 1, users: ['usr_atta_lead'] }]
    },
    {
      id: 'm_atta_3',
      chatId: 'c_atta',
      senderId: 'usr_atta_lead',
      senderName: 'Atta Muhammad',
      type: 'voice_note',
      content: 'Voice note preview (Encrypted Opus/AAC stream)',
      attachment: {
        url: '#',
        duration: '0:28',
        size: '340 KB'
      },
      timestamp: Date.now() - 1800000,
      timeFormatted: '12:05 PM',
      status: 'read',
      reactions: []
    },
    {
      id: 'm_atta_4',
      chatId: 'c_atta',
      senderId: 'usr_atta_lead',
      senderName: 'Atta Muhammad',
      type: 'image',
      content: 'VibeTalk Clean Architecture & Room Entity Flow diagram',
      attachment: {
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
        name: 'architecture_diagram.png',
        size: '1.2 MB'
      },
      timestamp: Date.now() - 900000,
      timeFormatted: '12:20 PM',
      status: 'read',
      reactions: [{ emoji: '👍', count: 1, users: [CURRENT_USER_ID] }]
    }
  ],

  c_group_core: [
    {
      id: 'm_grp_pin',
      chatId: 'c_group_core',
      senderId: 'usr_atta_lead',
      senderName: 'Atta Muhammad',
      type: 'text',
      content: '📌 SPRINT NOTICE: AM Digital Hub Phase 3 Group, Contacts, and Stories integration active today.',
      timestamp: Date.now() - 86400000,
      timeFormatted: 'Yesterday',
      status: 'read',
      isPinned: true,
      reactions: [{ emoji: '🚀', count: 4, users: [CURRENT_USER_ID, 'usr_atta_lead', 'usr_elena', 'usr_sophia'] }]
    },
    {
      id: 'm_grp_poll_1',
      chatId: 'c_group_core',
      senderId: 'usr_atta_lead',
      senderName: 'Atta Muhammad',
      type: 'poll',
      content: 'Poll: Which story privacy should be the default for new users?',
      poll: {
        question: 'Which story privacy should be the default for new users?',
        options: [
          { id: 'opt_1', text: 'My Contacts only (Recommended)', voterIds: ['usr_atta_lead', 'usr_elena'] },
          { id: 'opt_2', text: 'Everyone (Public Discover)', voterIds: ['usr_marcus'] },
          { id: 'opt_3', text: 'Selected Close Friends', voterIds: [CURRENT_USER_ID, 'usr_sophia'] }
        ],
        totalVotes: 5,
        allowMultipleAnswers: false
      },
      timestamp: Date.now() - 5400000,
      timeFormatted: '11:15 AM',
      status: 'read',
      reactions: [{ emoji: '🗳️', count: 3, users: ['usr_atta_lead', CURRENT_USER_ID, 'usr_elena'] }]
    },
    {
      id: 'm_grp_1',
      chatId: 'c_group_core',
      senderId: 'usr_elena',
      senderName: 'Dr. Elena Rostova',
      type: 'text',
      content: 'Key exchange handshake confirmed with 256-bit encryption. Room DAO caching verified.',
      timestamp: Date.now() - 7200000,
      timeFormatted: '10:45 AM',
      status: 'read',
      reactions: [{ emoji: '🛡️', count: 2, users: ['usr_atta_lead', CURRENT_USER_ID] }]
    },
    {
      id: 'm_grp_2',
      chatId: 'c_group_core',
      senderId: 'usr_sophia',
      senderName: 'Sophia Chen',
      type: 'document',
      content: 'Material 3 design spec sheet and motion tokens',
      attachment: {
        url: '#',
        name: 'VibeTalk_M3_Spec.pdf',
        size: '4.8 MB'
      },
      timestamp: Date.now() - 3600000,
      timeFormatted: '11:45 AM',
      status: 'read',
      reactions: [{ emoji: '🎨', count: 3, users: ['usr_atta_lead', 'usr_elena', CURRENT_USER_ID] }]
    },
    {
      id: 'm_grp_3',
      chatId: 'c_group_core',
      senderId: 'usr_marcus',
      senderName: 'Marcus Vance',
      type: 'text',
      content: 'Hey @atta_dev, PR for multiple admins and group member permissions is ready for review.',
      mentions: ['@atta_dev'],
      timestamp: Date.now() - 1800000,
      timeFormatted: '12:10 PM',
      status: 'read',
      reactions: [{ emoji: '👀', count: 1, users: ['usr_atta_lead'] }]
    }
  ],

  c_ai: [
    {
      id: 'm_ai_1',
      chatId: 'c_ai',
      senderId: 'usr_ai_copilot',
      senderName: 'VibeTalk AI Copilot',
      type: 'text',
      content: 'Greetings! I am VibeTalk AI Copilot. I analyze context, draft intelligent smart replies, and summarize lengthy conversations.',
      timestamp: Date.now() - 3600000 * 3,
      timeFormatted: '9:30 AM',
      status: 'read',
      reactions: [{ emoji: '✨', count: 1, users: [CURRENT_USER_ID] }]
    }
  ],

  c_elena: [
    {
      id: 'm_elena_1',
      chatId: 'c_elena',
      senderId: 'usr_elena',
      senderName: 'Dr. Elena Rostova',
      type: 'document',
      content: 'Quantum key exchange security whitepaper',
      attachment: {
        url: '#',
        name: 'Quantum_Security_VibeTalk.pdf',
        size: '2.1 MB'
      },
      timestamp: Date.now() - 86400000 * 2,
      timeFormatted: '2 days ago',
      status: 'read',
      reactions: [{ emoji: '🔒', count: 1, users: [CURRENT_USER_ID] }]
    }
  ],

  c_sophia: [
    {
      id: 'm_sophia_1',
      chatId: 'c_sophia',
      senderId: 'usr_sophia',
      senderName: 'Sophia Chen',
      type: 'video',
      content: 'Jetpack Compose Material 3 bottom navigation ripple animation',
      attachment: {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        duration: '0:14',
        name: 'm3_ripple_demo.mp4',
        size: '3.4 MB'
      },
      timestamp: Date.now() - 86400000,
      timeFormatted: 'Yesterday',
      status: 'read',
      reactions: [{ emoji: '😍', count: 1, users: [CURRENT_USER_ID] }]
    }
  ],

  c_archived_1: [
    {
      id: 'm_arch_1',
      chatId: 'c_archived_1',
      senderId: 'usr_legacy',
      senderName: 'Server Telemetry',
      type: 'text',
      content: 'All old socket logs transferred to cold storage.',
      timestamp: Date.now() - 86400000 * 10,
      timeFormatted: '10 days ago',
      status: 'read',
      reactions: []
    }
  ]
};

export const INITIAL_CONTACTS: ContactItem[] = [
  {
    id: 'con_atta',
    name: 'Atta Muhammad',
    username: 'atta_dev',
    phoneNumber: '+1 (555) 234-8901',
    bio: 'Founder & Lead Architect @ AM Digital Hub • Android Jetpack & Room Champion',
    avatar: 'AM',
    avatarBg: 'from-cyan-400 to-blue-500',
    isOnline: true,
    lastSeen: 'Active now',
    vibeStatus: 'Deep Focus ⚡',
    chatId: 'c_atta'
  },
  {
    id: 'con_elena',
    name: 'Dr. Elena Rostova',
    username: 'elena_sec',
    phoneNumber: '+1 (555) 456-7890',
    bio: 'Quantum Security Scientist • Post-quantum encryption & KeyStore hardening',
    avatar: 'ER',
    avatarBg: 'from-pink-400 to-rose-500',
    isOnline: true,
    lastSeen: 'Active now',
    vibeStatus: 'Quantum Sec 🔐',
    chatId: 'c_elena'
  },
  {
    id: 'con_marcus',
    name: 'Marcus Vance',
    username: 'marcus_eng',
    phoneNumber: '+1 (555) 678-9012',
    bio: 'Staff Backend & Distributed Systems Engineer @ AM Hub',
    avatar: 'MV',
    avatarBg: 'from-amber-400 to-orange-500',
    isOnline: false,
    lastSeen: 'Last seen 15m ago',
    vibeStatus: 'Reviewing PRs ⚡'
  },
  {
    id: 'con_sophia',
    name: 'Sophia Chen',
    username: 'sophia_ui',
    phoneNumber: '+1 (555) 890-1234',
    bio: 'Product Designer & Material 3 Motion Lead',
    avatar: 'SC',
    avatarBg: 'from-emerald-400 to-teal-500',
    isOnline: true,
    lastSeen: 'Active now',
    vibeStatus: 'Design Flow 🎨',
    chatId: 'c_sophia'
  },
  {
    id: 'con_alex',
    name: 'Alex Rivera',
    username: 'alex_cloud',
    phoneNumber: '+1 (555) 345-6789',
    bio: 'Cloud Native & WebRTC Infrastructure Architect',
    avatar: 'AR',
    avatarBg: 'from-blue-500 to-indigo-600',
    isOnline: false,
    lastSeen: 'Last seen 2h ago',
    vibeStatus: 'Deploying 🚀'
  },
  {
    id: 'con_aisha',
    name: 'Aisha Patel',
    username: 'aisha_ai',
    phoneNumber: '+1 (555) 901-2345',
    bio: 'Machine Learning Research Engineer • Contextual NLP & Gemini agent integrations',
    avatar: 'AP',
    avatarBg: 'from-violet-500 to-fuchsia-500',
    isOnline: true,
    lastSeen: 'Active now',
    vibeStatus: 'Neural Vibe ✨'
  }
];

export const INITIAL_STORIES: StoryItem[] = [
  {
    id: 'story_self',
    authorId: CURRENT_USER_ID,
    authorName: 'Your Story',
    authorUsername: 'current_user',
    authorAvatar: 'ME',
    authorAvatarBg: 'from-emerald-400 to-cyan-500',
    type: 'text',
    content: 'Phase 3: Groups, Contacts, and Stories active on VibeTalk! 🚀 High-speed Jetpack Compose architecture.',
    bgGradient: 'from-emerald-600 via-teal-700 to-cyan-800',
    createdAt: Date.now() - 3600000 * 2,
    timeAgo: '2h ago',
    viewCount: 42,
    privacy: 'contacts',
    isSelf: true,
    viewers: [
      { userId: 'usr_atta_lead', name: 'Atta Muhammad', avatar: 'AM', viewedAt: '1h ago', reaction: '🔥' },
      { userId: 'usr_elena', name: 'Dr. Elena Rostova', avatar: 'ER', viewedAt: '45m ago', reaction: '❤️' },
      { userId: 'usr_sophia', name: 'Sophia Chen', avatar: 'SC', viewedAt: '20m ago', reaction: '👏' }
    ],
    reactions: [
      { emoji: '🔥', count: 3, users: ['usr_atta_lead', 'usr_marcus'] },
      { emoji: '❤️', count: 2, users: ['usr_elena', 'usr_sophia'] }
    ]
  },
  {
    id: 'story_atta',
    authorId: 'usr_atta_lead',
    authorName: 'Atta Muhammad',
    authorUsername: 'atta_dev',
    authorAvatar: 'AM',
    authorAvatarBg: 'from-cyan-400 to-blue-500',
    type: 'photo',
    content: 'AM Digital Hub 2026 Core architecture sprint! Quantum-resistant Room schema approved.',
    mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    createdAt: Date.now() - 3600000 * 4,
    timeAgo: '4h ago',
    viewCount: 88,
    privacy: 'everyone',
    viewers: [
      { userId: CURRENT_USER_ID, name: 'You', avatar: 'ME', viewedAt: '2h ago', reaction: '⚡' }
    ],
    reactions: [
      { emoji: '⚡', count: 12, users: [CURRENT_USER_ID] },
      { emoji: '🚀', count: 8, users: [] }
    ]
  },
  {
    id: 'story_sophia',
    authorId: 'usr_sophia',
    authorName: 'Sophia Chen',
    authorUsername: 'sophia_ui',
    authorAvatar: 'SC',
    authorAvatarBg: 'from-emerald-400 to-teal-500',
    type: 'video',
    content: 'Material 3 Dynamic Color Tokens & Spring Physics in Jetpack Compose 🎨',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    createdAt: Date.now() - 3600000 * 7,
    timeAgo: '7h ago',
    viewCount: 65,
    privacy: 'contacts',
    viewers: [
      { userId: CURRENT_USER_ID, name: 'You', avatar: 'ME', viewedAt: '3h ago' }
    ],
    reactions: [
      { emoji: '😍', count: 15, users: [CURRENT_USER_ID] }
    ]
  },
  {
    id: 'story_elena',
    authorId: 'usr_elena',
    authorName: 'Dr. Elena Rostova',
    authorUsername: 'elena_sec',
    authorAvatar: 'ER',
    authorAvatarBg: 'from-pink-400 to-rose-500',
    type: 'text',
    content: 'Our post-quantum key distribution benchmark paper was just accepted by the IEEE Security Symposium! 🔐✨',
    bgGradient: 'from-purple-900 via-indigo-900 to-slate-900',
    createdAt: Date.now() - 3600000 * 11,
    timeAgo: '11h ago',
    viewCount: 54,
    privacy: 'everyone',
    viewers: [],
    reactions: [
      { emoji: '🎉', count: 9, users: [CURRENT_USER_ID] }
    ]
  }
];
