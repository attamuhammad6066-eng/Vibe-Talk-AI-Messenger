import React from 'react';
import { Wifi, BatteryMedium, Sparkles, Moon, Sun } from 'lucide-react';

interface AndroidDeviceFrameProps {
  children: React.ReactNode;
  isDark: boolean;
  onToggleTheme: () => void;
  title?: string;
}

export function AndroidDeviceFrame({
  children,
  isDark,
  onToggleTheme,
  title = 'Pixel 8 Pro • Android 14'
}: AndroidDeviceFrameProps) {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Phone Enclosure */}
      <div
        className={`relative w-[380px] max-w-[95vw] h-[780px] max-h-[92vh] rounded-[48px] p-3 shadow-2xl border-4 transition-colors duration-300 ${
          isDark
            ? 'bg-[#151A24] border-slate-700/80 shadow-black/80'
            : 'bg-[#E2E8F0] border-slate-300 shadow-slate-400/40'
        }`}
      >
        {/* Device Outer Frame Accents */}
        <div className="absolute -left-[7px] top-28 w-[3px] h-12 bg-slate-600 rounded-l-md" /> {/* Volume Up */}
        <div className="absolute -left-[7px] top-44 w-[3px] h-12 bg-slate-600 rounded-l-md" /> {/* Volume Down */}
        <div className="absolute -right-[7px] top-36 w-[3px] h-16 bg-slate-600 rounded-r-md" /> {/* Power Button */}

        {/* Inner Screen Bezel */}
        <div
          className={`w-full h-full rounded-[38px] overflow-hidden flex flex-col relative border ${
            isDark ? 'bg-[#0A0D14] border-slate-900' : 'bg-[#F8FAFC] border-slate-200'
          }`}
        >
          {/* Top Android Status Bar */}
          <div
            className={`w-full h-8 px-6 flex items-center justify-between z-30 select-none text-[11px] font-bold ${
              isDark ? 'text-slate-200 bg-[#0A0D14]' : 'text-slate-800 bg-[#F8FAFC]'
            }`}
          >
            {/* Clock */}
            <span>{currentTime}</span>

            {/* Front Camera Punch-Hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-black ring-2 ring-slate-800 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-slate-900" />
            </div>

            {/* Status Icons: 5G, Wi-Fi, Battery */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-[10px] tracking-tighter">5G</span>
              <Wifi className="w-3 h-3" />
              <BatteryMedium className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 overflow-hidden relative flex flex-col">{children}</div>

          {/* Bottom Android Gesture Navigation Bar */}
          <div
            className={`w-full h-5 flex items-center justify-center select-none ${
              isDark ? 'bg-[#0F141C]' : 'bg-white'
            }`}
          >
            <div
              className={`w-28 h-1 rounded-full ${
                isDark ? 'bg-slate-600' : 'bg-slate-400'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
