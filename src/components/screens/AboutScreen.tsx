import { ArrowLeft, Shield, Sparkles, Code2, Globe, Heart } from 'lucide-react';

interface AboutScreenProps {
  isDark: boolean;
  onBack: () => void;
}

export function AboutScreen({ isDark, onBack }: AboutScreenProps) {
  return (
    <div
      className={`h-full w-full flex flex-col justify-between select-none overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#0A0D14] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      <div
        className={`px-4 py-3 border-b flex items-center space-x-2.5 ${
          isDark ? 'bg-[#0F141C] border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <button
          onClick={onBack}
          className={`w-7 h-7 rounded-xl flex items-center justify-center border cursor-pointer ${
            isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h3 className="text-sm font-black">About VibeTalk AI</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#00E5A3] to-[#00C2FF] flex items-center justify-center font-black text-black text-2xl shadow-xl shadow-emerald-500/20 mb-3">
            V~
          </div>
          <h2 className="text-base font-black">VibeTalk AI v2.0</h2>
          <p className="text-xs text-emerald-400 font-medium">Phase 2 — Messaging Core Certified</p>
          <p className="text-[10px] text-slate-400 mt-1 max-w-xs">
            Architected and engineered by <b>Atta Muhammad</b> for <b>AM Digital Hub</b>.
          </p>
        </div>

        <div className="space-y-2">
          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center space-x-2 mb-1 text-emerald-400">
              <Shield className="w-4 h-4" />
              <h4 className="text-xs font-bold">Quantum-Resistant Security</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Post-quantum cryptography protocols combined with Android KeyStore hardware root-of-trust protection.
            </p>
          </div>

          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center space-x-2 mb-1 text-cyan-400">
              <Code2 className="w-4 h-4" />
              <h4 className="text-xs font-bold">Jetpack Compose & Room Architecture</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Fully decoupled layers: Data Source (Room SQLite), Repository (Offline-first Flow), Domain UseCases, and Compose UI state machines.
            </p>
          </div>

          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center space-x-2 mb-1 text-purple-400">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-xs font-bold">Contextual AI Copilot</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Real-time message intelligence, auto-summarization, smart suggestions, and contextual vibe status analysis.
            </p>
          </div>
        </div>

        <div className="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center space-x-1">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
          <span>by Atta Muhammad</span>
        </div>
      </div>
    </div>
  );
}
