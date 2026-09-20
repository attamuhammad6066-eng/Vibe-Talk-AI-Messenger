import { useState } from 'react';
import { X, Send, Check } from 'lucide-react';
import { ChatConversation } from '../types';

interface ForwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  chats: ChatConversation[];
  onForward: (targetChatIds: string[]) => void;
  isDark: boolean;
}

export function ForwardModal({
  isOpen,
  onClose,
  chats,
  onForward,
  isDark
}: ForwardModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSend = () => {
    if (selectedIds.length === 0) return;
    onForward(selectedIds);
    setSelectedIds([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl border flex flex-col max-h-[80vh] ${
          isDark ? 'bg-[#121824] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/40 mb-3">
          <div>
            <h3 className="text-sm font-black">Forward Message</h3>
            <p className="text-[10px] text-slate-400">Select recipient chats</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-500/10 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {chats.map((chat) => {
            const isSelected = selectedIds.includes(chat.id);
            return (
              <div
                key={chat.id}
                onClick={() => toggleSelect(chat.id)}
                className={`p-2.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : isDark
                    ? 'border-slate-800 bg-[#0A0D14] hover:bg-slate-800/60'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${chat.avatarBg} flex items-center justify-center font-bold text-xs text-white`}>
                    {chat.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{chat.name}</h4>
                    <span className="text-[9px] text-slate-400">
                      {chat.isGroup ? 'Group' : 'Direct Message'}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-emerald-400 border-emerald-400 text-black'
                      : 'border-slate-600'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4">
          <button
            disabled={selectedIds.length === 0}
            onClick={handleSend}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#00E5A3] to-[#00C2FF] text-black font-bold text-xs flex items-center justify-center space-x-2 disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Forward to ({selectedIds.length}) Chats</span>
          </button>
        </div>
      </div>
    </div>
  );
}
