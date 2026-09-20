import { useState } from 'react';
import {
  X,
  Cloud,
  Mail,
  HardDrive,
  Clock,
  RefreshCw,
  Trash2,
  Check,
  Sparkles,
  Link2,
  Unlink,
  AlertCircle,
  Database,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { googleDriveBackupService } from '../services/googleDriveBackupService';
import { UserProfile } from '../types';

interface GoogleDriveBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
  isDark: boolean;
}

export function GoogleDriveBackupModal({
  isOpen,
  onClose,
  user,
  onSave,
  isDark
}: GoogleDriveBackupModalProps) {
  // Gmail input
  const [gmailInput, setGmailInput] = useState(user.linkedGmail || 'atta.muhammad612@gmail.com');
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Backup states
  const [backingUp, setBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backupLog, setBackupLog] = useState('');

  // Frequency
  const [frequency, setFrequency] = useState<'none' | 'daily' | 'weekly' | 'monthly'>(user.autoBackupInterval || 'none');

  if (!isOpen) return null;

  // Link Gmail account
  const handleLinkGmail = async () => {
    if (!gmailInput || !gmailInput.includes('@')) {
      setError('Please provide a valid Gmail address');
      return;
    }
    setError(null);
    setIsLinking(true);

    try {
      const success = await googleDriveBackupService.linkGmail(gmailInput);
      if (success) {
        // Sync back
        const updated: UserProfile = {
          ...user,
          linkedGmail: gmailInput
        };
        onSave(updated);
      }
    } catch (e) {
      setError('Failed to authenticate with Google Account');
    } finally {
      setIsLinking(false);
    }
  };

  // Unlink Gmail
  const handleUnlinkGmail = () => {
    if (window.confirm('Are you sure you want to unlink your Gmail? Automatic and manual cloud backups will be suspended.')) {
      const updated: UserProfile = {
        ...user,
        linkedGmail: null,
        lastBackupTime: null,
        backupSize: null
      };
      onSave(updated);
    }
  };

  // Run Manual Backup Now
  const handleBackupNow = async () => {
    if (!user.linkedGmail) {
      setError('Please link a Gmail address first to establish cloud storage.');
      return;
    }
    setError(null);
    setBackingUp(true);
    setBackupProgress(0);
    setBackupLog('Gearing up compression pipelines...');

    try {
      const res = await googleDriveBackupService.uploadBackup(user.linkedGmail, (pct) => {
        setBackupProgress(pct);
        if (pct < 30) {
          setBackupLog('🗜️ Compressing room database streams...');
        } else if (pct < 60) {
          setBackupLog('🎙️ Encrypting media items & custom voice files...');
        } else if (pct < 90) {
          setBackupLog('☁️ Streaming packages to Google Drive sandbox...');
        } else {
          setBackupLog('🔒 Verifying integrity certificate blocks...');
        }
      });

      const updated: UserProfile = {
        ...user,
        lastBackupTime: res.backupTime,
        backupSize: res.backupSize
      };
      onSave(updated);
    } catch (err: any) {
      setError(err.message || 'Backup failed.');
    } finally {
      setBackingUp(false);
    }
  };

  // Delete Backup
  const handleDeleteBackup = () => {
    if (!user.linkedGmail) return;
    if (window.confirm('Are you sure you want to delete your backup from Google Drive? This action is permanent.')) {
      googleDriveBackupService.deleteBackup(user.linkedGmail);
      const updated: UserProfile = {
        ...user,
        lastBackupTime: null,
        backupSize: null
      };
      onSave(updated);
    }
  };

  // Change Auto backup interval
  const handleSaveFrequency = (freq: 'none' | 'daily' | 'weekly' | 'monthly') => {
    setFrequency(freq);
    const updated: UserProfile = {
      ...user,
      autoBackupInterval: freq
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[94vh] ${
          isDark ? 'bg-[#0E131F] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Cloud className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-black">Google Drive Chat Backup</h3>
              <p className="text-[10px] text-slate-400">Sync conversations, audio & photos with Google Cloud</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Active Backup Status Panel */}
          <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-[#131A2A] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center space-x-2 border-b pb-1.5 border-slate-800/40">
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Drive Cloud Database</span>
            </div>

            {user.linkedGmail ? (
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-400 text-[11px]">
                  <span>Last backup:</span>
                  <span className="font-bold text-slate-200 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {user.lastBackupTime ? new Date(user.lastBackupTime).toLocaleString() : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400 text-[11px]">
                  <span>Backup size:</span>
                  <span className="font-bold text-slate-200">{user.backupSize || '0 KB'}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 text-[11px]">
                  <span>Linked Google account:</span>
                  <span className="font-mono text-emerald-400 font-bold truncate max-w-[180px]">{user.linkedGmail}</span>
                </div>
              </div>
            ) : (
              <div className="py-2 text-center text-xs text-slate-400 flex flex-col items-center space-y-1">
                <AlertCircle className="w-6 h-6 text-amber-500/80" />
                <span>No Google account linked. Backups are currently disabled.</span>
              </div>
            )}
          </div>

          {/* Setup / Unlink Gmail Control */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">
              Google Account Settings
            </label>

            {!user.linkedGmail ? (
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={gmailInput}
                    onChange={(e) => setGmailInput(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-semibold outline-none border ${
                      isDark ? 'bg-[#090D16] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                {error && (
                  <p className="text-[10px] text-rose-500 px-1 font-semibold">{error}</p>
                )}
                <button
                  onClick={handleLinkGmail}
                  disabled={isLinking}
                  className="w-full py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center space-x-1 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isLinking ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Link Google Gmail & Grant Drive Access</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={handleUnlinkGmail}
                  className="flex-1 py-2.5 rounded-xl border border-rose-500/25 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer transition-all"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Unlink Account</span>
                </button>

                {user.lastBackupTime && (
                  <button
                    onClick={handleDeleteBackup}
                    className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer transition-colors border border-rose-500/20"
                    title="Delete Backup from Drive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Backup Action Trigger (WhatsApp Style) */}
          {user.linkedGmail && (
            <div className="space-y-3 pt-1">
              {backingUp ? (
                <div className="p-3 bg-slate-950/80 border border-emerald-500/20 rounded-xl space-y-2 font-mono text-[9px]">
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      BACKING UP CHATS...
                    </span>
                    <span>{backupProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${backupProgress}%` }} />
                  </div>
                  <div className="text-slate-400 truncate">{backupLog}</div>
                </div>
              ) : (
                <button
                  onClick={handleBackupNow}
                  className="w-full py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 active:scale-[0.99] text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-400/10 transition-all"
                >
                  <Cloud className="w-4 h-4 animate-bounce" />
                  <span>Backup Now to Google Drive ⚡</span>
                </button>
              )}
            </div>
          )}

          {/* Auto Backup Frequencies (WhatsApp Style) */}
          {user.linkedGmail && (
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">
                Auto Backup Frequency
              </label>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'none', label: 'Off / None' },
                  { id: 'daily', label: 'Daily' },
                  { id: 'weekly', label: 'Weekly' },
                  { id: 'monthly', label: 'Monthly' }
                ].map((item) => {
                  const isSelected = frequency === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSaveFrequency(item.id as any)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-500/10 text-emerald-400'
                          : isDark ? 'border-slate-800 bg-[#121724] text-slate-400 hover:border-slate-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-5 py-4 border-t flex items-center justify-end ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 flex items-center space-x-1 cursor-pointer transition-all shadow-md shadow-emerald-400/5"
          >
            <Check className="w-4 h-4" />
            <span>Apply & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
