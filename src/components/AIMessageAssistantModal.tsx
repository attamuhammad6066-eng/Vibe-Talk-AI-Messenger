import { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  CheckCheck,
  Briefcase,
  Smile,
  Coffee,
  Scissors,
  Maximize2,
  Globe,
  HelpCircle,
  FileText,
  MessageSquare,
  Mail,
  Megaphone,
  Copy,
  Check,
  Send,
  ArrowRight,
  RefreshCw,
  Edit3
} from 'lucide-react';
import {
  AIMessageAction,
  AI_MESSAGE_ACTIONS,
  SupportedLanguage,
  SUPPORTED_LANGUAGES
} from '../services/aiTypes';
import { aiCoreService } from '../services/aiCoreService';

interface AIMessageAssistantModalProps {
  isOpen: boolean;
  initialText: string;
  chatContext?: string;
  isDark: boolean;
  onClose: () => void;
  onApply: (refinedText: string, sendImmediately: boolean) => void;
}

export function AIMessageAssistantModal({
  isOpen,
  initialText,
  chatContext,
  isDark,
  onClose,
  onApply
}: AIMessageAssistantModalProps) {
  const [inputText, setInputText] = useState(initialText);
  const [selectedAction, setSelectedAction] = useState<AIMessageAction>('rewrite');
  const [targetLang, setTargetLang] = useState<SupportedLanguage>('Urdu');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiOutput, setAiOutput] = useState('');
  const [editedOutput, setEditedOutput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputText(initialText);
      setAiOutput('');
      setEditedOutput('');
      setHasGenerated(false);
      // Auto-trigger if there is initial text
      if (initialText.trim()) {
        handleGenerate(initialText, selectedAction, targetLang);
      }
    }
  }, [isOpen, initialText]);

  if (!isOpen) return null;

  const handleGenerate = async (
    textToProcess: string,
    action: AIMessageAction,
    lang: SupportedLanguage
  ) => {
    setIsProcessing(true);
    try {
      const response = await aiCoreService.assistMessage(
        textToProcess || 'Hello team, let us align on the sprint goals.',
        action,
        chatContext,
        lang
      );
      setAiOutput(response.result);
      setEditedOutput(response.result);
      setHasGenerated(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleActionSelect = (action: AIMessageAction) => {
    setSelectedAction(action);
    handleGenerate(inputText, action, targetLang);
  };

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    setTargetLang(lang);
    if (selectedAction === 'translate') {
      handleGenerate(inputText, 'translate', lang);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedOutput);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getActionIcon = (action: AIMessageAction) => {
    switch (action) {
      case 'rewrite':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'grammar':
        return <CheckCheck className="w-3.5 h-3.5" />;
      case 'professional':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'friendly':
        return <Smile className="w-3.5 h-3.5" />;
      case 'casual':
        return <Coffee className="w-3.5 h-3.5" />;
      case 'short':
        return <Scissors className="w-3.5 h-3.5" />;
      case 'detailed':
        return <Maximize2 className="w-3.5 h-3.5" />;
      case 'translate':
        return <Globe className="w-3.5 h-3.5" />;
      case 'explain':
        return <HelpCircle className="w-3.5 h-3.5" />;
      case 'summarize':
        return <FileText className="w-3.5 h-3.5" />;
      case 'generate_reply':
        return <MessageSquare className="w-3.5 h-3.5" />;
      case 'generate_email':
        return <Mail className="w-3.5 h-3.5" />;
      case 'generate_announcement':
        return <Megaphone className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all max-h-[92vh] ${
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
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center text-black font-black shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black tracking-wide">AI Message Assistant</h3>
              <p className="text-[10px] text-slate-400">Review & customize AI suggestions before sending</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-700/20 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Category Badges (Horizontal scroll) */}
        <div
          className={`px-3 py-2 border-b flex items-center space-x-1.5 overflow-x-auto no-scrollbar ${
            isDark ? 'bg-[#0A0E17] border-slate-800' : 'bg-slate-100/70 border-slate-200'
          }`}
        >
          {AI_MESSAGE_ACTIONS.map((item) => {
            const isSelected = selectedAction === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleActionSelect(item.id)}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-black shadow-sm'
                    : isDark
                    ? 'bg-[#151C2A] text-slate-300 hover:bg-slate-800 border border-slate-800'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200 shadow-xs'
                }`}
              >
                {getActionIcon(item.id)}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Language Selector (When Translate action is selected) */}
        {selectedAction === 'translate' && (
          <div
            className={`px-3 py-2 border-b flex items-center space-x-1.5 overflow-x-auto no-scrollbar ${
              isDark ? 'bg-emerald-950/20 border-emerald-900/30' : 'bg-emerald-50/70 border-emerald-100'
            }`}
          >
            <span className="text-[10px] font-bold uppercase text-emerald-400 shrink-0 mr-1">
              Target Lang:
            </span>
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSel = targetLang === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageSelect(lang.id)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition-all flex items-center space-x-1 ${
                    isSel
                      ? 'bg-emerald-400 text-black font-extrabold shadow-xs'
                      : isDark
                      ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Content Area: Original vs AI Review */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {/* User Input / Source Prompt */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Original Message / Draft
              </label>
              <button
                onClick={() => handleGenerate(inputText, selectedAction, targetLang)}
                disabled={isProcessing}
                className="text-[10px] text-emerald-400 hover:underline flex items-center space-x-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste draft text here..."
              rows={2}
              className={`w-full p-2.5 rounded-xl border text-xs outline-none resize-none transition-colors ${
                isDark
                  ? 'bg-[#151C2A] border-slate-800 focus:border-emerald-500/50 text-slate-200'
                  : 'bg-slate-50 border-slate-200 focus:border-emerald-500 text-slate-900'
              }`}
            />
          </div>

          {/* AI Output with Mandatory User Review Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>AI-Generated Preview (Review & Edit)</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center space-x-1 cursor-pointer"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div
              className={`relative rounded-2xl border p-3 min-h-[110px] transition-all ${
                isDark
                  ? 'bg-[#121824] border-emerald-500/30 shadow-inner'
                  : 'bg-emerald-50/40 border-emerald-200 shadow-inner'
              }`}
            >
              {isProcessing ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-2 text-emerald-400">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span className="text-xs font-bold tracking-wide">
                    Crafting with Gemini 3.8 Flash...
                  </span>
                </div>
              ) : hasGenerated ? (
                <div className="space-y-2">
                  <textarea
                    value={editedOutput}
                    onChange={(e) => setEditedOutput(e.target.value)}
                    rows={4}
                    placeholder="AI generated content will appear here..."
                    className="w-full bg-transparent text-xs leading-relaxed outline-none resize-none border-none p-0"
                  />
                  <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[10px] opacity-75">
                    <span className="flex items-center space-x-1 text-emerald-400">
                      <Edit3 className="w-3 h-3" />
                      <span>Always editable: modify any words directly before applying</span>
                    </span>
                    <span>{editedOutput.length} chars</span>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Select an action above to generate and review AI text
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions: Always Let User Review Before Sending */}
        <div
          className={`p-3 border-t flex items-center justify-between gap-2 ${
            isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <button
            onClick={onClose}
            className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'
            }`}
          >
            Cancel
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onApply(editedOutput, false)}
              disabled={!editedOutput.trim() || isProcessing}
              className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center space-x-1.5 cursor-pointer disabled:opacity-40 transition-all active:scale-95 ${
                isDark
                  ? 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
                  : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <span>Apply to Input</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onApply(editedOutput, true)}
              disabled={!editedOutput.trim() || isProcessing}
              className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 text-black shadow-md flex items-center space-x-1.5 cursor-pointer disabled:opacity-40 hover:opacity-95 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Confirm & Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
