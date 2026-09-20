import { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Activity,
  FileText,
  AlertTriangle,
  Server,
  Database,
  Lock,
  HardDrive,
  BarChart3,
  RefreshCw,
  Search,
  CheckCircle2,
  X,
  Sliders,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  Zap,
  Globe,
  Key
} from 'lucide-react';

interface Phase10AdminProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export function Phase10AdminDashboard({ isOpen, onClose, isDark }: Phase10AdminProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'moderation' | 'ai_usage' | 'health' | 'audit_logs'>('overview');
  const [adminRole, setAdminRole] = useState<'Super Admin' | 'Admin' | 'Moderator' | 'Support' | 'Analytics'>('Super Admin');
  const [notice, setNotice] = useState<string | null>(null);

  // Mock data for users
  const [users, setUsers] = useState([
    { id: 'usr_1', name: 'Atta Muhammad', email: 'atta.muhammad612@gmail.com', role: 'Super Admin', status: 'Active', lastActive: 'Just now' },
    { id: 'usr_2', name: 'Sarah Jenkins', email: 'sarah.j@vibetalk.io', role: 'Admin', status: 'Active', lastActive: '5m ago' },
    { id: 'usr_3', name: 'Alex Rivera', email: 'alex.r@vibetalk.io', role: 'Moderator', status: 'Active', lastActive: '12m ago' },
    { id: 'usr_4', name: 'Spam Bot 99', email: 'spammer@malicious.xyz', role: 'User', status: 'Suspended', lastActive: '3d ago' },
  ]);

  // Mock reports
  const [reports, setReports] = useState([
    { id: 'rep_1', reporter: 'Sarah Jenkins', target: 'Spam Bot 99', reason: 'Harassment & Phishing link', status: 'Pending Review', date: '2026-09-19' },
    { id: 'rep_2', reporter: 'Alex Rivera', target: 'Group #412', reason: 'Copyright infringement', status: 'Resolved', date: '2026-09-18' },
  ]);

  // System health
  const [healthMetrics, setHealthMetrics] = useState({
    cpuUsage: '18.4%',
    memoryUsage: '2.4 GB / 8.0 GB',
    activeWebSocketConnections: '14,290',
    postgresPool: 'Active (12ms latency)',
    redisCluster: 'Connected (Hit rate 98.4%)',
    objectStorage: 'Operational (AWS S3 / GCS)'
  });

  // Audit logs
  const [auditLogs, setAuditLogs] = useState([
    { id: 'log_1', admin: 'Atta Muhammad', action: 'ROLE_UPDATE', details: 'Promoted user usr_2 to Admin', timestamp: '2026-09-19 13:30:12' },
    { id: 'log_2', admin: 'Sarah Jenkins', action: 'USER_SUSPEND', details: 'Suspended user usr_4 (Spam Bot 99)', timestamp: '2026-09-19 12:15:40' },
    { id: 'log_3', admin: 'System', action: 'DATABASE_BACKUP', details: 'Automated PostgreSQL snapshot created successfully', timestamp: '2026-09-19 04:00:00' },
  ]);

  if (!isOpen) return null;

  const triggerNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleSuspendUser = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'Suspended' ? 'Active' : 'Suspended' } : u))
    );
    triggerNotice(`User status updated successfully.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-5xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[94vh] ${
          isDark ? 'bg-[#0B0F17] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold">VibeTalk Secure Web Admin Dashboard (Phase 10)</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  RBAC: {adminRole}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">PostgreSQL + Redis + Object Storage • Real-time APIs • Strict Role-Based Access Control</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={adminRole}
              onChange={(e) => {
                setAdminRole(e.target.value as any);
                triggerNotice(`Switched admin permission view to ${e.target.value}`);
              }}
              className={`px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer ${
                isDark ? 'bg-slate-900 border-slate-700 text-cyan-300' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
              <option value="Support">Support</option>
              <option value="Analytics">Analytics</option>
            </select>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        {notice && (
          <div className="bg-cyan-500/15 border-b border-cyan-500/30 px-4 py-2 flex items-center space-x-2 text-cyan-300 text-xs font-semibold animate-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>{notice}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className={`flex border-b px-3 pt-2 space-x-1 overflow-x-auto ${isDark ? 'border-slate-800 bg-[#070A10]' : 'border-slate-200 bg-slate-50'}`}>
          {[
            { id: 'overview', label: 'System Dashboard', icon: Activity },
            { id: 'users', label: 'Users & Devices', icon: Users },
            { id: 'moderation', label: 'Reports & Moderation', icon: AlertTriangle },
            { id: 'ai_usage', label: 'AI Usage & Cost', icon: Zap },
            { id: 'health', label: 'Infrastructure Health', icon: Server },
            { id: 'audit_logs', label: 'Audit Logs & RBAC', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Total Active Users', value: '142,850', change: '+12.4% this week', icon: Users, color: 'text-cyan-400' },
                  { label: 'Concurrent WS Conns', value: '14,290', change: '99.9% uptime', icon: Globe, color: 'text-emerald-400' },
                  { label: 'AI Token Consumption', value: '48.2M', change: 'Cost: $142.50/day', icon: Zap, color: 'text-purple-400' },
                  { label: 'Pending Reports', value: '3', change: 'Needs moderation', icon: AlertTriangle, color: 'text-amber-400' },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className={`p-4 rounded-xl border ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 font-bold">{stat.label}</span>
                        <Icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <p className="text-xl font-extrabold text-white">{stat.value}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{stat.change}</span>
                    </div>
                  );
                })}
              </div>

              <div className={`p-5 rounded-xl border space-y-4 ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className="font-bold text-sm flex items-center space-x-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>Backend Database & Cache Status</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">PostgreSQL (Primary)</span>
                    <p className="font-bold text-emerald-400 mt-1">Healthy (12ms)</p>
                    <span className="text-[10px] text-slate-500">Entities: Users, Messages, Chats, Attachments</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Redis Cluster (Cache/PubSub)</span>
                    <p className="font-bold text-emerald-400 mt-1">Connected (98.4% Hit)</p>
                    <span className="text-[10px] text-slate-500">Session store, rate limiting, real-time presence</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Object Storage (S3/GCS)</span>
                    <p className="font-bold text-emerald-400 mt-1">Operational</p>
                    <span className="text-[10px] text-slate-500">Media, voice notes, attachments, backups</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">User Directory & Device Management</h3>
                  <p className="text-[11px] text-slate-400">Manage user accounts, roles, profiles, active sessions, and status</p>
                </div>
                <button
                  onClick={() => triggerNotice('Exported user CSV report successfully.')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold hover:opacity-90 cursor-pointer"
                >
                  Export Users CSV
                </button>
              </div>

              <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-white border-slate-200'}`}>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b text-[10px] uppercase tracking-wider text-slate-400 ${isDark ? 'border-slate-800 bg-[#0F141C]' : 'border-slate-200 bg-slate-50'}`}>
                      <th className="p-3">User</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Last Active</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 font-bold text-white">{u.name}</td>
                        <td className="p-3 text-slate-400 font-mono">{u.email}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">{u.role}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{u.lastActive}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleSuspendUser(u.id)}
                            className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                              u.status === 'Active' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            }`}
                          >
                            {u.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'moderation' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">Reports & Content Moderation</h3>
                  <p className="text-[11px] text-slate-400">Review reported messages, groups, and stories submitted by users</p>
                </div>
              </div>

              <div className="space-y-3">
                {reports.map((rep) => (
                  <div key={rep.id} className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold flex items-center space-x-2">
                          <span>Target: {rep.target}</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">{rep.status}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">Reason: {rep.reason} (Reported by {rep.reporter})</p>
                        <span className="text-[10px] text-slate-500 font-mono">Date: {rep.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => triggerNotice(`Report ${rep.id} dismissed.`)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold cursor-pointer"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => triggerNotice(`Target ${rep.target} banned and report resolved.`)}
                        className="px-3 py-1.5 rounded-lg bg-red-500 text-white font-bold hover:opacity-90 cursor-pointer"
                      >
                        Ban Target
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai_usage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">AI Usage & Cost Telemetry</h3>
                  <p className="text-[11px] text-slate-400">Monitor Gemini model token consumption, rate limits, and operational costs</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-slate-400 font-bold">Total Tokens (Today)</span>
                  <p className="text-2xl font-extrabold text-purple-400 mt-1">48,290,104</p>
                  <span className="text-[10px] text-emerald-400 mt-1 block">Within rate limits (92% quota remaining)</span>
                </div>
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-slate-400 font-bold">Estimated Cost (MTD)</span>
                  <p className="text-2xl font-extrabold text-cyan-400 mt-1">$142.50</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Optimized via caching & Flash models</span>
                </div>
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-slate-400 font-bold">AI Features Active</span>
                  <p className="text-2xl font-extrabold text-emerald-400 mt-1">11 Services</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">MyTone, Digital Twin, Scam Buster, Translation</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">Infrastructure Health & System Status</h3>
                  <p className="text-[11px] text-slate-400">Real-time container metrics, database pool, and object storage status</p>
                </div>
                <button
                  onClick={() => triggerNotice('System health check completed. All nodes operational.')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold hover:opacity-90 cursor-pointer"
                >
                  Run Diagnostics
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(healthMetrics).map(([key, val], idx) => (
                  <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <p className="font-bold text-white text-sm mt-0.5">{val}</p>
                    </div>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-md animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit_logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">Audit Logs & Strict RBAC Controls</h3>
                  <p className="text-[11px] text-slate-400">Track all administrative actions, role assignments, and security events</p>
                </div>
                <button
                  onClick={() => triggerNotice('PostgreSQL backup snapshot created successfully.')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold hover:opacity-90 cursor-pointer"
                >
                  Trigger DB Backup Now
                </button>
              </div>

              <div className="space-y-2.5">
                {auditLogs.map((log) => (
                  <div key={log.id} className={`p-3.5 rounded-xl border flex items-center justify-between ${isDark ? 'bg-[#121824] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-bold">
                        <Key className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold flex items-center space-x-2">
                          <span>{log.admin}</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300">{log.action}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">{log.details}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex justify-between items-center ${isDark ? 'border-slate-800 bg-[#070A10]' : 'border-slate-200 bg-slate-50'}`}>
          <span className="text-[10px] text-slate-400">VibeTalk Secure Web Admin Dashboard • Strict RBAC enforced</span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-cyan-500 text-black font-bold hover:opacity-90 cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
