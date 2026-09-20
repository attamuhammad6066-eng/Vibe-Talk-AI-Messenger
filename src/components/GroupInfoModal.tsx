import { useState } from 'react';
import {
  X,
  Users,
  Shield,
  UserPlus,
  UserMinus,
  Settings,
  Image,
  FileText,
  Search,
  Check,
  MoreVertical,
  Lock,
  Crown,
  Share2,
  ArrowLeft
} from 'lucide-react';
import { ChatConversation, GroupMember, GroupPermissions, Message } from '../types';
import { messagingRepository } from '../services/messagingRepository';
import { CURRENT_USER_ID } from '../data/mockMessagingData';

interface GroupInfoModalProps {
  chat: ChatConversation;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onOpenDirectChat?: (contactId: string) => void;
}

export function GroupInfoModal({
  chat,
  isOpen,
  onClose,
  isDark,
  onOpenDirectChat
}: GroupInfoModalProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'media' | 'permissions'>('members');
  const [searchMember, setSearchMember] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState('');
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [groupName, setGroupName] = useState(chat.name);
  const [groupDescription, setGroupDescription] = useState(chat.description || '');

  if (!isOpen) return null;

  const contacts = messagingRepository.getContacts();
  const members = chat.members || [];
  const permissions: GroupPermissions = chat.permissions || {
    canSendMessages: true,
    canSendMedia: true,
    canAddMembers: true,
    canEditGroupInfo: false
  };

  const isAdmin = chat.adminIds?.includes(CURRENT_USER_ID) || false;
  const isOwner = members.find((m) => m.id === CURRENT_USER_ID)?.isOwner || false;

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.username.toLowerCase().includes(searchMember.toLowerCase())
  );

  const availableContactsToAdd = contacts.filter(
    (c) => !members.some((m) => m.id === c.id || m.username === c.username)
  );

  const { media, docs } = messagingRepository.getSharedMedia(chat.id);

  const handleSaveInfo = () => {
    messagingRepository.updateGroupInfo(chat.id, {
      name: groupName,
      description: groupDescription
    });
    setIsEditingInfo(false);
  };

  const handleTogglePermission = (key: keyof GroupPermissions) => {
    if (!isAdmin) return;
    const newPerms = { ...permissions, [key]: !permissions[key] };
    messagingRepository.updateGroupInfo(chat.id, { permissions: newPerms });
  };

  const handleAddMember = () => {
    if (!selectedContactId) return;
    messagingRepository.addGroupMember(chat.id, selectedContactId);
    setSelectedContactId('');
    setShowAddMember(false);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full h-full max-w-lg flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#0E131F] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-4 pt-[calc(env(safe-area-inset-top,0px)+12px)] border-b border-slate-800/50 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-1">
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800/20 text-slate-400 hover:text-white transition-colors cursor-pointer mr-1"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <Users className="w-4 h-4 text-emerald-400 shrink-0" />
            <h3 className="font-bold text-sm tracking-tight truncate max-w-[200px]">Group Info & Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800/40 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Avatar and Info Card */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${chat.avatarBg} flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-500/15 ring-4 ring-emerald-500/20`}
            >
              {chat.avatar}
            </div>

            {isEditingInfo ? (
              <div className="w-full space-y-2 max-w-sm">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className={`w-full px-3 py-2 text-sm font-bold rounded-xl border outline-none ${
                    isDark ? 'bg-[#151C2C] border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                  placeholder="Group Name"
                />
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  rows={2}
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none resize-none ${
                    isDark ? 'bg-[#151C2C] border-slate-700' : 'bg-slate-50 border-slate-300'
                  }`}
                  placeholder="Group Description"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsEditingInfo(false)}
                    className="px-3 py-1 text-xs rounded-lg border border-slate-700 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveInfo}
                    className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-400 text-black hover:bg-emerald-300"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-center space-x-2">
                  <h2 className="text-lg font-black">{chat.name}</h2>
                  {isAdmin && (
                    <button
                      onClick={() => setIsEditingInfo(true)}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                    >
                      Edit
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  {chat.description || 'No description provided yet.'}
                </p>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {members.length} Members
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {chat.adminIds?.length || 1} Admins
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800/60 pb-1 gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('members')}
              className={`pb-2 px-2 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'members'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Members ({members.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`pb-2 px-2 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'media'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Image className="w-3.5 h-3.5" />
              <span>Shared ({media.length + docs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`pb-2 px-2 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'permissions'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Permissions</span>
            </button>
          </div>

          {/* TAB 1: MEMBERS */}
          {activeTab === 'members' && (
            <div className="space-y-3">
              {/* Member Search & Add Action */}
              <div className="flex items-center space-x-2">
                <div
                  className={`flex-1 flex items-center px-3 py-1.5 rounded-xl border text-xs ${
                    isDark ? 'bg-[#121826] border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
                  <input
                    type="text"
                    value={searchMember}
                    onChange={(e) => setSearchMember(e.target.value)}
                    placeholder="Search group members..."
                    className="w-full bg-transparent outline-none"
                  />
                </div>

                {(isAdmin || permissions.canAddMembers) && (
                  <button
                    onClick={() => setShowAddMember(true)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold text-xs flex items-center space-x-1 hover:brightness-105 cursor-pointer shrink-0"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                )}
              </div>

              {/* Add Member Card */}
              {showAddMember && (
                <div
                  className={`p-3 rounded-2xl border space-y-2 ${
                    isDark ? 'bg-[#151C2C] border-emerald-500/30' : 'bg-emerald-50/50 border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-400">Add Member from Contacts</span>
                    <button
                      onClick={() => setShowAddMember(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {availableContactsToAdd.length === 0 ? (
                    <p className="text-[11px] text-slate-400">All your contacts are already in this group.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {availableContactsToAdd.map((contact) => (
                        <div
                          key={contact.id}
                          onClick={() => setSelectedContactId(contact.id)}
                          className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                            selectedContactId === contact.id
                              ? 'border-emerald-400 bg-emerald-500/10'
                              : isDark
                              ? 'border-slate-800 hover:bg-slate-800/50'
                              : 'border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-7 h-7 rounded-full bg-gradient-to-tr ${contact.avatarBg} text-white font-bold flex items-center justify-center text-[10px]`}
                            >
                              {contact.avatar}
                            </div>
                            <div>
                              <p className="font-bold">{contact.name}</p>
                              <p className="text-[10px] text-slate-400">@{contact.username}</p>
                            </div>
                          </div>
                          {selectedContactId === contact.id && (
                            <Check className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {availableContactsToAdd.length > 0 && (
                    <button
                      onClick={handleAddMember}
                      disabled={!selectedContactId}
                      className="w-full py-1.5 rounded-xl bg-emerald-400 text-black font-bold text-xs disabled:opacity-40 cursor-pointer"
                    >
                      Confirm Add Member
                    </button>
                  )}
                </div>
              )}

              {/* Members List */}
              <div className="space-y-1.5">
                {filteredMembers.map((member) => {
                  const memberIsAdmin = chat.adminIds?.includes(member.id) || member.isAdmin;
                  const isCurrent = member.id === CURRENT_USER_ID;

                  return (
                    <div
                      key={member.id}
                      className={`flex items-center justify-between p-2.5 rounded-2xl border transition-colors ${
                        isDark
                          ? 'bg-[#121826]/70 border-slate-800/80 hover:border-slate-700'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-8 h-8 rounded-full bg-gradient-to-tr ${member.avatarBg} text-white font-bold flex items-center justify-center text-xs shadow-xs`}
                        >
                          {member.avatar}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-xs">
                              {member.name} {isCurrent && '(You)'}
                            </span>
                            {member.isOwner && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center space-x-0.5">
                                <Crown className="w-2.5 h-2.5" />
                                <span>Owner</span>
                              </span>
                            )}
                            {memberIsAdmin && !member.isOwner && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-0.5">
                                <Shield className="w-2.5 h-2.5" />
                                <span>Admin</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            @{member.username}
                          </span>
                        </div>
                      </div>

                      {/* Admin Controls */}
                      <div className="flex items-center space-x-1">
                        {isAdmin && !isCurrent && !member.isOwner && (
                          <>
                            <button
                              onClick={() => messagingRepository.toggleGroupAdmin(chat.id, member.id)}
                              className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-colors ${
                                memberIsAdmin
                                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                              title={memberIsAdmin ? 'Dismiss as admin' : 'Make group admin'}
                            >
                              {memberIsAdmin ? 'Dismiss Admin' : 'Make Admin'}
                            </button>
                            <button
                              onClick={() => messagingRepository.removeGroupMember(chat.id, member.id)}
                              className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/20"
                              title="Remove member"
                            >
                              <UserMinus className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SHARED MEDIA & DOCUMENTS */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Photos & Videos ({media.length})
                </h4>
                {media.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">No media shared yet.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {media.map((item) => (
                      <div
                        key={item.id}
                        className="aspect-square rounded-xl overflow-hidden bg-slate-800 relative group cursor-pointer border border-slate-800"
                      >
                        {item.attachment?.url && (
                          <img
                            src={item.attachment.url}
                            alt="shared"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        )}
                        <span className="absolute bottom-1 right-1 text-[9px] bg-black/70 px-1 rounded text-white font-mono">
                          {item.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Documents & Files ({docs.length})
                </h4>
                {docs.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">No documents shared yet.</p>
                ) : (
                  <div className="space-y-2">
                    {docs.map((doc) => (
                      <div
                        key={doc.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                          isDark ? 'bg-[#121826] border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <p className="font-bold truncate max-w-[200px]">
                              {doc.attachment?.name || doc.content}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {doc.attachment?.size || '1.2 MB'} • {doc.timeFormatted}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400">Download</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PERMISSIONS */}
          {activeTab === 'permissions' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
                <span className="font-bold">Member Permissions:</span> Controls what standard group members can do. Admins always hold full privileges.
              </div>

              <div className="space-y-2">
                {[
                  {
                    key: 'canSendMessages' as keyof GroupPermissions,
                    title: 'Send Messages',
                    desc: 'Allow members to send text messages, polls and emojis.'
                  },
                  {
                    key: 'canSendMedia' as keyof GroupPermissions,
                    title: 'Send Media & Files',
                    desc: 'Allow photos, voice notes, audio and PDF uploads.'
                  },
                  {
                    key: 'canAddMembers' as keyof GroupPermissions,
                    title: 'Add Other Members',
                    desc: 'Allow members to add friends to this conversation.'
                  },
                  {
                    key: 'canEditGroupInfo' as keyof GroupPermissions,
                    title: 'Edit Group Info',
                    desc: 'Allow members to change group name, photo and description.'
                  }
                ].map((item) => (
                  <div
                    key={item.key}
                    onClick={() => handleTogglePermission(item.key)}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                      isAdmin ? 'cursor-pointer' : 'opacity-70 cursor-not-allowed'
                    } ${
                      isDark ? 'bg-[#121826] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{item.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <div
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                        permissions[item.key] ? 'bg-emerald-400' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-black transition-transform ${
                          permissions[item.key] ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800/50 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-400">Quantum E2E Encrypted Group</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
