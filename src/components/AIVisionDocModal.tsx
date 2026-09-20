import { useState, useRef } from 'react';
import {
  X,
  Eye,
  FileText,
  Scan,
  Globe,
  HelpCircle,
  Upload,
  Copy,
  Check,
  RefreshCw,
  Volume2,
  ArrowRight,
  Image as ImageIcon
} from 'lucide-react';
import { AIVisionTask, SupportedLanguage, SUPPORTED_LANGUAGES } from '../services/aiTypes';
import { aiCoreService } from '../services/aiCoreService';

interface AIVisionDocModalProps {
  isOpen: boolean;
  isDark: boolean;
  initialMediaUrl?: string;
  initialMimeType?: string;
  onClose: () => void;
  onInsertToInput?: (extractedText: string) => void;
}

export function AIVisionDocModal({
  isOpen,
  isDark,
  initialMediaUrl,
  initialMimeType = 'image/jpeg',
  onClose,
  onInsertToInput
}: AIVisionDocModalProps) {
  const [fileDataUrl, setFileDataUrl] = useState<string>(initialMediaUrl || '');
  const [fileName, setFileName] = useState<string>('Uploaded Document');
  const [mimeType, setMimeType] = useState<string>(initialMimeType);
  const [selectedTask, setSelectedTask] = useState<AIVisionTask>('ocr');
  const [userQuestion, setUserQuestion] = useState('');
  const [targetLang, setTargetLang] = useState<SupportedLanguage>('English');
  const [resultText, setResultText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setMimeType(file.type || 'image/jpeg');

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setFileDataUrl(dataUrl);
      // Auto run default task
      handleAnalyze(dataUrl, file.type, selectedTask, userQuestion, targetLang);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async (
    mediaUrl: string,
    mediaMime: string,
    task: AIVisionTask,
    question: string,
    lang: SupportedLanguage
  ) => {
    if (!mediaUrl) return;
    setIsProcessing(true);
    try {
      const res = await aiCoreService.analyzeMediaOrDocument(
        mediaUrl,
        mediaMime,
        task,
        question,
        lang
      );
      setResultText(res.result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (resultText) {
      aiCoreService.speakText(resultText);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-all max-h-[92vh] ${
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
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black tracking-wide">Image & Document Vision AI</h3>
              <p className="text-[10px] text-slate-400">OCR, Translation, Executive Summary & Visual Q&A</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-700/20 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Task Selection Bar */}
        <div
          className={`px-3 py-2 border-b flex items-center space-x-1.5 overflow-x-auto no-scrollbar ${
            isDark ? 'bg-[#0A0E17] border-slate-800' : 'bg-slate-100/70 border-slate-200'
          }`}
        >
          {[
            { id: 'ocr' as const, label: 'OCR & Text Extract', icon: <Scan className="w-3.5 h-3.5" /> },
            { id: 'describe' as const, label: 'Image Description', icon: <Eye className="w-3.5 h-3.5" /> },
            { id: 'summary' as const, label: 'Doc Reading & Summary', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'translate' as const, label: 'Translate Media Text', icon: <Globe className="w-3.5 h-3.5" /> },
            { id: 'qa' as const, label: 'Questions About Media', icon: <HelpCircle className="w-3.5 h-3.5" /> },
          ].map((t) => {
            const isSel = selectedTask === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTask(t.id);
                  if (fileDataUrl) {
                    handleAnalyze(fileDataUrl, mimeType, t.id, userQuestion, targetLang);
                  }
                }}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95 ${
                  isSel
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-xs font-extrabold'
                    : isDark
                    ? 'bg-[#151C2A] text-slate-300 border border-slate-800 hover:bg-slate-800'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Translation Language Bar (If Translate selected) */}
        {selectedTask === 'translate' && (
          <div className="px-3 py-1.5 border-b flex items-center space-x-1 overflow-x-auto no-scrollbar bg-purple-950/20 border-purple-900/30">
            <span className="text-[10px] font-bold uppercase text-purple-400 shrink-0 mr-1">
              Translate To:
            </span>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  setTargetLang(lang.id);
                  if (fileDataUrl) {
                    handleAnalyze(fileDataUrl, mimeType, 'translate', userQuestion, lang.id);
                  }
                }}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer ${
                  targetLang === lang.id
                    ? 'bg-purple-500 text-white font-extrabold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}

        {/* Content Area */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {/* File Upload Preview */}
          <div
            className={`border-2 border-dashed rounded-2xl p-3 text-center transition-all ${
              fileDataUrl
                ? isDark
                  ? 'border-slate-800 bg-[#121824]'
                  : 'border-slate-300 bg-slate-50'
                : isDark
                ? 'border-slate-800 hover:border-purple-500/50 bg-[#121824]/50'
                : 'border-slate-300 hover:border-purple-500/50 bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,application/pdf,text/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {fileDataUrl ? (
              <div className="flex items-center space-x-3 text-left">
                {mimeType.startsWith('image/') ? (
                  <img
                    src={fileDataUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                    <FileText className="w-8 h-8" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{fileName}</p>
                  <p className="text-[10px] text-slate-400">{mimeType}</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1 text-[10px] text-purple-400 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload different file</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="py-6 flex flex-col items-center justify-center space-y-1 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-1">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold">Select Image or Document to Analyze</p>
                <p className="text-[10px] text-slate-400">Supports PNG, JPG, WebP, PDF or Receipts</p>
              </div>
            )}
          </div>

          {/* Interactive Question Input for 'qa' task */}
          {selectedTask === 'qa' && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                Ask a Question About This Media
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="e.g., What is the total amount? Who signed this? What is the main subject?"
                  className={`flex-1 p-2 rounded-xl border text-xs outline-none ${
                    isDark
                      ? 'bg-[#151C2A] border-slate-800 text-slate-200 focus:border-purple-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAnalyze(fileDataUrl, mimeType, 'qa', userQuestion, targetLang);
                    }
                  }}
                />
                <button
                  onClick={() => handleAnalyze(fileDataUrl, mimeType, 'qa', userQuestion, targetLang)}
                  disabled={isProcessing || !userQuestion.trim()}
                  className="px-3 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold cursor-pointer disabled:opacity-40"
                >
                  Ask
                </button>
              </div>
            </div>
          )}

          {/* Analysis Results Display */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-1">
                <Scan className="w-3 h-3" />
                <span>AI Vision Intelligence Output</span>
              </span>

              {resultText && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSpeak}
                    className="text-[10px] text-slate-400 hover:text-purple-400 flex items-center space-x-1 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Speak</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    className="text-[10px] text-slate-400 hover:text-purple-400 flex items-center space-x-1 cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-purple-400" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>

            <div
              className={`p-3 rounded-2xl border min-h-[120px] text-xs leading-relaxed ${
                isDark
                  ? 'bg-[#121824] border-purple-500/30 text-slate-200'
                  : 'bg-purple-50/40 border-purple-200 text-slate-900'
              }`}
            >
              {isProcessing ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-2 text-purple-400">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span className="text-xs font-bold tracking-wide">
                    Inspecting pixels with Gemini 3.8 Flash...
                  </span>
                </div>
              ) : resultText ? (
                <div className="whitespace-pre-wrap font-sans text-xs">{resultText}</div>
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Upload an image or document above to begin intelligent extraction.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
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

          {onInsertToInput && resultText && (
            <button
              onClick={() => {
                onInsertToInput(resultText);
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md active:scale-95"
            >
              <span>Insert Extracted Text</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
