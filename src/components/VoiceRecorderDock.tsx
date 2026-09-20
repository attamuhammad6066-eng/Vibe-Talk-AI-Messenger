import { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Pause,
  Play,
  Square,
  Trash2,
  Send,
  RotateCcw,
  Volume2,
  CheckCircle2
} from 'lucide-react';

interface VoiceRecorderDockProps {
  isDark: boolean;
  onSend: (audioUrl: string, durationFormatted: string) => void;
  onCancel: () => void;
}

export function VoiceRecorderDock({ isDark, onSend, onCancel }: VoiceRecorderDockProps) {
  const [recorderState, setRecorderState] = useState<'recording' | 'paused' | 'preview'>('recording');
  const [seconds, setSeconds] = useState(0);
  const [waveformAmplitudes, setWaveformAmplitudes] = useState<number[]>(() =>
    Array(24).fill(8)
  );

  // Preview state
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewCurrentTime, setPreviewCurrentTime] = useState(0);
  const [previewSpeed, setPreviewSpeed] = useState<1 | 1.5 | 2>(1);

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // =========================================================================
  // Initialize Real or Synthetic Audio Recording
  // =========================================================================
  useEffect(() => {
    let isMounted = true;

    async function startRecording() {
      audioChunksRef.current = [];

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          if (!isMounted) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = stream;

          // Set up Web Audio Analyser
          try {
            const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            const ctx = new AudioCtxClass();
            audioContextRef.current = ctx;
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);
            analyserRef.current = analyser;
          } catch {
            // AudioContext not allowed
          }

          // Set up MediaRecorder
          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;

          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };

          recorder.onstop = () => {
            const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);
            setPreviewAudioUrl(url);
          };

          recorder.start(100);
        }
      } catch (err) {
        console.warn('Microphone permission blocked or unavailable. Falling back to synthetic voice recorder:', err);
      }

      // Start elapsed seconds timer
      timerIntervalRef.current = window.setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);

      // Start waveform animation loop
      const updateWaveform = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const amps: number[] = [];
          for (let i = 0; i < 24; i++) {
            const val = dataArray[i % dataArray.length] || 10;
            amps.push(Math.max(4, Math.min(28, (val / 255) * 28)));
          }
          setWaveformAmplitudes(amps);
        } else {
          // Synthetic audio wave animation
          const now = Date.now() / 150;
          const amps: number[] = [];
          for (let i = 0; i < 24; i++) {
            const amp = Math.sin(now + i * 0.45) * 10 + 14;
            amps.push(Math.max(4, Math.min(26, amp)));
          }
          setWaveformAmplitudes(amps);
        }
        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      };
      animationFrameRef.current = requestAnimationFrame(updateWaveform);
    }

    startRecording();

    return () => {
      isMounted = false;
      cleanupRecording();
    };
  }, []);

  const cleanupRecording = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  // Handle Pause / Resume
  const togglePauseResume = () => {
    if (recorderState === 'recording') {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.pause();
      }
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      setRecorderState('paused');
    } else if (recorderState === 'paused') {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
        mediaRecorderRef.current.resume();
      }
      timerIntervalRef.current = window.setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
      setRecorderState('recording');
    }
  };

  // Stop recording and switch to Preview Mode
  const handleStopAndPreview = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // Fallback synthetic preview url
      setPreviewAudioUrl('#');
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    setRecorderState('preview');
  };

  // Preview Audio playback management
  useEffect(() => {
    if (recorderState !== 'preview' || !previewAudioUrl) return;

    const audio = new Audio();
    if (previewAudioUrl !== '#') {
      audio.src = previewAudioUrl;
    }
    previewAudioRef.current = audio;

    audio.ontimeupdate = () => {
      setPreviewCurrentTime(Math.round(audio.currentTime));
    };
    audio.onended = () => {
      setIsPreviewPlaying(false);
      setPreviewCurrentTime(0);
    };

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [recorderState, previewAudioUrl]);

  // Preview synthetic progress fallback
  useEffect(() => {
    if (!isPreviewPlaying || previewAudioUrl !== '#') return;
    const interval = setInterval(() => {
      setPreviewCurrentTime((prev) => {
        if (prev >= seconds) {
          setIsPreviewPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000 / previewSpeed);
    return () => clearInterval(interval);
  }, [isPreviewPlaying, previewAudioUrl, seconds, previewSpeed]);

  const togglePreviewPlay = () => {
    if (isPreviewPlaying) {
      if (previewAudioRef.current) previewAudioRef.current.pause();
      setIsPreviewPlaying(false);
    } else {
      if (previewAudioRef.current && previewAudioUrl !== '#') {
        previewAudioRef.current.playbackRate = previewSpeed;
        previewAudioRef.current
          .play()
          .then(() => setIsPreviewPlaying(true))
          .catch(() => setIsPreviewPlaying(true));
      } else {
        setIsPreviewPlaying(true);
      }
    }
  };

  const handleSendNote = () => {
    cleanupRecording();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    onSend(previewAudioUrl || '#', formatted || '0:05');
  };

  const handleCancelNote = () => {
    cleanupRecording();
    if (previewAudioUrl && previewAudioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewAudioUrl);
    }
    onCancel();
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      className={`flex-1 flex items-center justify-between px-3 py-1.5 rounded-2xl border transition-all animate-scale-up ${
        isDark
          ? 'bg-[#151C2A] border-emerald-500/40 shadow-lg shadow-emerald-500/5'
          : 'bg-emerald-50/90 border-emerald-300 shadow-md'
      }`}
    >
      {/* LEFT: Discard / Trash Button */}
      <button
        type="button"
        onClick={handleCancelNote}
        className="w-8 h-8 rounded-xl flex items-center justify-center text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
        title="Cancel and discard voice note"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* CENTER: Recording State vs Preview State */}
      {recorderState !== 'preview' ? (
        <div className="flex-1 flex items-center justify-center space-x-3 px-2">
          {/* Pulsing indicator */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                recorderState === 'recording'
                  ? 'bg-rose-500 animate-ping'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-xs font-mono font-bold tracking-wider">
              {formatTime(seconds)}
            </span>
          </div>

          {/* Live Waveform Bars */}
          <div className="flex-1 flex items-center justify-center space-x-0.5 h-7 overflow-hidden">
            {waveformAmplitudes.map((amp, idx) => (
              <div
                key={idx}
                style={{ height: `${amp}px` }}
                className={`w-1 rounded-full transition-all duration-75 ${
                  recorderState === 'recording'
                    ? 'bg-emerald-400'
                    : 'bg-amber-400/60'
                }`}
              />
            ))}
          </div>

          {/* Pause / Resume Button */}
          <button
            type="button"
            onClick={togglePauseResume}
            className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
              recorderState === 'recording'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
            title={recorderState === 'recording' ? 'Pause recording' : 'Resume recording'}
          >
            {recorderState === 'recording' ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>

          {/* Stop and Preview Button */}
          <button
            type="button"
            onClick={handleStopAndPreview}
            className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 flex items-center justify-center cursor-pointer"
            title="Preview before sending"
          >
            <Square className="w-3 h-3 fill-current" />
          </button>
        </div>
      ) : (
        /* PREVIEW MODE */
        <div className="flex-1 flex items-center justify-between space-x-2 px-2">
          {/* Play/Pause Preview */}
          <button
            type="button"
            onClick={togglePreviewPlay}
            className="w-8 h-8 rounded-full bg-emerald-400 text-black flex items-center justify-center shadow-md active:scale-90 cursor-pointer shrink-0"
            title={isPreviewPlaying ? 'Pause preview' : 'Play preview'}
          >
            {isPreviewPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 ml-0.5 fill-current" />
            )}
          </button>

          {/* Scrubber Waveform for Preview */}
          <div className="flex-1 flex flex-col justify-center space-y-0.5">
            <div className="flex items-center space-x-0.5 h-5">
              {waveformAmplitudes.slice(0, 18).map((amp, idx) => {
                const pct = (idx / 18) * 100;
                const played = pct <= (seconds > 0 ? (previewCurrentTime / seconds) * 100 : 0);
                return (
                  <div
                    key={idx}
                    style={{ height: `${amp}px` }}
                    className={`flex-1 rounded-full transition-all ${
                      played ? 'bg-emerald-400' : 'bg-slate-600/50'
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[9px] font-mono opacity-80">
              <span>{formatTime(previewCurrentTime)} / {formatTime(seconds)}</span>
              <span className="text-emerald-400 font-bold">Preview Ready</span>
            </div>
          </div>

          {/* Speed Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = previewSpeed === 1 ? 1.5 : previewSpeed === 1.5 ? 2 : 1;
              setPreviewSpeed(next);
              if (previewAudioRef.current) previewAudioRef.current.playbackRate = next;
            }}
            className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 text-[9px] font-bold border border-slate-700 cursor-pointer shrink-0"
            title="Playback Speed"
          >
            {previewSpeed}x
          </button>
        </div>
      )}

      {/* RIGHT: Send Button */}
      <button
        type="button"
        onClick={handleSendNote}
        className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00E5A3] to-[#00C2FF] text-black flex items-center justify-center font-bold shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer shrink-0 ml-1"
        title="Send voice note"
      >
        <Send className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
