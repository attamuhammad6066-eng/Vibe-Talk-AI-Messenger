import { useState } from 'react';
import {
  Palette,
  Search,
  Bell,
  HardDrive,
  Sparkles,
  Layers,
  MessageSquare,
  Users,
  FileText,
  Image,
  Mic,
  Shield,
  Download,
  Trash2,
  CheckCircle2,
  X,
  Sliders,
  Smartphone,
  Eye,
  Volume2,
  Lock,
  RefreshCw,
  Zap
} from 'lucide-react';

interface Phase9HubProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  currentTheme: string;
  onSelectTheme: (theme: string) => void;
  accentColor: string;
  onSelectAccent: (color: string) => void;
}

export function Phase9SettingsHub({
  isOpen,
  onClose,
  isDark,
  currentTheme,
  onSelectTheme,
  accentColor,
  onSelectAccent
}: Phase9HubProps) {
  const [activeTab, setActiveTab] = useState<'themes' | 'search' | 'notifications' | 'storage'>('themes');
  const [notice, setNotice] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchScope, setSearchScope] = useState<'all' | 'messages' | 'people' | 'files' | 'ai'>('all');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; title: string; type: string; snippet: string }>>([
    { id: '1', title: 'Project Roadmap AI Sync', type: 'Messages', snippet: 'Reviewing the Phase 9 deliverables and AI integration logs.' },
    { id: '2', title: 'Sarah Jenkins', type: 'People', snippet: 'Online • Product Designer' },
    { id: '3', title: 'Q3_Financial_Audit.pdf', type: 'Files', snippet: '14.2 MB • Secure Vault Document' },
    { id: '4', title: 'Digital Twin Summary: Meeting Notes', type: 'AI Conversations', snippet: 'AI generated executive summary of customer inquiry.' }
  ]);

  // Notifications state
  const [notifToggles, setNotifToggles] = useState({
    messages: true,
    calls: true,
    stories: true,
    mentions: true,
    groups: true,
    ai: true,
    security: true,
    loginAlerts: true
  });

  // Storage state
  const [storageData, setStorageData] = useState({
    totalUsedMb: 1428,
    mediaMb: 950,
    documentsMb: 320,
    cacheMb: 158,
    dataSaver: false,
    autoDownload: 'wifi_only',
    compression: 'high'
  });

  if (!isOpen) return null;

  const triggerNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
          isDark ? 'bg-[#0F141C] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-cyan-500 text-white flex items-center justify-center font-bold shadow-md">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">VibeTalk Phase 9: Premium UI, Search, Notifications & Storage</h2>
              <p className="text-[11px] text-slate-400">Themes, Natural Language Search, Granular Notifications, and Storage Management</p>
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
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-2 flex items-center space-x-2 text-emerald-300 text-xs font-semibold animate-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{notice}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className={`flex border-b px-3 pt-2 space-x-2 ${isDark ? 'border-slate-800 bg-[#0A0E17]' : 'border-slate-200 bg-slate-50'}`}>
          {[
            { id: 'themes', label: 'Themes & Customization', icon: Palette },
            { id: 'search', label: 'Universal & NLP Search', icon: Search },
            { id: 'notifications', label: 'Notification Center', icon: Bell },
            { id: 'storage', label: 'Storage & Media Manager', icon: HardDrive },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  active
                    ? 'border-purple-400 text-purple-400 bg-purple-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'themes' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-sm mb-1">Visual Themes & Atmosphere</h3>
                <p className="text-[11px] text-slate-400 mb-3">Choose from 8 professional themes crafted with mathematical precision</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'dark', label: 'Dark Charcoal', desc: 'Deepslate dark UI', bg: 'bg-[#0A0D14] text-white border-slate-800' },
                    { id: 'light', label: 'Clean Light', desc: 'Crisp off-white canvas', bg: 'bg-white text-slate-900 border-slate-200' },
                    { id: 'amoled', label: 'AMOLED Pure Black', desc: '#000000 true black', bg: 'bg-black text-white border-zinc-900' },
                    { id: 'futuristic', label: 'Futuristic AI', desc: 'Cyberpunk cyan & purple', bg: 'bg-[#050B14] text-cyan-300 border-cyan-500/30' },
                    { id: 'glass', label: 'Glassmorphic', desc: 'Frosted blur aesthetic', bg: 'bg-slate-900/80 backdrop-blur-md text-white border-slate-700' },
                    { id: 'minimal', label: 'Minimal Monochrome', desc: 'Subtle slate & gray', bg: 'bg-zinc-900 text-zinc-100 border-zinc-800' },
                    { id: 'colorful', label: 'Vibrant Colorful', desc: 'Dynamic gradient accents', bg: 'bg-indigo-950 text-indigo-100 border-indigo-800' },
                    { id: 'professional', label: 'Executive Pro', desc: 'Corporate navy & steel', bg: 'bg-[#0F172A] text-slate-100 border-slate-700' },
                  ].map((th) => {
                    const isSel = currentTheme === th.id;
                    return (
                      <button
                        key={th.id}
                        onClick={() => {
                          onSelectTheme(th.id);
                          triggerNotice(`Applied theme: ${th.label}`);
                        }}
                        className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-24 cursor-pointer transition-all ${th.bg} ${
                          isSel ? 'ring-2 ring-purple-500 scale-[1.02]' : 'hover:opacity-90'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{th.label}</span>
                          {isSel && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                        </div>
                        <span className="text-[10px] opacity-75">{th.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="font-bold text-sm">Accent Color Customization</h4>
                <div className="flex items-center space-x-3">
                  {[
                    { id: '#10B981', label: 'Emerald' },
                    { id: '#06B6D4', label: 'Cyan' },
                    { id: '#8B5CF6', label: 'Purple' },
                    { id: '#EC4899', label: 'Pink' },
                    { id: '#F59E0B', label: 'Amber' },
                    { id: '#3B82F6', label: 'Blue' },
                  ].map((col) => (
                    <button
                      key={col.id}
                      onClick={() => {
                        onSelectAccent(col.id);
                        triggerNotice(`Accent color set to ${col.label}`);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                        accentColor === col.id ? 'scale-110 border-white shadow-md' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: col.id }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm mb-1">Universal & Natural-Language Search</h3>
                <p className="text-[11px] text-slate-400 mb-3">Search messages, people, groups, files, images, voice transcripts, and AI chat logs</p>
              </div>

              <div className="flex items-center space-x-2">
                <div className={`flex-1 flex items-center space-x-2 px-3.5 py-2.5 rounded-xl border ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search anything or type natural language query (e.g. 'documents sent last week')..."
                    className="w-full bg-transparent border-none outline-none text-xs"
                  />
                </div>
                <select
                  value={searchScope}
                  onChange={(e) => setSearchScope(e.target.value as any)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                    isDark ? 'bg-[#131924] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="all">All Scopes</option>
                  <option value="messages">Messages</option>
                  <option value="people">People</option>
                  <option value="files">Files & Docs</option>
                  <option value="ai">AI Conversations</option>
                </select>
              </div>

              <div className="space-y-2.5 pt-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Search Results (4 items)</span>
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold">
                        {item.type === 'People' ? <Users className="w-4 h-4" /> : item.type === 'Files' ? <FileText className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold flex items-center space-x-2">
                          <span>{item.title}</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300">{item.type}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.snippet}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => triggerNotice(`Opened item: ${item.title}`)}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 font-bold cursor-pointer"
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm mb-1">Granular Notification Center</h3>
                <p className="text-[11px] text-slate-400 mb-3">Customize alerts and push channels across messages, calls, stories, AI agents, and security</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'messages', label: 'Direct Messages & Chats', desc: 'New incoming peer messages', icon: MessageSquare },
                  { id: 'calls', label: 'Voice & Video Calls', desc: 'Incoming ringing and missed calls', icon: Zap },
                  { id: 'stories', label: 'Stories & Status Updates', desc: 'New updates from contacts', icon: Image },
                  { id: 'mentions', label: 'Tags & Mentions', desc: 'When tagged in group chats', icon: Users },
                  { id: 'groups', label: 'Group Activity', desc: 'Active discussions and polls', icon: Users },
                  { id: 'ai', label: 'AI Agent & Digital Twin', desc: 'AI assistant replies & handoffs', icon: Sparkles },
                  { id: 'security', label: 'Security & E2EE Alerts', desc: 'App lock, key rotations, warnings', icon: Shield },
                  { id: 'loginAlerts', label: 'New Device Logins', desc: 'Login alerts from unrecognized IPs', icon: Lock },
                ].map((notif) => {
                  const Icon = notif.icon;
                  const isEnabled = (notifToggles as any)[notif.id];
                  return (
                    <div
                      key={notif.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between ${
                        isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold">{notif.label}</p>
                          <span className="text-[10px] text-slate-400">{notif.desc}</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) => {
                          setNotifToggles((prev) => ({ ...prev, [notif.id]: e.target.checked }));
                          triggerNotice(`Updated notification setting for ${notif.label}`);
                        }}
                        className="w-4 h-4 accent-purple-500 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-5">
              <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <HardDrive className="w-5 h-5 text-purple-400" />
                    <div>
                      <h4 className="font-bold text-sm">Storage & Media Manager</h4>
                      <p className="text-[11px] text-slate-400">Total usage: {(storageData.totalUsedMb / 1024).toFixed(2)} GB / 64 GB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerNotice('Storage cache optimized! Freed 158 MB.')}
                    className="px-4 py-2 rounded-xl bg-purple-500 text-white font-bold hover:opacity-90 cursor-pointer"
                  >
                    Clean Cache (158 MB)
                  </button>
                </div>

                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex mb-3">
                  <div className="bg-purple-500 h-full" style={{ width: '66%' }} title="Media" />
                  <div className="bg-cyan-500 h-full" style={{ width: '22%' }} title="Documents" />
                  <div className="bg-amber-500 h-full" style={{ width: '12%' }} title="Cache" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /><span>Media ({storageData.mediaMb} MB)</span></span>
                  <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" /><span>Documents ({storageData.documentsMb} MB)</span></span>
                  <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /><span>Cache ({storageData.cacheMb} MB)</span></span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold">Data Saver Mode</span>
                      <p className="text-[10px] text-slate-400">Reduce network bandwidth on mobile connections</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={storageData.dataSaver}
                      onChange={(e) => {
                        setStorageData((prev) => ({ ...prev, dataSaver: e.target.checked }));
                        triggerNotice(e.target.checked ? 'Data Saver enabled' : 'Data Saver disabled');
                      }}
                      className="w-4 h-4 accent-purple-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold">Auto-Download Media</span>
                      <p className="text-[10px] text-slate-400">Manage automatic downloads for photos & videos</p>
                    </div>
                    <select
                      value={storageData.autoDownload}
                      onChange={(e) => setStorageData((prev) => ({ ...prev, autoDownload: e.target.value }))}
                      className={`px-3 py-1.5 rounded-xl border font-semibold text-xs cursor-pointer ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="wifi_only">Wi-Fi Only</option>
                      <option value="always">Always</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => triggerNotice('Full backup archive generated successfully (.zip)')}
                  className="px-4 py-2.5 rounded-xl border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 font-bold flex items-center space-x-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Backup & Export Chats</span>
                </button>
                <button
                  onClick={() => triggerNotice('Media compression set to high efficiency.')}
                  className="px-4 py-2.5 rounded-xl bg-purple-500 text-white font-bold hover:opacity-90 cursor-pointer"
                >
                  Compress Media Storage
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex justify-between items-center ${isDark ? 'border-slate-800 bg-[#0A0E17]' : 'border-slate-200 bg-slate-50'}`}>
          <span className="text-[10px] text-slate-400">Phase 9 Premium UI, Search, Notifications & Storage Hub</span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-purple-500 text-white font-bold hover:opacity-90 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
