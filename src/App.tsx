import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AndroidDeviceFrame } from './components/AndroidDeviceFrame';
import { SplashScreen } from './components/screens/SplashScreen';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { OtpScreen } from './components/screens/OtpScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { ChatDetailScreen } from './components/screens/ChatDetailScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { AboutScreen } from './components/screens/AboutScreen';
import { HelpScreen } from './components/screens/HelpScreen';
import { PermissionModal } from './components/PermissionModal';
import { SecurityPrivacyModal } from './components/SecurityPrivacyModal';
import { Phase8AdvancedFeaturesModal } from './components/Phase8AdvancedFeaturesModal';
import { Phase9SettingsHub } from './components/Phase9SettingsHub';
import { Phase10AdminDashboard } from './components/Phase10AdminDashboard';
import { Phase11SuperAIHub } from './components/Phase11SuperAIHub';
import { CodeInspector } from './components/CodeInspector';
import { AuraProfilePrivacyModal } from './components/AuraProfilePrivacyModal';
import { BackupRestoreScreen } from './components/screens/BackupRestoreScreen';
import { GoogleDriveBackupModal } from './components/GoogleDriveBackupModal';
import { biometricAuthManager } from './security/BiometricAuthManager';
import { settingsManager } from './settings/SettingsManager';
import { AndroidPermission, ScreenRoute, UserProfile } from './types';
import {
  Smartphone,
  Code2,
  Moon,
  Sun,
  Shield,
  Layers,
  ChevronRight,
  RotateCcw,
  Sparkles,
  MessageSquare
} from 'lucide-react';

const INITIAL_USER: UserProfile = {
  id: 'usr_atta_001',
  displayName: 'Atta Muhammad',
  username: 'atta_dev',
  phoneNumber: '+1 (555) 234-8901',
  bio: 'Connect. Communicate. Think Smarter. Founder @ AM Digital Hub',
  avatarUrl: null,
  vibeStatus: 'Deep Focus ⚡',
  language: 'English (US)',
  isOnline: true,
  accountCreated: true,
  dpPrivacy: 'everyone',
  storyPrivacy: 'everyone'
};

const INITIAL_PERMISSIONS: AndroidPermission[] = [
  {
    id: 'location',
    name: 'Location (ACCESS_FINE_LOCATION)',
    description: 'Required to share live location and search nearby chat peers.',
    granted: true,
    iconName: 'MapPin'
  },
  {
    id: 'camera',
    name: 'Camera (RECORD_VIDEO)',
    description: 'Required for HD video calling and Vibe stories.',
    granted: true,
    iconName: 'Camera'
  },
  {
    id: 'mic',
    name: 'Microphone (RECORD_AUDIO)',
    description: 'Crystal-clear voice notes and noise-cancelled audio calls.',
    granted: true,
    iconName: 'Mic'
  },
  {
    id: 'calendar',
    name: 'Calendar (READ_CALENDAR)',
    description: 'Required to schedule workspace meetings and track call tasks.',
    granted: false,
    iconName: 'Calendar'
  },
  {
    id: 'call_logs',
    name: 'Call Logs (READ_CALL_LOG)',
    description: 'Required to sync calling history with native Android dialer.',
    granted: false,
    iconName: 'PhoneCall'
  },
  {
    id: 'contacts',
    name: 'Contacts (READ_CONTACTS)',
    description: 'Instant synchronisation with verified VibeTalk friends.',
    granted: true,
    iconName: 'Contact'
  },
  {
    id: 'files',
    name: 'Files (READ_EXTERNAL_STORAGE)',
    description: 'Required to share documents, pdfs, and chat archives.',
    granted: false,
    iconName: 'FileText'
  },
  {
    id: 'music_audio',
    name: 'Music and Audio (READ_MEDIA_AUDIO)',
    description: 'Required to send, receive, and play high-quality music/audio tracks.',
    granted: false,
    iconName: 'Music'
  },
  {
    id: 'phone',
    name: 'Phone (READ_PHONE_STATE)',
    description: 'Required to handle incoming cellular interruptions during VoIP calls.',
    granted: false,
    iconName: 'Smartphone'
  },
  {
    id: 'photos_videos',
    name: 'Photos and Videos (READ_MEDIA_IMAGES)',
    description: 'Required to upload images, avatars, stories, and send gallery items.',
    granted: true,
    iconName: 'Image'
  },
  {
    id: 'sms',
    name: 'SMS (RECEIVE_SMS)',
    description: 'Required to auto-detect and autofill OTP verification codes.',
    granted: true,
    iconName: 'MessageSquareCode'
  },
  {
    id: 'notifications',
    name: 'Push Notifications (POST_NOTIFICATIONS)',
    description: 'Incoming encrypted call alerts and contextual AI summaries.',
    granted: true,
    iconName: 'Bell'
  }
];

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<ScreenRoute>('home');
  const [selectedChatId, setSelectedChatId] = useState<string>('c_atta');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 234-8901');
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('vibetalk_user_profile_v1');
      if (stored) {
        return { ...INITIAL_USER, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load user profile from LocalStorage:', e);
    }
    return INITIAL_USER;
  });

  useEffect(() => {
    try {
      localStorage.setItem('vibetalk_user_profile_v1', JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to save user profile to LocalStorage:', e);
    }
  }, [user]);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [showCodeInspector, setShowCodeInspector] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [showSecurityCenter, setShowSecurityCenter] = useState(false);
  const [showAuraProfilePrivacy, setShowAuraProfilePrivacy] = useState(false);
  const [showPhase8Modal, setShowPhase8Modal] = useState(false);
  const [showPhase9Hub, setShowPhase9Hub] = useState(false);
  const [showPhase10Admin, setShowPhase10Admin] = useState(false);
  const [showPhase11Hub, setShowPhase11Hub] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('#8B5CF6');
  const [permissions, setPermissions] = useState<AndroidPermission[]>(INITIAL_PERMISSIONS);

  useEffect(() => {
    (window as any).__openSecurityCenter = () => setShowSecurityCenter(true);
    (window as any).__openPhase8Modal = () => setShowPhase8Modal(true);
    (window as any).__openPhase9Hub = () => setShowPhase9Hub(true);
    (window as any).__openPhase10Admin = () => setShowPhase10Admin(true);
    (window as any).__openPhase11Hub = () => setShowPhase11Hub(true);

    // Startup & Background Resumption Biometric App Lock Check
    const checkAppLockOnResume = async () => {
      if (document.visibilityState === 'visible' && settingsManager.isAppLockEnabled()) {
        await biometricAuthManager.authenticate({
          title: 'VibeTalk App Lock',
          subtitle: 'Verify biometric identity to resume session'
        });
      }
    };

    if (settingsManager.isAppLockEnabled()) {
      biometricAuthManager.authenticate({
        title: 'VibeTalk App Lock',
        subtitle: 'Verify biometric identity to unlock'
      });
    }

    document.addEventListener('visibilitychange', checkAppLockOnResume);

    return () => {
      delete (window as any).__openSecurityCenter;
      delete (window as any).__openPhase8Modal;
      delete (window as any).__openPhase9Hub;
      delete (window as any).__openPhase10Admin;
      delete (window as any).__openPhase11Hub;
      document.removeEventListener('visibilitychange', checkAppLockOnResume);
    };
  }, []);

  const togglePermission = async (id: string) => {
    let shouldGrant = false;
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          shouldGrant = !p.granted;
          return { ...p, granted: shouldGrant };
        }
        return p;
      })
    );

    if (shouldGrant) {
      try {
        if (id === 'location' && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            () => console.log('Location permission granted.'),
            (err) => console.warn('Location permission denied:', err)
          );
        } else if (id === 'camera' && navigator.mediaDevices) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach((track) => track.stop());
          console.log('Camera permission granted.');
        } else if (id === 'mic' && navigator.mediaDevices) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((track) => track.stop());
          console.log('Microphone permission granted.');
        }
      } catch (err) {
        console.warn(`Native browser permission request failed for ${id}:`, err);
      }
    }
  };

  const navRoutes: { route: ScreenRoute; label: string }[] = [
    { route: 'splash', label: '1. Splash' },
    { route: 'welcome', label: '2. Welcome' },
    { route: 'onboarding', label: '3. Onboarding' },
    { route: 'login', label: '4. Login' },
    { route: 'otp', label: '5. OTP' },
    { route: 'profile', label: '6. Profile' },
    { route: 'home', label: '7. Home (5 Tabs)' },
    { route: 'chat-detail', label: '8. Messaging Core (Room)' },
    { route: 'settings', label: '9. Settings' }
  ];

  return (
    <div
      className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-300 ${
        isDark ? 'bg-[#06080D] text-slate-100' : 'bg-[#EDF2F7] text-slate-900'
      }`}
    >
      {/* Platform Header & Navigation Stepper */}
      <header
        className={`px-4 sm:px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 backdrop-blur-md ${
          isDark
            ? 'bg-[#0A0E17]/90 border-slate-800'
            : 'bg-white/90 border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00E5A3] to-[#00C2FF] flex items-center justify-center text-black font-black text-xs shadow-md shadow-emerald-500/20">
            V~
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-black tracking-tight">VibeTalk AI Messenger</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                PHASE 2 • MESSAGING CORE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Room Local Caching • Voice Notes • Media • Reactions • Mentions • E2E Encryption
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center space-x-2">
          {/* Permissions Trigger */}
          <button
            onClick={() => setShowPermissions(true)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
              isDark
                ? 'border-slate-800 bg-[#111622] hover:bg-slate-800 text-slate-300'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Permissions</span>
          </button>

          {/* Toggle Code Inspector */}
          <button
            onClick={() => setShowCodeInspector(!showCodeInspector)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
              showCodeInspector
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                : isDark
                ? 'border-slate-800 bg-[#111622] hover:bg-slate-800 text-slate-300'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{showCodeInspector ? 'Show Phone' : 'Inspect Code'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? 'border-slate-800 bg-[#111622] hover:bg-slate-800 text-amber-400'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
            title="Toggle Light/Dark Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Reset Navigation */}
          <button
            onClick={() => setCurrentRoute('splash')}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? 'border-slate-800 bg-[#111622] hover:bg-slate-800 text-slate-400'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
            title="Restart Flow from Splash"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Nav Flow Stepper Bar */}
      <div
        className={`px-4 py-2 border-b overflow-x-auto flex items-center space-x-1 text-xs select-none ${
          isDark ? 'bg-[#080B11] border-slate-800/80' : 'bg-slate-100 border-slate-200'
        }`}
      >
        <span className="text-[10px] uppercase font-bold text-slate-500 mr-2 shrink-0">
          Architecture Route:
        </span>
        {navRoutes.map((step, idx) => {
          const isActive = currentRoute === step.route;
          return (
            <div key={step.route} className="flex items-center space-x-1 shrink-0">
              <button
                onClick={() => setCurrentRoute(step.route)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {step.label}
              </button>
              {idx < navRoutes.length - 1 && (
                <ChevronRight className="w-3 h-3 text-slate-500/40 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
        {showCodeInspector ? (
          <div className="w-full max-w-6xl h-[80vh]">
            <CodeInspector isDark={isDark} />
          </div>
        ) : (
          <AndroidDeviceFrame
            isDark={isDark}
            onToggleTheme={() => setIsDark(!isDark)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentRoute}
                initial={{ opacity: 0, x: 12, filter: 'blur(3px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -12, filter: 'blur(3px)' }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="w-full h-full flex flex-col flex-1 overflow-hidden"
              >
                {/* Screen State Machine */}
                {currentRoute === 'splash' && (
                  <SplashScreen
                    isDark={isDark}
                    onFinish={() => setCurrentRoute('welcome')}
                  />
                )}

                {currentRoute === 'welcome' && (
                  <WelcomeScreen
                    isDark={isDark}
                    onGetStarted={() => setCurrentRoute('onboarding')}
                    onLogin={() => setCurrentRoute('login')}
                  />
                )}

                {currentRoute === 'onboarding' && (
                  <OnboardingScreen
                    isDark={isDark}
                    onComplete={() => setCurrentRoute('login')}
                  />
                )}

                {currentRoute === 'login' && (
                  <LoginScreen
                    isDark={isDark}
                    onOtpRequested={(phone) => {
                      setPhoneNumber(phone);
                      setCurrentRoute('otp');
                    }}
                  />
                )}

                {currentRoute === 'otp' && (
                  <OtpScreen
                    phoneNumber={phoneNumber}
                    isDark={isDark}
                    onBack={() => setCurrentRoute('login')}
                    onVerified={(isNew) => {
                      setIsNewUser(isNew);
                      setCurrentRoute('backup-restore');
                    }}
                  />
                )}

                {currentRoute === 'backup-restore' && (
                  <BackupRestoreScreen
                    isDark={isDark}
                    onUpdateUser={(updatedUser) => setUser(updatedUser)}
                    onComplete={() => {
                      if (isNewUser) {
                        setCurrentRoute('profile');
                      } else {
                        setCurrentRoute('home');
                      }
                    }}
                  />
                )}

                {currentRoute === 'profile' && (
                  <ProfileScreen
                    isDark={isDark}
                    onSaveProfile={(updatedProfile) => {
                      setUser(updatedProfile);
                      setCurrentRoute('home');
                    }}
                  />
                )}

                {currentRoute === 'home' && (
                  <HomeScreen
                    user={user}
                    isDark={isDark}
                    onRequestPermission={() => setShowPermissions(true)}
                    onOpenChat={(chatId) => {
                      setSelectedChatId(chatId);
                      setCurrentRoute('chat-detail');
                    }}
                    onOpenSettings={() => setCurrentRoute('settings')}
                    onOpenProfilePrivacy={() => setShowAuraProfilePrivacy(true)}
                  />
                )}

                {currentRoute === 'chat-detail' && (
                  <ChatDetailScreen
                    chatId={selectedChatId}
                    user={user}
                    isDark={isDark}
                    onBack={() => setCurrentRoute('home')}
                  />
                )}

                {currentRoute === 'settings' && (
                  <SettingsScreen
                    user={user}
                    isDark={isDark}
                    onBack={() => setCurrentRoute('home')}
                    onOpenAbout={() => setCurrentRoute('about')}
                    onOpenHelp={() => setCurrentRoute('help')}
                    onRequestPermission={() => setShowPermissions(true)}
                    onLogout={() => setCurrentRoute('welcome')}
                    onToggleTheme={() => setIsDark(!isDark)}
                    onOpenProfilePrivacy={() => setShowAuraProfilePrivacy(true)}
                    onOpenBackup={() => setShowBackupModal(true)}
                  />
                )}

                {currentRoute === 'about' && (
                  <AboutScreen
                    isDark={isDark}
                    onBack={() => setCurrentRoute('settings')}
                  />
                )}

                {currentRoute === 'help' && (
                  <HelpScreen
                    isDark={isDark}
                    onBack={() => setCurrentRoute('settings')}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </AndroidDeviceFrame>
        )}
      </main>

      {/* Android Permission Architecture Modal */}
      <PermissionModal
        isOpen={showPermissions}
        onClose={() => setShowPermissions(false)}
        permissions={permissions}
        onTogglePermission={togglePermission}
        isDark={isDark}
      />

      {/* Security & Privacy Center Modal */}
      <SecurityPrivacyModal
        isOpen={showSecurityCenter}
        onClose={() => setShowSecurityCenter(false)}
        isDark={isDark}
      />

      {/* Phase 8 Advanced Features Modal */}
      <Phase8AdvancedFeaturesModal
        isOpen={showPhase8Modal}
        onClose={() => setShowPhase8Modal(false)}
        isDark={isDark}
      />

      {/* Phase 9 Premium UI, Search & Storage Hub */}
      <Phase9SettingsHub
        isOpen={showPhase9Hub}
        onClose={() => setShowPhase9Hub(false)}
        isDark={isDark}
        currentTheme={currentTheme}
        onSelectTheme={(th) => {
          setCurrentTheme(th);
          if (th === 'light') setIsDark(false);
          else setIsDark(true);
        }}
        accentColor={accentColor}
        onSelectAccent={setAccentColor}
      />

      {/* Phase 10 Secure Web Admin Dashboard */}
      <Phase10AdminDashboard
        isOpen={showPhase10Admin}
        onClose={() => setShowPhase10Admin(false)}
        isDark={isDark}
      />

      {/* Phase 11 Super AI & Advanced Integration Hub */}
      <Phase11SuperAIHub
        isOpen={showPhase11Hub}
        onClose={() => setShowPhase11Hub(false)}
        isDark={isDark}
      />

      {/* Modern Aura DP & Privacy Shield Manager */}
      <AuraProfilePrivacyModal
        isOpen={showAuraProfilePrivacy}
        onClose={() => setShowAuraProfilePrivacy(false)}
        user={user}
        onSave={(updatedUser) => {
          setUser(updatedUser);
        }}
        isDark={isDark}
      />

      {/* Google Drive Chat Backup & Cloud Sync Manager */}
      <GoogleDriveBackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        user={user}
        onSave={(updatedUser) => {
          setUser(updatedUser);
        }}
        isDark={isDark}
      />
    </div>
  );
}
