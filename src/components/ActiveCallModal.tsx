import { useState, useEffect, useRef } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  Volume1,
  Headphones,
  Bluetooth,
  SwitchCamera,
  Users,
  Plus,
  ShieldCheck,
  Activity,
  Wifi,
  WifiOff,
  AlertTriangle,
  Sparkles,
  X,
  Radio
} from 'lucide-react';
import { CallSession, ContactItem, AudioOutputDevice } from '../types';
import { webrtcCallService } from '../services/webrtcCallService';
import { messagingRepository } from '../services/messagingRepository';

interface ActiveCallModalProps {
  session: CallSession;
  isDark: boolean;
  onClose: () => void;
}

export function ActiveCallModal({ session, isDark, onClose }: ActiveCallModalProps) {
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [showAudioOutputMenu, setShowAudioOutputMenu] = useState(false);
  const [availableContacts, setAvailableContacts] = useState<ContactItem[]>([]);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Bind local & remote video elements to MediaStreams
  useEffect(() => {
    const localStream = webrtcCallService.getLocalStream();
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    const remoteStream = webrtcCallService.getRemoteStream();
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [session.isVideoOn, session.state, session.type]);

  // Load contacts for group call invitation
  useEffect(() => {
    const list = messagingRepository.getContacts();
    setAvailableContacts(list.filter((c) => !session.participants.some((p) => p.id === c.id)));
  }, [session.participants]);

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleToggleMute = () => {
    webrtcCallService.toggleMute();
  };

  const handleToggleVideo = () => {
    webrtcCallService.toggleVideo();
  };

  const handleCycleAudioOutput = () => {
    webrtcCallService.cycleAudioOutput();
  };

  const handleSelectAudioOutput = (dev: AudioOutputDevice) => {
    webrtcCallService.setAudioOutput(dev);
    setShowAudioOutputMenu(false);
  };

  const handleSwitchCamera = () => {
    webrtcCallService.switchCamera();
  };

  const handleSimulateGlitch = () => {
    webrtcCallService.simulateNetworkGlitch();
  };

  const handleAddParticipant = (contact: ContactItem) => {
    webrtcCallService.addParticipant(contact);
    setShowAddParticipant(false);
  };

  const handleEndCall = () => {
    webrtcCallService.endCall();
    onClose();
  };

  const { contact, stats, networkQuality, state, audioOutput } = session;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm sm:max-w-md h-[640px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#0B0F19] via-[#111A2E] to-[#080B12] text-white flex flex-col justify-between p-4 sm:p-5 border border-slate-800">
        
        {/* ================================================================= */}
        {/* TOP STATUS BAR: Encryption, Timer, Network Quality & Glitch Test */}
        {/* ================================================================= */}
        <div className="flex items-center justify-between z-20">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
              <ShieldCheck className="w-3 h-3" />
              <span>Opus E2EE</span>
            </div>

            {/* Network Quality Badge */}
            <div
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-mono border ${
                networkQuality === 'excellent'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : networkQuality === 'good'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : networkQuality === 'poor'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500 animate-pulse'
              }`}
              title={`Ping: ${stats.pingMs}ms • Loss: ${stats.packetLoss}% • Bitrate: ${stats.bitrateKbps}kbps`}
            >
              {networkQuality === 'reconnecting' ? (
                <WifiOff className="w-3 h-3 animate-spin" />
              ) : (
                <Wifi className="w-3 h-3" />
              )}
              <span>{stats.pingMs}ms</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Live Call Duration */}
            <span className="text-xs font-mono font-bold tracking-widest px-2 py-0.5 rounded-lg bg-black/40 text-slate-200">
              {state === 'connected' ? formatDuration(session.durationSeconds) : state.toUpperCase()}
            </span>

            {/* Test Reconnection Glitch Button */}
            <button
              onClick={handleSimulateGlitch}
              className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[9px] font-mono text-slate-300 border border-slate-700 cursor-pointer"
              title="Test network glitch and auto-reconnection"
            >
              Test Glitch
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RECONNECTING ALERT BANNER */}
        {/* ================================================================= */}
        {networkQuality === 'reconnecting' && (
          <div className="z-30 my-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-2">
              <Radio className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span className="font-bold">Reconnecting WebRTC stream...</span>
            </div>
            <span className="text-[10px] font-mono opacity-80">Restoring ICE</span>
          </div>
        )}

        {/* ================================================================= */}
        {/* MAIN STAGE: VOICE or VIDEO (With Group Call Architecture Layout) */}
        {/* ================================================================= */}
        <div className="relative flex-1 flex flex-col items-center justify-center my-2 z-10 w-full overflow-hidden rounded-2xl">
          {session.isVideoOn ? (
            /* VIDEO CALL VIEW */
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
              {/* Multi-participant grid layout (Ready for Group Calling) */}
              <div
                className={`w-full h-full grid gap-2 p-1 ${
                  session.participants.length > 2
                    ? 'grid-cols-2 grid-rows-2'
                    : session.participants.length === 2
                    ? 'grid-cols-1 grid-rows-2'
                    : 'grid-cols-1'
                }`}
              >
                {/* Primary Remote Peer */}
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                    alt={contact.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Remote Badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-xs text-[10px] font-bold flex items-center space-x-1">
                    <span>{contact.name}</span>
                    <span className="text-emerald-400">● 1080p 60fps</span>
                  </div>
                </div>

                {/* Additional Group Participants (Future Group Calls) */}
                {session.participants.slice(1).map((p) => (
                  <div
                    key={p.id}
                    className="relative w-full h-full rounded-xl overflow-hidden bg-slate-800 flex flex-col items-center justify-center border border-slate-700"
                  >
                    <div
                      className={`w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr ${p.avatarBg} flex items-center justify-center`}
                    >
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-sm font-bold">
                        {p.avatar}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-slate-200">{p.name}</span>
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[8px] text-emerald-400 font-mono">
                      Connected
                    </div>
                  </div>
                ))}
              </div>

              {/* Local Self-View Picture-in-Picture (PiP) */}
              <div className="absolute top-3 right-3 w-24 h-32 sm:w-28 sm:h-36 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-2xl bg-slate-800 z-20">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
                <div className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-black/70 text-[8px] font-mono text-emerald-400">
                  You ({session.isFrontCamera ? 'Front' : 'Rear'})
                </div>
              </div>
            </div>
          ) : (
            /* VOICE CALL VIEW */
            <div className="flex flex-col items-center justify-center text-center space-y-3 py-4">
              {/* Pulsing Audio Aura */}
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-emerald-400/15 animate-ping" />
                <div className="absolute -inset-2 rounded-full bg-cyan-400/20 animate-pulse" />
                <div
                  className={`relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr ${contact.avatarBg} shadow-2xl shadow-emerald-500/25 flex items-center justify-center`}
                >
                  <div className="w-full h-full rounded-full bg-[#121A2B] flex items-center justify-center text-3xl font-black text-white">
                    {contact.avatar}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">{contact.name}</h2>
                <p className="text-xs text-emerald-400 font-mono mt-0.5">@{contact.username}</p>
                <div className="mt-1 flex items-center justify-center space-x-1.5 text-xs text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{contact.vibeStatus}</span>
                </div>
              </div>

              {/* Dynamic Waveform Visualizer for Voice */}
              <div className="flex items-center space-x-1 h-8 pt-2">
                {[8, 14, 22, 12, 28, 16, 24, 10, 20, 15, 26, 12].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-emerald-500 to-cyan-400 animate-pulse"
                  />
                ))}
              </div>

              {/* Group Call Participants Carousel (if multi-user) */}
              {session.participants.length > 1 && (
                <div className="flex items-center space-x-2 pt-2 px-3 py-1.5 rounded-2xl bg-slate-800/60 border border-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Group Call ({session.participants.length}):
                  </span>
                  <div className="flex -space-x-1.5">
                    {session.participants.map((p) => (
                      <div
                        key={p.id}
                        className="w-6 h-6 rounded-full border border-slate-900 bg-emerald-400 text-black flex items-center justify-center text-[9px] font-bold"
                        title={p.name}
                      >
                        {p.avatar}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* AUDIO OUTPUT SELECTOR SHEET (Speaker, Earpiece, Bluetooth) */}
        {/* ================================================================= */}
        {showAudioOutputMenu && (
          <div className="absolute bottom-24 inset-x-6 z-40 p-3 rounded-2xl bg-[#151E30] border border-slate-700 shadow-2xl space-y-2 animate-scale-up">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200">Audio Routing</span>
              <button
                onClick={() => setShowAudioOutputMenu(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleSelectAudioOutput('speaker')}
                className={`p-2 rounded-xl flex flex-col items-center text-center cursor-pointer border ${
                  audioOutput === 'speaker'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <Volume2 className="w-5 h-5 mb-1" />
                <span className="text-[10px]">Speaker</span>
              </button>
              <button
                onClick={() => handleSelectAudioOutput('earpiece')}
                className={`p-2 rounded-xl flex flex-col items-center text-center cursor-pointer border ${
                  audioOutput === 'earpiece'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <Volume1 className="w-5 h-5 mb-1" />
                <span className="text-[10px]">Earpiece</span>
              </button>
              <button
                onClick={() => handleSelectAudioOutput('bluetooth')}
                className={`p-2 rounded-xl flex flex-col items-center text-center cursor-pointer border ${
                  audioOutput === 'bluetooth'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <Bluetooth className="w-5 h-5 mb-1" />
                <span className="text-[10px]">Bluetooth</span>
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* ADD PARTICIPANT SHEET (Future Group Calling Architecture) */}
        {/* ================================================================= */}
        {showAddParticipant && (
          <div className="absolute bottom-24 inset-x-4 z-40 p-4 rounded-3xl bg-[#131B2D] border border-slate-700 shadow-2xl space-y-3 animate-scale-up max-h-60 overflow-y-auto">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200">Invite to Group Call</span>
              <button
                onClick={() => setShowAddParticipant(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {availableContacts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                All contacts already joined.
              </p>
            ) : (
              <div className="space-y-1.5">
                {availableContacts.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleAddParticipant(c)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-700"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-7 h-7 rounded-full p-0.5 bg-gradient-to-tr ${c.avatarBg} flex items-center justify-center`}
                      >
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold">
                          {c.avatar}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold">{c.name}</h5>
                        <p className="text-[9px] text-slate-400">@{c.username}</p>
                      </div>
                    </div>
                    <button className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* BOTTOM CONTROL DOCK */}
        {/* ================================================================= */}
        <div className="flex flex-col items-center space-y-3 z-20">
          <div className="flex items-center justify-center space-x-2.5 sm:space-x-3.5">
            {/* Mic Mute / Unmute */}
            <button
              onClick={handleToggleMute}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                session.isMuted
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700'
              }`}
              title={session.isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {session.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Video Camera Toggle */}
            <button
              onClick={handleToggleVideo}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                session.isVideoOn
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700'
              }`}
              title={session.isVideoOn ? 'Turn camera off' : 'Turn camera on'}
            >
              {session.isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* Switch Camera (Front / Rear) */}
            {session.isVideoOn && (
              <button
                onClick={handleSwitchCamera}
                className="w-11 h-11 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 flex items-center justify-center cursor-pointer transition-all"
                title="Switch between front and rear camera"
              >
                <SwitchCamera className="w-5 h-5" />
              </button>
            )}

            {/* Audio Route Selector (Speaker / Earpiece / Bluetooth) */}
            <button
              onClick={() => setShowAudioOutputMenu(!showAudioOutputMenu)}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer border ${
                audioOutput === 'bluetooth'
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                  : audioOutput === 'speaker'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-white border-slate-700'
              }`}
              title={`Audio output: ${audioOutput}`}
            >
              {audioOutput === 'bluetooth' ? (
                <Bluetooth className="w-5 h-5" />
              ) : audioOutput === 'speaker' ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <Volume1 className="w-5 h-5" />
              )}
            </button>

            {/* Group Call: Add Participant Button */}
            <button
              onClick={() => setShowAddParticipant(!showAddParticipant)}
              className="w-11 h-11 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-emerald-400 border border-slate-700 flex items-center justify-center cursor-pointer transition-all"
              title="Add participant to call"
            >
              <Users className="w-5 h-5" />
            </button>
          </div>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 active:scale-95 transition-all cursor-pointer"
            title="End call"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
}
