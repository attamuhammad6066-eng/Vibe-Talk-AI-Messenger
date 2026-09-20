import { useState } from 'react';
import {
  X,
  Type,
  Image,
  Video,
  Eye,
  Shield,
  Palette,
  Sparkles,
  Check
} from 'lucide-react';
import { StoryPrivacy, StoryType } from '../types';
import { messagingRepository } from '../services/messagingRepository';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const GRADIENTS = [
  'from-emerald-600 via-teal-700 to-cyan-800',
  'from-purple-900 via-indigo-900 to-slate-900',
  'from-rose-600 via-pink-700 to-purple-800',
  'from-amber-600 via-orange-700 to-rose-800',
  'from-cyan-600 via-blue-700 to-indigo-900'
];

const PRESET_MEDIA = {
  photo: [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
  ],
  video: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
  ]
};

export function CreateStoryModal({ isOpen, onClose, isDark }: CreateStoryModalProps) {
  const [storyType, setStoryType] = useState<StoryType>('text');
  const [content, setContent] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);
  const [mediaUrl, setMediaUrl] = useState(PRESET_MEDIA.photo[0]);
  const [privacy, setPrivacy] = useState<StoryPrivacy>(() => {
    try {
      const stored = localStorage.getItem('vibetalk_user_profile_v1');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.storyPrivacy) {
          if (u.storyPrivacy === 'nobody') return 'nobody';
          return u.storyPrivacy as StoryPrivacy;
        }
      }
    } catch (e) {
      console.warn(e);
    }
    return 'contacts';
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && storyType === 'text') return;

    messagingRepository.addStory({
      type: storyType,
      content: content.trim() || (storyType === 'photo' ? 'Photo moment' : 'Video clip'),
      mediaUrl: storyType !== 'text' ? mediaUrl : undefined,
      bgGradient: storyType === 'text' ? selectedGradient : undefined,
      privacy
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden ${
          isDark
            ? 'bg-[#0E131F] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm">Post to Story / Aura</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Story Format Selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setStoryType('text');
              }}
              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                storyType === 'text'
                  ? 'bg-emerald-400 text-black shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStoryType('photo');
                setMediaUrl(PRESET_MEDIA.photo[0]);
              }}
              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                storyType === 'photo'
                  ? 'bg-emerald-400 text-black shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Image className="w-3.5 h-3.5" />
              <span>Photo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStoryType('video');
                setMediaUrl(PRESET_MEDIA.video[0]);
              }}
              className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                storyType === 'video'
                  ? 'bg-emerald-400 text-black shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video</span>
            </button>
          </div>

          {/* Preview Canvas */}
          <div
            className={`w-full h-48 rounded-2xl p-4 flex flex-col justify-center items-center text-center relative overflow-hidden transition-all shadow-inner ${
              storyType === 'text' ? `bg-gradient-to-tr ${selectedGradient}` : 'bg-black'
            }`}
          >
            {storyType !== 'text' && (
              <img
                src={mediaUrl}
                alt="Story media"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
            )}

            <div className="relative z-10 w-full">
              {storyType === 'text' ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's your vibe right now?"
                  rows={4}
                  className="w-full bg-transparent text-white font-extrabold text-sm md:text-base text-center placeholder-white/60 outline-none resize-none"
                  required
                />
              ) : (
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Add a caption..."
                  className="w-full bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-xl text-center outline-none border border-white/20"
                />
              )}
            </div>
          </div>

          {/* Text Story Customizer: Gradients */}
          {storyType === 'text' && (
            <div className="space-y-1.5">
              <label className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <Palette className="w-3 h-3" />
                <span>Atmospheric Aura Gradient</span>
              </label>
              <div className="flex space-x-2">
                {GRADIENTS.map((g, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedGradient(g)}
                    className={`w-8 h-8 rounded-full bg-gradient-to-tr ${g} ring-offset-2 ring-offset-slate-900 transition-all ${
                      selectedGradient === g ? 'ring-2 ring-emerald-400 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Photo/Video Preset Picker */}
          {storyType !== 'text' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Select Visual Asset
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(storyType === 'photo' ? PRESET_MEDIA.photo : PRESET_MEDIA.video).map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => setMediaUrl(url)}
                    className={`aspect-video rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      mediaUrl === url ? 'border-emerald-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="preset" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Selector */}
          <div className="space-y-1.5">
            <label className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span>Who can see this story?</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'everyone' as StoryPrivacy, label: 'Everyone (Public)' },
                { id: 'contacts' as StoryPrivacy, label: 'My Contacts' },
                { id: 'selected' as StoryPrivacy, label: 'Selected Contacts' },
                { id: 'nobody' as StoryPrivacy, label: 'Nobody (Private)' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPrivacy(opt.id)}
                  className={`p-2 rounded-xl text-left border text-[11px] font-semibold flex items-center justify-between transition-colors ${
                    privacy === opt.id
                      ? 'border-emerald-400 bg-emerald-500/10 text-emerald-400'
                      : isDark
                      ? 'border-slate-800 bg-[#121826] text-slate-400 hover:border-slate-700'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {privacy === opt.id && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-black hover:brightness-105 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              Share Story
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
