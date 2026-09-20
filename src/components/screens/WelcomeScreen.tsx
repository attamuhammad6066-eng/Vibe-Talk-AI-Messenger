import { ArrowRight, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
  isDark: boolean;
}

export function WelcomeScreen({ onGetStarted, onLogin, isDark }: WelcomeScreenProps) {
  return (
    <div
      className={`h-full w-full flex flex-col justify-between px-6 py-8 select-none transition-colors duration-300 ${
        isDark ? 'bg-[#0A0D14] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Top Bar Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00E5A3] to-[#00C2FF] flex items-center justify-center font-black text-black text-sm">
            V
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">VibeTalk AI</h2>
            <p className="text-[10px] font-semibold text-emerald-400">AM Digital Hub</p>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-[10px] font-semibold text-emerald-400">
          Clean Arch
        </div>
      </div>

      {/* Main Content Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center my-auto"
      >
        {/* Original Aura Graphic */}
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-purple-500/20 flex items-center justify-center animate-pulse p-4">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl ${
                isDark
                  ? 'bg-[#121824] border border-slate-800'
                  : 'bg-white border border-slate-200'
              }`}
            >
              <Sparkles className="w-10 h-10 text-[#00E5A3]" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-black tracking-tight leading-tight">
          Next-Gen AI Messaging <br />
          <span className="bg-gradient-to-r from-[#00E5A3] via-[#00C2FF] to-[#7C4DFF] bg-clip-text text-transparent">
            With Living Aura
          </span>
        </h1>

        <p
          className={`text-xs mt-3 max-w-[280px] leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          Not just another chat app. Built with Kotlin, Jetpack Compose, Material 3, Room, and
          contextual intelligence.
        </p>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap gap-2 justify-center mt-6">
          <div
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium ${
              isDark ? 'bg-[#161F2E] text-slate-300' : 'bg-white text-slate-700 shadow-sm'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Room DB Offline-First</span>
          </div>
          <div
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium ${
              isDark ? 'bg-[#161F2E] text-slate-300' : 'bg-white text-slate-700 shadow-sm'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Coroutines / Flow</span>
          </div>
        </div>
      </motion.div>

      {/* Navigation Actions */}
      <div className="space-y-3 pb-2">
        <button
          id="btn-get-started"
          onClick={onGetStarted}
          className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#00E5A3] to-[#00C2FF] text-black font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all hover:brightness-105 cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          id="btn-existing-login"
          onClick={onLogin}
          className={`w-full h-12 rounded-2xl font-semibold text-xs transition-colors cursor-pointer border ${
            isDark
              ? 'border-slate-800 hover:bg-slate-800/50 text-slate-300'
              : 'border-slate-200 hover:bg-slate-100 text-slate-700'
          }`}
        >
          I already have an account
        </button>
      </div>
    </div>
  );
}
