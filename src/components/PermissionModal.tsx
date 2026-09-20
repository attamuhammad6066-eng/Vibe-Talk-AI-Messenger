import {
  Camera,
  Mic,
  Contact,
  Bell,
  Shield,
  CheckCircle2,
  MapPin,
  Calendar,
  PhoneCall,
  FileText,
  Music,
  Smartphone,
  Image,
  MessageSquareCode
} from 'lucide-react';
import { AndroidPermission } from '../types';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissions: AndroidPermission[];
  onTogglePermission: (id: string) => void;
  isDark: boolean;
}

export function PermissionModal({
  isOpen,
  onClose,
  permissions,
  onTogglePermission,
  isDark
}: PermissionModalProps) {
  if (!isOpen) return null;

  const getIcon = (id: string) => {
    switch (id) {
      case 'location':
        return <MapPin className="w-4 h-4 text-indigo-400" />;
      case 'camera':
        return <Camera className="w-4 h-4 text-emerald-400" />;
      case 'mic':
        return <Mic className="w-4 h-4 text-cyan-400" />;
      case 'calendar':
        return <Calendar className="w-4 h-4 text-rose-400" />;
      case 'call_logs':
        return <PhoneCall className="w-4 h-4 text-red-400" />;
      case 'contacts':
        return <Contact className="w-4 h-4 text-amber-400" />;
      case 'files':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'music_audio':
        return <Music className="w-4 h-4 text-pink-400" />;
      case 'phone':
        return <Smartphone className="w-4 h-4 text-teal-400" />;
      case 'photos_videos':
        return <Image className="w-4 h-4 text-purple-400" />;
      case 'sms':
        return <MessageSquareCode className="w-4 h-4 text-orange-400" />;
      case 'notifications':
        return <Bell className="w-4 h-4 text-fuchsia-400" />;
      default:
        return <Shield className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl border flex flex-col max-h-[90vh] ${
          isDark
            ? 'bg-[#121824] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center space-x-2.5 mb-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black">Android Permission Manager</h3>
            <p className="text-[10px] text-slate-400">Core Runtime Security Context</p>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed shrink-0">
          VibeTalk AI requests access to essential Android subsystem capabilities for encrypted
          calling, file sharing, contacts indexing, and secure background operations:
        </p>

        {/* Scrollable list to prevent overflow */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 mb-5 max-h-[380px] custom-scrollbar">
          {permissions.map((perm) => (
            <div
              key={perm.id}
              onClick={() => onTogglePermission(perm.id)}
              className={`p-2.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                perm.granted
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : isDark
                  ? 'border-slate-800 bg-[#0A0D14]'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                <div className="p-2 rounded-xl bg-slate-500/10 shrink-0">{getIcon(perm.id)}</div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold truncate">{perm.name}</h4>
                  <p className="text-[10px] text-slate-400 leading-snug">{perm.description}</p>
                </div>
              </div>

              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ml-2 ${
                  perm.granted ? 'bg-emerald-400 text-black' : 'border border-slate-600'
                }`}
              >
                {perm.granted && <CheckCircle2 className="w-4 h-4" />}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-black font-bold text-xs transition-colors cursor-pointer shrink-0"
        >
          Save & Apply Permissions
        </button>
      </div>
    </div>
  );
}
