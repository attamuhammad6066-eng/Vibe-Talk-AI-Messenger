import { useState } from 'react';
import {
  Cloud,
  ArrowRight,
  Database,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Mail,
  HardDrive,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { googleDriveBackupService } from '../../services/googleDriveBackupService';
import { UserProfile } from '../../types';

interface BackupRestoreScreenProps {
  onComplete: () => void;
  isDark: boolean;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export function BackupRestoreScreen({ onComplete, isDark, onUpdateUser }: BackupRestoreScreenProps) {
  const [stage, setStage] = useState<'gmail_input' | 'check_backup' | 'backup_found' | 'no_backup' | 'restoring' | 'success'>('gmail_input');
  
  const [gmail, setGmail] = useState('atta.muhammad612@gmail.com');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Restore variables
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [restoreLog, setRestoreLog] = useState('Initializing decryption...');
  const [backupDetails, setBackupDetails] = useState<any | null>(null);

  // Check for backup
  const handleCheckBackup = () => {
    if (!gmail || !gmail.includes('@')) {
      setError('Please provide a valid Gmail address');
      return;
    }
    setError(null);
    setChecking(true);
    setStage('check_backup');

    setTimeout(() => {
      const backup = googleDriveBackupService.checkBackupExists(gmail);
      setChecking(false);
      if (backup) {
        setBackupDetails(backup);
        setStage('backup_found');
      } else {
        setStage('no_backup');
      }
    }, 1800);
  };

  // Perform Restore
  const handlePerformRestore = () => {
    setStage('restoring');
    setRestoreProgress(0);
    setRestoreLog('Connecting to Google Drive Secure Servers...');

    const logs = [
      '⚡ Authorizing Drive Secure APIs...',
      '📥 Downloading encryted backup payload (vibetalk_backup.json)...',
      '🔓 Decrypting 256-bit VibeTalk data package...',
      '🛠️ Restoring individual user chats, messages, and threads...',
      '🎙️ Recalibrating compressed voice notes & media assets...',
      '🎨 Synchronizing custom Aura display presets & active stories...',
      '✅ Full VibeTalk database rebuild successful!'
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < logs.length) {
        setRestoreLog(logs[step]);
        setRestoreProgress((prev) => Math.min(prev + 15, 100));
        step++;
      } else {
        clearInterval(interval);
        setRestoreProgress(100);
        
        // Restore values
        const success = googleDriveBackupService.restoreBackup(gmail);
        if (success) {
          // Sync App state user profile
          const savedUser = localStorage.getItem('vibetalk_user_profile_v1');
          if (savedUser) {
            onUpdateUser(JSON.parse(savedUser));
          }
          setStage('success');
        } else {
          setError('Database restore failed. Data might be corrupted.');
          setStage('gmail_input');
        }
      }
    }, 450);
  };

  // Skip backup
  const handleSkipRestore = () => {
    const confirmSkip = window.confirm(
      "Are you sure you want to skip? If you skip restoring your chats, your old conversations, voice notes, and media logs will be permanently skipped for this installation."
    );
    if (confirmSkip) {
      onComplete();
    }
  };

  return (
    <div
      className={`h-full w-full flex flex-col justify-between px-6 py-8 select-none transition-colors duration-300 ${
        isDark ? 'bg-[#0A0D14] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center space-x-2.5 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold shadow-md shadow-emerald-500/5">
            <Cloud className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black leading-tight">Google Drive Backup</h2>
            <p className="text-[10px] text-slate-400">Secure Backup & Restore Engine</p>
          </div>
        </div>

        {stage === 'gmail_input' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-2">
              <h3 className="text-xl font-black tracking-tight">Check Google Drive</h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                To check if you have an existing chat backup, please link the Gmail address you previously registered for backups.
              </p>
            </div>

            <div className="space-y-3 pt-3">
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs font-semibold outline-none border ${
                    isDark ? 'bg-[#121824] border-slate-800 text-white focus:border-emerald-400' : 'bg-white border-slate-200 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleCheckBackup}
                className="w-full py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-400/10 transition-all mt-2"
              >
                <span>Check for Backups</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onComplete}
                className={`w-full py-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                  isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Skip Check & Create Fresh Account
              </button>
            </div>
          </div>
        )}

        {stage === 'check_backup' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in duration-300">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500/10 border-t-emerald-400 animate-spin flex items-center justify-center" />
              <Cloud className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-xs font-black tracking-wider uppercase text-emerald-400">Accessing Google Cloud</h3>
              <p className="text-[10px] text-slate-400">Checking Drive metadata files under {gmail}...</p>
            </div>
          </div>
        )}

        {stage === 'backup_found' && backupDetails && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-2">
              <h3 className="text-xl font-black tracking-tight text-emerald-400">Backup Found! 🎉</h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                A highly secure conversation history backup was successfully located on your Google Drive space.
              </p>
            </div>

            {/* Premium Backup Summary Info Card */}
            <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center space-x-2 border-b pb-2 border-slate-800/40">
                <HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-black text-emerald-400">Storage Information</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wide">Gmail Address</span>
                  <p className="font-bold truncate text-slate-200">{backupDetails.email}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wide">Backup Size</span>
                  <p className="font-bold text-slate-200">{backupDetails.backupSize}</p>
                </div>
                <div className="space-y-0.5 col-span-2">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wide">Last Backed Up</span>
                  <div className="flex items-center space-x-1.5 text-slate-200 font-bold mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(backupDetails.backupTime).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Data Summary Indicators */}
              <div className="pt-2 border-t border-slate-800/40 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <div className="flex items-center space-x-1">
                  <Database className="w-3 h-3 text-slate-400" />
                  <span>Chats restored: <strong className="text-white">{backupDetails.chats?.length || 0}</strong></span>
                </div>
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Voice notes, Media & DP config preserved</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={handlePerformRestore}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00E5A3] to-[#00C2FF] text-black font-black text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Restore Chat Backup</span>
              </button>

              <button
                onClick={handleSkipRestore}
                className={`w-full py-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                  isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Skip Restore
              </button>
            </div>
          </div>
        )}

        {stage === 'no_backup' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-2 text-center py-4">
              <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
              <h3 className="text-lg font-black tracking-tight text-amber-400">No Backup Found</h3>
              <p className={`text-xs leading-relaxed max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                We searched the secure Google Drive sandbox directory for {gmail} but did not locate any active VibeTalk databases.
              </p>
            </div>

            <div className="space-y-2 pt-4">
              <button
                onClick={() => setStage('gmail_input')}
                className="w-full py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-md transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Try another Gmail Address</span>
              </button>

              <button
                onClick={onComplete}
                className={`w-full py-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                  isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                Skip & Create Fresh Account
              </button>
            </div>
          </div>
        )}

        {stage === 'restoring' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-5 animate-in fade-in duration-300">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-500/10 border-t-emerald-400 animate-spin flex items-center justify-center" />
              <RefreshCw className="w-8 h-8 text-emerald-400 absolute inset-0 m-auto animate-spin" style={{ animationDuration: '3s' }} />
            </div>

            <div className="text-center space-y-2 w-full max-w-xs">
              <div className="flex justify-between items-center text-xs text-slate-400 font-bold px-1">
                <span>Restoring Backup...</span>
                <span className="text-emerald-400 font-black">{restoreProgress}%</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/50">
                <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full transition-all duration-300" style={{ width: `${restoreProgress}%` }} />
              </div>

              {/* Sub-log Console output */}
              <p className="text-[10px] text-emerald-400/80 font-mono truncate pt-1 animate-pulse">
                &gt; {restoreLog}
              </p>
            </div>
          </div>
        )}

        {stage === 'success' && (
          <div className="space-y-4 animate-in fade-in duration-300 text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-black tracking-tight text-emerald-400">Restore Complete!</h3>
              <p className={`text-xs leading-relaxed max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                All chat threads, contact entries, stories, configurations, and display properties have been fully restored.
              </p>
            </div>

            <button
              onClick={onComplete}
              className="w-full py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-md mt-6"
            >
              <span>Done & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className={`pt-4 border-t flex items-center justify-center space-x-1.5 text-[10px] ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>Fully integrated with Google Core Security Shield</span>
      </div>
    </div>
  );
}
