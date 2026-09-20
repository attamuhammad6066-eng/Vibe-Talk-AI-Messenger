import { useState, useEffect } from 'react';
import {
  Bot,
  Flame,
  MessageSquare,
  Phone,
  Radio,
  Search,
  Users,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  Video,
  Plus,
  Compass,
  Pin,
  Archive,
  BellOff,
  CheckCheck,
  Settings,
  X,
  UserPlus,
  Share2,
  Lock,
  Eye,
  Check,
  AlertCircle,
  Clock,
  Shield,
  Smartphone
} from 'lucide-react';
import { HomeTab, UserProfile, ChatConversation, ContactItem, StoryItem, CallSession, CallHistoryItem } from '../../types';
import { messagingRepository } from '../../services/messagingRepository';
import { securityEngine } from '../../security/AdvancedSecurityEngine';
import { webrtcCallService } from '../../services/webrtcCallService';
import { NewGroupModal } from '../NewGroupModal';
import { AddContactModal } from '../AddContactModal';
import { ContactProfileModal } from '../ContactProfileModal';
import { ActiveCallModal } from '../ActiveCallModal';
import { IncomingCallModal } from '../IncomingCallModal';
import { CreateStoryModal } from '../CreateStoryModal';
import { StoryViewerModal } from '../StoryViewerModal';
import { InviteModal } from '../InviteModal';

interface HomeScreenProps {
  user: UserProfile;
  isDark: boolean;
  onRequestPermission: () => void;
  onOpenChat: (chatId: string) => void;
  onOpenSettings: () => void;
  onOpenProfilePrivacy: () => void;
}

export function HomeScreen({
  user,
  isDark,
  onRequestPermission,
  onOpenChat,
  onOpenSettings,
  onOpenProfilePrivacy
}: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<HomeTab>('chats');
  const [chatFilter, setChatFilter] = useState<'all' | 'unread' | 'groups' | 'ai' | 'archived'>('all');
  const [contactFilter, setContactFilter] = useState<'all' | 'online' | 'blocked'>('all');
  const [storyFilter, setStoryFilter] = useState<'all' | 'friends' | 'my_auras'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Repositories state
  const [chats, setChats] = useState<ChatConversation[]>([]);
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [stories, setStories] = useState<StoryItem[]>([]);

  // Permission state for contacts
  const [hasContactsPermission, setHasContactsPermission] = useState<boolean>(() => {
    return localStorage.getItem('vibetalk_perm_contacts_v3') === 'true';
  });

  // Modal triggers
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);
  const [callSession, setCallSession] = useState<CallSession | null>(() =>
    webrtcCallService.getCurrentSession()
  );
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>(() =>
    webrtcCallService.getCallHistory()
  );
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [viewingStoryIndex, setViewingStoryIndex] = useState<number | null>(null);

  // Subscribe to WebRTC call state and call history
  useEffect(() => {
    const unsubSession = webrtcCallService.subscribe((s) => setCallSession(s));
    const unsubHistory = webrtcCallService.subscribeHistory((h) => setCallHistory(h));
    return () => {
      unsubSession();
      unsubHistory();
    };
  }, []);

  // Subscribe to Room repository updates
  useEffect(() => {
    const update = () => {
      setChats(
        messagingRepository.getChats({
          search: activeTab === 'chats' ? searchQuery : undefined,
          filter: chatFilter
        })
      );
      setContacts(
        messagingRepository.getContacts(activeTab === 'contacts' ? searchQuery : undefined)
      );
      setStories(messagingRepository.getStories());
    };

    update();
    const unsubscribe = messagingRepository.subscribe(update);
    return () => unsubscribe();
  }, [searchQuery, chatFilter, activeTab]);

  const handleGrantContactsPermission = () => {
    localStorage.setItem('vibetalk_perm_contacts_v3', 'true');
    setHasContactsPermission(true);
    setContacts(messagingRepository.getContacts());
  };

  // Filtered contacts based on sub-filter
  const filteredContacts = contacts.filter((c) => {
    if (contactFilter === 'online') return c.isOnline;
    if (contactFilter === 'blocked') return c.isBlocked;
    return true;
  });

  // Filtered stories
  const filteredStories = stories.filter((s) => {
    if (storyFilter === 'my_auras') return s.authorId === 'usr_current';
    if (storyFilter === 'friends') return s.authorId !== 'usr_current';
    return true;
  });

  // Separate pinned vs standard chats
  const pinnedChats = chats.filter((c) => c.isPinned);
  const regularChats = chats.filter((c) => !c.isPinned);

  return (
    <div
      className={`h-full w-full flex flex-col justify-between select-none overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#0A0D14] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Signature Top Header */}
      <div
        className={`px-4 pt-3 pb-3 border-b flex flex-col gap-2.5 ${
          isDark ? 'bg-[#0F141C] border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00E5A3] to-[#00C2FF] flex items-center justify-center font-black text-black text-xs shadow-md shadow-emerald-500/10">
              V~
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-black tracking-tight">VibeTalk AI</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  PHASE 5
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-1.5">
            {/* User Aura Pill */}
            <div
              onClick={onRequestPermission}
              className={`flex items-center space-x-1.5 px-2 py-1 rounded-full border cursor-pointer hover:opacity-90 transition-all ${
                isDark ? 'bg-[#161F2E] border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#00E5A3] to-[#00C2FF] flex items-center justify-center text-[8px] font-bold text-black">
                {user.displayName.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-[10px] font-semibold text-emerald-400">
                {user.vibeStatus.split(' ')[0]}
              </span>
            </div>

            {/* Settings Button */}
            <button
              id="btn-open-settings"
              onClick={onOpenSettings}
              className={`p-1.5 rounded-xl border cursor-pointer ${
                isDark ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-600'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar with Context Awareness */}
        <div
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs ${
            isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder={
              activeTab === 'chats'
                ? 'Search encrypted chats, groups & copilot...'
                : activeTab === 'contacts'
                ? 'Search by name, @username, or phone number...'
                : activeTab === 'stories'
                ? 'Search stories & vibe auras...'
                : 'Search call history...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-xs placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Chips (when on chats tab) */}
        {activeTab === 'chats' && (
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 no-scrollbar text-[11px]">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'unread', label: 'Unread' },
                { id: 'groups', label: 'Groups' },
                { id: 'ai', label: 'AI Copilot' },
                { id: 'archived', label: 'Archived' }
              ] as const
            ).map((filter) => {
              const active = chatFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setChatFilter(filter.id)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap font-bold transition-all cursor-pointer border ${
                    active
                      ? 'bg-emerald-400 text-black border-emerald-400 shadow-xs'
                      : isDark
                      ? 'bg-[#121824] border-slate-800 text-slate-400 hover:text-slate-200'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Filter Chips (when on contacts tab) */}
        {activeTab === 'contacts' && (
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 no-scrollbar text-[11px]">
            {(
              [
                { id: 'all', label: `All Contacts (${contacts.length})` },
                { id: 'online', label: 'Online' },
                { id: 'blocked', label: 'Blocked' }
              ] as const
            ).map((filter) => {
              const active = contactFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setContactFilter(filter.id)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap font-bold transition-all cursor-pointer border ${
                    active
                      ? 'bg-emerald-400 text-black border-emerald-400 shadow-xs'
                      : isDark
                      ? 'bg-[#121824] border-slate-800 text-slate-400 hover:text-slate-200'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Filter Chips (when on stories tab) */}
        {activeTab === 'stories' && (
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 no-scrollbar text-[11px]">
            {(
              [
                { id: 'all', label: `All Vibes (${stories.length})` },
                { id: 'friends', label: 'Friends' },
                { id: 'my_auras', label: 'My Auras' }
              ] as const
            ).map((filter) => {
              const active = storyFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setStoryFilter(filter.id)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap font-bold transition-all cursor-pointer border ${
                    active
                      ? 'bg-emerald-400 text-black border-emerald-400 shadow-xs'
                      : isDark
                      ? 'bg-[#121824] border-slate-800 text-slate-400 hover:text-slate-200'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {/* ========================================================================= */}
        {/* CHATS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'chats' && (
          <div className="space-y-3">
            {/* Header with Encrypted Badge & New Group button */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Room Repository Active</span>
              </span>
              <button
                id="btn-new-group"
                onClick={() => setShowNewGroupModal(true)}
                className="text-[10px] font-bold text-emerald-400 flex items-center space-x-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>New Group</span>
              </button>
            </div>

            {/* Empty State */}
            {chats.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                {chatFilter === 'archived'
                  ? 'No archived chats. You can archive any conversation from its chat menu.'
                  : 'No conversations matching this filter.'}
              </div>
            ) : (
              <>
                {/* Pinned Chats Section */}
                {pinnedChats.length > 0 && chatFilter !== 'archived' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-1 text-[10px] font-black tracking-wider text-emerald-400 uppercase px-1">
                      <Pin className="w-3 h-3 rotate-45" />
                      <span>Pinned Conversations</span>
                    </div>

                    {pinnedChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => onOpenChat(chat.id)}
                        className={`p-3 rounded-2xl border flex items-center space-x-3 cursor-pointer transition-all ${
                          isDark
                            ? 'bg-[#121824] border-emerald-500/20 hover:border-emerald-500/50 hover:bg-[#161F2E]'
                            : 'bg-white border-emerald-200/80 hover:border-emerald-400 shadow-xs'
                        }`}
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div
                            className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${chat.avatarBg} p-[2px] flex items-center justify-center`}
                          >
                            <div
                              className={`w-full h-full rounded-[14px] flex items-center justify-center text-xs font-black ${
                                isDark ? 'bg-[#121824] text-white' : 'bg-white text-slate-900'
                              }`}
                            >
                              {chat.avatar}
                            </div>
                          </div>
                          {chat.participants.some((p) => p.isOnline) && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#0A0D14]" />
                          )}
                        </div>

                        {/* Middle Text */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1.5 truncate">
                              <h4 className="text-xs font-black truncate">{chat.name}</h4>
                              {chat.isMuted && <BellOff className="w-3 h-3 text-slate-400 shrink-0" />}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              {chat.lastMessage?.timeFormatted || ''}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-0.5">
                            <p className="text-[11px] text-slate-400 truncate pr-2">
                              {chat.participants.some((p) => p.isTyping) ? (
                                <span className="text-emerald-400 font-bold">typing...</span>
                              ) : chat.lastMessage?.content ? (
                                securityEngine.decryptMessage(chat.lastMessage.content)
                              ) : (
                                'No messages yet'
                              )}
                            </p>

                            <div className="flex items-center space-x-1 shrink-0">
                              <Pin className="w-3 h-3 text-emerald-400 rotate-45" />
                              {chat.unreadCount > 0 && (
                                <span className="w-4 h-4 rounded-full bg-gradient-to-r from-[#00E5A3] to-[#00C2FF] text-black font-extrabold text-[9px] flex items-center justify-center">
                                  {chat.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Regular Chats Section */}
                {regularChats.length > 0 && (
                  <div className="space-y-1.5">
                    {pinnedChats.length > 0 && chatFilter !== 'archived' && (
                      <div className="text-[10px] font-black tracking-wider text-slate-400 uppercase px-1 pt-1">
                        All Messages
                      </div>
                    )}

                    {regularChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => onOpenChat(chat.id)}
                        className={`p-3 rounded-2xl border flex items-center space-x-3 cursor-pointer transition-all ${
                          isDark
                            ? 'bg-[#121824] border-slate-800/80 hover:border-slate-700 hover:bg-[#161F2E]'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                        }`}
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div
                            className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${chat.avatarBg} p-[2px] flex items-center justify-center`}
                          >
                            <div
                              className={`w-full h-full rounded-[14px] flex items-center justify-center text-xs font-black ${
                                isDark ? 'bg-[#121824] text-white' : 'bg-white text-slate-900'
                              }`}
                            >
                              {chat.avatar}
                            </div>
                          </div>
                          {chat.participants.some((p) => p.isOnline) && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#0A0D14]" />
                          )}
                        </div>

                        {/* Middle Text */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1.5 truncate">
                              <h4 className="text-xs font-black truncate">{chat.name}</h4>
                              {chat.isMuted && <BellOff className="w-3 h-3 text-slate-400 shrink-0" />}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              {chat.lastMessage?.timeFormatted || ''}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-0.5">
                            <p className="text-[11px] text-slate-400 truncate pr-2">
                              {chat.participants.some((p) => p.isTyping) ? (
                                <span className="text-emerald-400 font-bold">typing...</span>
                              ) : chat.lastMessage?.content ? (
                                securityEngine.decryptMessage(chat.lastMessage.content)
                              ) : (
                                'No messages yet'
                              )}
                            </p>

                            {chat.unreadCount > 0 && (
                              <span className="w-4 h-4 rounded-full bg-gradient-to-r from-[#00E5A3] to-[#00C2FF] text-black font-extrabold text-[9px] flex items-center justify-center shrink-0">
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* CONTACTS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'contacts' && (
          <div className="space-y-3">
            {/* Contacts Top Bar with Action Buttons */}
            <div className="flex items-center justify-between px-1">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Encrypted Contacts
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  {contacts.length} Connected • AM Digital Hub
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  id="btn-invite-contacts"
                  onClick={() => setShowInviteModal(true)}
                  className="px-2.5 py-1 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold flex items-center space-x-1 cursor-pointer hover:bg-cyan-500/20"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Invite</span>
                </button>
                <button
                  id="btn-add-contact"
                  onClick={() => setShowAddContact(true)}
                  className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#00E5A3] to-[#00C2FF] text-black text-[10px] font-bold flex items-center space-x-1 cursor-pointer shadow-sm shadow-emerald-500/20"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Add Contact</span>
                </button>
              </div>
            </div>

            {/* Android Device Contacts Permission Card */}
            {!hasContactsPermission && (
              <div
                className={`p-3.5 rounded-2xl border flex flex-col space-y-2.5 ${
                  isDark
                    ? 'bg-gradient-to-r from-emerald-500/10 via-slate-900 to-transparent border-emerald-500/30'
                    : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <div className="flex items-start space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-400">
                      Device Contacts Permission
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                      Grant contacts permission to automatically sync your phonebook, discover friends by phone number, and detect nearby vibes.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-2 pt-1 border-t border-emerald-500/20">
                  <button
                    onClick={handleGrantContactsPermission}
                    className="px-3 py-1.5 rounded-xl bg-emerald-400 text-black text-xs font-bold shadow-sm cursor-pointer hover:bg-emerald-300 active:scale-95 transition-all"
                  >
                    Grant Contacts Access
                  </button>
                </div>
              </div>
            )}

            {/* Contact Items List */}
            {filteredContacts.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                {searchQuery
                  ? `No contacts matching "${searchQuery}". Tap "Add Contact" to add them.`
                  : 'No contacts in this list.'}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isDark
                        ? 'bg-[#121824] border-slate-800/80 hover:border-emerald-500/40 hover:bg-[#161F2E]'
                        : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${contact.avatarBg} flex items-center justify-center text-white font-black text-xs shadow-sm`}
                        >
                          {contact.avatar}
                        </div>
                        {contact.isOnline && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0A0D14]" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs font-black truncate">{contact.name}</h4>
                          {contact.isBlocked && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-400 font-bold">
                              Blocked
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-emerald-400 font-mono truncate">
                          @{contact.username} • {contact.phoneNumber}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {contact.vibeStatus}
                        </p>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div
                      className="flex items-center space-x-1 shrink-0 ml-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          const chatId = messagingRepository.getOrCreateDirectChat(contact);
                          onOpenChat(chatId);
                        }}
                        className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center cursor-pointer"
                        title="Start Chat"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          webrtcCallService.startCall(contact, 'voice');
                        }}
                        className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 flex items-center justify-center cursor-pointer"
                        title="Audio Call"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          webrtcCallService.startCall(contact, 'video');
                        }}
                        className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 flex items-center justify-center cursor-pointer"
                        title="Video Call"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STORIES / VIBES TAB */}
        {/* ========================================================================= */}
        {activeTab === 'stories' && (
          <div className="space-y-3">
            {/* Stories Header & Add Story Trigger */}
            <div className="flex items-center justify-between px-1">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Aura Moments & Vibes
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  Ephemeral 24h • E2E Encrypted
                </span>
              </div>

              <button
                id="btn-post-story"
                onClick={() => setShowCreateStory(true)}
                className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#00E5A3] to-[#00C2FF] text-black text-[10px] font-bold flex items-center space-x-1 cursor-pointer shadow-sm shadow-emerald-500/20"
              >
                <Plus className="w-3 h-3" />
                <span>Post Aura</span>
              </button>
            </div>

            {/* Story Privacy Control Banner */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between gap-2.5 ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center space-x-2 min-w-0">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-[11px] font-black leading-tight text-slate-200">Story Privacy Shield</h4>
                  <p className="text-[9px] text-slate-400 truncate mt-0.5">
                    Visible to: <span className="text-emerald-400 font-bold capitalize">{user.storyPrivacy || 'everyone'}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenProfilePrivacy}
                className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[9px] font-black border border-emerald-500/20 whitespace-nowrap transition-all uppercase cursor-pointer"
              >
                Privacy Control ⚙️
              </button>
            </div>

            {/* Stories Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* My Own Aura Card */}
              <div
                onClick={() => setShowCreateStory(true)}
                className={`p-3 rounded-2xl border border-dashed flex flex-col justify-between h-32 cursor-pointer transition-all ${
                  isDark
                    ? 'border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10'
                    : 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00E5A3] to-[#00C2FF] flex items-center justify-center text-black font-black text-xs">
                    +
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold">
                    You
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black">Share Your Aura</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Post photo, video, or text vibe
                  </p>
                </div>
              </div>

              {/* Feed of Real Stories */}
              {filteredStories.map((story, index) => (
                <div
                  key={story.id}
                  onClick={() => setViewingStoryIndex(index)}
                  className={`p-3 rounded-2xl border flex flex-col justify-between h-32 cursor-pointer overflow-hidden relative group transition-all ${
                    isDark ? 'border-slate-800 bg-[#121824] hover:border-slate-700' : 'border-slate-200 bg-white hover:shadow-md'
                  }`}
                >
                  {/* Background Aura Gradient / Preview */}
                  {story.type === 'text' && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-tr ${
                        story.bgGradient || 'from-emerald-600 to-cyan-700'
                      } opacity-20`}
                    />
                  )}

                  {/* Top Author Bar */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <div className="w-5 h-5 rounded-lg bg-emerald-400 text-black font-black text-[8px] flex items-center justify-center">
                        {story.authorName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[11px] font-black truncate text-slate-200">
                        {story.authorName}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {story.timeAgo}
                    </span>
                  </div>

                  {/* Body Content Preview */}
                  <div className="relative z-10 my-1">
                    <p className="text-[11px] font-bold line-clamp-2 leading-tight">
                      {story.content || `${story.type} aura shared`}
                    </p>
                    <span className="text-[10px] text-emerald-400 font-bold block mt-0.5 truncate capitalize">
                      ✨ {story.privacy}
                    </span>
                  </div>

                  {/* Footer: Views & Reactions */}
                  <div className="relative z-10 flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-current/10">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3 text-emerald-400" />
                      <span>{story.viewCount} views</span>
                    </div>
                    <div className="flex items-center space-x-0.5">
                      {story.reactions.map((r, i) => (
                        <span key={i}>{r.emoji}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CALLS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'calls' && (
          <div className="space-y-3">
            {/* Incoming Call Simulation Card for Testing */}
            <div
              className={`p-3 rounded-2xl border ${
                isDark
                  ? 'bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-transparent border-emerald-500/30'
                  : 'bg-emerald-50/80 border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Real-Time WebRTC Call Engine</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Phase 4 Ready</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2.5 leading-relaxed">
                Test the full WebRTC call lifecycle including ringtone, audio/video streams, mic/speaker switching, front/rear camera, and network quality indicators.
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const caller = contacts[0] || {
                      id: 'usr_atta_lead',
                      name: 'Atta Muhammad',
                      username: 'atta_dev',
                      phoneNumber: '+1-555-0199',
                      avatar: 'AM',
                      avatarBg: 'from-emerald-400 to-cyan-500',
                      isOnline: true,
                      lastSeen: 'Active now',
                      vibeStatus: 'Building real-time WebRTC audio/video calls 🚀',
                      isBlocked: false,
                      isReported: false,
                      bio: 'VibeTalk Lead Architect'
                    };
                    webrtcCallService.simulateIncomingCall(caller, 'voice');
                  }}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Simulate Voice Call</span>
                </button>
                <button
                  onClick={() => {
                    const caller = contacts[1] || contacts[0] || {
                      id: 'usr_elena_crypto',
                      name: 'Dr. Elena Rostova',
                      username: 'elena_sec',
                      phoneNumber: '+1-555-0144',
                      avatar: 'ER',
                      avatarBg: 'from-purple-500 to-pink-500',
                      isOnline: true,
                      lastSeen: 'Active now',
                      vibeStatus: '1080p 60fps WebRTC video live 📹',
                      isBlocked: false,
                      isReported: false,
                      bio: 'Cybersecurity Researcher'
                    };
                    webrtcCallService.simulateIncomingCall(caller, 'video');
                  }}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs font-bold border border-purple-500/30 flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Simulate Video Call</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Call Log ({callHistory.length})
              </span>
              <span className="text-[10px] font-medium text-emerald-400">Opus E2EE HD Voice</span>
            </div>

            {callHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No recent calls. Start a voice or video call above!
              </div>
            ) : (
              callHistory.map((call) => {
                const matchedContact = contacts.find((c) => c.id === call.contactId) || {
                  id: call.contactId,
                  name: call.name,
                  username: call.handle.replace('@', ''),
                  phoneNumber: '+1-555-0100',
                  avatar: call.name.slice(0, 2).toUpperCase(),
                  avatarBg: 'from-emerald-400 to-cyan-500',
                  isOnline: true,
                  lastSeen: 'Active now',
                  vibeStatus: 'VibeTalk User',
                  isBlocked: false,
                  isReported: false,
                  bio: 'VibeTalk Contact'
                };

                return (
                  <div
                    key={call.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between ${
                      isDark ? 'bg-[#121824] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                          call.status === 'missed'
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        {call.type === 'video' ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <PhoneCall className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs font-black">{call.name}</h4>
                          <span
                            className={`text-[9px] font-mono px-1 rounded ${
                              call.direction === 'incoming'
                                ? call.status === 'missed'
                                  ? 'bg-rose-500/20 text-rose-400'
                                  : 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-cyan-500/20 text-cyan-400'
                            }`}
                          >
                            {call.direction === 'incoming'
                              ? call.status === 'missed'
                                ? '↙ Missed'
                                : '↙ Incoming'
                              : '↗ Outgoing'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {call.time} •{' '}
                          <span
                            className={
                              call.status === 'missed' ? 'text-rose-400' : 'text-emerald-400'
                            }
                          >
                            {call.duration}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => webrtcCallService.startCall(matchedContact, 'voice')}
                        className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center cursor-pointer hover:bg-emerald-500/20 active:scale-95 transition-all"
                        title="Voice Call"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => webrtcCallService.startCall(matchedContact, 'video')}
                        className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center cursor-pointer hover:bg-purple-500/20 active:scale-95 transition-all"
                        title="Video Call"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* AI ENGINE TAB */}
        {/* ========================================================================= */}
        {activeTab === 'ai' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent border border-emerald-500/20">
              <div className="flex items-center space-x-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-black text-emerald-400">VibeTalk Neural Intelligence</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5">
                AI Copilot processes conversation threads, detects sentiment, and generates instant context replies.
              </p>
              <button
                onClick={() => onOpenChat('c_ai')}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00E5A3] to-[#00C2FF] text-black font-bold text-[11px] shadow-sm cursor-pointer"
              >
                Launch AI Copilot Chat
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Contextual Insights
              </span>
              <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-white border-slate-200'}`}>
                <h5 className="text-xs font-bold mb-1">Architecture Sync: Phase 3 Completed</h5>
                <p className="text-[10px] text-slate-400">
                  Groups management, member permissions, polls, contacts directory, and 24h aura stories are fully operational.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Signature Bottom Tab Navigation */}
      <div
        className={`px-3 py-2 border-t flex items-center justify-around z-20 ${
          isDark ? 'bg-[#0F141C] border-slate-800' : 'bg-white border-slate-200 shadow-md'
        }`}
      >
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex flex-col items-center space-y-1 cursor-pointer transition-colors ${
            activeTab === 'chats' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-[9px] font-bold">Chats</span>
        </button>

        <button
          onClick={() => setActiveTab('calls')}
          className={`flex flex-col items-center space-y-1 cursor-pointer transition-colors ${
            activeTab === 'calls' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span className="text-[9px] font-bold">Calls</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex flex-col items-center space-y-1 cursor-pointer transition-colors ${
            activeTab === 'ai' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#00E5A3] to-[#00C2FF] text-black flex items-center justify-center -mt-2 shadow-md shadow-emerald-500/20 font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-bold">AI</span>
        </button>

        <button
          onClick={() => setActiveTab('stories')}
          className={`flex flex-col items-center space-y-1 cursor-pointer transition-colors ${
            activeTab === 'stories' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span className="text-[9px] font-bold">Vibes</span>
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex flex-col items-center space-y-1 cursor-pointer transition-colors ${
            activeTab === 'contacts' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="text-[9px] font-bold">Contacts</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PHASE 3 MODALS */}
      {/* ========================================================================= */}

      {/* New Group Modal */}
      <NewGroupModal
        isOpen={showNewGroupModal}
        onClose={() => setShowNewGroupModal(false)}
        onGroupCreated={(newChatId) => onOpenChat(newChatId)}
        isDark={isDark}
      />

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={showAddContact}
        onClose={() => setShowAddContact(false)}
        isDark={isDark}
      />

      {/* Contact Profile Modal */}
      <ContactProfileModal
        contact={selectedContact}
        isOpen={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        isDark={isDark}
        onStartChat={(c) => {
          const chatId = messagingRepository.getOrCreateDirectChat(c);
          setSelectedContact(null);
          onOpenChat(chatId);
        }}
        onStartCall={(c, isVideo) => {
          webrtcCallService.startCall(c, isVideo ? 'video' : 'voice');
        }}
      />

      {/* Invite Friends Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        isDark={isDark}
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

      {/* Create Story Modal */}
      <CreateStoryModal
        isOpen={showCreateStory}
        onClose={() => setShowCreateStory(false)}
        isDark={isDark}
      />

      {/* Story Viewer Modal */}
      {viewingStoryIndex !== null && (
        <StoryViewerModal
          stories={filteredStories}
          initialIndex={viewingStoryIndex}
          isOpen={true}
          onClose={() => setViewingStoryIndex(null)}
          isDark={isDark}
        />
      )}
    </div>
  );
}
