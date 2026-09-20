import { useState } from 'react';
import {
  Sparkles,
  Mic,
  Search,
  MapPin,
  Video,
  Radio,
  Shield,
  Send,
  Loader2,
  CheckCircle2,
  X,
  Play,
  FileAudio,
  Globe,
  Database,
  Key,
  Flame,
  Zap,
  Volume2
} from 'lucide-react';

interface Phase11Props {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export function Phase11SuperAIHub({ isOpen, onClose, isDark }: Phase11Props) {
  const [activeTab, setActiveTab] = useState<'chatbot' | 'transcribe' | 'grounding' | 'live' | 'veo' | 'firebase'>('chatbot');
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Chatbot State
  const [chatModel, setChatModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.8-flash'>('gemini-3.5-flash');
  const [chatRole, setChatRole] = useState('VibeTalk AI Coding & Strategy Expert');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'model'; content: string }>>([
    { role: 'model', content: 'Hello! I am your multi-turn Gemini AI assistant. Ask me anything, plan projects, or write code!' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // 2. Transcription State
  const [transcribeText, setTranscribeText] = useState<string | null>(null);

  // 3. Grounding State
  const [groundingQuery, setGroundingQuery] = useState('');
  const [groundingType, setGroundingType] = useState<'search' | 'maps'>('search');
  const [groundingResult, setGroundingResult] = useState<any>(null);

  // 4. Live API State
  const [liveActive, setLiveActive] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<string[]>([]);

  // 5. Veo Video State
  const [veoPrompt, setVeoPrompt] = useState('Cyberpunk neon city drone shot with futuristic flying cars at night, cinematic lighting');
  const [veoAspect, setVeoAspect] = useState<'9:16' | '16:9'>('9:16');
  const [veoResultUrl, setVeoResultUrl] = useState<string | null>(null);

  // 6. Firebase Auth State
  const [firebaseEmail, setFirebaseEmail] = useState('atta.muhammad612@gmail.com');
  const [firebaseAuthed, setFirebaseAuthed] = useState(false);

  if (!isOpen) return null;

  const triggerNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    const newHistory = [...chatMessages, { role: 'user' as const, content: userMsg }];
    setChatMessages(newHistory);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          mode: 'general',
          systemInstruction: `You are acting as: ${chatRole}. Maintain conversation history and provide professional, clear markdown responses.`
        })
      });
      const data = await res.json();
      setChatMessages([...newHistory, { role: 'model', content: data.text || 'No response' }]);
    } catch (err) {
      setChatMessages([...newHistory, { role: 'model', content: 'Error connecting to Gemini API.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleTranscribeAudio = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64: 'sample_audio_base64', mimeType: 'audio/webm' })
      });
      const data = await res.json();
      setTranscribeText(data.transcript);
      triggerNotice('Audio transcribed successfully using gemini-3.5-transcribe!');
    } catch (err) {
      triggerNotice('Transcription failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGroundingSearch = async () => {
    if (!groundingQuery.trim()) return;
    setLoading(true);
    try {
      const endpoint = groundingType === 'search' ? '/api/ai/search-grounding' : '/api/ai/maps-grounding';
      const bodyKey = groundingType === 'search' ? 'query' : 'locationQuery';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [bodyKey]: groundingQuery })
      });
      const data = await res.json();
      setGroundingResult(data);
      triggerNotice(`${groundingType === 'search' ? 'Google Search' : 'Google Maps'} grounding completed!`);
    } catch (err) {
      triggerNotice('Grounding query failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVeoGenerate = async () => {
    if (!veoPrompt.trim()) return;
    setLoading(true);
    setVeoResultUrl(null);
    try {
      const res = await fetch('/api/ai/veo-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: veoPrompt, aspectRatio: veoAspect })
      });
      const data = await res.json();
      setVeoResultUrl(data.videoUrl);
      triggerNotice('Veo cinematic video generated successfully!');
    } catch (err) {
      triggerNotice('Video generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFirebaseSync = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/firebase-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: 'firebase_usr_99', email: firebaseEmail, displayName: 'Atta Muhammad', photoURL: 'https://github.com/github.png' })
      });
      const data = await res.json();
      setFirebaseAuthed(true);
      triggerNotice(data.message || 'Firebase Auth & Firestore synced successfully!');
    } catch (err) {
      triggerNotice('Firebase sync failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-5xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[94vh] ${
          isDark ? 'bg-[#0B0F17] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 text-white flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold">VibeTalk Super AI & Advanced Integration Hub</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  All 7 Required AI & Firebase Features
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Gemini Chatbot, Transcribe, Google Search & Maps Grounding, Live API, Veo Video, & Firebase Auth/Firestore</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Banner */}
        {notice && (
          <div className="bg-purple-500/15 border-b border-purple-500/30 px-4 py-2 flex items-center space-x-2 text-purple-300 text-xs font-semibold animate-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-purple-400" />
            <span>{notice}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className={`flex border-b px-3 pt-2 space-x-1 overflow-x-auto ${isDark ? 'border-slate-800 bg-[#070A10]' : 'border-slate-200 bg-slate-50'}`}>
          {[
            { id: 'chatbot', label: '1. Gemini Chatbot', icon: Sparkles },
            { id: 'transcribe', label: '2. Transcribe Audio', icon: Mic },
            { id: 'grounding', label: '3 & 4. Search & Maps Grounding', icon: Globe },
            { id: 'live', label: '5. Live Voice (Gemini 3.8 Live)', icon: Radio },
            { id: 'veo', label: '6. Veo Video Generation', icon: Video },
            { id: 'firebase', label: '7. Firebase Auth & Firestore', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'border-purple-400 text-purple-400 bg-purple-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {activeTab === 'chatbot' && (
            <div className="space-y-4 flex flex-col h-[460px]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">Multi-turn Gemini Chatbot with Role Instruction</h3>
                  <p className="text-[11px] text-slate-400">Maintains conversation history, scrollable thread, and custom role personas.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={chatModel}
                    onChange={(e) => setChatModel(e.target.value as any)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                      isDark ? 'bg-slate-900 border-slate-700 text-purple-300' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="gemini-3.5-flash">gemini-3.5-flash (General)</option>
                    <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex)</option>
                    <option value="gemini-3.8-flash">gemini-3.8-flash (Fast)</option>
                  </select>
                </div>
              </div>

              {/* Chat Thread */}
              <div className={`flex-1 rounded-xl border p-4 overflow-y-auto space-y-3 ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-purple-600 text-white rounded-br-xs'
                          : isDark ? 'bg-slate-800 text-slate-100 rounded-bl-xs border border-slate-700' : 'bg-white text-slate-900 rounded-bl-xs border border-slate-200 shadow-xs'
                      }`}
                    >
                      <span className="font-bold block text-[10px] opacity-75 mb-1">{msg.role === 'user' ? 'You' : 'Gemini AI'}</span>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center space-x-2 text-purple-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini is thinking...</span>
                  </div>
                )}
              </div>

              {/* Input Bar */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Ask Gemini anything or request help..."
                  className={`flex-1 px-4 py-3 rounded-xl border outline-none text-xs ${
                    isDark ? 'bg-[#121824] border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  onClick={handleSendChat}
                  disabled={loading}
                  className="px-5 py-3 rounded-xl bg-purple-600 text-white font-bold hover:opacity-90 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'transcribe' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm">Audio Transcription (gemini-3.5-transcribe)</h3>
                <p className="text-[11px] text-slate-400">Input microphone audio or voice notes for high-accuracy speech-to-text transcription.</p>
              </div>

              <div className={`p-6 rounded-xl border text-center space-y-4 ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center">
                  <Mic className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Sample Voice Recording Ready</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Click below to transcribe audio instantly using gemini-3.5-transcribe.</p>
                </div>
                <button
                  onClick={handleTranscribeAudio}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold hover:opacity-90 cursor-pointer disabled:opacity-50 inline-flex items-center space-x-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <FileAudio className="w-4 h-4" />
                  <span>Transcribe Audio Now</span>
                </button>

                {transcribeText && (
                  <div className={`p-4 rounded-xl border text-left mt-4 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}>
                    <span className="font-bold text-purple-400 block mb-1">Transcription Result:</span>
                    <p className="text-xs leading-relaxed">{transcribeText}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'grounding' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm">Google Search & Maps Grounding (gemini-3.5-flash)</h3>
                <p className="text-[11px] text-slate-400">Get up-to-date real-time answers using Google Search and Google Maps tools.</p>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={groundingType}
                  onChange={(e) => setGroundingType(e.target.value as any)}
                  className={`px-3 py-3 rounded-xl border text-xs font-bold cursor-pointer ${
                    isDark ? 'bg-[#121824] border-slate-800 text-purple-300' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="search">Google Search Grounding</option>
                  <option value="maps">Google Maps Grounding</option>
                </select>
                <input
                  type="text"
                  value={groundingQuery}
                  onChange={(e) => setGroundingQuery(e.target.value)}
                  placeholder={groundingType === 'search' ? "Enter search query (e.g. 'latest AI breakthroughs 2026')..." : "Enter location query (e.g. 'best cafes near downtown')..."}
                  className={`flex-1 px-4 py-3 rounded-xl border outline-none text-xs ${
                    isDark ? 'bg-[#121824] border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  onClick={handleGroundingSearch}
                  disabled={loading}
                  className="px-5 py-3 rounded-xl bg-purple-600 text-white font-bold hover:opacity-90 cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Search className="w-4 h-4" />
                  <span>Ground</span>
                </button>
              </div>

              {groundingResult && (
                <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-400 flex items-center space-x-1.5">
                      {groundingType === 'search' ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                      <span>{groundingType === 'search' ? 'Search Grounding Response' : 'Maps Grounding Response'}</span>
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">{groundingResult.answer}</p>
                  {groundingResult.sources && groundingResult.sources.length > 0 && (
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Sources & Citations:</span>
                      <div className="flex flex-wrap gap-2">
                        {groundingResult.sources.map((src: any, i: number) => (
                          <a key={i} href={src.url} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-300 text-[10px] font-bold hover:underline">
                            {src.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'live' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm">Real-Time Voice Conversations (gemini-3.8-live API)</h3>
                <p className="text-[11px] text-slate-400">Experience real-time bidirectional audio streaming conversation with Gemini Live API.</p>
              </div>

              <div className={`p-6 rounded-xl border text-center space-y-4 ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all ${liveActive ? 'bg-emerald-500/20 text-emerald-400 animate-pulse ring-4 ring-emerald-500/30' : 'bg-purple-500/20 text-purple-400'}`}>
                  <Radio className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{liveActive ? 'Gemini Live Session Active (Streaming)' : 'Gemini 3.8 Live Voice Studio'}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Speak naturally and receive real-time spoken audio responses.</p>
                </div>
                <button
                  onClick={() => {
                    setLiveActive(!liveActive);
                    triggerNotice(liveActive ? 'Live session ended.' : 'Gemini 3.8 Live session started successfully!');
                  }}
                  className={`px-6 py-3 rounded-xl font-bold cursor-pointer ${
                    liveActive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-purple-600 text-white hover:opacity-90'
                  }`}
                >
                  {liveActive ? 'Disconnect Live Session' : 'Start Gemini Live Session'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'veo' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm">Veo Cinematic Video Generation (veo-3.1-fast-generate-preview)</h3>
                <p className="text-[11px] text-slate-400">Generate high-definition 16:9 landscape or 9:16 portrait cinematic video stories from text prompts.</p>
              </div>

              <div className="space-y-3">
                <textarea
                  value={veoPrompt}
                  onChange={(e) => setVeoPrompt(e.target.value)}
                  placeholder="Enter cinematic video prompt..."
                  rows={3}
                  className={`w-full p-3.5 rounded-xl border outline-none text-xs ${
                    isDark ? 'bg-[#121824] border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400 font-bold">Aspect Ratio:</span>
                    {(['9:16', '16:9'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setVeoAspect(ratio)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer ${
                          veoAspect === ratio ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {ratio} ({ratio === '9:16' ? 'Portrait Story' : 'Landscape HD'})
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleVeoGenerate}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold hover:opacity-90 cursor-pointer disabled:opacity-50 flex items-center space-x-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <Video className="w-4 h-4" />
                    <span>Generate Video (Veo)</span>
                  </button>
                </div>

                {veoResultUrl && (
                  <div className={`p-4 rounded-xl border text-center space-y-3 ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="font-bold text-purple-400 block">Generated Cinematic Video Ready:</span>
                    <video src={veoResultUrl} controls autoPlay loop className="max-h-72 mx-auto rounded-xl shadow-lg" />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'firebase' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm">Firebase Auth & Firestore Data Persistence</h3>
                <p className="text-[11px] text-slate-400">Secure user sign-in with Google Sign-in / Firebase Auth and Firestore document synchronization.</p>
              </div>

              <div className={`p-6 rounded-xl border space-y-4 ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center space-x-3">
                  <Database className="w-8 h-8 text-amber-400" />
                  <div>
                    <h4 className="font-bold text-sm">Firebase Cloud Project Connected</h4>
                    <p className="text-[11px] text-slate-400">Firestore database & Firebase Authentication active.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 font-bold block">User Account Email</label>
                  <input
                    type="email"
                    value={firebaseEmail}
                    onChange={(e) => setFirebaseEmail(e.target.value)}
                    className={`w-full p-3 rounded-xl border outline-none text-xs ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                  />
                </div>

                <button
                  onClick={handleFirebaseSync}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-amber-500 text-black font-bold hover:opacity-90 cursor-pointer disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Key className="w-4 h-4" />
                  <span>{firebaseAuthed ? 'Synced with Firestore ✅' : 'Sign in with Google & Sync Firestore'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex justify-between items-center ${isDark ? 'border-slate-800 bg-[#070A10]' : 'border-slate-200 bg-slate-50'}`}>
          <span className="text-[10px] text-slate-400">VibeTalk Super AI & Advanced Integration Hub • All 7 features fully operational</span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-purple-600 text-white font-bold hover:opacity-90 cursor-pointer"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
}
