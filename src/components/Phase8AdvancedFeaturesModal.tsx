import { useState, useEffect } from 'react';
import {
  Wifi,
  Bluetooth,
  Clock,
  MapPin,
  Sparkles,
  Eye,
  Video,
  Box,
  X,
  CheckCircle2,
  RefreshCcw,
  Send,
  Lock,
  Globe,
  Radio,
  Sliders,
  Camera,
  Volume2
} from 'lucide-react';

interface Phase8ModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export function Phase8AdvancedFeaturesModal({ isOpen, onClose, isDark }: Phase8ModalProps) {
  const [activeTab, setActiveTab] = useState<'offline' | 'capsule' | 'geo' | 'ambient' | 'ocular' | 'ar_call' | 'ar_vault'>('offline');
  const [notice, setNotice] = useState<string | null>(null);

  // Offline Link state
  const [offlineMode, setOfflineMode] = useState<'bluetooth' | 'wifi_direct' | 'nearby_mesh' | 'store_forward'>('bluetooth');
  const [isMeshConnected, setIsMeshConnected] = useState(false);
  const [meshQueue, setMeshQueue] = useState<string[]>(['Hey from peer device (queued for sync)', 'Attachment: doc_report.pdf']);

  // Time Capsule state
  const [capsuleMsg, setCapsuleMsg] = useState('');
  const [unlockDate, setUnlockDate] = useState('2027-01-01T00:00');
  const [capsules, setCapsules] = useState<Array<{ id: string; text: string; unlockAt: string; status: 'locked' | 'unlocked' }>>([
    { id: '1', text: 'Happy New Year 2027 capsule!', unlockAt: '2027-01-01 00:00', status: 'locked' }
  ]);

  // Geo-Locked state
  const [geoMsg, setGeoMsg] = useState('');
  const [targetLat, setTargetLat] = useState('37.7749');
  const [targetLng, setTargetLng] = useState('-122.4194');
  const [radiusMeters, setRadiusMeters] = useState(50);
  const [geoItems, setGeoItems] = useState<Array<{ id: string; text: string; lat: string; lng: string; radius: number }>>([
    { id: '1', text: 'Surprise gift at Golden Gate Park!', lat: '37.7694', lng: '-122.4862', radius: 100 }
  ]);

  // Ambient Vibe state
  const [ambientTheme, setAmbientTheme] = useState<'rain' | 'sunset' | 'forest' | 'aurora' | 'none'>('rain');
  const [volume, setVolume] = useState(40);

  // Ocular Accessibility state
  const [ocularEnabled, setOcularEnabled] = useState(false);
  const [dwellTimeMs, setDwellTimeMs] = useState(1000);
  const [gazeCursorPos, setGazeCursorPos] = useState({ x: 50, y: 50 });

  // AR Holographic Call state
  const [arAvatarMode, setArAvatarMode] = useState<'cyber_fox' | 'holo_human' | 'neon_bot' | 'none'>('cyber_fox');
  const [spatialAudio, setSpatialAudio] = useState(true);

  // AR Memory Vault state
  const [vaultSphere, setVaultSphere] = useState<'tokyo_2025' | 'beach_sunset' | 'alpine_snow'>('tokyo_2025');

  if (!isOpen) return null;

  const triggerNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
          isDark ? 'bg-[#0F141C] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Phase 8: Offline Mesh & Special Features Hub</h2>
              <p className="text-[11px] text-slate-400">P2P Offline Link, Time Capsules, Geo-Lock, Ocular, and AR Spatial Holograms</p>
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
        <div className={`flex border-b px-3 pt-2 space-x-1 overflow-x-auto ${isDark ? 'border-slate-800 bg-[#0A0E17]' : 'border-slate-200 bg-slate-50'}`}>
          {[
            { id: 'offline', label: 'Offline Link', icon: Wifi },
            { id: 'capsule', label: 'Time Capsule', icon: Clock },
            { id: 'geo', label: 'Geo-Locked', icon: MapPin },
            { id: 'ambient', label: 'Ambient Vibe', icon: Sparkles },
            { id: 'ocular', label: 'Ocular Eye-Track', icon: Eye },
            { id: 'ar_call', label: 'AR Hologram Call', icon: Video },
            { id: 'ar_vault', label: 'AR Memory Vault', icon: Box },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
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
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'offline' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border bg-purple-500/5 border-purple-500/20 flex items-start space-x-3">
                <Radio className="w-5 h-5 text-purple-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="font-bold text-purple-300 text-sm">VibeTalk P2P Mesh & Offline Link</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Communicate without cellular or internet connectivity using Bluetooth BLE, Wi-Fi Direct, Android Nearby APIs, and automatic Store-and-Forward sync when internet returns.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'bluetooth', label: 'Bluetooth BLE', icon: Bluetooth },
                  { id: 'wifi_direct', label: 'Wi-Fi Direct', icon: Wifi },
                  { id: 'nearby_mesh', label: 'Nearby API Mesh', icon: Radio },
                  { id: 'store_forward', label: 'Store & Forward', icon: RefreshCcw },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSel = offlineMode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setOfflineMode(m.id as any);
                        triggerNotice(`Switched transport mode to ${m.label}`);
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${
                        isSel
                          ? 'bg-purple-500/15 border-purple-400 text-purple-300'
                          : isDark
                          ? 'bg-[#131924] border-slate-800 text-slate-400 hover:text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-black'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-bold">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-bold text-sm">Mesh Node Status</span>
                    <p className="text-[11px] text-slate-400">Scanning for nearby offline VibeTalk peers in range</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsMeshConnected(true);
                      triggerNotice('Connected to 3 nearby offline mesh nodes via Bluetooth/Wi-Fi Direct.');
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-500 text-white font-bold hover:opacity-90 cursor-pointer"
                  >
                    {isMeshConnected ? 'Mesh Active (3 Peers)' : 'Start P2P Scan'}
                  </button>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-700/50">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Store & Forward Outbox Queue</span>
                  {meshQueue.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
                      <span className="text-slate-300 font-mono text-[11px]">📦 {item}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">Pending Sync</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'capsule' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Time Capsule Scheduler</h4>
                  <p className="text-[11px] text-slate-400">Lock messages, media, or documents for future unlock dates</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Capsule Message or Document URL</label>
                  <textarea
                    rows={2}
                    value={capsuleMsg}
                    onChange={(e) => setCapsuleMsg(e.target.value)}
                    placeholder="Type a message for your future self or recipient..."
                    className={`w-full p-2.5 rounded-xl border text-xs ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Unlock Date & Time</label>
                    <input
                      type="datetime-local"
                      value={unlockDate}
                      onChange={(e) => setUnlockDate(e.target.value)}
                      className={`p-2 rounded-xl border text-xs font-mono ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!capsuleMsg.trim()) return;
                      setCapsules((prev) => [...prev, { id: Date.now().toString(), text: capsuleMsg, unlockAt: unlockDate.replace('T', ' '), status: 'locked' }]);
                      setCapsuleMsg('');
                      triggerNotice('Time Capsule successfully locked and sealed!');
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-500 text-white font-bold hover:opacity-90 cursor-pointer self-end"
                  >
                    Seal Time Capsule
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Active Time Capsules</span>
                {capsules.map((c) => (
                  <div key={c.id} className={`p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">{c.text}</p>
                        <span className="text-[10px] text-slate-400 font-mono">Unlocks at: {c.unlockAt}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      🔒 Sealed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'geo' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Geo-Locked Messages</h4>
                  <p className="text-[11px] text-slate-400">Messages that only unlock when the recipient arrives at precise GPS coordinates & radius</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Geo-Locked Message</label>
                  <input
                    type="text"
                    value={geoMsg}
                    onChange={(e) => setGeoMsg(e.target.value)}
                    placeholder="e.g., Look under the park bench!"
                    className={`w-full p-2.5 rounded-xl border text-xs ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Latitude</label>
                    <input
                      type="text"
                      value={targetLat}
                      onChange={(e) => setTargetLat(e.target.value)}
                      className={`w-full p-2 rounded-xl border text-xs font-mono ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Longitude</label>
                    <input
                      type="text"
                      value={targetLng}
                      onChange={(e) => setTargetLng(e.target.value)}
                      className={`w-full p-2 rounded-xl border text-xs font-mono ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Radius (Meters)</label>
                    <input
                      type="number"
                      value={radiusMeters}
                      onChange={(e) => setRadiusMeters(Number(e.target.value))}
                      className={`w-full p-2 rounded-xl border text-xs font-mono ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!geoMsg.trim()) return;
                    setGeoItems((prev) => [...prev, { id: Date.now().toString(), text: geoMsg, lat: targetLat, lng: targetLng, radius: radiusMeters }]);
                    setGeoMsg('');
                    triggerNotice('Geo-locked message planted at coordinates successfully!');
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 text-black font-bold hover:opacity-90 cursor-pointer"
                >
                  Plant Geo-Locked Drop
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Active Geo-Drops</span>
                {geoItems.map((g) => (
                  <div key={g.id} className={`p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-bold">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">{g.text}</p>
                        <span className="text-[10px] text-slate-400 font-mono">Lat: {g.lat}, Lng: {g.lng} • Radius: {g.radius}m</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      📍 Geofenced
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ambient' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Ambient Vibe Atmosphere Generator</h4>
                  <p className="text-[11px] text-slate-400">Environment-based visual atmospheres and spatial audio soundscapes</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'rain', label: 'Gentle Rain & Thunder', icon: '🌧️', bg: 'from-blue-900/40 to-slate-900' },
                  { id: 'sunset', label: 'Golden Hour Sunset', icon: '🌅', bg: 'from-amber-900/40 to-slate-900' },
                  { id: 'forest', label: 'Whispering Pine Forest', icon: '🌲', bg: 'from-emerald-900/40 to-slate-900' },
                  { id: 'aurora', label: 'Northern Lights Aurora', icon: '🌌', bg: 'from-purple-900/40 to-slate-900' },
                ].map((th) => {
                  const isSel = ambientTheme === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => {
                        setAmbientTheme(th.id as any);
                        triggerNotice(`Activated ambient atmosphere: ${th.label}`);
                      }}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all bg-gradient-to-b ${th.bg} ${
                        isSel ? 'border-purple-400 ring-2 ring-purple-500/50' : isDark ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="text-2xl">{th.icon}</span>
                      <span className="font-bold text-center">{th.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-purple-400" />
                    <span className="font-bold">Soundscape Volume</span>
                  </div>
                  <span className="font-mono text-purple-400">{volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'ocular' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Ocular Accessibility & Eye-Control Typing</h4>
                  <p className="text-[11px] text-slate-400">Experimental webcam eye-tracking and gaze dwell typing with standard keyboard fallback</p>
                </div>
                <input
                  type="checkbox"
                  checked={ocularEnabled}
                  onChange={(e) => {
                    setOcularEnabled(e.target.checked);
                    triggerNotice(e.target.checked ? 'Ocular eye-tracking sensor initialized.' : 'Ocular mode disabled (fallback to standard keyboard)');
                  }}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>

              {ocularEnabled ? (
                <div className={`p-5 rounded-xl border text-center space-y-4 ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center animate-pulse">
                    <Eye className="w-8 h-8" />
                  </div>
                  <div>
                    <h5 className="font-bold text-emerald-400 text-sm">Eye-Tracking Sensor Active</h5>
                    <p className="text-[11px] text-slate-400 mt-1">Look at screen buttons for {dwellTimeMs}ms to trigger dwell click.</p>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-slate-400">Dwell Threshold:</span>
                    {[500, 1000, 1500].map((ms) => (
                      <button
                        key={ms}
                        onClick={() => setDwellTimeMs(ms)}
                        className={`px-3 py-1 rounded-lg border font-mono text-xs cursor-pointer ${
                          dwellTimeMs === ms ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {ms}ms
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`p-5 rounded-xl border text-center space-y-2 ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-slate-400 text-xs">Ocular tracking is currently disabled. Normal touch / keyboard input active.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ar_call' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">AR Holographic Calls & Spatial Effects</h4>
                  <p className="text-[11px] text-slate-400">Experimental AR avatars and spatial audio filters with normal video fallback</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'cyber_fox', label: 'Cyber Fox Avatar', icon: '🦊' },
                  { id: 'holo_human', label: 'Holographic Human', icon: '👤' },
                  { id: 'neon_bot', label: 'Neon AI Bot', icon: '🤖' },
                  { id: 'none', label: 'Standard Video', icon: '📹' },
                ].map((av) => {
                  const isSel = arAvatarMode === av.id;
                  return (
                    <button
                      key={av.id}
                      onClick={() => {
                        setArAvatarMode(av.id as any);
                        triggerNotice(`AR Hologram filter set to: ${av.label}`);
                      }}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${
                        isSel
                          ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
                          : isDark
                          ? 'bg-[#131924] border-slate-800 text-slate-400 hover:text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-black'
                      }`}
                    >
                      <span className="text-2xl">{av.icon}</span>
                      <span className="font-bold text-xs">{av.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center space-x-2.5">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="font-bold text-xs">Spatial 3D Audio Rendering</span>
                    <p className="text-[10px] text-slate-400">Position voices in 3D binaural space during calls</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={spatialAudio}
                  onChange={(e) => setSpatialAudio(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'ar_vault' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">AR Memory Vault & 3D Holographic Spaces</h4>
                  <p className="text-[11px] text-slate-400">Immersive 3D gallery spheres with normal chat/gallery fallback</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'tokyo_2025', label: 'Tokyo Neon Rooftop', icon: '🗼' },
                  { id: 'beach_sunset', label: 'Malibu Sunset Beach', icon: '🏖️' },
                  { id: 'alpine_snow', label: 'Swiss Alpine Cabin', icon: '🏔️' },
                ].map((sp) => {
                  const isSel = vaultSphere === sp.id;
                  return (
                    <button
                      key={sp.id}
                      onClick={() => {
                        setVaultSphere(sp.id as any);
                        triggerNotice(`Loaded AR memory sphere: ${sp.label}`);
                      }}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${
                        isSel
                          ? 'bg-amber-500/15 border-amber-400 text-amber-300'
                          : isDark
                          ? 'bg-[#131924] border-slate-800 text-slate-400 hover:text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-black'
                      }`}
                    >
                      <span className="text-3xl">{sp.icon}</span>
                      <span className="font-bold text-xs">{sp.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className={`p-4 rounded-xl border text-center space-y-2 ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <p className="text-slate-300 text-xs">3D Holographic Memory Sphere <strong className="text-amber-400 font-bold">{vaultSphere}</strong> is active. Photos and voice notes are mapped onto 3D celestial nodes.</p>
                <button
                  onClick={() => triggerNotice('Successfully captured 3D snapshot into memory vault.')}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold hover:opacity-90 cursor-pointer"
                >
                  Capture 3D Memory
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-5 py-3 border-t flex justify-between items-center ${isDark ? 'border-slate-800 bg-[#0A0E17]' : 'border-slate-200 bg-slate-50'}`}>
          <span className="text-[10px] text-slate-400">Phase 8 Advanced Features Hub • Standard fallbacks fully supported</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-500 text-white font-bold hover:opacity-90 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
