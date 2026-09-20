import { useState } from 'react';
import {
  X,
  Globe,
  Copy,
  Check,
  Volume2,
  RefreshCw,
  ArrowRightLeft,
  ArrowRight
} from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../services/aiTypes';
import { aiCoreService } from '../services/aiCoreService';

interface AITranslateModalProps {
  isOpen: boolean;
  sourceText: string;
  isDark: boolean;
  onClose: () => void;
  onInsertToInput?: (translatedText: string) => void;
}

export function AITranslateModal({
  isOpen,
  sourceText,
  isDark,
  onClose,
  onInsertToInput
}: AITranslateModalProps) {
  const [inputText, setInputText] = useState(sourceText);
  const [targetLang, setTargetLang] = useState<SupportedLanguage>('Urdu');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleTranslate = async (text: string, lang: SupportedLanguage) => {
    if (!text.trim()) return;
    setIsTranslating(true);
    try {
      const res = await aiCoreService.translate(text, lang);
      setTranslatedText(res.translatedText);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (translatedText) {
      aiCoreService.speakText(translatedText);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-all ${
          isDark ? 'bg-[#0E131C] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-4 py-3 border-b flex items-center justify-between ${
            isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-black font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black tracking-wide">Neural Multilingual Translation</h3>
              <p className="text-[10px] text-slate-400">11 supported languages including Urdu & Punjabi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-700/20 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Selection Grid */}
        <div className="p-3 border-b overflow-x-auto no-scrollbar flex items-center space-x-1.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = targetLang === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => {
                  setTargetLang(lang.id);
                  handleTranslate(inputText, lang.id);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all flex items-center space-x-1 active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-black shadow-sm font-black'
                    : isDark
                    ? 'bg-[#151C2A] text-slate-300 border border-slate-800 hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            );
          })}
        </div>

        {/* Text Areas */}
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Source Text
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate..."
              rows={2}
              className={`w-full p-2.5 rounded-xl border text-xs outline-none resize-none ${
                isDark
                  ? 'bg-[#151C2A] border-slate-800 text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => handleTranslate(inputText, targetLang)}
              disabled={isTranslating || !inputText.trim()}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1.5 cursor-pointer disabled:opacity-40 hover:bg-emerald-500/30 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTranslating ? 'animate-spin' : ''}`} />
              <span>Translate to {targetLang}</span>
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                {targetLang} Translation
              </label>
              {translatedText && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSpeak}
                    className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center space-x-1 cursor-pointer"
                    title="Listen aloud"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Speak</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center space-x-1 cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>

            <div
              className={`p-3 rounded-2xl border min-h-[90px] text-xs leading-relaxed ${
                isDark
                  ? 'bg-[#121824] border-emerald-500/30 text-slate-200'
                  : 'bg-emerald-50/50 border-emerald-200 text-slate-900'
              }`}
            >
              {isTranslating ? (
                <div className="flex items-center justify-center py-6 text-emerald-400 space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Translating with Gemini 3.8 Flash...</span>
                </div>
              ) : translatedText ? (
                <p className="whitespace-pre-wrap">{translatedText}</p>
              ) : (
                <span className="text-slate-400">
                  Tap 'Translate to {targetLang}' above to generate translation.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className={`p-3 border-t flex items-center justify-between ${
            isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            Close
          </button>
          {onInsertToInput && translatedText && (
            <button
              onClick={() => {
                onInsertToInput(translatedText);
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <span>Insert in Message</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
