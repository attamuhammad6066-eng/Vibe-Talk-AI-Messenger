import { useState, useEffect } from 'react';
import { X, Users, Check, Camera, Sparkles, ArrowLeft } from 'lucide-react';
import { messagingRepository } from '../services/messagingRepository';
import { ContactItem } from '../types';

interface NewGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (newChatId: string) => void;
  isDark: boolean;
}

const AVATAR_OPTIONS = ['👥', '🚀', '⚡', '🌟', '💎', '🔥', '🛡️', '🧠'];
const GRADIENTS = [
  'from-emerald-400 to-cyan-500',
  'from-purple-500 to-indigo-600',
  'from-pink-500 to-rose-600',
  'from-amber-400 to-orange-500',
  'from-cyan-400 to-blue-600'
];

export function NewGroupModal({
  isOpen,
  onClose,
  onGroupCreated,
  isDark
}: NewGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👥');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      const c = messagingRepository.getContacts();
      setContacts(c);
      if (c.length > 0 && selectedContacts.length === 0) {
        setSelectedContacts([c[0].id]);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleContact = (id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedContacts.length === 0) return;

    const newChat = messagingRepository.createGroup({
      name: groupName.trim(),
      description: description.trim() || 'Encrypted group conversation on VibeTalk AI',
      avatar: selectedAvatar,
      avatarGradient: selectedGradient,
      participantIds: selectedContacts
    });
    onGroupCreated(newChat.id);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl border flex flex-col ${
          isDark
            ? 'bg-[#121824] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/40 mb-3">
          <div className="flex items-center space-x-1">
            <button
              onClick={onClose}
              type="button"
              className="p-1 rounded-lg hover:bg-slate-800/20 text-slate-400 hover:text-white transition-colors cursor-pointer mr-1"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-black tracking-tight">Create Group Chat</h3>
              <p className="text-[9px] text-slate-400">Multi-admin & roles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full flex items-center justify-center bg-slate-500/10 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-3">
          {/* Avatar and Group Name */}
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${selectedGradient} flex items-center justify-center text-xl shrink-0 shadow-md shadow-emerald-500/10`}
            >
              {selectedAvatar}
            </div>

            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Group Name *
              </label>
              <input
                type="text"
                placeholder="e.g. AM Mobile Architects 🚀"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-xl text-xs outline-none border transition-colors ${
                  isDark
                    ? 'bg-[#0A0D14] border-slate-800 text-white focus:border-emerald-400'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                }`}
                autoFocus
                required
              />
            </div>
          </div>

          {/* Avatar Emojis */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Group Badge
            </label>
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedAvatar(emoji)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm border shrink-0 transition-all ${
                    selectedAvatar === emoji
                      ? 'border-emerald-400 bg-emerald-500/20 scale-105'
                      : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="What is this group about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3 py-1.5 rounded-xl text-xs outline-none border transition-colors ${
                isDark
                  ? 'bg-[#0A0D14] border-slate-800 text-white focus:border-emerald-400'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
              }`}
            />
          </div>

          {/* Participant Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Members ({selectedContacts.length})
              </label>
              <span className="text-[10px] text-emerald-400 font-mono">
                {contacts.length} Available
              </span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {contacts.map((contact) => {
                const isSelected = selectedContacts.includes(contact.id);
                return (
                  <div
                    key={contact.id}
                    onClick={() => toggleContact(contact.id)}
                    className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                        : isDark
                        ? 'border-slate-800 bg-[#0A0D14]'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${contact.avatarBg} text-white font-black text-[9px] flex items-center justify-center`}
                      >
                        {contact.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-none">{contact.name}</p>
                        <span className="text-[9px] text-slate-400">@{contact.username}</span>
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        isSelected
                          ? 'bg-emerald-400 border-emerald-400 text-black'
                          : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={!groupName.trim() || selectedContacts.length === 0}
            className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-[#00E5A3] to-[#00C2FF] text-black font-bold text-xs disabled:opacity-40 cursor-pointer shadow-md shadow-emerald-500/20 active:scale-98 transition-transform"
          >
            Create Encrypted Group
          </button>
        </form>
      </div>
    </div>
  );
}
