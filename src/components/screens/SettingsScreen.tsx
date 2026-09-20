import {
  ArrowLeft,
  Shield,
  Bell,
  Lock,
  Moon,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Database,
  Radio,
  Sparkles,
  Fingerprint,
  Palette,
  ShieldCheck,
  Cloud
} from 'lucide-react';
import { useState } from 'react';
import { UserProfile } from '../../types';
import { biometricAuthManager } from '../../security/BiometricAuthManager';
import { settingsManager } from '../../settings/SettingsManager';

interface SettingsScreenProps {
  user: UserProfile;
  isDark: boolean;
  onBack: () => void;
  onOpenAbout: () => void;
  onOpenHelp: () => void;
  onRequestPermission: () => void;
  onLogout: () => void;
  onToggleTheme: () => void;
  onOpenProfilePrivacy: () => void;
  onOpenBackup?: () => void;
}

export function SettingsScreen({
  user,
  isDark,
  onBack,
  onOpenAbout,
  onOpenHelp,
  onRequestPermission,
  onLogout,
  onToggleTheme,
  onOpenProfilePrivacy,
  onOpenBackup
}: SettingsScreenProps) {
  const [appLockEnabled, setAppLockEnabled] = useState(() => settingsManager.isAppLockEnabled());
  const [authStatusMsg, setAuthStatusMsg] = useState<string | null>(null);

  const handleToggleAppLock = async (enabled: boolean) => {
    if (enabled) {
      const res = await biometricAuthManager.authenticate({
        title: 'Authenticate to enable App Lock',
        subtitle: 'Confirm your biometric identity to secure VibeTalk'
      });
      if (!res.success) {
        setAuthStatusMsg('Biometric authentication failed. App lock not enabled.');
        setTimeout(() => setAuthStatusMsg(null), 3000);
        return;
      }
    }
    settingsManager.setAppLockEnabled(enabled);
    biometricAuthManager.setBiometricEnabled(enabled);
    setAppLockEnabled(enabled);
    setAuthStatusMsg(enabled ? 'App Lock & Biometric security enabled (DataStore persisted).' : 'App Lock disabled.');
    setTimeout(() => setAuthStatusMsg(null), 3000);
  };
  return (
    <div
      className={`h-full w-full flex flex-col justify-between select-none overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#0A0D14] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {authStatusMsg && (
        <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-4 py-2 text-emerald-400 text-xs font-bold flex items-center justify-between">
          <span>{authStatusMsg}</span>
        </div>
      )}
      <div
        className={`px-4 py-3 border-b flex items-center justify-between ${
          isDark ? 'bg-[#0F141C] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onBack}
            className={`w-7 h-7 rounded-xl flex items-center justify-center border cursor-pointer ${
              isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-sm font-black">Settings & Preferences</h3>
            <p className="text-[10px] text-slate-400">Manage account, security & Room DB</p>
          </div>
        </div>
      </div>

      {/* Settings Options List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* User Card */}
        <div
          onClick={onOpenProfilePrivacy}
          className={`p-3 rounded-2xl border flex items-center space-x-3 cursor-pointer transition-all active:scale-[0.99] hover:scale-[1.01] ${
            isDark ? 'bg-[#121824] border-slate-800 hover:bg-[#1a2334]' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
          title="Manage Display Picture (DP), AI Avatar & Privacy visibility"
        >
          <div className="relative shrink-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="w-12 h-12 rounded-2xl object-cover border border-emerald-400"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00E5A3] to-[#00C2FF] flex items-center justify-center text-base font-black text-black shadow-md shadow-emerald-500/10">
                {user.displayName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center border border-[#0A0D14] shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black truncate">{user.displayName}</h4>
              <span className="text-[8px] bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                DP & Privacy ⚙️
              </span>
            </div>
            <p className="text-[10px] text-emerald-400 truncate font-mono">@{user.username}</p>
            <p className="text-[10px] text-slate-400 truncate mt-0.5 leading-tight">{user.bio || user.phoneNumber}</p>
          </div>
        </div>

        {/* Section: App Preferences */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Interface & Permissions
          </span>

          <div
            onClick={onToggleTheme}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              isDark ? 'bg-[#121824] border-slate-800 hover:bg-slate-800/50' : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Moon className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-xs font-bold">Dark Aura Mode</p>
                <span className="text-[9px] text-slate-400">
                  {isDark ? 'High-contrast AMOLED Dark' : 'Clean Light Canvas'}
                </span>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-bold">{isDark ? 'ON' : 'OFF'}</span>
          </div>

          <div
            onClick={onRequestPermission}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              isDark ? 'bg-[#121824] border-slate-800 hover:bg-slate-800/50' : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-bold">Android OS Permissions</p>
                <span className="text-[9px] text-slate-400">Camera, Mic, Contacts, Notifications</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div
            onClick={() => (window as any).__openPhase9Hub?.()}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              isDark ? 'bg-[#121824] border-slate-800 hover:bg-slate-800/50' : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Palette className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-xs font-bold">Phase 9: Premium UI, Search & Storage Hub</p>
                <span className="text-[9px] text-slate-400">8 Themes, Accent colors, NLP Search, Notifications, Storage Manager</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div
            onClick={() => (window as any).__openPhase10Admin?.()}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              isDark ? 'bg-[#121824] border-slate-800 hover:bg-slate-800/50' : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <div>
                <p className="text-xs font-bold">Phase 10: Secure Web Admin Dashboard</p>
                <span className="text-[9px] text-slate-400">PostgreSQL/Redis, RBAC, System Health, Moderation & Audit Logs</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div
            onClick={() => (window as any).__openPhase11Hub?.()}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              isDark ? 'bg-[#121824] border-slate-800 hover:bg-slate-800/50' : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <div>
                <p className="text-xs font-bold">Phase 11: Super AI & Advanced Integration Hub</p>
                <span className="text-[9px] text-slate-400">Gemini Chatbot, Transcribe, Search/Maps Grounding, Live API, Veo Video & Firebase</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center justify-between ${
              isDark ? 'bg-[#121824] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Fingerprint className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-bold">App Lock & Biometric Protection</p>
                <span className="text-[9px] text-slate-400">Require fingerprint/PIN on startup & background resume</span>
              </div>
            </div>
            <button
              onClick={() => handleToggleAppLock(!appLockEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
                appLockEnabled ? 'bg-emerald-500' : isDark ? 'bg-slate-700' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  appLockEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section: Data & Storage */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Data Architecture
          </span>

          <div
            className={`p-3 rounded-xl border flex items-center justify-between ${
              isDark ? 'bg-[#121824] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Database className="w-4 h-4 text-cyan-400" />
              <div>
                <p className="text-xs font-bold">Room Database Engine</p>
                <span className="text-[9px] text-slate-400">Local SQLite caching & Flow streams</span>
              </div>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ACTIVE
            </span>
          </div>

          <div
            onClick={onOpenBackup}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              isDark ? 'bg-[#121824] border-slate-800 hover:bg-slate-800/50' : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Cloud className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-bold">Google Drive Chat Backup</p>
                <span className="text-[9px] text-slate-400 truncate max-w-[190px]">
                  {user.linkedGmail ? `Gmail: ${user.linkedGmail}` : 'Link account to secure messages & media'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1 shrink-0">
              {user.lastBackupTime && (
                <span className="text-[8px] bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-black uppercase tracking-wide">
                  SECURED
                </span>
              )}
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Section: Info & Support */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Support & Identity
          </span>

          <div
            onClick={onOpenAbout}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              isDark ? 'bg-[#121824] border-slate-800 hover:bg-slate-800/50' : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Info className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-xs font-bold">About VibeTalk AI</p>
                <span className="text-[9px] text-slate-400">Version 2.0 • Created by Atta Muhammad</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div
            onClick={onOpenHelp}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              isDark ? 'bg-[#121824] border-slate-800 hover:bg-slate-800/50' : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-xs font-bold">Help & Documentation</p>
                <span className="text-[9px] text-slate-400">AM Digital Hub developer guides</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full py-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-bold flex items-center justify-center space-x-2 hover:bg-rose-500/20 cursor-pointer transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out / Reset Session</span>
        </button>
      </div>
    </div>
  );
}
