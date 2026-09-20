import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, ShieldCheck } from 'lucide-react';

interface OtpScreenProps {
  phoneNumber: string;
  onVerified: (isNewUser: boolean) => void;
  onBack: () => void;
  isDark: boolean;
}

export function OtpScreen({ phoneNumber, onVerified, onBack, isDark }: OtpScreenProps) {
  const [code, setCode] = useState(['1', '2', '3', '4', '5', '6']);
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);

    if (val && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onVerified(true);
    }, 650);
  };

  return (
    <div
      className={`h-full w-full flex flex-col justify-between px-6 py-8 select-none transition-colors duration-300 ${
        isDark ? 'bg-[#0A0D14] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      <div>
        {/* Back Button */}
        <div className="pt-2 mb-6">
          <button
            id="btn-otp-back"
            onClick={onBack}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors cursor-pointer ${
              isDark
                ? 'border-slate-800 bg-[#121824] text-slate-300 hover:bg-slate-800'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 mb-6">
          <h2 className="text-2xl font-black tracking-tight">Verify 6-Digit Code</h2>
          <p
            className={`text-xs leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Enter the code dispatched to{' '}
            <span className="font-semibold text-emerald-400">{phoneNumber}</span>.
          </p>
        </div>

        {/* 6 Digit Input Boxes */}
        <div className="flex justify-between gap-2 my-8">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              id={`otp-input-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-11 h-13 rounded-xl text-center text-lg font-black outline-none border transition-all ${
                digit
                  ? 'border-emerald-400/80 bg-emerald-500/10 text-emerald-400'
                  : isDark
                  ? 'bg-[#121824] border-slate-800 text-white focus:border-emerald-400'
                  : 'bg-white border-slate-200 text-slate-900 focus:border-emerald-500'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-rose-500 font-medium px-1 mb-4 text-center">{error}</p>
        )}

        <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
          <span>Didn't receive code?</span>
          {timer > 0 ? (
            <span className="font-semibold text-slate-500">Resend in {timer}s</span>
          ) : (
            <button
              onClick={() => setTimer(45)}
              className="font-bold text-emerald-400 flex items-center space-x-1 hover:underline cursor-pointer"
            >
              <RotateCw className="w-3 h-3" />
              <span>Resend Now</span>
            </button>
          )}
        </div>
      </div>

      <div className="pb-2 space-y-3">
        <div
          className={`px-3 py-2 rounded-xl flex items-center justify-center space-x-2 text-[11px] ${
            isDark ? 'bg-[#121824] text-slate-400' : 'bg-slate-100 text-slate-600'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified via Android Encrypted KeyStore</span>
        </div>

        <button
          id="btn-verify-otp"
          onClick={handleVerify}
          disabled={loading}
          className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#00E5A3] to-[#00C2FF] text-black font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all hover:brightness-105 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
