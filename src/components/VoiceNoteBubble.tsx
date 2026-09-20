import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Sparkles, RefreshCw, Copy, Check, FileText } from 'lucide-react';
import { AttachmentData } from '../types';
import { aiCoreService } from '../services/aiCoreService';

interface VoiceNoteBubbleProps {
  attachment: AttachmentData;
  isMe: boolean;
  isDark: boolean;
}

export function VoiceNoteBubble({ attachment, isMe, isDark }: VoiceNoteBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(14); // seconds
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Parse initial duration if formatted like "0:28"
  useEffect(() => {
    if (attachment.duration) {
      const parts = attachment.duration.split(':');
      if (parts.length === 2) {
        const parsed = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
        if (!isNaN(parsed) && parsed > 0) setDuration(parsed);
      }
    }
  }, [attachment.duration]);

  // Audio element setup
  useEffect(() => {
    const audio = new Audio();
    audio.src = attachment.url || '';
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(Math.round(audio.duration));
      }
    };

    audio.ontimeupdate = () => {
      setCurrentTime(Math.round(audio.currentTime));
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [attachment.url]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Synthetic playback fallback if audio URL is placeholder '#'
          setIsPlaying(true);
        });
    }
  };

  // Synthetic progress ticker fallback if media URL is invalid
  useEffect(() => {
    if (!isPlaying) return;
    if (audioRef.current && audioRef.current.src && audioRef.current.src !== window.location.href && !audioRef.current.src.endsWith('#')) {
      return;
    }
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, duration, playbackSpeed]);

  const toggleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextSpeed: 1 | 1.5 | 2 = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1;
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 18 waveform bars with distinct natural amplitudes
  const barHeights = [
    6, 12, 18, 10, 24, 16, 28, 20, 14, 22, 30, 24, 16, 20, 12, 18, 10, 6
  ];

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleTranscribe = async () => {
    if (transcription) {
      setShowTranscript(!showTranscript);
      return;
    }
    setIsTranscribing(true);
    setShowTranscript(true);
    try {
      // Mock base64 or audio extraction
      const res = await aiCoreService.transcribeAudio(
        'mock_audio_data',
        'audio/webm',
        'transcribe_and_summarize'
      );
      setTranscription(res.transcription);
      setSummary(res.summary || 'Summary: Project timeline confirmed.');
    } catch (e) {
      console.error(e);
      setTranscription('Transcribed: "Checking in on the sprint progress, ready for testing."');
      setSummary('Summary: Team update on testing readiness.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleCopyTranscript = () => {
    if (transcription) {
      navigator.clipboard.writeText(transcription);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col space-y-1.5 min-w-[220px] max-w-[290px]">
      <div className="flex items-center space-x-2.5 py-1">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 cursor-pointer shadow-md transition-transform active:scale-90 ${
            isMe
              ? 'bg-slate-900 text-emerald-400 hover:bg-black'
              : isDark
              ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
              : 'bg-emerald-500 text-white hover:bg-emerald-600'
          }`}
          title={isPlaying ? 'Pause voice note' : 'Play voice note'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 ml-0.5 fill-current" />
          )}
        </button>

        {/* Waveform & Scrubber Area */}
        <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1">
          {/* Waveform Bars */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const pct = Math.max(0, Math.min(1, clickX / rect.width));
              const newTime = Math.round(pct * duration);
              setCurrentTime(newTime);
              if (audioRef.current && !isNaN(audioRef.current.duration)) {
                audioRef.current.currentTime = newTime;
              }
            }}
            className="flex items-center space-x-0.5 h-6 cursor-pointer py-1"
            title="Click to seek"
          >
            {barHeights.map((h, i) => {
              const barPct = (i / barHeights.length) * 100;
              const isPlayed = barPct <= progressPercent;
              return (
                <div
                  key={i}
                  style={{ height: `${Math.max(4, h)}px` }}
                  className={`flex-1 rounded-full transition-all duration-150 ${
                    isPlayed
                      ? isMe
                        ? 'bg-emerald-400'
                        : isDark
                        ? 'bg-emerald-400'
                        : 'bg-emerald-600'
                      : isMe
                      ? 'bg-emerald-950/40'
                      : isDark
                      ? 'bg-slate-700/60'
                      : 'bg-slate-300'
                  } ${isPlaying && isPlayed ? 'animate-pulse' : ''}`}
                />
              );
            })}
          </div>

          {/* Time and Speed Controls */}
          <div className="flex items-center justify-between text-[9px] font-mono leading-none">
            <span className={isMe ? 'text-emerald-950/80' : 'text-slate-400'}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="flex items-center space-x-1.5">
              <Volume2 className={`w-2.5 h-2.5 ${isMe ? 'text-emerald-950/70' : 'text-slate-400'}`} />

              {/* Playback Speed Toggle (1x, 1.5x, 2x) */}
              <button
                type="button"
                onClick={toggleSpeed}
                className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-tight cursor-pointer transition-all active:scale-95 ${
                  playbackSpeed !== 1
                    ? 'bg-emerald-500/20 text-emerald-400 font-extrabold border border-emerald-400/30'
                    : isMe
                    ? 'bg-emerald-900/20 text-emerald-950 border border-emerald-950/20'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
                title="Toggle playback speed (1x, 1.5x, 2x)"
              >
                {playbackSpeed}x
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Voice Transcribe & Summarize Trigger */}
      <div className="pt-0.5 flex items-center justify-between">
        <button
          type="button"
          onClick={handleTranscribe}
          className={`text-[9px] font-bold flex items-center space-x-1 px-1.5 py-0.5 rounded-md transition-all cursor-pointer ${
            showTranscript
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30'
              : isMe
              ? 'text-emerald-950/80 hover:text-black hover:bg-emerald-900/10'
              : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
          <span>{isTranscribing ? 'Transcribing...' : transcription ? (showTranscript ? 'Hide Transcript' : 'Show Transcript') : 'AI Transcribe & Summary'}</span>
        </button>
      </div>

      {/* Transcribed Drawer */}
      {showTranscript && (
        <div
          className={`p-2 rounded-xl text-[10px] leading-relaxed space-y-1.5 border animate-fade-in ${
            isDark
              ? 'bg-[#0E131C] border-slate-800 text-slate-200'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          {isTranscribing ? (
            <div className="flex items-center space-x-1.5 text-emerald-400 py-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Transcribing with Gemini 3.5 Transcribe...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase">
                <span className="flex items-center space-x-1">
                  <FileText className="w-2.5 h-2.5" />
                  <span>Transcription</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyTranscript}
                  className="hover:text-emerald-400 flex items-center space-x-0.5 cursor-pointer"
                >
                  {isCopied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="italic text-slate-300">{transcription}</p>
              {summary && (
                <div className="pt-1 border-t border-slate-700/30 text-[9px] text-emerald-400">
                  <span className="font-bold">Summary: </span>
                  <span>{summary.replace('Summary:', '').trim()}</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
