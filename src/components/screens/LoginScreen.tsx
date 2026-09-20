import { useState } from 'react';
import { ArrowRight, Lock, PhoneCall, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onOtpRequested: (phone: string) => void;
  isDark: boolean;
}

export function LoginScreen({ onOtpRequested, isDark }: LoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 234-8901');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 6) {
      setError('Please enter a valid phone number.');
      return;
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onOtpRequested(phoneNumber);
    }, 600);
  };

  return (
    <div
      className={`h-full w-full flex flex-col justify-between px-6 py-8 select-none transition-colors duration-300 ${
        isDark ? 'bg-[#0A0D14] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center space-x-2 pt-2 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00E5A3] to-[#00C2FF] flex items-center justify-center text-black font-black text-base shadow-md shadow-emerald-500/10">
            V~
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight">VibeTalk AI</h1>
            <p className="text-[10px] text-emerald-400 font-semibold">Secure Entry Point</p>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <h2 className="text-2xl font-black tracking-tight">Enter Your Phone</h2>
          <p
            className={`text-xs leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            We will dispatch a 6-digit verification code to authenticate your VibeTalk account
            securely.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Mobile Number
            </label>
            <div
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl border transition-all ${
                isDark
                  ? 'bg-[#121824] border-slate-800 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/10'
                  : 'bg-white border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10'
              }`}
            >
              <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                id="input-phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-transparent text-sm font-medium outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-500 font-medium px-1 animate-fade-in">{error}</p>
          )}

          <div
            className={`p-3 rounded-2xl border flex items-start space-x-2.5 ${
              isDark
                ? 'bg-[#121824]/60 border-slate-800/80 text-slate-400'
                : 'bg-slate-100/80 border-slate-200 text-slate-600'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Protected with AES-256 GCM encrypted token exchange and zero cloud tracking on credentials.
            </p>
          </div>
        </form>
      </div>

      {/* Bottom Submit Button */}
      <div className="pb-2">
        <button
          id="btn-request-otp"
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#00E5A3] to-[#00C2FF] text-black font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all hover:brightness-105 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Send Verification Code</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
