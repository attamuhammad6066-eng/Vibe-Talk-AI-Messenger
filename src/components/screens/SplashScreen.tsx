import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  isDark: boolean;
}

export function SplashScreen({ onFinish, isDark }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`h-full w-full flex flex-col justify-between items-center px-6 py-12 select-none transition-colors duration-300 ${
        isDark ? 'bg-[#0A0D14] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      <div className="w-full flex justify-end">
        <span className="text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          ANDROID 14 • COMPOSE
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center"
      >
        {/* Holographic Vibe Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#00E5A3] via-[#00C2FF] to-[#7C4DFF] p-[2px] shadow-lg shadow-emerald-500/20">
            <div
              className={`w-full h-full rounded-[22px] flex items-center justify-center ${
                isDark ? 'bg-[#0F141C]' : 'bg-white'
              }`}
            >
              <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-[#00E5A3] to-[#00C2FF] bg-clip-text text-transparent">
                V~
              </span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1.5 -right-1.5"
          >
            <Sparkles className="w-5 h-5 text-cyan-400 fill-cyan-400" />
          </motion.div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">VibeTalk AI</h1>
        <p className="text-xs font-semibold tracking-widest text-emerald-500 uppercase mt-1">
          MESSENGER
        </p>

        <p
          className={`text-sm mt-3 font-medium max-w-[240px] ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          Connect. Communicate. Think Smarter.
        </p>
      </motion.div>

      <div className="flex flex-col items-center text-center space-y-1">
        <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          Creator: Atta Muhammad
        </p>
        <p className="text-[10px] font-medium text-slate-500/80">
          Developed by AM Digital Hub
        </p>
        <div className="w-8 h-1 bg-emerald-500/40 rounded-full mt-3 animate-pulse" />
      </div>
    </div>
  );
}
