import { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Send,
  Trash2,
  EyeOff,
  Shield,
  Heart,
  Flame,
  Laugh,
  Sparkles,
  Play,
  Pause
} from 'lucide-react';
import { StoryItem } from '../types';
import { messagingRepository } from '../services/messagingRepository';
import { CURRENT_USER_ID } from '../data/mockMessagingData';

interface StoryViewerModalProps {
  stories: StoryItem[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const QUICK_REACTIONS = ['🔥', '❤️', '👏', '😂', '⚡', '🎉'];

export function StoryViewerModal({
  stories,
  initialIndex = 0,
  isOpen,
  onClose,
  isDark
}: StoryViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showViewersDrawer, setShowViewersDrawer] = useState(false);
  const [floatingReaction, setFloatingReaction] = useState<string | null>(null);
  const [replySentToast, setReplySentToast] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
    setShowViewersDrawer(false);
  }, [initialIndex, isOpen]);

  const currentStory = stories[currentIndex];

  // Mark as viewed if not self
  useEffect(() => {
    if (isOpen && currentStory && !currentStory.isSelf) {
      messagingRepository.viewStory(currentStory.id, {
        userId: CURRENT_USER_ID,
        name: 'You',
        avatar: 'ME',
        viewedAt: 'Just now'
      });
    }
  }, [isOpen, currentIndex, currentStory]);

  // Story progress timer
  useEffect(() => {
    if (!isOpen || isPaused || showViewersDrawer) return;

    const stepMs = 50;
    const totalDurationMs = 5000;
    const increment = (stepMs / totalDurationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => clearInterval(timer);
  }, [isOpen, isPaused, currentIndex, showViewersDrawer, stories.length]);

  if (!isOpen || !currentStory) return null;

  const handleNext = () => {
    setProgress(0);
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    setProgress(0);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSendReaction = (emoji: string) => {
    messagingRepository.reactToStory(currentStory.id, emoji);
    setFloatingReaction(emoji);
    setTimeout(() => setFloatingReaction(null), 1200);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    // Send reply as DM to story author
    const authorChats = messagingRepository.getChats();
    const directChat = authorChats.find(
      (c) =>
        !c.isGroup &&
        c.participants.some(
          (p) => p.id === currentStory.authorId || p.name === currentStory.authorName
        )
    );

    if (directChat) {
      messagingRepository.sendMessage({
        chatId: directChat.id,
        content: `Replied to your story: "${replyText.trim()}"`,
        type: 'text'
      });
    }

    setReplyText('');
    setReplySentToast(true);
    setTimeout(() => setReplySentToast(false), 2000);
  };

  const handleDelete = () => {
    messagingRepository.deleteStory(currentStory.id);
    handleNext();
  };

  const handleHide = () => {
    messagingRepository.hideStory(currentStory.id);
    handleNext();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm h-[620px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-slate-800 select-none">
        {/* Background Visual Layer */}
        {currentStory.type === 'text' ? (
          <div
            className={`absolute inset-0 w-full h-full bg-gradient-to-tr ${
              currentStory.bgGradient || 'from-emerald-700 to-cyan-900'
            }`}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-black">
            <img
              src={currentStory.mediaUrl}
              alt="Story"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          </div>
        )}

        {/* Floating animated reaction badge */}
        {floatingReaction && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none animate-bounce text-6xl drop-shadow-xl">
            {floatingReaction}
          </div>
        )}

        {/* TOP CONTROLS */}
        <div className="relative z-20 p-4 space-y-3">
          {/* Segmented Progress Bars */}
          <div className="flex items-center space-x-1 w-full">
            {stories.map((s, idx) => (
              <div
                key={s.id}
                className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{
                    width:
                      idx === currentIndex
                        ? `${progress}%`
                        : idx < currentIndex
                        ? '100%'
                        : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Author Header Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div
                className={`w-9 h-9 rounded-full bg-gradient-to-tr ${currentStory.authorAvatarBg} text-white font-black text-xs flex items-center justify-center ring-2 ring-emerald-400`}
              >
                {currentStory.authorAvatar}
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-white font-bold text-xs drop-shadow-md">
                    {currentStory.authorName}
                  </span>
                  <span className="text-white/70 text-[10px] font-mono">
                    • {currentStory.timeAgo}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-300 font-mono capitalize">
                  {currentStory.privacy} visibility
                </span>
              </div>
            </div>

            {/* Right Tools */}
            <div className="flex items-center space-x-1 text-white">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-full hover:bg-white/20"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>

              {currentStory.isSelf ? (
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-full hover:bg-rose-500/30 text-rose-400"
                  title="Delete story"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleHide}
                  className="p-1.5 rounded-full hover:bg-white/20 text-slate-300"
                  title="Hide story from feed"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* TAP NAVIGATION ZONES */}
        <div className="absolute inset-0 z-10 flex">
          <div
            onClick={handlePrev}
            className="w-1/3 h-full cursor-pointer opacity-0 hover:opacity-10 transition-opacity flex items-center pl-2"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </div>
          <div
            onClick={() => setIsPaused(!isPaused)}
            className="w-1/3 h-full cursor-pointer"
          />
          <div
            onClick={handleNext}
            className="w-1/3 h-full cursor-pointer opacity-0 hover:opacity-10 transition-opacity flex items-center justify-end pr-2"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* CENTER STORY TEXT/CAPTION */}
        <div className="relative z-15 px-6 my-auto text-center pointer-events-none">
          {currentStory.type === 'text' ? (
            <p className="text-white font-black text-xl md:text-2xl leading-relaxed drop-shadow-lg tracking-tight">
              {currentStory.content}
            </p>
          ) : (
            currentStory.content && (
              <div className="inline-block bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                <p className="text-white text-xs font-semibold drop-shadow-md">
                  {currentStory.content}
                </p>
              </div>
            )
          )}
        </div>

        {/* BOTTOM ACTION DOCK */}
        <div className="relative z-20 p-4 space-y-2 bg-gradient-to-t from-black via-black/80 to-transparent">
          {/* Reaction Bar & Views Counter */}
          <div className="flex items-center justify-between">
            {/* View count */}
            {currentStory.isSelf ? (
              <button
                onClick={() => setShowViewersDrawer(true)}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold hover:bg-white/30 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentStory.viewCount} views</span>
              </button>
            ) : (
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/40 text-white/80 text-[11px] font-medium">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>{currentStory.viewCount} views</span>
              </div>
            )}

            {/* Quick emoji reaction buttons */}
            <div className="flex items-center space-x-1.5">
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleSendReaction(emoji)}
                  className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-sm active:scale-125 transition-transform cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Reply Input (For peers) */}
          {!currentStory.isSelf && (
            <form onSubmit={handleSendReply} className="flex items-center space-x-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${currentStory.authorName}...`}
                className="flex-1 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium placeholder-white/60 outline-none border border-white/20 focus:border-emerald-400"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="w-8 h-8 rounded-full bg-emerald-400 text-black flex items-center justify-center disabled:opacity-40 hover:brightness-110 cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          {replySentToast && (
            <div className="text-center text-[10px] font-bold text-emerald-400 py-1">
              Reply sent directly to {currentStory.authorName}!
            </div>
          )}
        </div>

        {/* SELF STORY VIEWERS DRAWER */}
        {showViewersDrawer && (
          <div className="absolute inset-x-0 bottom-0 max-h-72 rounded-t-3xl bg-[#0E131F] border-t border-slate-700 p-4 z-40 overflow-y-auto space-y-3 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Story Viewers ({currentStory.viewers.length})</span>
              </div>
              <button
                onClick={() => setShowViewersDrawer(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {currentStory.viewers.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                No friends have viewed this aura yet.
              </p>
            ) : (
              <div className="space-y-2">
                {currentStory.viewers.map((viewer, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-white font-bold flex items-center justify-center text-[10px]">
                        {viewer.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-white">{viewer.name}</p>
                        <p className="text-[10px] text-slate-400">{viewer.viewedAt}</p>
                      </div>
                    </div>
                    {viewer.reaction && (
                      <span className="text-base">{viewer.reaction}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
