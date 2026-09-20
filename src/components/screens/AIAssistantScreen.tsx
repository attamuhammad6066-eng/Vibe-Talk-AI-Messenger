import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RefreshCw,
  Copy,
  Check,
  Edit3,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Calendar,
  PenTool,
  Globe,
  FileCode,
  ArrowRight,
  Trash2,
  Bot
} from 'lucide-react';
import {
  AIAssistantMode,
  AIChatMessage,
  SupportedLanguage,
  SUPPORTED_LANGUAGES
} from '../../services/aiTypes';
import { aiCoreService } from '../../services/aiCoreService';

interface AIAssistantScreenProps {
  isDark: boolean;
  onOpenVisionDoc?: () => void;
  onOpenChatWithDraft?: (chatId: string, text: string) => void;
}

export function AIAssistantScreen({
  isDark,
  onOpenVisionDoc,
  onOpenChatWithDraft
}: AIAssistantScreenProps) {
  const [activeMode, setActiveMode] = useState<AIAssistantMode>('general');
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content:
        '👋 Welcome to **VibeTalk AI Core Intelligence**!\n\nI can assist you with:\n• ✍️ **Writing:** Creative drafts, formal emails, and announcements\n• 🗓️ **Planning:** Daily schedules, sprint milestones, and itineraries\n• 🌐 **Multilingual Translation:** High-fidelity translations across 11 languages including Urdu, Roman Urdu, and Punjabi\n• 📑 **Summaries:** Fast executive briefs of complex topics\n• 🎙️ **Voice AI:** Hands-free speech conversation\n\nHow can I help you right now?',
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [targetTranslationLang, setTargetTranslationLang] = useState<SupportedLanguage>('Urdu');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
      mode: activeMode
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));
      history.push({ role: 'user', content: text });

      const promptModifier =
        activeMode === 'translation'
          ? `Translate the following text into ${targetTranslationLang}:\n\n${text}`
          : undefined;

      const res = await aiCoreService.chat(history, activeMode, promptModifier);

      const aiMsg: AIChatMessage = {
        id: `model_${Date.now()}`,
        role: 'model',
        content: res.text,
        timestamp: Date.now(),
        mode: activeMode
      };

      setMessages((prev) => [...prev, aiMsg]);

      // If voice conversation mode is on, speak response automatically
      if (isVoiceMode) {
        aiCoreService.speakText(res.text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        role: 'model',
        content: 'New session started. How can I assist you?',
        timestamp: Date.now()
      }
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    aiCoreService.speakText(text);
  };

  // Voice recording toggle for live STT
  const handleToggleVoiceRecord = async () => {
    if (isRecording) {
      // Stop recording and process
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          stream.getTracks().forEach((t) => t.stop());

          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Data = (reader.result as string).split(',')[1];
            setIsLoading(true);
            try {
              const transcribeRes = await aiCoreService.transcribeAudio(
                base64Data,
                'audio/webm',
                'transcribe'
              );
              if (transcribeRes.transcription) {
                handleSendMessage(transcribeRes.transcription);
              }
            } catch (err) {
              console.error(err);
            } finally {
              setIsLoading(false);
            }
          };
          reader.readAsDataURL(audioBlob);
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Microphone access not available or denied:', err);
        // Fallback simulation for seamless preview
        setIsRecording(true);
        setTimeout(() => {
          setIsRecording(false);
          handleSendMessage('Hey VibeTalk, plan my sprint for this week.');
        }, 2200);
      }
    }
  };

  const PROMPT_SUGGESTIONS: Record<AIAssistantMode, string[]> = {
    general: [
      'What are the core capabilities of VibeTalk AI?',
      'Explain quantum-resistant encryption simply',
      'Give me a creative motivational thought for today'
    ],
    writing: [
      'Draft a professional sprint launch announcement',
      'Polish an email introducing our new feature update',
      'Write a warm, celebratory message for a colleague'
    ],
    planning: [
      'Create a 3-day tech workshop itinerary',
      'Break down a mobile app release into 5 milestones',
      'Design a structured morning productivity routine'
    ],
    translation: [
      'Translate "Our team delivers world-class software" into Urdu',
      'Translate "Let’s connect on the call at 3 PM" into Roman Urdu',
      'Translate "Welcome everyone to the channel" into Punjabi'
    ],
    summary: [
      'Summarize key principles of Clean Architecture',
      'Create bulleted takeaways for a remote team agreement',
      'Summarize best practices for mobile audio/video calling'
    ]
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Bar: Mode Selector & Voice Mode Switcher */}
      <div
        className={`px-3 py-2 border-b flex items-center justify-between gap-2 shrink-0 ${
          isDark ? 'bg-[#0E131C] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        {/* Horizontal Mode Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'general' as const, label: 'General Chat', icon: <Bot className="w-3.5 h-3.5" /> },
            { id: 'writing' as const, label: 'Writing & Drafts', icon: <PenTool className="w-3.5 h-3.5" /> },
            { id: 'planning' as const, label: 'Planning & Sprints', icon: <Calendar className="w-3.5 h-3.5" /> },
            { id: 'translation' as const, label: 'Multilingual', icon: <Globe className="w-3.5 h-3.5" /> },
            { id: 'summary' as const, label: 'Executive Summaries', icon: <FileText className="w-3.5 h-3.5" /> },
          ].map((mode) => {
            const isSel = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all flex items-center space-x-1.5 active:scale-95 ${
                  isSel
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-black shadow-xs font-black'
                    : isDark
                    ? 'bg-[#151C2A] text-slate-300 border border-slate-800 hover:bg-slate-800'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Action Icons: Vision Doc & Clear */}
        <div className="flex items-center space-x-1 shrink-0">
          {onOpenVisionDoc && (
            <button
              onClick={onOpenVisionDoc}
              title="Media Vision & OCR"
              className="p-1.5 rounded-xl border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 cursor-pointer text-xs font-bold flex items-center space-x-1"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vision AI</span>
            </button>
          )}

          <button
            onClick={() => setIsVoiceMode(!isVoiceMode)}
            title={isVoiceMode ? 'Voice Mode Active (Auto-Speaks)' : 'Enable Voice Mode'}
            className={`p-1.5 rounded-xl border cursor-pointer transition-all ${
              isVoiceMode
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 font-bold'
                : isDark
                ? 'border-slate-800 text-slate-400 hover:text-white'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            {isVoiceMode ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleClearChat}
            title="Reset Chat Session"
            className="p-1.5 rounded-xl border border-transparent hover:border-slate-700/40 text-slate-400 hover:text-rose-400 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target Language selector when Translation mode is active */}
      {activeMode === 'translation' && (
        <div className="px-3 py-1.5 border-b flex items-center space-x-1 overflow-x-auto no-scrollbar bg-emerald-950/20 border-emerald-900/30">
          <span className="text-[10px] font-bold uppercase text-emerald-400 shrink-0 mr-1">
            Target Language:
          </span>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setTargetTranslationLang(lang.id)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer ${
                targetTranslationLang === lang.id
                  ? 'bg-emerald-400 text-black font-extrabold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {lang.flag} {lang.label}
            </button>
          ))}
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
            >
              <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-slate-400">
                <span className="font-bold">{isUser ? 'You' : 'VibeTalk AI'}</span>
                <span>•</span>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div
                className={`max-w-[90%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs transition-all ${
                  isUser
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-medium rounded-tr-xs'
                    : isDark
                    ? 'bg-[#151C2A] text-slate-200 border border-slate-800 rounded-tl-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans space-y-1.5">
                  {msg.content.split('\n\n').map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>

                {!isUser && (
                  <div className="mt-2 pt-2 border-t border-current/10 flex items-center justify-end space-x-2 text-[10px] opacity-80">
                    <button
                      onClick={() => handleSpeak(msg.content)}
                      className="hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Speak</span>
                    </button>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-emerald-400 py-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="font-bold">Neural Engine thinking with Gemini 3.8 Flash...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Contextual Prompt Suggestions */}
      <div
        className={`px-3 py-1.5 border-t overflow-x-auto no-scrollbar flex items-center space-x-1.5 shrink-0 ${
          isDark ? 'bg-[#0E131C] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <span className="text-[9px] font-extrabold uppercase text-slate-500 shrink-0">
          Suggested:
        </span>
        {PROMPT_SUGGESTIONS[activeMode].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className={`px-2.5 py-1 rounded-xl text-[10px] whitespace-nowrap border cursor-pointer transition-all active:scale-95 ${
              isDark
                ? 'bg-[#151C2A] border-slate-800 text-slate-300 hover:border-emerald-500/50'
                : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500'
            }`}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Dock */}
      <div
        className={`p-3 border-t shrink-0 ${
          isDark ? 'bg-[#0E131C] border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div
          className={`flex items-center space-x-2 px-3 py-2 rounded-2xl border ${
            isDark ? 'bg-[#151C2A] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {/* Vision Doc Upload quick shortcut */}
          {onOpenVisionDoc && (
            <button
              onClick={onOpenVisionDoc}
              title="Attach Image / Document for OCR or Analysis"
              className="text-slate-400 hover:text-purple-400 cursor-pointer"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          )}

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={
              activeMode === 'writing'
                ? 'Describe what you want to write or draft...'
                : activeMode === 'planning'
                ? 'Enter your goals or sprint objectives...'
                : activeMode === 'translation'
                ? `Enter text to translate into ${targetTranslationLang}...`
                : activeMode === 'summary'
                ? 'Paste text or topics to summarize...'
                : 'Ask VibeTalk AI anything...'
            }
            className="flex-1 bg-transparent text-xs outline-none"
          />

          {/* Voice input button (Speech-To-Text) */}
          <button
            onClick={handleToggleVoiceRecord}
            className={`p-1.5 rounded-xl cursor-pointer transition-all ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
            title={isRecording ? 'Stop Recording' : 'Voice Input (STT)'}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Send */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="p-1.5 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-500 text-black cursor-pointer disabled:opacity-40 shadow-xs transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
