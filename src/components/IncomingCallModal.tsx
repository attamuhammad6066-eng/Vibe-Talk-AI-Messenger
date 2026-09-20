import { Phone, PhoneOff, Video, Sparkles, ShieldCheck } from 'lucide-react';
import { CallSession } from '../types';
import { webrtcCallService } from '../services/webrtcCallService';

interface IncomingCallModalProps {
  session: CallSession;
  isDark: boolean;
}

export function IncomingCallModal({ session, isDark }: IncomingCallModalProps) {
  const { contact, type } = session;

  const handleAccept = () => {
    webrtcCallService.acceptIncomingCall();
  };

  const handleDecline = () => {
    webrtcCallService.rejectIncomingCall();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#0F172A] via-[#111C33] to-[#0A0E17] text-white p-6 border border-slate-700/60 flex flex-col items-center justify-between min-h-[500px]">
        {/* Top Header */}
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>VibeTalk End-to-End Encrypted</span>
        </div>

        {/* Center Caller Profile */}
        <div className="flex flex-col items-center text-center my-auto">
          {/* Animated Pulsing Avatar Ring */}
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
            <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-[#00E5A3] via-teal-500 to-[#00C2FF] shadow-2xl shadow-emerald-500/30 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center text-3xl font-black">
                {contact.avatar}
              </div>
            </div>
          </div>

          <span className="text-xs uppercase tracking-widest font-mono text-emerald-400 font-bold mb-1">
            Incoming {type === 'video' ? 'Video' : 'Voice'} Call
          </span>
          <h2 className="text-2xl font-black tracking-tight">{contact.name}</h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">@{contact.username}</p>

          <div className="mt-3 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{contact.vibeStatus}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full flex items-center justify-around pt-6 border-t border-slate-800">
          {/* Decline Button */}
          <div className="flex flex-col items-center space-y-1.5">
            <button
              onClick={handleDecline}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 active:scale-95 transition-all cursor-pointer"
              title="Decline call"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
            <span className="text-xs font-bold text-slate-400">Decline</span>
          </div>

          {/* Accept Button */}
          <div className="flex flex-col items-center space-y-1.5">
            <button
              onClick={handleAccept}
              className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 active:scale-95 transition-all cursor-pointer animate-bounce"
              title="Accept call"
            >
              {type === 'video' ? (
                <Video className="w-7 h-7 fill-current" />
              ) : (
                <Phone className="w-7 h-7 fill-current" />
              )}
            </button>
            <span className="text-xs font-bold text-emerald-400">Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
}
