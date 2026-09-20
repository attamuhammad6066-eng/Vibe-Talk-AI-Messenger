import { useState } from 'react';
import {
  X,
  Phone,
  Video,
  MessageSquare,
  ShieldAlert,
  Ban,
  CheckCircle,
  Share2,
  Sparkles,
  Lock,
  UserCheck,
  ArrowLeft
} from 'lucide-react';
import { ContactItem } from '../types';
import { messagingRepository } from '../services/messagingRepository';

interface ContactProfileModalProps {
  contact: ContactItem | null;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onStartChat: (contact: ContactItem) => void;
  onStartCall: (contact: ContactItem, isVideo: boolean) => void;
}

export function ContactProfileModal({
  contact,
  isOpen,
  onClose,
  isDark,
  onStartChat,
  onStartCall
}: ContactProfileModalProps) {
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [reportReason, setReportReason] = useState('Spam or unsolicited advertising');
  const [reportedToast, setReportedToast] = useState(false);
  const [currentUserProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('vibetalk_user_profile_v1');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn(e);
    }
    return { dpPrivacy: 'everyone', storyPrivacy: 'everyone' };
  });

  if (!isOpen || !contact) return null;

  const isBlocked = contact.isBlocked;

  const handleToggleBlock = () => {
    messagingRepository.toggleBlockContact(contact.id);
  };

  const handleConfirmReport = () => {
    messagingRepository.reportContact(contact.id, reportReason);
    setShowReportConfirm(false);
    setReportedToast(true);
    setTimeout(() => {
      setReportedToast(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden ${
          isDark
            ? 'bg-[#0E131F] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Header */}
        <div className="relative p-6 pt-10 flex flex-col items-center text-center border-b border-slate-800/40">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/30 transition-colors cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Avatar with Status Ring */}
          <div className="relative mb-3">
            <div
              className={`w-22 h-22 rounded-full p-1 bg-gradient-to-tr ${contact.avatarBg} shadow-xl shadow-emerald-500/15 flex items-center justify-center`}
            >
              <div
                className={`w-full h-full rounded-full flex items-center justify-center text-2xl font-black text-white ${
                  isDark ? 'bg-[#121826]' : 'bg-slate-900'
                }`}
              >
                {contact.avatar}
              </div>
            </div>
            <div
              className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 ${
                isDark ? 'border-[#0E131F]' : 'border-white'
              } ${contact.isOnline ? 'bg-emerald-400' : 'bg-slate-500'}`}
            />
          </div>

          <h2 className="text-xl font-black tracking-tight">{contact.name}</h2>
          <p className="text-xs font-mono text-emerald-400 font-bold mt-0.5">
            @{contact.username}
          </p>
          <span className="text-[11px] text-slate-400 mt-1">{contact.phoneNumber}</span>

          {/* Living Vibe Aura Badge */}
          <div className="mt-3 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold flex items-center space-x-1.5">
            <Sparkles className="w-3 h-3" />
            <span>{contact.vibeStatus}</span>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="grid grid-cols-3 gap-2 p-4 border-b border-slate-800/40">
          <button
            onClick={() => {
              onClose();
              onStartChat(contact);
            }}
            className={`py-2.5 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all ${
              isDark
                ? 'bg-[#151C2C] hover:bg-emerald-500/20 text-emerald-400'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-bold">Message</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onStartCall(contact, false);
            }}
            className={`py-2.5 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all ${
              isDark
                ? 'bg-[#151C2C] hover:bg-cyan-500/20 text-cyan-400'
                : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-600'
            }`}
          >
            <Phone className="w-5 h-5" />
            <span className="text-[10px] font-bold">Voice Call</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onStartCall(contact, true);
            }}
            className={`py-2.5 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all ${
              isDark
                ? 'bg-[#151C2C] hover:bg-purple-500/20 text-purple-400'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-600'
            }`}
          >
            <Video className="w-5 h-5" />
            <span className="text-[10px] font-bold">Video Call</span>
          </button>
        </div>

        {/* Bio & Details */}
        <div className="p-4 space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              About & Bio
            </span>
            <p className="text-xs leading-relaxed text-slate-300">
              {contact.bio || 'Connecting on VibeTalk AI Messenger.'}
            </p>
          </div>

          {/* Simulated Peer-to-Peer Privacy Verification */}
          <div className={`p-3.5 rounded-2xl border space-y-2.5 ${isDark ? 'bg-[#111624] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 block">
              🛡️ Privacy Shield Ledger
            </span>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center justify-between">
                <span>Display Picture View:</span>
                {currentUserProfile.dpPrivacy === 'nobody' ? (
                  <span className="text-rose-400 font-bold flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> Hidden (Nobody)
                  </span>
                ) : currentUserProfile.dpPrivacy === 'contacts' ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <UserCheck className="w-3 h-3" /> Allowed (Contacts Only)
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <CheckCircle className="w-3 h-3" /> Allowed (Everyone)
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span>Stories & Updates View:</span>
                {currentUserProfile.storyPrivacy === 'nobody' ? (
                  <span className="text-rose-400 font-bold flex items-center gap-0.5">
                    <Lock className="w-3 h-3" /> Hidden (Nobody)
                  </span>
                ) : currentUserProfile.storyPrivacy === 'contacts' ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <UserCheck className="w-3 h-3" /> Allowed (Contacts Only)
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <CheckCircle className="w-3 h-3" /> Allowed (Everyone)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div
            className={`p-3 rounded-2xl border flex items-center space-x-2 text-xs ${
              isDark ? 'bg-[#121826] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-400">
              Messages and calls are quantum-encrypted end-to-end.
            </span>
          </div>

          {/* Block / Report Controls */}
          {showReportConfirm ? (
            <div className="p-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 space-y-2">
              <span className="text-xs font-bold text-rose-400 block">
                Report {contact.name}?
              </span>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className={`w-full p-2 text-xs rounded-xl border outline-none ${
                  isDark ? 'bg-[#0E131F] border-slate-700' : 'bg-white border-slate-300'
                }`}
              >
                <option>Spam or unsolicited advertising</option>
                <option>Harassment or abusive behavior</option>
                <option>Impersonation or fake account</option>
                <option>Malicious links or phishing</option>
              </select>
              <div className="flex justify-end space-x-2 pt-1">
                <button
                  onClick={() => setShowReportConfirm(false)}
                  className="px-3 py-1 text-xs rounded-lg border border-slate-700 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReport}
                  className="px-3 py-1 text-xs font-bold rounded-lg bg-rose-500 text-white hover:bg-rose-600"
                >
                  Submit Report
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                onClick={handleToggleBlock}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors ${
                  isBlocked
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                <span>{isBlocked ? 'Unblock Contact' : 'Block Contact'}</span>
              </button>

              <button
                onClick={() => setShowReportConfirm(true)}
                className="py-2 px-3 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 text-rose-400 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report</span>
              </button>
            </div>
          )}

          {reportedToast && (
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs text-center font-bold">
              Report submitted. Security review initiated.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
