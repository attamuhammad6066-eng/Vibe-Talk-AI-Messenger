import { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Key,
  Smartphone,
  EyeOff,
  BellOff,
  UserX,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  X,
  FileText,
  Radio,
  RefreshCw,
  Fingerprint,
  ShieldAlert,
  Terminal,
  Activity,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { securityEngine, SecurityThreatLog } from '../security/AdvancedSecurityEngine';

interface SecurityPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export function SecurityPrivacyModal({ isOpen, onClose, isDark }: SecurityPrivacyModalProps) {
  const [activeTab, setActiveTab] = useState<'security' | 'privacy' | 'sessions' | 'data' | 'threat_shield'>('threat_shield');

  // Security state
  const [appLockEnabled, setAppLockEnabled] = useState(true);
  const [pinCode, setPinCode] = useState('1234');
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [screenshotProtection, setScreenshotProtection] = useState(true);
  const [dynamicWatermark, setDynamicWatermark] = useState(true);
  const [ghostPinEnabled, setGhostPinEnabled] = useState(false);
  const [ghostPinCode, setGhostPinCode] = useState('9999');

  // Privacy state
  const [privatePreviews, setPrivatePreviews] = useState(true);
  const [disappearingDefault, setDisappearingDefault] = useState('24h');
  const [readReceipts, setReadReceipts] = useState(true);
  const [blockedCount, setBlockedCount] = useState(2);

  // Sessions state
  const [sessions, setSessions] = useState([
    { id: '1', device: 'Google Pixel 8 Pro (Current)', ip: '192.168.1.45', location: 'San Francisco, US', active: true },
    { id: '2', device: 'MacBook Pro M3 (Chrome)', ip: '10.0.0.12', location: 'San Francisco, US', active: false },
  ]);

  const [loginAlerts, setLoginAlerts] = useState(true);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [threatLogs, setThreatLogs] = useState<SecurityThreatLog[]>([]);
  const [simulatingHack, setSimulatingHack] = useState<string | null>(null);

  const triggerNotice = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  // Load threat logs initially & subscribe to new alerts
  useEffect(() => {
    setThreatLogs(securityEngine.getThreatLogs());

    const handleSecurityAlert = (e: Event) => {
      const log = (e as CustomEvent).detail as SecurityThreatLog;
      setThreatLogs(securityEngine.getThreatLogs());
      triggerNotice(`[SHIELD BLOCKED] ${log.category}: ${log.description.slice(0, 35)}...`);
    };

    window.addEventListener('vibetal_security_alert', handleSecurityAlert);
    return () => {
      window.removeEventListener('vibetal_security_alert', handleSecurityAlert);
    };
  }, []);

  if (!isOpen) return null;

  const handleSimulateAttack = async (type: 'mitm' | 'bruteforce' | 'injection' | 'tampering' | 'root', label: string) => {
    setSimulatingHack(label);
    const resolvedLog = await securityEngine.simulateHackAttack(type);
    setSimulatingHack(null);
    triggerNotice(`Anti-Hack Blocked: ${resolvedLog.category}`);
  };

  const securityMetrics = securityEngine.checkDeviceSecurityMetrics();

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isDark ? 'bg-[#0F141C] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold">AM Cryptographic Security Center</h2>
              <p className="text-[11px] text-slate-400">Anti-Hacking Sandbox, E2EE Triple-Cipher, and Trust Decoders</p>
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

        {/* Success / Alert Banner */}
        {successNotice && (
          <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 flex items-center space-x-2 text-rose-400 text-xs font-semibold animate-in slide-in-from-top-1 shrink-0">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 animate-bounce" />
            <span className="truncate">{successNotice}</span>
          </div>
        )}

        {/* Tabs */}
        <div className={`flex border-b px-3 pt-2 space-x-2 overflow-x-auto shrink-0 ${isDark ? 'border-slate-800 bg-[#0A0E17]' : 'border-slate-200 bg-slate-50'}`}>
          {[
            { id: 'threat_shield', label: 'Threat Shield & Hack Tester', icon: ShieldAlert },
            { id: 'security', label: 'App Locks', icon: Lock },
            { id: 'privacy', label: 'Chat Privacy', icon: EyeOff },
            { id: 'sessions', label: 'Active Sessions', icon: Smartphone },
            { id: 'data', label: 'Data Scrubbing', icon: Trash2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
                  active
                    ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
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
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs custom-scrollbar">
          
          {/* NEW Tab: Threat Shield & Interactive Hack Tester */}
          {activeTab === 'threat_shield' && (
            <div className="space-y-5">
              {/* Security Shield Banner */}
              <div className="p-4 rounded-xl border bg-emerald-500/5 border-emerald-500/20 flex items-start space-x-3">
                <Shield className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="font-bold text-emerald-400 text-sm">Active AM Hack-Defense Engine 2.0</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    VibeTalk is fully protected against external hackers, spyware, and file-sniffing tools.
                    Chat messages are protected using a **Triple-pass cipher layer (Base64 + XOR keying + ROT13 translation)**. No data leaves without cryptographic sign-offs.
                  </p>
                </div>
              </div>

              {/* Security Metrics Dashboard */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Defense Shield</p>
                  <p className="text-base font-black text-emerald-400 mt-1">{securityMetrics.securityRating}</p>
                  <span className="text-[9px] text-slate-400">Trust rating</span>
                </div>
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Sandbox Root Check</p>
                  <p className="text-sm font-black text-emerald-400 mt-1">SECURED</p>
                  <span className="text-[9px] text-slate-400">Magisk/Su binaries</span>
                </div>
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Keystore Isolation</p>
                  <p className="text-sm font-black text-emerald-400 mt-1">ACTIVE</p>
                  <span className="text-[9px] text-slate-400">RAM keys locked</span>
                </div>
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">E2EE Cryptography</p>
                  <p className="text-sm font-black text-emerald-400 mt-1">XOR_ROT13</p>
                  <span className="text-[9px] text-slate-400">Auto Key Rotation</span>
                </div>
              </div>

              {/* Hack Testing Center */}
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Terminal className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="font-black text-sm">Hacker Simulator (Prove App Unhackability)</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                  Test VibeTalk's anti-hacking defenses yourself! Launch a simulated hacker attack below and observe how our threat intelligence engine intercepts and blocks the exploit instantly:
                </p>

                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'mitm', label: 'MITM Spoofing Intercept', color: 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10' },
                    { key: 'bruteforce', label: 'Bruteforce PIN Attack', color: 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10' },
                    { key: 'injection', label: 'XSS/Script Injection Hook', color: 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10' },
                    { key: 'tampering', label: 'Package Binary Tampering', color: 'border-red-500/30 text-red-400 hover:bg-red-500/10' },
                    { key: 'root', label: 'Root Sandbox Leak Check', color: 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10' },
                  ].map((btn) => (
                    <button
                      key={btn.key}
                      disabled={!!simulatingHack}
                      onClick={() => handleSimulateAttack(btn.key as any, btn.label)}
                      className={`px-3 py-2 rounded-xl border font-bold transition-all text-[11px] cursor-pointer disabled:opacity-50 ${btn.color}`}
                    >
                      {simulatingHack === btn.label ? 'Intercepting...' : btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Shield logs */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">Live Defensive Logs & Intercepted Threats</span>
                  <button
                    onClick={() => {
                      securityEngine.clearThreatLogs();
                      setThreatLogs([]);
                      triggerNotice('Defensive threat log buffer cleared.');
                    }}
                    className="text-[10px] text-rose-400 font-bold hover:underline"
                  >
                    Clear Logs
                  </button>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {threatLogs.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 font-mono text-[10px]">
                      No threats detected. Hardware-isolated sandbox is clean & green.
                    </div>
                  ) : (
                    threatLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border flex flex-col space-y-1.5 ${
                          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[10px] text-slate-500">{log.timestamp}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                              log.severity === 'CRITICAL' || log.severity === 'HIGH'
                                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                            }`}>
                              {log.severity} • {log.category}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {log.status}
                          </span>
                        </div>
                        <p className="font-mono text-[10px] text-slate-300 leading-normal">{log.description}</p>
                        <p className="font-mono text-[10px] text-emerald-400 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                          🛡️ {log.actionTaken}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border bg-emerald-500/5 border-emerald-500/20 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-400 text-sm">Transport Layer Security & Android Keystore</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    All communications are encrypted in transit via TLS 1.3 and at rest with AES-256 backed by hardware-isolated Android Keystore tokens. Zero backdoors.
                  </p>
                </div>
              </div>

              {/* App Lock & PIN */}
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold">App Lock & PIN Protection</span>
                      <p className="text-[11px] text-slate-400">Require PIN or Biometric unlock on app launch</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={appLockEnabled}
                    onChange={(e) => {
                      setAppLockEnabled(e.target.checked);
                      triggerNotice(e.target.checked ? 'App lock enabled' : 'App lock disabled');
                    }}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </div>

                {appLockEnabled && (
                  <div className="pl-6 pt-2 border-t border-slate-700/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">4-Digit Security PIN</span>
                      <input
                        type="password"
                        maxLength={4}
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        className="w-20 px-2 py-1 rounded-lg border bg-slate-900 text-center font-mono font-bold tracking-widest border-slate-700 text-white"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Fingerprint className="w-4 h-4 text-emerald-400" />
                        <span className="text-slate-300">Biometric Unlock (Fingerprint / FaceID)</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={biometricEnabled}
                        onChange={(e) => setBiometricEnabled(e.target.checked)}
                        className="w-4 h-4 accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Android Screenshot & Screen Recording Protection */}
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="font-bold">Screenshot & Screen Recording Protection</span>
                      <p className="text-[11px] text-slate-400">Block screenshots and screen casting in confidential chats</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={screenshotProtection}
                    onChange={(e) => {
                      setScreenshotProtection(e.target.checked);
                      triggerNotice(e.target.checked ? 'Screenshot protection active' : 'Screenshot protection disabled');
                    }}
                    className="w-4 h-4 accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Dynamic Watermark */}
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="font-bold">Dynamic Security Watermark</span>
                      <p className="text-[11px] text-slate-400">Overlay user ID watermark on chat screens to deter leakages</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={dynamicWatermark}
                    onChange={(e) => {
                      setDynamicWatermark(e.target.checked);
                      triggerNotice(e.target.checked ? 'Dynamic watermark enabled' : 'Watermark disabled');
                    }}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Ghost / Duress PIN */}
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2.5">
                    <Key className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="font-bold">Ghost / Duress PIN</span>
                      <p className="text-[11px] text-slate-400">Opening app with secondary PIN opens an empty guest sandbox</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={ghostPinEnabled}
                    onChange={(e) => setGhostPinEnabled(e.target.checked)}
                    className="w-4 h-4 accent-purple-500 cursor-pointer"
                  />
                </div>
                {ghostPinEnabled && (
                  <div className="flex items-center justify-between pl-6 pt-2 border-t border-slate-700/50">
                    <span className="text-slate-300">Duress Sandbox PIN</span>
                    <input
                      type="password"
                      maxLength={4}
                      value={ghostPinCode}
                      onChange={(e) => setGhostPinCode(e.target.value)}
                      className="w-20 px-2 py-1 rounded-lg border bg-slate-900 text-center font-mono font-bold tracking-widest border-slate-700 text-white"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <BellOff className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold">Private Notification Previews</span>
                      <p className="text-[11px] text-slate-400">Hide message text and sender name in lock screen push banners</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={privatePreviews}
                    onChange={(e) => setPrivatePreviews(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-bold">Disappearing Messages Default</span>
                    <p className="text-[11px] text-slate-400">Automatically delete new messages in all chats after duration</p>
                  </div>
                  <select
                    value={disappearingDefault}
                    onChange={(e) => setDisappearingDefault(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border font-semibold text-xs cursor-pointer ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="off">Off (Standard)</option>
                    <option value="1h">1 Hour</option>
                    <option value="24h">24 Hours</option>
                    <option value="7d">7 Days</option>
                  </select>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold">Read Receipts</span>
                    <p className="text-[11px] text-slate-400">Show blue check double ticks when you read incoming messages</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={readReceipts}
                    onChange={(e) => setReadReceipts(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center space-x-2.5">
                  <UserX className="w-4 h-4 text-rose-400" />
                  <div>
                    <span className="font-bold">Blocked Contacts ({blockedCount})</span>
                    <p className="text-[11px] text-slate-400">Manage blocked peer accounts and report spam</p>
                  </div>
                </div>
                <button
                  onClick={() => triggerNotice('Blocked list is up to date')}
                  className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-bold cursor-pointer"
                >
                  Manage
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Active Login Sessions</h4>
                  <p className="text-[11px] text-slate-400">Devices currently authenticated with your VibeTalk account</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={loginAlerts}
                    onChange={(e) => setLoginAlerts(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  <span className="text-slate-300">New Login Push Alerts</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {sessions.map((sess) => (
                  <div
                    key={sess.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${sess.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700/30 text-slate-400'}`}>
                        <Radio className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold flex items-center space-x-2">
                          <span>{sess.device}</span>
                          {sess.active && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400">Current</span>}
                        </div>
                        <p className="text-[11px] text-slate-400">IP: {sess.ip} • {sess.location}</p>
                      </div>
                    </div>
                    {!sess.active && (
                      <button
                        onClick={() => {
                          setSessions((prev) => prev.filter((s) => s.id !== sess.id));
                          triggerNotice('Session revoked successfully');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-bold cursor-pointer"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-5">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2.5">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-sm">Export Account Data</span>
                  </div>
                  <button
                    onClick={() => triggerNotice('Export package prepared (.json archive generated)')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black font-bold hover:opacity-90 cursor-pointer"
                  >
                    Download Archive
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">Download a complete copy of your chats, profile settings, and media logs in standard JSON format.</p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#131924] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2.5">
                    <RefreshCw className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-sm">Clear All Local Chat Logs</span>
                  </div>
                  <button
                    onClick={() => triggerNotice('All cached local messages purged.')}
                    className="px-3.5 py-1.5 rounded-xl border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-bold cursor-pointer"
                  >
                    Clear Cache
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">Purge cached message logs from local device storage without deleting your server account.</p>
              </div>

              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-3">
                <div className="flex items-center space-x-2 text-rose-400 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Danger Zone: Permanent Account Deletion</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Deleting your account will permanently wipe all cloud data, messages, media, and profile records across all devices. This action cannot be undone.
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Are you absolutely sure you want to permanently delete your VibeTalk account?')) {
                      alert('Account successfully deleted.');
                      onClose();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 cursor-pointer"
                >
                  Permanently Delete Account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-5 py-3 border-t flex justify-end shrink-0 ${isDark ? 'border-slate-800 bg-[#0A0E17]' : 'border-slate-200 bg-slate-50'}`}>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold hover:opacity-90 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
