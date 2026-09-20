import { useState } from 'react';
import { Camera, Check, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileScreenProps {
  onSaveProfile: (profile: UserProfile) => void;
  isDark: boolean;
}

const VIBE_OPTIONS = [
  { id: 'focus', label: 'Deep Focus ⚡', color: 'from-amber-400 to-orange-500' },
  { id: 'chill', label: 'Chill & Ready 💬', color: 'from-emerald-400 to-teal-500' },
  { id: 'creative', label: 'Creative Flow 🎨', color: 'from-pink-400 to-purple-500' },
  { id: 'ai', label: 'Exploring AI 🤖', color: 'from-cyan-400 to-blue-500' }
];

export function ProfileScreen({ onSaveProfile, isDark }: ProfileScreenProps) {
  const [displayName, setDisplayName] = useState('Atta Muhammad');
  const [username, setUsername] = useState('atta_muhammad');
  const [bio, setBio] = useState('Connect. Communicate. Think Smarter. Founder @ AM Digital Hub');
  const [selectedVibe, setSelectedVibe] = useState('Deep Focus ⚡');
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
  const [avatarIndex, setAvatarIndex] = useState(0);

  const avatarGradients = [
    'from-[#00E5A3] to-[#00C2FF]',
    'from-[#FF5E7E] to-[#FF9966]',
    'from-[#7C4DFF] to-[#00C2FF]',
    'from-[#F59E0B] to-[#10B981]'
  ];

  const handleFinish = () => {
    const profile: UserProfile = {
      id: 'usr_atta_001',
      displayName: displayName || 'Atta Muhammad',
      username: username || 'atta_muhammad',
      phoneNumber: '+1 (555) 234-8901',
      bio: bio || 'Connect. Communicate. Think Smarter.',
      avatarUrl: null,
      vibeStatus: selectedVibe,
      language: selectedLanguage,
      isOnline: true,
      accountCreated: true
    };
    onSaveProfile(profile);
  };

  return (
    <div
      className={`h-full w-full flex flex-col justify-between px-6 py-6 select-none overflow-y-auto transition-colors duration-300 ${
        isDark ? 'bg-[#0A0D14] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      <div>
        <div className="pt-2 mb-4">
          <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            STEP 6 • PROFILE SETUP
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-2">Craft Your Identity</h2>
          <p
            className={`text-xs mt-1 leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Customize your persona and living aura for friends and AI agents.
          </p>
        </div>

        {/* Dynamic Aura Avatar */}
        <div className="flex flex-col items-center my-4">
          <div className="relative group cursor-pointer" onClick={() => setAvatarIndex((prev) => (prev + 1) % avatarGradients.length)}>
            <div
              className={`w-22 h-22 rounded-full p-1 bg-gradient-to-tr ${avatarGradients[avatarIndex]} shadow-lg shadow-emerald-500/20 flex items-center justify-center animate-pulse`}
            >
              <div
                className={`w-full h-full rounded-full flex items-center justify-center font-black text-2xl ${
                  isDark ? 'bg-[#121824] text-white' : 'bg-white text-slate-900'
                }`}
              >
                {displayName.slice(0, 2).toUpperCase() || 'AM'}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-400 text-black flex items-center justify-center shadow-md">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 mt-2">Tap to cycle aura gradient</span>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Display Name
            </label>
            <input
              id="input-display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold outline-none border transition-colors ${
                isDark
                  ? 'bg-[#121824] border-slate-800 focus:border-emerald-400'
                  : 'bg-white border-slate-200 focus:border-emerald-500'
              }`}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Username Handle
            </label>
            <div
              className={`flex items-center px-3.5 py-2.5 rounded-xl border text-xs ${
                isDark ? 'bg-[#121824] border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <span className="text-emerald-400 font-bold mr-1">@</span>
              <input
                id="input-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent outline-none font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Tagline / Bio
            </label>
            <input
              id="input-bio"
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none border ${
                isDark ? 'bg-[#121824] border-slate-800' : 'bg-white border-slate-200'
              }`}
            />
          </div>

          {/* Living Vibe Selector */}
          <div>
            <label className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Default Living Vibe Status</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {VIBE_OPTIONS.map((vibe) => (
                <button
                  key={vibe.id}
                  id={`btn-vibe-${vibe.id}`}
                  type="button"
                  onClick={() => setSelectedVibe(vibe.label)}
                  className={`px-2.5 py-2 rounded-xl text-left border text-[11px] font-semibold flex items-center justify-between cursor-pointer transition-all ${
                    selectedVibe === vibe.label
                      ? 'border-emerald-400 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/30'
                      : isDark
                      ? 'border-slate-800 bg-[#121824] text-slate-300 hover:border-slate-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span>{vibe.label}</span>
                  {selectedVibe === vibe.label && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 pb-2">
        <button
          id="btn-save-profile"
          onClick={handleFinish}
          className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#00E5A3] to-[#00C2FF] text-black font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all hover:brightness-105 cursor-pointer"
        >
          <span>Complete Setup & Enter</span>
        </button>
      </div>
    </div>
  );
}
