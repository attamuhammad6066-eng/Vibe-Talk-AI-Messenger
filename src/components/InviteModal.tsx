import { useState } from 'react';
import { X, Share2, Copy, Check, QrCode, Sparkles } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export function InviteModal({ isOpen, onClose, isDark }: InviteModalProps) {
  const [copied, setCopied] = useState(false);
  const inviteLink = 'https://vibetalk.ai/join/@current_user';
  const inviteCode = 'VIBE-8921-TECH';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl border flex flex-col ${
          isDark
            ? 'bg-[#121824] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/40 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black">Invite to VibeTalk AI</h3>
              <p className="text-[10px] text-slate-400">Expand your private network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-500/10 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-center p-4 rounded-2xl bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-transparent border border-emerald-500/20">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#00E5A3] to-[#00C2FF] flex items-center justify-center text-black font-black text-lg mb-2 shadow-lg shadow-emerald-500/20">
              V~
            </div>
            <h4 className="text-xs font-bold">Connect on VibeTalk AI Messenger</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Invite friends to chat with quantum encryption, AI Copilot, and living vibe auras.
            </p>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Your Personal Invite Link
            </label>
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                isDark ? 'bg-[#0A0D14] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="truncate font-mono text-[11px] text-emerald-400 mr-2">
                {inviteLink}
              </span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 shrink-0 cursor-pointer"
                title="Copy link"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Invite Code
            </label>
            <div
              className={`p-2 rounded-xl border text-center font-mono font-bold tracking-widest text-xs ${
                isDark ? 'bg-[#0A0D14] border-slate-800 text-cyan-400' : 'bg-slate-50 border-slate-200 text-cyan-600'
              }`}
            >
              {inviteCode}
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00E5A3] to-[#00C2FF] text-black font-bold text-xs cursor-pointer shadow-md shadow-emerald-500/20"
          >
            {copied ? 'Link Copied to Clipboard!' : 'Copy & Share Invite Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
