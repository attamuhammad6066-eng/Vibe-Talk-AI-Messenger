import {
  ChatConversation,
  Message,
  MessageType,
  MessageStatus,
  MessageReaction,
  AttachmentData,
  PollData,
  GroupMember,
  GroupPermissions,
  ContactItem,
  StoryItem,
  StoryPrivacy,
  StoryViewer
} from '../types';
import {
  CURRENT_USER_ID,
  INITIAL_CHATS,
  INITIAL_MESSAGES,
  INITIAL_CONTACTS,
  INITIAL_STORIES
} from '../data/mockMessagingData';
import { aiCoreService } from './aiCoreService';
import { securityEngine } from '../security/AdvancedSecurityEngine';

type Listener = () => void;

class MessagingRepository {
  private chats: ChatConversation[] = [];
  private messages: Record<string, Message[]> = {};
  private contacts: ContactItem[] = [];
  private stories: StoryItem[] = [];
  private listeners: Set<Listener> = new Set();
  private typingTimeouts: Record<string, any> = {};

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedChats = localStorage.getItem('vibetalk_chats_v3');
      const savedMessages = localStorage.getItem('vibetalk_messages_v3');
      const savedContacts = localStorage.getItem('vibetalk_contacts_v3');
      const savedStories = localStorage.getItem('vibetalk_stories_v3');

      if (savedChats && savedMessages) {
        this.chats = JSON.parse(savedChats);
        this.messages = JSON.parse(savedMessages);
      } else {
        this.chats = JSON.parse(JSON.stringify(INITIAL_CHATS));
        this.messages = JSON.parse(JSON.stringify(INITIAL_MESSAGES));
        this.syncLastMessages();
      }

      if (savedContacts) {
        this.contacts = JSON.parse(savedContacts);
      } else {
        this.contacts = JSON.parse(JSON.stringify(INITIAL_CONTACTS));
      }

      if (savedStories) {
        this.stories = JSON.parse(savedStories);
      } else {
        this.stories = JSON.parse(JSON.stringify(INITIAL_STORIES));
      }

      this.saveToStorage();
    } catch (e) {
      this.chats = JSON.parse(JSON.stringify(INITIAL_CHATS));
      this.messages = JSON.parse(JSON.stringify(INITIAL_MESSAGES));
      this.contacts = JSON.parse(JSON.stringify(INITIAL_CONTACTS));
      this.stories = JSON.parse(JSON.stringify(INITIAL_STORIES));
      this.syncLastMessages();
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('vibetalk_chats_v3', JSON.stringify(this.chats));
      localStorage.setItem('vibetalk_messages_v3', JSON.stringify(this.messages));
      localStorage.setItem('vibetalk_contacts_v3', JSON.stringify(this.contacts));
      localStorage.setItem('vibetalk_stories_v3', JSON.stringify(this.stories));
    } catch (e) {
      // ignore storage quota errors
    }
  }

  private syncLastMessages() {
    this.chats.forEach((chat) => {
      const chatMsgs = this.messages[chat.id] || [];
      const visibleMsgs = chatMsgs.filter(
        (m) => !m.isDeletedForEveryone && (!m.deletedForUsers || !m.deletedForUsers.includes(CURRENT_USER_ID))
      );
      chat.lastMessage = visibleMsgs.length > 0 ? visibleMsgs[visibleMsgs.length - 1] : undefined;
    });
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.syncLastMessages();
    this.saveToStorage();
    this.listeners.forEach((fn) => fn());
  }

  // ==========================================
  // --- CHAT & GROUP OPERATIONS ---
  // ==========================================

  public getChats(options?: {
    search?: string;
    filter?: 'all' | 'unread' | 'groups' | 'ai' | 'archived';
  }): ChatConversation[] {
    const search = (options?.search || '').toLowerCase().trim();
    const filter = options?.filter || 'all';

    return this.chats
      .filter((chat) => {
        if (filter === 'archived') {
          if (!chat.isArchived) return false;
        } else {
          if (chat.isArchived) return false;
        }

        if (filter === 'unread' && chat.unreadCount === 0) return false;
        if (filter === 'groups' && !chat.isGroup) return false;
        if (filter === 'ai' && !chat.isAiCopilot) return false;

        if (search) {
          const matchName = chat.name.toLowerCase().includes(search);
          const matchDesc = chat.description?.toLowerCase().includes(search) ?? false;
          const matchLastMsg = chat.lastMessage?.content.toLowerCase().includes(search) ?? false;
          const matchParticipants = chat.participants.some(
            (p) => p.name.toLowerCase().includes(search) || p.username.toLowerCase().includes(search)
          );
          return matchName || matchDesc || matchLastMsg || matchParticipants;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        const timeA = a.lastMessage?.timestamp || 0;
        const timeB = b.lastMessage?.timestamp || 0;
        return timeB - timeA;
      });
  }

  public getChat(chatId: string): ChatConversation | undefined {
    return this.chats.find((c) => c.id === chatId);
  }

  public togglePinChat(chatId: string) {
    const chat = this.chats.find((c) => c.id === chatId);
    if (chat) {
      chat.isPinned = !chat.isPinned;
      this.notify();
    }
  }

  public toggleArchiveChat(chatId: string) {
    const chat = this.chats.find((c) => c.id === chatId);
    if (chat) {
      chat.isArchived = !chat.isArchived;
      this.notify();
    }
  }

  public toggleMuteChat(chatId: string) {
    const chat = this.chats.find((c) => c.id === chatId);
    if (chat) {
      chat.isMuted = !chat.isMuted;
      this.notify();
    }
  }

  public markChatAsRead(chatId: string) {
    const chat = this.chats.find((c) => c.id === chatId);
    if (chat && chat.unreadCount > 0) {
      chat.unreadCount = 0;
      const msgs = this.messages[chatId] || [];
      msgs.forEach((m) => {
        if (m.senderId !== CURRENT_USER_ID && m.status !== 'read') {
          m.status = 'read';
        }
      });
      this.notify();
    }
  }

  public createGroup(params: {
    name: string;
    description?: string;
    avatar?: string;
    avatarGradient?: string;
    participantIds: string[];
  }): ChatConversation {
    const now = Date.now();
    const members: GroupMember[] = [
      {
        id: CURRENT_USER_ID,
        name: 'You',
        username: 'current_user',
        avatar: 'ME',
        avatarBg: 'from-emerald-400 to-cyan-500',
        isAdmin: true,
        isOwner: true,
        joinedAt: 'Today'
      }
    ];

    const participants = [
      {
        id: CURRENT_USER_ID,
        name: 'You',
        username: 'current_user',
        avatar: 'ME',
        avatarBg: 'from-emerald-400 to-cyan-500',
        isOnline: true,
        lastSeen: 'Active now',
        vibeStatus: 'Building 🛠️'
      }
    ];

    params.participantIds.forEach((pid) => {
      const contact = this.contacts.find((c) => c.id === pid || c.username === pid);
      if (contact) {
        members.push({
          id: contact.id,
          name: contact.name,
          username: contact.username,
          avatar: contact.avatar,
          avatarBg: contact.avatarBg,
          isAdmin: false,
          isOwner: false,
          joinedAt: 'Today'
        });
        participants.push({
          id: contact.id,
          name: contact.name,
          username: contact.username,
          avatar: contact.avatar,
          avatarBg: contact.avatarBg,
          isOnline: contact.isOnline,
          lastSeen: contact.lastSeen,
          vibeStatus: contact.vibeStatus
        });
      }
    });

    const newChat: ChatConversation = {
      id: `c_grp_${now}`,
      isGroup: true,
      name: params.name,
      avatar: params.avatar || params.name.slice(0, 2).toUpperCase(),
      avatarBg: params.avatarGradient || 'from-emerald-400 via-teal-500 to-cyan-500',
      description: params.description || 'Welcome to the group conversation.',
      adminIds: [CURRENT_USER_ID],
      members,
      participants,
      permissions: {
        canSendMessages: true,
        canSendMedia: true,
        canAddMembers: true,
        canEditGroupInfo: false
      },
      unreadCount: 0,
      isPinned: false,
      isArchived: false,
      isMuted: false
    };

    this.chats.unshift(newChat);
    this.messages[newChat.id] = [
      {
        id: `msg_init_${now}`,
        chatId: newChat.id,
        senderId: CURRENT_USER_ID,
        senderName: 'You',
        type: 'text',
        content: `Created group "${params.name}". Encrypted quantum channel established.`,
        timestamp: now,
        timeFormatted: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
        reactions: []
      }
    ];

    this.notify();
    return newChat;
  }

  public updateGroupInfo(
    chatId: string,
    data: {
      name?: string;
      description?: string;
      avatarBg?: string;
      permissions?: GroupPermissions;
    }
  ) {
    const chat = this.chats.find((c) => c.id === chatId && c.isGroup);
    if (!chat) return;

    if (data.name) {
      chat.name = data.name;
      chat.avatar = data.name.slice(0, 2).toUpperCase();
    }
    if (data.description !== undefined) chat.description = data.description;
    if (data.avatarBg) chat.avatarBg = data.avatarBg;
    if (data.permissions) chat.permissions = data.permissions;

    this.notify();
  }

  public addGroupMember(chatId: string, contactId: string) {
    const chat = this.chats.find((c) => c.id === chatId && c.isGroup);
    const contact = this.contacts.find((c) => c.id === contactId);
    if (!chat || !contact) return;

    if (!chat.members) chat.members = [];
    if (chat.members.some((m) => m.id === contact.id)) return;

    chat.members.push({
      id: contact.id,
      name: contact.name,
      username: contact.username,
      avatar: contact.avatar,
      avatarBg: contact.avatarBg,
      isAdmin: false,
      isOwner: false,
      joinedAt: 'Today'
    });

    chat.participants.push({
      id: contact.id,
      name: contact.name,
      username: contact.username,
      avatar: contact.avatar,
      avatarBg: contact.avatarBg,
      isOnline: contact.isOnline,
      lastSeen: contact.lastSeen,
      vibeStatus: contact.vibeStatus
    });

    this.sendMessage({
      chatId,
      content: `@${contact.username} was added to the group.`,
      type: 'text'
    });

    this.notify();
  }

  public removeGroupMember(chatId: string, memberId: string) {
    const chat = this.chats.find((c) => c.id === chatId && c.isGroup);
    if (!chat) return;

    const removedMember = chat.members?.find((m) => m.id === memberId);
    if (chat.members) {
      chat.members = chat.members.filter((m) => m.id !== memberId);
    }
    chat.participants = chat.participants.filter((p) => p.id !== memberId);
    if (chat.adminIds) {
      chat.adminIds = chat.adminIds.filter((id) => id !== memberId);
    }

    if (removedMember) {
      this.sendMessage({
        chatId,
        content: `@${removedMember.username} was removed from the group.`,
        type: 'text'
      });
    }

    this.notify();
  }

  public toggleGroupAdmin(chatId: string, memberId: string) {
    const chat = this.chats.find((c) => c.id === chatId && c.isGroup);
    if (!chat) return;

    if (!chat.adminIds) chat.adminIds = [];
    const member = chat.members?.find((m) => m.id === memberId);

    if (chat.adminIds.includes(memberId)) {
      chat.adminIds = chat.adminIds.filter((id) => id !== memberId);
      if (member) member.isAdmin = false;
    } else {
      chat.adminIds.push(memberId);
      if (member) member.isAdmin = true;
    }

    this.notify();
  }

  public getSharedMedia(chatId: string): { media: Message[]; docs: Message[] } {
    const msgs = this.messages[chatId] || [];
    const media = msgs.filter((m) => (m.type === 'image' || m.type === 'video') && m.attachment);
    const docs = msgs.filter((m) => (m.type === 'document' || m.type === 'audio') && m.attachment);
    return { media, docs };
  }

  // ==========================================
  // --- MESSAGE & POLL OPERATIONS ---
  // ==========================================

  public getMessages(chatId: string): Message[] {
    const list = this.messages[chatId] || [];
    return list.filter(
      (m) => !m.deletedForUsers || !m.deletedForUsers.includes(CURRENT_USER_ID)
    );
  }

  public sendMessage(params: {
    chatId: string;
    content: string;
    type?: MessageType;
    attachment?: AttachmentData;
    poll?: PollData;
    replyToMessageId?: string;
    mentions?: string[];
  }): Message {
    const {
      chatId,
      content,
      type = 'text',
      attachment,
      poll,
      replyToMessageId,
      mentions
    } = params;

    const chatMsgs = this.messages[chatId] || [];
    const replyTarget = replyToMessageId
      ? chatMsgs.find((m) => m.id === replyToMessageId)
      : undefined;

    const now = Date.now();
    const timeFormatted = new Date(now).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newMessage: Message = {
      id: `msg_${now}_${Math.random().toString(36).substr(2, 5)}`,
      chatId,
      senderId: CURRENT_USER_ID,
      senderName: 'You',
      type,
      content: type === 'text' && !content.startsWith('E2EE_AM::') ? securityEngine.encryptMessage(content) : content,
      attachment,
      poll,
      timestamp: now,
      timeFormatted,
      status: 'sending',
      reactions: [],
      mentions,
      replyToMessageId,
      replyToMessage: replyTarget
        ? {
            id: replyTarget.id,
            senderName: replyTarget.senderName,
            content: replyTarget.content,
            type: replyTarget.type
          }
        : undefined
    };

    chatMsgs.push(newMessage);
    this.messages[chatId] = chatMsgs;
    this.notify();

    setTimeout(() => {
      newMessage.status = 'sent';
      this.notify();
    }, 400);

    setTimeout(() => {
      newMessage.status = 'delivered';
      this.notify();
    }, 800);

    setTimeout(() => {
      newMessage.status = 'read';
      this.notify();
    }, 2200);

    this.simulatePeerResponse(chatId, content);

    return newMessage;
  }

  public sendPoll(chatId: string, question: string, optionTexts: string[]): Message {
    const options = optionTexts
      .filter((t) => t.trim().length > 0)
      .map((text, i) => ({
        id: `opt_${Date.now()}_${i}`,
        text: text.trim(),
        voterIds: []
      }));

    return this.sendMessage({
      chatId,
      content: `Poll: ${question}`,
      type: 'poll',
      poll: {
        question,
        options,
        totalVotes: 0,
        allowMultipleAnswers: false
      }
    });
  }

  public votePoll(messageId: string, optionId: string, userId = CURRENT_USER_ID) {
    for (const chatId in this.messages) {
      const msg = this.messages[chatId].find((m) => m.id === messageId);
      if (msg && msg.poll) {
        const option = msg.poll.options.find((o) => o.id === optionId);
        if (!option) return;

        // Toggle user vote
        const hasVoted = option.voterIds.includes(userId);
        if (hasVoted) {
          option.voterIds = option.voterIds.filter((uid) => uid !== userId);
        } else {
          // If single choice, remove from other options first
          if (!msg.poll.allowMultipleAnswers) {
            msg.poll.options.forEach((o) => {
              o.voterIds = o.voterIds.filter((uid) => uid !== userId);
            });
          }
          option.voterIds.push(userId);
        }

        // Recalculate total unique voters
        const allVoters = new Set<string>();
        msg.poll.options.forEach((o) => o.voterIds.forEach((uid) => allVoters.add(uid)));
        msg.poll.totalVotes = allVoters.size;

        this.notify();
        return;
      }
    }
  }

  private simulatePeerResponse(chatId: string, userMessageContent: string) {
    const chat = this.getChat(chatId);
    if (!chat) return;

    if (this.typingTimeouts[chatId]) {
      clearTimeout(this.typingTimeouts[chatId]);
    }

    const typingDuration = 1800;
    setTimeout(() => {
      const activeParticipant = chat.participants.find((p) => p.id !== CURRENT_USER_ID) || chat.participants[0];
      if (activeParticipant) {
        activeParticipant.isTyping = true;
        this.notify();
      }

      this.typingTimeouts[chatId] = setTimeout(() => {
        if (activeParticipant) {
          activeParticipant.isTyping = false;
        }

        let replyText = '';
        let senderId = activeParticipant?.id || 'usr_peer';
        let senderName = activeParticipant?.name || chat.name;

        if (chat.isAiCopilot) {
          aiCoreService
            .chat(
              [
                ...((this.messages[chatId] || []).slice(-6).map((m) => ({
                  role: (m.senderId === CURRENT_USER_ID ? 'user' : 'model') as 'user' | 'model',
                  content: m.content
                }))),
                { role: 'user' as const, content: userMessageContent }
              ],
              'general'
            )
            .then((res) => {
              const now = Date.now();
              const responseMsg: Message = {
                id: `msg_ai_${now}`,
                chatId,
                senderId: 'usr_ai_copilot',
                senderName: 'VibeTalk AI Copilot',
                type: 'text',
                content: securityEngine.encryptMessage(res.text),
                timestamp: now,
                timeFormatted: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'delivered',
                reactions: []
              };
              const msgs = this.messages[chatId] || [];
              msgs.push(responseMsg);
              this.messages[chatId] = msgs;
              this.notify();
            })
            .catch(() => {
              const now = Date.now();
              const responseMsg: Message = {
                id: `msg_ai_${now}`,
                chatId,
                senderId: 'usr_ai_copilot',
                senderName: 'VibeTalk AI Copilot',
                type: 'text',
                content: securityEngine.encryptMessage(`⚡ VibeTalk AI: I received "${userMessageContent.slice(0, 30)}...". All systems operational!`),
                timestamp: now,
                timeFormatted: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'delivered',
                reactions: []
              };
              const msgs = this.messages[chatId] || [];
              msgs.push(responseMsg);
              this.messages[chatId] = msgs;
              this.notify();
            });
          return;
        } else if (chat.id === 'c_atta') {
          replyText = `Core engines are looking spectacular! Voice/video WebRTC engine, waveforms, and central AI Core are responsive, fluid, and 100% secure.`;
        } else if (chat.isGroup) {
          replyText = `@You Poll, group event, and AI updates synced across all peers.`;
        } else {
          replyText = `Got your update! Connecting via Room DAO stream. 👍`;
        }

        const now = Date.now();
        const responseMsg: Message = {
          id: `msg_resp_${now}`,
          chatId,
          senderId,
          senderName,
          type: 'text',
          content: securityEngine.encryptMessage(replyText),
          timestamp: now,
          timeFormatted: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered',
          reactions: []
        };

        const msgs = this.messages[chatId] || [];
        msgs.push(responseMsg);
        this.messages[chatId] = msgs;

        msgs.forEach((m) => {
          if (m.senderId === CURRENT_USER_ID) {
            m.status = 'read';
          }
        });

        this.notify();
      }, typingDuration);
    }, 600);
  }

  public editMessage(messageId: string, newContent: string) {
    for (const chatId in this.messages) {
      const msg = this.messages[chatId].find((m) => m.id === messageId);
      if (msg) {
        msg.content = newContent;
        msg.isEdited = true;
        this.notify();
        return;
      }
    }
  }

  public deleteMessage(messageId: string, mode: 'for_me' | 'for_everyone', userId = CURRENT_USER_ID) {
    for (const chatId in this.messages) {
      const msg = this.messages[chatId].find((m) => m.id === messageId);
      if (msg) {
        if (mode === 'for_everyone') {
          msg.isDeletedForEveryone = true;
          msg.content = '🚫 This message was deleted';
          msg.attachment = undefined;
          msg.poll = undefined;
        } else {
          if (!msg.deletedForUsers) msg.deletedForUsers = [];
          if (!msg.deletedForUsers.includes(userId)) {
            msg.deletedForUsers.push(userId);
          }
        }
        this.notify();
        return;
      }
    }
  }

  public toggleReaction(messageId: string, emoji: string, userId = CURRENT_USER_ID) {
    for (const chatId in this.messages) {
      const msg = this.messages[chatId].find((m) => m.id === messageId);
      if (msg) {
        if (!msg.reactions) msg.reactions = [];
        const existing = msg.reactions.find((r) => r.emoji === emoji);

        if (existing) {
          if (existing.users.includes(userId)) {
            existing.users = existing.users.filter((u) => u !== userId);
            existing.count -= 1;
            if (existing.count <= 0) {
              msg.reactions = msg.reactions.filter((r) => r.emoji !== emoji);
            }
          } else {
            existing.users.push(userId);
            existing.count += 1;
          }
        } else {
          msg.reactions.push({
            emoji,
            count: 1,
            users: [userId]
          });
        }
        this.notify();
        return;
      }
    }
  }

  public togglePinMessage(messageId: string) {
    for (const chatId in this.messages) {
      const msg = this.messages[chatId].find((m) => m.id === messageId);
      if (msg) {
        msg.isPinned = !msg.isPinned;
        const chat = this.getChat(chatId);
        if (chat) {
          chat.pinnedMessageId = msg.isPinned ? msg.id : undefined;
        }
        this.notify();
        return;
      }
    }
  }

  public toggleStarMessage(messageId: string) {
    for (const chatId in this.messages) {
      const msg = this.messages[chatId].find((m) => m.id === messageId);
      if (msg) {
        msg.isStarred = !msg.isStarred;
        this.notify();
        return;
      }
    }
  }

  public forwardMessage(messageId: string, targetChatIds: string[], userId = CURRENT_USER_ID) {
    let sourceMsg: Message | undefined;
    for (const chatId in this.messages) {
      sourceMsg = this.messages[chatId].find((m) => m.id === messageId);
      if (sourceMsg) break;
    }

    if (!sourceMsg) return;

    targetChatIds.forEach((targetId) => {
      this.sendMessage({
        chatId: targetId,
        content: sourceMsg!.content,
        type: sourceMsg!.type,
        attachment: sourceMsg!.attachment,
        poll: sourceMsg!.poll
      });

      const msgs = this.messages[targetId];
      if (msgs && msgs.length > 0) {
        msgs[msgs.length - 1].isForwarded = true;
      }
    });

    this.notify();
  }

  // ==========================================
  // --- CONTACTS OPERATIONS ---
  // ==========================================

  public getContacts(query?: string, searchType: 'all' | 'name' | 'username' | 'phone' = 'all'): ContactItem[] {
    const q = (query || '').toLowerCase().trim();
    if (!q) return this.contacts;

    return this.contacts.filter((c) => {
      if (searchType === 'name') return c.name.toLowerCase().includes(q);
      if (searchType === 'username') return c.username.toLowerCase().includes(q.replace('@', ''));
      if (searchType === 'phone') return c.phoneNumber.includes(q);

      return (
        c.name.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q.replace('@', '')) ||
        c.phoneNumber.includes(q)
      );
    });
  }

  public addContact(contactData: {
    name: string;
    username: string;
    phoneNumber: string;
    bio?: string;
  }): ContactItem {
    const now = Date.now();
    const initials = contactData.name.slice(0, 2).toUpperCase();
    const newContact: ContactItem = {
      id: `con_${now}`,
      name: contactData.name,
      username: contactData.username.replace('@', ''),
      phoneNumber: contactData.phoneNumber,
      bio: contactData.bio || 'Connected via VibeTalk AI',
      avatar: initials,
      avatarBg: 'from-emerald-400 to-cyan-500',
      isOnline: true,
      lastSeen: 'Active now',
      vibeStatus: 'Available 💬'
    };

    this.contacts.unshift(newContact);
    this.notify();
    return newContact;
  }

  public toggleBlockContact(contactId: string) {
    const contact = this.contacts.find((c) => c.id === contactId);
    if (contact) {
      contact.isBlocked = !contact.isBlocked;
      this.notify();
    }
  }

  public reportContact(contactId: string, reason: string) {
    const contact = this.contacts.find((c) => c.id === contactId);
    if (contact) {
      contact.isReported = true;
      this.notify();
    }
  }

  public getOrCreateDirectChat(contact: ContactItem): string {
    const existing = this.chats.find(
      (c) => !c.isGroup && c.participants.some((p) => p.name === contact.name || p.username === contact.username)
    );
    if (existing) return existing.id;

    const now = Date.now();
    const newChat: ChatConversation = {
      id: `c_${now}`,
      isGroup: false,
      name: contact.name,
      avatar: contact.avatar,
      avatarBg: contact.avatarBg,
      unreadCount: 0,
      isPinned: false,
      isArchived: false,
      isMuted: false,
      participants: [
        {
          id: contact.id,
          name: contact.name,
          username: contact.username,
          avatar: contact.avatar,
          avatarBg: contact.avatarBg,
          isOnline: contact.isOnline,
          lastSeen: contact.lastSeen,
          vibeStatus: contact.vibeStatus
        }
      ]
    };

    this.chats.unshift(newChat);
    this.messages[newChat.id] = [
      {
        id: `msg_hello_${now}`,
        chatId: newChat.id,
        senderId: contact.id,
        senderName: contact.name,
        type: 'text',
        content: `Hey! Glad to connect on VibeTalk AI. ⚡`,
        timestamp: now,
        timeFormatted: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
        reactions: []
      }
    ];

    this.notify();
    return newChat.id;
  }

  // ==========================================
  // --- STORIES / AURA MOMENTS OPERATIONS ---
  // ==========================================

  public getStories(filter?: { hideOwn?: boolean }): StoryItem[] {
    return this.stories.filter((s) => {
      if (s.isHidden) return false;
      if (filter?.hideOwn && s.isSelf) return false;
      return true;
    });
  }

  public getStory(storyId: string): StoryItem | undefined {
    return this.stories.find((s) => s.id === storyId);
  }

  public addStory(params: {
    type: 'photo' | 'video' | 'text';
    content: string;
    mediaUrl?: string;
    bgGradient?: string;
    privacy?: StoryPrivacy;
  }): StoryItem {
    const now = Date.now();
    const newStory: StoryItem = {
      id: `story_${now}`,
      authorId: CURRENT_USER_ID,
      authorName: 'Your Story',
      authorUsername: 'current_user',
      authorAvatar: 'ME',
      authorAvatarBg: 'from-emerald-400 to-cyan-500',
      type: params.type,
      content: params.content,
      mediaUrl: params.mediaUrl,
      bgGradient: params.bgGradient || 'from-emerald-600 via-teal-700 to-cyan-800',
      createdAt: now,
      timeAgo: 'Just now',
      viewCount: 0,
      viewers: [],
      privacy: params.privacy || 'contacts',
      isSelf: true,
      reactions: []
    };

    // Replace or prepend self story
    const existingSelfIndex = this.stories.findIndex((s) => s.isSelf);
    if (existingSelfIndex >= 0) {
      this.stories.splice(existingSelfIndex, 1);
    }
    this.stories.unshift(newStory);
    this.notify();
    return newStory;
  }

  public viewStory(storyId: string, viewer: StoryViewer) {
    const story = this.stories.find((s) => s.id === storyId);
    if (story) {
      if (!story.viewers.some((v) => v.userId === viewer.userId)) {
        story.viewers.push(viewer);
        story.viewCount = story.viewers.length;
        this.notify();
      }
    }
  }

  public reactToStory(storyId: string, emoji: string, userId = CURRENT_USER_ID) {
    const story = this.stories.find((s) => s.id === storyId);
    if (!story) return;

    if (!story.reactions) story.reactions = [];
    const existing = story.reactions.find((r) => r.emoji === emoji);

    if (existing) {
      if (!existing.users.includes(userId)) {
        existing.users.push(userId);
        existing.count += 1;
      }
    } else {
      story.reactions.push({
        emoji,
        count: 1,
        users: [userId]
      });
    }

    this.notify();
  }

  public hideStory(storyId: string) {
    const story = this.stories.find((s) => s.id === storyId);
    if (story) {
      story.isHidden = true;
      this.notify();
    }
  }

  public deleteStory(storyId: string) {
    this.stories = this.stories.filter((s) => s.id !== storyId);
    this.notify();
  }

  public updateStoryPrivacy(storyId: string, privacy: StoryPrivacy) {
    const story = this.stories.find((s) => s.id === storyId);
    if (story) {
      story.privacy = privacy;
      this.notify();
    }
  }
}

export const messagingRepository = new MessagingRepository();
