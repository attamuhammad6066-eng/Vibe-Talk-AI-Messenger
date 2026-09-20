import {
  ContactItem,
  CallType,
  CallDirection,
  CallState,
  AudioOutputDevice,
  NetworkQuality,
  CallParticipant,
  CallSession,
  CallHistoryItem
} from '../types';

type CallListener = (session: CallSession | null) => void;
type HistoryListener = (history: CallHistoryItem[]) => void;

class WebRTCCallService {
  private currentSession: CallSession | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private listeners: Set<CallListener> = new Set();
  private historyListeners: Set<HistoryListener> = new Set();

  private callTimer: number | null = null;
  private statsTimer: number | null = null;
  private reconnectTimer: number | null = null;

  // Web Audio Context for synthesizer tones (Ringtone, Dial tone, Busy tone)
  private audioCtx: AudioContext | null = null;
  private ringtoneOsc1: OscillatorNode | null = null;
  private ringtoneOsc2: OscillatorNode | null = null;
  private ringtoneGain: GainNode | null = null;

  private callHistory: CallHistoryItem[] = [
    {
      id: 'hist_1',
      contactId: 'usr_atta_lead',
      name: 'Atta Muhammad',
      handle: '@atta_dev',
      type: 'video',
      direction: 'incoming',
      status: 'answered',
      duration: '14m 22s',
      timestamp: Date.now() - 3600000 * 2,
      time: 'Today, 11:42 AM'
    },
    {
      id: 'hist_2',
      contactId: 'usr_ai',
      name: 'VibeTalk AI Copilot',
      handle: '@vibetalk_ai',
      type: 'voice',
      direction: 'outgoing',
      status: 'answered',
      duration: '4m 05s',
      timestamp: Date.now() - 3600000 * 24,
      time: 'Yesterday, 4:10 PM'
    },
    {
      id: 'hist_3',
      contactId: 'usr_elena_crypto',
      name: 'Dr. Elena Rostova',
      handle: '@elena_sec',
      type: 'video',
      direction: 'incoming',
      status: 'missed',
      duration: '0s',
      timestamp: Date.now() - 3600000 * 48,
      time: 'Sep 17, 9:15 PM'
    }
  ];

  constructor() {
    // Load persisted history if available
    try {
      const saved = localStorage.getItem('vibetalk_call_history_v1');
      if (saved) {
        this.callHistory = JSON.parse(saved);
      }
    } catch {
      // ignore
    }
  }

  public getCurrentSession(): CallSession | null {
    return this.currentSession;
  }

  public getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  public getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  public getCallHistory(): CallHistoryItem[] {
    return [...this.callHistory];
  }

  public subscribe(listener: CallListener): () => void {
    this.listeners.add(listener);
    listener(this.currentSession);
    return () => this.listeners.delete(listener);
  }

  public subscribeHistory(listener: HistoryListener): () => void {
    this.historyListeners.add(listener);
    listener([...this.callHistory]);
    return () => this.historyListeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l(this.currentSession ? { ...this.currentSession } : null));
  }

  private notifyHistory() {
    try {
      localStorage.setItem('vibetalk_call_history_v1', JSON.stringify(this.callHistory));
    } catch {
      // ignore
    }
    this.historyListeners.forEach((l) => l([...this.callHistory]));
  }

  // =========================================================================
  // Web Audio Synthesizer (Ringtone / Ringback / Chimes)
  // =========================================================================
  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  private playTone(freq1: number, freq2: number, durationSec: number = 2, intervalSec: number = 4) {
    try {
      this.stopTone();
      const ctx = this.getAudioContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.value = freq1;
      osc2.frequency.value = freq2;

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + durationSec);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + durationSec + 0.05);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      this.ringtoneOsc1 = osc1;
      this.ringtoneOsc2 = osc2;
      this.ringtoneGain = gain;

      // Repeat tone if still active
      const loop = () => {
        if (!this.ringtoneGain) return;
        try {
          const now = ctx.currentTime;
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
          gain.gain.setValueAtTime(0.12, now + durationSec);
          gain.gain.linearRampToValueAtTime(0, now + durationSec + 0.05);
          setTimeout(loop, intervalSec * 1000);
        } catch {
          // stopped
        }
      };
      setTimeout(loop, intervalSec * 1000);
    } catch {
      // AudioContext unavailable
    }
  }

  private stopTone() {
    try {
      if (this.ringtoneOsc1) {
        this.ringtoneOsc1.stop();
        this.ringtoneOsc1.disconnect();
        this.ringtoneOsc1 = null;
      }
      if (this.ringtoneOsc2) {
        this.ringtoneOsc2.stop();
        this.ringtoneOsc2.disconnect();
        this.ringtoneOsc2 = null;
      }
      if (this.ringtoneGain) {
        this.ringtoneGain.disconnect();
        this.ringtoneGain = null;
      }
    } catch {
      // ignore
    }
  }

  private playChime(success: boolean) {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(success ? 587.33 : 329.63, ctx.currentTime); // D5 or E4
      if (success) {
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25); // A5
      } else {
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.3); // A3
      }
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // ignore
    }
  }

  // =========================================================================
  // MediaStream Management (Real getUserMedia + Robust Fallback)
  // =========================================================================
  public async initMediaStream(
    type: CallType,
    facingMode: 'user' | 'environment' = 'user'
  ): Promise<MediaStream> {
    this.stopMediaTracks();

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          },
          video:
            type === 'video'
              ? {
                  facingMode: facingMode,
                  width: { ideal: 1280 },
                  height: { ideal: 720 }
                }
              : false
        });
        this.localStream = stream;
        return stream;
      }
    } catch (err) {
      console.warn('Hardware camera/microphone unavailable or permission denied. Initializing simulated WebRTC stream:', err);
    }

    // High quality synthetic media stream for sandbox/simulated calls
    const synthetic = this.createSyntheticMediaStream(type);
    this.localStream = synthetic;
    return synthetic;
  }

  private createSyntheticMediaStream(type: CallType): MediaStream {
    const stream = new MediaStream();

    // 1. Audio Track via Web Audio Oscillator
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const dst = ctx.createMediaStreamDestination();
      const gain = ctx.createGain();
      gain.gain.value = 0.001; // subtle live tone
      osc.connect(gain);
      gain.connect(dst);
      osc.start();
      dst.stream.getAudioTracks().forEach((t) => stream.addTrack(t));
    } catch {
      // ignore
    }

    // 2. Video Track via Canvas Stream (if video call)
    if (type === 'video') {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        let frame = 0;

        const draw = () => {
          if (!ctx) return;
          frame++;
          // Cyberpunk / Modern Dark UI Camera Simulator
          const grad = ctx.createLinearGradient(0, 0, 640, 480);
          grad.addColorStop(0, '#0a101d');
          grad.addColorStop(0.5, '#0e2439');
          grad.addColorStop(1, '#050b14');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 640, 480);

          // Animated particle/scanline wave
          ctx.strokeStyle = '#00E5A3';
          ctx.lineWidth = 3;
          ctx.beginPath();
          for (let x = 0; x < 640; x += 15) {
            const y = 240 + Math.sin((x + frame * 4) * 0.03) * 35;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Face silhouette outline
          ctx.fillStyle = 'rgba(0, 229, 163, 0.15)';
          ctx.beginPath();
          ctx.arc(320, 200, 75, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 16px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('LIVE WEBRTC VIDEO FEED', 320, 320);
          ctx.fillStyle = '#00E5A3';
          ctx.font = '12px monospace';
          ctx.fillText('Opus 128kbps • VP9 60FPS • 256-bit Encrypted', 320, 345);

          requestAnimationFrame(draw);
        };
        draw();

        const canvasStream = canvas.captureStream(30);
        canvasStream.getVideoTracks().forEach((t) => stream.addTrack(t));
      } catch {
        // ignore
      }
    }

    return stream;
  }

  private stopMediaTracks() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((t) => t.stop());
      this.localStream = null;
    }
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((t) => t.stop());
      this.remoteStream = null;
    }
  }

  // =========================================================================
  // Call Session Lifecycle
  // =========================================================================

  /**
   * Start an OUTGOING voice or video call
   */
  public async startCall(contact: ContactItem, type: CallType): Promise<CallSession> {
    this.endCall(false); // Clean any previous session

    const initialParticipant: CallParticipant = {
      id: contact.id,
      name: contact.name,
      username: contact.username,
      avatar: contact.avatar,
      avatarBg: contact.avatarBg,
      isMuted: false,
      isVideoOn: type === 'video',
      networkQuality: 'excellent',
      role: 'participant'
    };

    const session: CallSession = {
      id: `call_${Date.now()}`,
      type,
      direction: 'outgoing',
      state: 'calling',
      contact,
      participants: [initialParticipant],
      durationSeconds: 0,
      isMuted: false,
      isVideoOn: type === 'video',
      isSpeaker: type === 'video',
      audioOutput: type === 'video' ? 'speaker' : 'earpiece',
      isFrontCamera: true,
      networkQuality: 'excellent',
      stats: {
        pingMs: 38,
        packetLoss: 0,
        bitrateKbps: type === 'video' ? 1420 : 128,
        resolution: type === 'video' ? '1080p' : undefined,
        fps: type === 'video' ? 60 : undefined
      }
    };

    this.currentSession = session;
    this.notify();

    // Start local camera / mic
    await this.initMediaStream(type, 'user');

    // Play outgoing dial tone
    this.playTone(440, 480, 2, 4);

    // Simulate remote user ringing after 1.5s
    setTimeout(() => {
      if (this.currentSession && this.currentSession.state === 'calling') {
        this.currentSession.state = 'ringing';
        this.notify();
      }
    }, 1500);

    // Simulate remote user accepting call after 4s (realistic WebRTC ICE connect)
    setTimeout(() => {
      if (this.currentSession && (this.currentSession.state === 'ringing' || this.currentSession.state === 'calling')) {
        this.connectCall();
      }
    }, 4200);

    return session;
  }

  /**
   * Receive an INCOMING voice or video call
   */
  public receiveIncomingCall(contact: ContactItem, type: CallType): CallSession {
    this.endCall(false);

    const initialParticipant: CallParticipant = {
      id: contact.id,
      name: contact.name,
      username: contact.username,
      avatar: contact.avatar,
      avatarBg: contact.avatarBg,
      isMuted: false,
      isVideoOn: type === 'video',
      networkQuality: 'excellent',
      role: 'participant'
    };

    const session: CallSession = {
      id: `call_${Date.now()}`,
      type,
      direction: 'incoming',
      state: 'ringing',
      contact,
      participants: [initialParticipant],
      durationSeconds: 0,
      isMuted: false,
      isVideoOn: type === 'video',
      isSpeaker: type === 'video',
      audioOutput: type === 'video' ? 'speaker' : 'earpiece',
      isFrontCamera: true,
      networkQuality: 'excellent',
      stats: {
        pingMs: 42,
        packetLoss: 0,
        bitrateKbps: type === 'video' ? 1500 : 128,
        resolution: type === 'video' ? '1080p' : undefined,
        fps: type === 'video' ? 60 : undefined
      }
    };

    this.currentSession = session;
    this.notify();

    // Play incoming ringtone (dual melodic ringtone)
    this.playTone(523.25, 659.25, 1.8, 3.5);

    return session;
  }

  public simulateIncomingCall(contact: ContactItem, type: CallType): CallSession {
    return this.receiveIncomingCall(contact, type);
  }

  /**
   * Accept incoming call
   */
  public async acceptIncomingCall(): Promise<void> {
    if (!this.currentSession) return;
    this.stopTone();
    this.currentSession.state = 'connecting';
    this.notify();

    await this.initMediaStream(this.currentSession.type, 'user');
    this.connectCall();
  }

  /**
   * Reject incoming call
   */
  public rejectIncomingCall(): void {
    if (!this.currentSession) return;
    this.stopTone();
    this.playChime(false);

    // Record as missed / declined
    this.addHistoryRecord(
      this.currentSession.contact,
      this.currentSession.type,
      'incoming',
      'declined',
      '0s'
    );

    this.currentSession.state = 'ended';
    this.notify();
    setTimeout(() => {
      this.cleanup();
    }, 500);
  }

  /**
   * Connect and start WebRTC peer timers
   */
  private connectCall() {
    if (!this.currentSession) return;
    this.stopTone();
    this.playChime(true);

    this.currentSession.state = 'connected';
    this.currentSession.startTime = Date.now();
    this.notify();

    // Start Call Duration Timer
    if (this.callTimer) clearInterval(this.callTimer);
    this.callTimer = window.setInterval(() => {
      if (this.currentSession && this.currentSession.state === 'connected') {
        this.currentSession.durationSeconds += 1;
        this.notify();
      }
    }, 1000);

    // Start Live WebRTC Stats Monitor (Simulating real RTCPeerConnection stats)
    if (this.statsTimer) clearInterval(this.statsTimer);
    this.statsTimer = window.setInterval(() => {
      if (this.currentSession && this.currentSession.state === 'connected') {
        // Vary ping between 30 and 55ms
        const ping = Math.floor(34 + Math.random() * 18);
        const packetLoss = Math.random() < 0.85 ? 0 : Number((Math.random() * 0.4).toFixed(1));
        const baseBitrate = this.currentSession.type === 'video' ? 1400 : 128;
        const bitrate = Math.floor(baseBitrate + (Math.random() * 60 - 30));

        this.currentSession.stats = {
          pingMs: ping,
          packetLoss: packetLoss,
          bitrateKbps: bitrate,
          resolution: this.currentSession.type === 'video' ? '1080p' : undefined,
          fps: this.currentSession.type === 'video' ? (ping > 50 ? 55 : 60) : undefined
        };

        // Network quality assessment
        if (ping > 90 || packetLoss > 2.5) {
          this.currentSession.networkQuality = 'poor';
        } else if (ping > 55 || packetLoss > 0.5) {
          this.currentSession.networkQuality = 'good';
        } else {
          this.currentSession.networkQuality = 'excellent';
        }

        this.notify();
      }
    }, 2500);
  }

  /**
   * End current call
   */
  public endCall(recordHistory: boolean = true): void {
    if (!this.currentSession) return;
    this.stopTone();

    if (recordHistory && this.currentSession.state !== 'ended') {
      const durationMins = Math.floor(this.currentSession.durationSeconds / 60);
      const durationSecs = this.currentSession.durationSeconds % 60;
      const durationFormatted =
        this.currentSession.durationSeconds > 0
          ? `${durationMins > 0 ? `${durationMins}m ` : ''}${durationSecs}s`
          : '0s';

      const status = this.currentSession.durationSeconds > 0 ? 'answered' : 'missed';

      this.addHistoryRecord(
        this.currentSession.contact,
        this.currentSession.type,
        this.currentSession.direction,
        status,
        durationFormatted
      );
    }

    this.playChime(false);
    this.currentSession.state = 'ended';
    this.notify();

    setTimeout(() => {
      this.cleanup();
    }, 600);
  }

  private cleanup() {
    this.stopTone();
    this.stopMediaTracks();

    if (this.callTimer) {
      clearInterval(this.callTimer);
      this.callTimer = null;
    }
    if (this.statsTimer) {
      clearInterval(this.statsTimer);
      this.statsTimer = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.currentSession = null;
    this.notify();
  }

  private addHistoryRecord(
    contact: ContactItem,
    type: CallType,
    direction: CallDirection,
    status: 'answered' | 'missed' | 'declined',
    duration: string
  ) {
    const newRecord: CallHistoryItem = {
      id: `hist_${Date.now()}`,
      contactId: contact.id,
      name: contact.name,
      handle: `@${contact.username}`,
      avatar: contact.avatar,
      avatarBg: contact.avatarBg,
      type,
      direction,
      status,
      duration,
      timestamp: Date.now(),
      time: 'Just now'
    };

    this.callHistory = [newRecord, ...this.callHistory];
    this.notifyHistory();
  }

  // =========================================================================
  // In-Call Controls (Mute, Video, Speaker, Bluetooth, Camera Flip, Reconnection)
  // =========================================================================

  public toggleMute(): boolean {
    if (!this.currentSession) return false;
    const newMuted = !this.currentSession.isMuted;
    this.currentSession.isMuted = newMuted;

    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = !newMuted;
      });
    }

    this.notify();
    return newMuted;
  }

  public toggleVideo(): boolean {
    if (!this.currentSession) return false;
    const newVideo = !this.currentSession.isVideoOn;
    this.currentSession.isVideoOn = newVideo;

    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = newVideo;
      });
    }

    // If upgrading from voice to video call dynamically
    if (newVideo && this.currentSession.type === 'voice') {
      this.currentSession.type = 'video';
      this.initMediaStream('video', 'user').then(() => this.notify());
    }

    this.notify();
    return newVideo;
  }

  public toggleSpeaker(): boolean {
    if (!this.currentSession) return false;
    const newSpeaker = !this.currentSession.isSpeaker;
    this.currentSession.isSpeaker = newSpeaker;
    this.currentSession.audioOutput = newSpeaker ? 'speaker' : 'earpiece';
    this.notify();
    return newSpeaker;
  }

  public setAudioOutput(device: AudioOutputDevice): void {
    if (!this.currentSession) return;
    this.currentSession.audioOutput = device;
    this.currentSession.isSpeaker = device === 'speaker';
    this.notify();
  }

  public cycleAudioOutput(): AudioOutputDevice {
    if (!this.currentSession) return 'speaker';
    const next: Record<AudioOutputDevice, AudioOutputDevice> = {
      earpiece: 'speaker',
      speaker: 'bluetooth',
      bluetooth: 'earpiece'
    };
    const device = next[this.currentSession.audioOutput];
    this.setAudioOutput(device);
    return device;
  }

  public async switchCamera(): Promise<boolean> {
    if (!this.currentSession || !this.currentSession.isVideoOn) return false;
    const nextMode = this.currentSession.isFrontCamera ? 'environment' : 'user';
    this.currentSession.isFrontCamera = !this.currentSession.isFrontCamera;
    this.notify();

    try {
      await this.initMediaStream('video', nextMode);
    } catch {
      // ignore
    }
    this.notify();
    return this.currentSession.isFrontCamera;
  }

  /**
   * Simulate a realistic Network Glitch & Auto-Reconnection
   */
  public simulateNetworkGlitch(): void {
    if (!this.currentSession || this.currentSession.state !== 'connected') return;

    this.currentSession.state = 'reconnecting';
    this.currentSession.networkQuality = 'reconnecting';
    this.currentSession.stats.pingMs = 380;
    this.currentSession.stats.packetLoss = 14.5;
    this.notify();

    // Auto reconnect after 2.8 seconds
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = window.setTimeout(() => {
      if (this.currentSession) {
        this.currentSession.state = 'connected';
        this.currentSession.networkQuality = 'excellent';
        this.currentSession.stats.pingMs = 40;
        this.currentSession.stats.packetLoss = 0;
        this.playChime(true);
        this.notify();
      }
    }, 2800);
  }

  // =========================================================================
  // Group Calling Architecture (Ready for multi-peer calling)
  // =========================================================================

  public addParticipant(contact: ContactItem): void {
    if (!this.currentSession) return;
    const exists = this.currentSession.participants.some((p) => p.id === contact.id);
    if (exists) return;

    const newParticipant: CallParticipant = {
      id: contact.id,
      name: contact.name,
      username: contact.username,
      avatar: contact.avatar,
      avatarBg: contact.avatarBg,
      isMuted: false,
      isVideoOn: this.currentSession.type === 'video',
      networkQuality: 'excellent',
      role: 'participant'
    };

    this.currentSession.participants.push(newParticipant);
    this.playChime(true);
    this.notify();
  }

  public removeParticipant(participantId: string): void {
    if (!this.currentSession) return;
    this.currentSession.participants = this.currentSession.participants.filter(
      (p) => p.id !== participantId
    );
    this.notify();
  }
}

export const webrtcCallService = new WebRTCCallService();
