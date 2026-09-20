import { useState, useRef } from 'react';
import {
  X,
  Camera,
  Sparkles,
  Eye,
  Lock,
  Users,
  Globe,
  Check,
  Upload,
  RefreshCw,
  Sliders,
  Shield,
  Palette,
  Atom,
  Tv,
  Coins,
  Crown,
  Moon
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuraProfilePrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
  isDark: boolean;
}

// Highly stylized futuristic pre-sets for AI Aura Generator
const AI_AVATAR_PRESETS = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Visor',
    theme: 'Neon Cyan & Electric Purple',
    bg: 'from-fuchsia-600 via-[#101726] to-cyan-500',
    icon: Atom,
    color: '#00E5A3',
    filter: 'hue-rotate-15 contrast-125 saturate-150',
    svgMarkup: (name: string) => `
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="grad-cyber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#d946ef" />
            <stop offset="50%" stop-color="#111827" />
            <stop offset="100%" stop-color="#06b6d4" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#grad-cyber)" stroke="#06b6d4" stroke-width="2" />
        <g opacity="0.15">
          <line x1="10" y1="20" x2="90" y2="20" stroke="#00E5A3" stroke-width="1" />
          <line x1="10" y1="40" x2="90" y2="40" stroke="#00E5A3" stroke-width="1" />
          <line x1="10" y1="60" x2="90" y2="60" stroke="#00E5A3" stroke-width="1" />
          <line x1="10" y1="80" x2="90" y2="80" stroke="#00E5A3" stroke-width="1" />
        </g>
        <circle cx="50" cy="45" r="18" fill="none" stroke="#00E5A3" stroke-width="2" stroke-dasharray="4 2" />
        <rect x="35" y="42" width="30" height="6" rx="3" fill="#00E5A3" opacity="0.8" />
        <text x="50" y="80" font-family="monospace" font-weight="900" font-size="12" fill="#00E5A3" text-anchor="middle" letter-spacing="1">
          ${name.slice(0, 8).toUpperCase()}
        </text>
      </svg>
    `
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave Sun',
    theme: 'Pastel Sunset & Synth Grid',
    bg: 'from-pink-500 via-[#1a1126] to-purple-600',
    icon: Tv,
    color: '#FF6EA7',
    filter: 'contrast-110 saturate-125 brightness-110',
    svgMarkup: (name: string) => `
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="grad-vapor" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ff007f" />
            <stop offset="40%" stop-color="#7928ca" />
            <stop offset="100%" stop-color="#ff007f" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#grad-vapor)" stroke="#ff007f" stroke-width="1.5" />
        <g opacity="0.4">
          <path d="M 10,65 L 90,65 M 15,73 L 85,73 M 20,81 L 80,81 M 25,89 L 75,89" stroke="#00f0ff" stroke-width="1" />
          <path d="M 50,50 L 15,90 M 50,50 L 35,90 M 50,50 L 50,90 M 50,50 L 65,90 M 50,50 L 85,90" stroke="#00f0ff" stroke-width="0.5" />
        </g>
        <circle cx="50" cy="40" r="15" fill="#f59e0b" />
        <text x="50" y="78" font-family="sans-serif" font-weight="bold" font-size="9" fill="#00f0ff" text-anchor="middle" letter-spacing="2">
          ${name.toUpperCase()}
        </text>
      </svg>
    `
  },
  {
    id: 'sovereign',
    name: 'Aura Sovereign',
    theme: 'Liquid Gold & Absolute Dark',
    bg: 'from-amber-500 via-[#0D0D0D] to-yellow-600',
    icon: Crown,
    color: '#FBBF24',
    filter: 'brightness-120 saturate-150 contrast-110',
    svgMarkup: (name: string) => `
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="grad-sov" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fbbf24" />
            <stop offset="60%" stop-color="#171717" />
            <stop offset="100%" stop-color="#000000" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#grad-sov)" stroke="#fbbf24" stroke-width="2" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="#fbbf24" stroke-width="0.5" stroke-dasharray="1 3" />
        <polygon points="50,30 58,45 73,40 65,55 50,50 35,55 27,40 42,45" fill="#fbbf24" opacity="0.9" />
        <text x="50" y="76" font-family="serif" font-weight="bold" font-style="italic" font-size="10" fill="#ffffff" text-anchor="middle" letter-spacing="1">
          ${name}
        </text>
      </svg>
    `
  },
  {
    id: 'cosmic',
    name: 'Cosmic Vibe',
    theme: 'Abyssal Blue & Supernova Glow',
    bg: 'from-blue-600 via-[#0A0D1A] to-indigo-700',
    icon: Moon,
    color: '#6366F1',
    filter: 'contrast-130 brightness-110 saturate-110',
    svgMarkup: (name: string) => `
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="grad-cosmic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4f46e5" />
            <stop offset="60%" stop-color="#090d16" />
            <stop offset="100%" stop-color="#3b82f6" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#grad-cosmic)" stroke="#4f46e5" stroke-width="1.5" />
        <circle cx="52" cy="40" r="12" fill="#ffffff" opacity="0.9" />
        <circle cx="46" cy="40" r="12" fill="#090d16" />
        <circle cx="75" cy="30" r="1.5" fill="#ffffff" />
        <circle cx="25" cy="65" r="1" fill="#ffffff" />
        <circle cx="30" cy="25" r="2" fill="#818cf8" opacity="0.6" />
        <text x="50" y="80" font-family="sans-serif" font-weight="800" font-size="11" fill="#818cf8" text-anchor="middle" letter-spacing="1.5">
          ${name.split(' ')[0].toUpperCase()}
        </text>
      </svg>
    `
  }
];

export function AuraProfilePrivacyModal({
  isOpen,
  onClose,
  user,
  onSave,
  isDark
}: AuraProfilePrivacyModalProps) {
  // Navigation tabs for the modal
  const [activeSubTab, setActiveSubTab] = useState<'profile_photo' | 'privacy_settings'>('profile_photo');

  // Avatar edit states
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatarUrl);

  // Privacy States
  const [dpPrivacy, setDpPrivacy] = useState<'everyone' | 'contacts' | 'nobody'>(user.dpPrivacy || 'everyone');
  const [storyPrivacy, setStoryPrivacy] = useState<'everyone' | 'contacts' | 'nobody'>(user.storyPrivacy || 'everyone');

  // Interactive AI Engine states
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState('cyberpunk');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // File Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Modern AI Generator Simulator
  const handleGenerateAIAvatar = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationLogs([]);

    const logs = [
      '⚡ Connecting to Aura Quantum Synthesis Core...',
      '🔍 Reading biometric signature data...',
      '🎨 Initializing color matrices & ambient lens gradients...',
      '🛠️ Vectorizing SVG structures with custom pseudonym initials...',
      '✨ Injecting premium cybernetic glow overlays...',
      '💾 Avatar synthesis complete! Storing in secured LocalDataStore.'
    ];

    let currentLogIdx = 0;
    const interval = setInterval(() => {
      if (currentLogIdx < logs.length) {
        setGenerationLogs((prev) => [...prev, logs[currentLogIdx]]);
        setGenerationProgress((prev) => Math.min(prev + 18, 100));
        currentLogIdx++;
      } else {
        clearInterval(interval);
        setGenerationProgress(100);

        // Generate the SVG data-url representing the AI generated artwork
        const preset = AI_AVATAR_PRESETS.find((p) => p.id === selectedPresetId) || AI_AVATAR_PRESETS[0];
        const svgString = preset.svgMarkup(displayName || 'USER');
        const encodedSvg = encodeURIComponent(svgString.trim())
          .replace(/'/g, "%27")
          .replace(/"/g, "%22");
        const dataUrl = `data:image/svg+xml;utf8,${encodedSvg}`;

        setAvatarUrl(dataUrl);
        setTimeout(() => {
          setIsGenerating(false);
        }, 800);
      }
    }, 450);
  };

  // Submit & Save Changes
  const handleSaveChanges = () => {
    const updatedUser: UserProfile = {
      ...user,
      displayName,
      bio,
      avatarUrl,
      dpPrivacy,
      storyPrivacy
    };
    onSave(updatedUser);
    onClose();
  };

  const activePreset = AI_AVATAR_PRESETS.find((p) => p.id === selectedPresetId) || AI_AVATAR_PRESETS[0];

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[94vh] ${
          isDark ? 'bg-[#0E131F] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-black">Aura Profile & Privacy Shield</h3>
              <p className="text-[10px] text-slate-400">Interactive DP Studio & Custom Visibility Controls</p>
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

        {/* Navigation Tabs */}
        <div className={`flex border-b px-4 space-x-4 ${isDark ? 'border-slate-800 bg-[#090C14]' : 'border-slate-200 bg-slate-50'}`}>
          <button
            onClick={() => setActiveSubTab('profile_photo')}
            className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'profile_photo'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>DP Studio & Profile</span>
          </button>
          <button
            onClick={() => setActiveSubTab('privacy_settings')}
            className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'privacy_settings'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Visibility & Privacy Shield</span>
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeSubTab === 'profile_photo' ? (
            <div className="space-y-4">
              {/* Profile Preview Panel */}
              <div
                className={`p-4 rounded-xl border flex flex-col md:flex-row items-center gap-4 ${
                  isDark ? 'bg-[#131A2A] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                {/* DP Avatar Area */}
                <div className="relative shrink-0 group">
                  <div
                    className={`w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-400 p-1 flex items-center justify-center bg-[#0B0F19] shadow-lg`}
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile Preview"
                        className="w-full h-full rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#00E5A3] to-[#00C2FF] flex items-center justify-center font-black text-2xl text-black">
                        {displayName.slice(0, 2).toUpperCase() || 'AM'}
                      </div>
                    )}
                  </div>

                  {/* Manual File Select trigger */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-400 text-black flex items-center justify-center cursor-pointer shadow-md active:scale-90 hover:bg-emerald-300 transition-transform"
                    title="Upload custom DP file"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Profile Text Inputs */}
                <div className="flex-1 w-full space-y-2.5">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-lg text-xs font-semibold outline-none border ${
                        isDark ? 'bg-[#090D16] border-slate-800 text-white focus:border-emerald-400' : 'bg-white border-slate-200 text-slate-900 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Status / Tagline
                    </label>
                    <input
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-lg text-xs font-semibold outline-none border ${
                        isDark ? 'bg-[#090D16] border-slate-800 text-white focus:border-emerald-400' : 'bg-white border-slate-200 text-slate-900 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Jadeeed AI Avatar Studio Panel */}
              <div className={`p-4 rounded-xl border space-y-3.5 ${isDark ? 'bg-[#101625] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <h4 className="text-xs font-black text-slate-200 uppercase tracking-wide">Quantum AI Avatar Studio</h4>
                  <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold rounded">JADEEED</span>
                </div>

                <p className="text-[10px] text-slate-400 leading-normal">
                  Our futuristic AI synthesis engine generates custom vector avatars featuring glowing quantum shapes, neon filter lens alignments, and embedded name hashes. Select a prototype style below to generate!
                </p>

                {/* Preset Prototypes Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {AI_AVATAR_PRESETS.map((preset) => {
                    const PresetIcon = preset.icon;
                    const selected = selectedPresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedPresetId(preset.id)}
                        className={`p-2.5 rounded-xl border text-left flex flex-col space-y-1.5 transition-all cursor-pointer ${
                          selected
                            ? 'border-emerald-400 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/30'
                            : isDark ? 'border-slate-800 bg-[#0B0F19] text-slate-400 hover:border-slate-700 hover:text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-black'
                        }`}
                      >
                        <PresetIcon className={`w-4 h-4 ${selected ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <div>
                          <p className="text-[10px] font-bold truncate">{preset.name}</p>
                          <p className="text-[8px] text-slate-500 truncate">{preset.theme}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Optional Custom AI Prompt */}
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Custom Vibe Prompt Modifier (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. glowing electric crown, galaxy neon rings..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs outline-none border ${
                      isDark ? 'bg-[#090D16] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                {/* AI Generation State Overlay / Logger */}
                {isGenerating ? (
                  <div className="p-3 bg-slate-950/80 border border-emerald-500/20 rounded-lg space-y-2 font-mono text-[9px]">
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span className="flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        SYNTHESIZING AVATAR...
                      </span>
                      <span>{generationProgress}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${generationProgress}%` }} />
                    </div>
                    {/* Active Logs */}
                    <div className="space-y-1 text-slate-400 max-h-[80px] overflow-y-auto pt-1 border-t border-slate-800/50">
                      {generationLogs.map((log, index) => (
                        <div key={index} className="truncate">{log}</div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerateAIAvatar}
                    className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-400/10 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Aura Avatar ⚡</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Visibility explanation */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${isDark ? 'bg-[#131A2A] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Privacy Shield Integration</h4>
                  <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                    Choose who is authorized to view your Display Picture (DP) and your Story/Updates. When visibility permissions are restricted, unauthorized users will see default blank placeholders instead, ensuring maximum metadata security.
                  </p>
                </div>
              </div>

              {/* DP Visibility Choices */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">
                  Who can see my Display Picture (DP)?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'everyone', label: 'Everyone', desc: 'All VibeTalk users', icon: Globe },
                    { id: 'contacts', label: 'Contacts Only', desc: 'Synced contacts', icon: Users },
                    { id: 'nobody', label: 'Nobody', desc: 'Private to everyone', icon: Lock }
                  ].map((option) => {
                    const OptIcon = option.icon;
                    const isSelected = dpPrivacy === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setDpPrivacy(option.id as any)}
                        className={`p-3 rounded-xl border text-left flex flex-col space-y-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/30'
                            : isDark ? 'border-slate-800 bg-[#121724] text-slate-400 hover:border-slate-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <OptIcon className="w-4 h-4 shrink-0" />
                        <div>
                          <p className="text-xs font-black">{option.label}</p>
                          <p className="text-[8px] text-slate-500 leading-tight mt-0.5">{option.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Story / Status updates visibility choice */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">
                  Who can see my Stories & Status updates?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'everyone', label: 'Everyone', desc: 'All VibeTalk users', icon: Globe },
                    { id: 'contacts', label: 'Contacts Only', desc: 'Synced contacts', icon: Users },
                    { id: 'nobody', label: 'Only Me (Nobody)', desc: 'Private to everyone', icon: Lock }
                  ].map((option) => {
                    const OptIcon = option.icon;
                    const isSelected = storyPrivacy === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setStoryPrivacy(option.id as any)}
                        className={`p-3 rounded-xl border text-left flex flex-col space-y-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/30'
                            : isDark ? 'border-slate-800 bg-[#121724] text-slate-400 hover:border-slate-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <OptIcon className="w-4 h-4 shrink-0" />
                        <div>
                          <p className="text-xs font-black">{option.label}</p>
                          <p className="text-[8px] text-slate-500 leading-tight mt-0.5">{option.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className={`px-5 py-4 border-t flex items-center justify-end gap-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 text-xs font-bold rounded-xl border cursor-pointer transition-colors ${
              isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-slate-950 flex items-center space-x-1 cursor-pointer transition-all shadow-md shadow-emerald-400/5"
          >
            <Check className="w-4 h-4" />
            <span>Apply Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
