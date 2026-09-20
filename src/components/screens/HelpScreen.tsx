import { ArrowLeft, BookOpen, MessageCircle, HelpCircle, CheckCircle } from 'lucide-react';

interface HelpScreenProps {
  isDark: boolean;
  onBack: () => void;
}

const FAQS = [
  {
    q: 'How does the Room database cache messages?',
    a: 'VibeTalk uses Room DAO entities (MessageEntity, ChatEntity) with Kotlin Flow streams. All messages are stored locally first, providing instant offline reads and automatic background synchronization.'
  },
  {
    q: 'How do reactions, pin, and star work?',
    a: 'Tap on any message bubble to open the contextual action bar. You can add reaction emojis (❤️, 👍, 🔥, etc.), pin important items to the top header banner, star messages, edit sent text, or delete for me / for everyone.'
  },
  {
    q: 'What message attachments are supported?',
    a: 'VibeTalk Phase 2 supports Text, Emojis, High-Res Images, Video previews, Documents (PDF/Doc/Zip), Audio tracks, and recorded Voice Notes.'
  },
  {
    q: 'What do the message delivery checkmarks mean?',
    a: 'Single checkmark = Sent to server. Double gray checkmarks = Delivered to recipient device. Double emerald checkmarks = Read by recipient. Red exclamation = Failed with instant retry action.'
  }
];

export function HelpScreen({ isDark, onBack }: HelpScreenProps) {
  return (
    <div
      className={`h-full w-full flex flex-col justify-between select-none overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#0A0D14] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      <div
        className={`px-4 py-3 border-b flex items-center space-x-2.5 ${
          isDark ? 'bg-[#0F141C] border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <button
          onClick={onBack}
          className={`w-7 h-7 rounded-xl flex items-center justify-center border cursor-pointer ${
            isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h3 className="text-sm font-black">Help & Architecture Guide</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
          <div className="flex items-center space-x-2 mb-1">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-black text-emerald-400">Phase 2 Messaging Engine</h4>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Real-time messaging architecture with one-to-one chats, groups, multimedia attachments, voice notes, message states, reactions, reply, forward, edit, delete, pin, star, and Room caching.
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Frequently Asked Questions
          </span>

          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl border space-y-1.5 ${
                isDark ? 'bg-[#121824] border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start space-x-2">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <h5 className="text-xs font-bold leading-tight">{faq.q}</h5>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
