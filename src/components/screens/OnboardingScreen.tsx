import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Bot, Lock, Radio } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
  isDark: boolean;
}

const ONBOARDING_SLIDES = [
  {
    title: 'Contextual AI Copilot',
    subtitle: 'Vibe Intelligence',
    description:
      'Autonomous message summarization, smart dynamic drafting, and multi-language live speech transcription natively integrated.',
    icon: Bot,
    color: 'from-emerald-400 to-teal-500',
    accent: '#00E5A3'
  },
  {
    title: 'Zero-Knowledge Security',
    subtitle: 'Vault Architecture',
    description:
      'Hardware-backed cryptographic keystores paired with encrypted Room local storage protect your communications at all times.',
    icon: Lock,
    color: 'from-cyan-400 to-blue-500',
    accent: '#00C2FF'
  },
  {
    title: 'Living Vibe Status',
    subtitle: 'Expressive Aura',
    description:
      'Broadcast real-time ambient focus states, dynamic audio rhythms, and mood rings without disturbing contact notifications.',
    icon: Radio,
    color: 'from-purple-400 to-indigo-500',
    accent: '#7C4DFF'
  }
];

export function OnboardingScreen({ onComplete, isDark }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const slide = ONBOARDING_SLIDES[currentSlide];
  const IconComponent = slide.icon;

  return (
    <div
      className={`h-full w-full flex flex-col justify-between px-6 py-8 select-none transition-colors duration-300 ${
        isDark ? 'bg-[#0A0D14] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Top Bar with Skip */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex space-x-1.5">
          {ONBOARDING_SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? 'w-6 bg-[#00E5A3]'
                  : 'w-1.5 bg-slate-500/30'
              }`}
            />
          ))}
        </div>
        <button
          id="btn-skip-onboarding"
          onClick={onComplete}
          className="text-xs font-semibold text-emerald-400 hover:underline px-2 py-1 cursor-pointer"
        >
          Skip
        </button>
      </div>

      {/* Slide Visual and Text */}
      <div className="my-auto py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            {/* Hologram Card Box */}
            <div
              className={`w-32 h-32 rounded-3xl p-[1px] bg-gradient-to-tr ${slide.color} mb-6 shadow-xl shadow-emerald-500/10`}
            >
              <div
                className={`w-full h-full rounded-[23px] flex items-center justify-center ${
                  isDark ? 'bg-[#121824]' : 'bg-white'
                }`}
              >
                <IconComponent className="w-14 h-14 text-emerald-400" />
              </div>
            </div>

            <span className="text-[11px] font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              {slide.subtitle}
            </span>

            <h2 className="text-xl font-black tracking-tight mb-3 px-4">
              {slide.title}
            </h2>

            <p
              className={`text-xs leading-relaxed max-w-[280px] ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Continue */}
      <div className="pb-2">
        <button
          id="btn-onboarding-continue"
          onClick={handleNext}
          className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#00E5A3] to-[#00C2FF] text-black font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all hover:brightness-105 cursor-pointer"
        >
          <span>
            {currentSlide === ONBOARDING_SLIDES.length - 1 ? 'Start with VibeTalk' : 'Continue'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
