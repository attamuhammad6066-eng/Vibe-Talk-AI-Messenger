import { useState } from 'react';
import { X, UserPlus, Phone, AtSign, User, ArrowLeft } from 'lucide-react';
import { messagingRepository } from '../services/messagingRepository';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export function AddContactModal({ isOpen, onClose, isDark }: AddContactModalProps) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phoneNumber.trim()) return;

    messagingRepository.addContact({
      name: name.trim(),
      username: username.trim() || name.toLowerCase().replace(/\s+/g, '_'),
      phoneNumber: phoneNumber.trim(),
      bio: bio.trim() || 'Connected via VibeTalk AI'
    });

    onClose();
  };

  const isValid = name.trim().length > 0 && phoneNumber.trim().length > 3;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden ${
          isDark
            ? 'bg-[#0E131F] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              onClick={onClose}
              type="button"
              className="p-1 rounded-lg hover:bg-slate-800/20 text-slate-400 hover:text-white transition-colors cursor-pointer mr-1"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <UserPlus className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-xs tracking-tight">Add New Contact</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Full Name *
            </label>
            <div
              className={`flex items-center px-3 py-2 rounded-xl border text-xs ${
                isDark ? 'bg-[#141A28] border-slate-700' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <User className="w-3.5 h-3.5 text-slate-400 mr-2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tariq Mansoor"
                className="w-full bg-transparent outline-none font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Phone Number *
            </label>
            <div
              className={`flex items-center px-3 py-2 rounded-xl border text-xs ${
                isDark ? 'bg-[#141A28] border-slate-700' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-slate-400 mr-2" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-transparent outline-none font-semibold font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Username Handle (Optional)
            </label>
            <div
              className={`flex items-center px-3 py-2 rounded-xl border text-xs ${
                isDark ? 'bg-[#141A28] border-slate-700' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <AtSign className="w-3.5 h-3.5 text-emerald-400 mr-2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="tariq_dev"
                className="w-full bg-transparent outline-none font-semibold font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Bio / Note
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Friend from AM Digital Hub"
              className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                isDark ? 'bg-[#141A28] border-slate-700' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-black hover:brightness-105 disabled:opacity-40 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              Save Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
