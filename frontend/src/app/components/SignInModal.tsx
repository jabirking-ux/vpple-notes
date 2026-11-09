import React, { useState } from 'react';
import { SymbolLockFill, SymbolXmark, SymbolChevronRight } from './SFSymbols';
import { LiquidGlassSurface } from './LiquidGlassContainer';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string, name: string) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim();
    if (!clean) {
      setErrorMsg('Please enter your Vpple ID or email address');
      return;
    }

    const namePart = clean.split('@')[0];
    const formatted = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    onSignIn(clean, formatted);
    setEmail('');
    setPassword('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <LiquidGlassSurface className="rounded-2xl max-w-sm w-full p-6 relative shadow-2xl animate-slide-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#86868b] hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <SymbolXmark className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
            <SymbolLockFill className="w-6 h-6 text-[#e5a00d]" />
          </div>
          <h2 className="text-white text-[20px] font-bold tracking-tight">Sign in with Apple ID</h2>
          <p className="text-[#86868b] text-[13px] mt-1 leading-normal">
            Use your Apple ID or Vpple account to sync notes across devices.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 text-center text-xs text-[#ff453a] bg-[#ff453a]/10 py-1.5 px-3 rounded-lg border border-[#ff453a]/20">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            autoFocus
            placeholder="Apple ID or Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            className="w-full bg-[#1c1c1e]/90 border border-white/20 rounded-xl px-3.5 py-2.5 text-white text-[14px] outline-none focus:border-[#e5a00d] placeholder:text-[#636366] transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#1c1c1e]/90 border border-white/20 rounded-xl px-3.5 py-2.5 text-white text-[14px] outline-none focus:border-[#e5a00d] placeholder:text-[#636366] transition-colors"
          />
          <button
            type="submit"
            className="w-full h-11 bg-[#e5a00d] hover:bg-[#d4940c] text-white font-semibold text-[14px] rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
          >
            <span>Sign In</span>
            <SymbolChevronRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => {
              onSignIn('guest@vpple.local', 'Guest User');
              onClose();
            }}
            className="text-[12px] text-[#86868b] hover:text-[#e5a00d] transition-colors cursor-pointer"
          >
            Continue as Local Guest
          </button>
        </div>
      </LiquidGlassSurface>
    </div>
  );
};
