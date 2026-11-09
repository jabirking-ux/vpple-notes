import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { googleAuth } from '../../utils/api';
import { SymbolVpplePeach } from './SFSymbols';
import { LiquidGlassButton, LiquidGlassSurface } from './LiquidGlassContainer';
import { SignInModal } from './SignInModal';

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            config: { theme: string; size: string; width: number }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export function LoginScreen() {
  const { login } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse-tracking for dynamic Kyant0 InteractiveHighlight specular sheen
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = ((e.clientX / window.innerWidth) * 100).toFixed(1);
      const y = ((e.clientY / window.innerHeight) * 100).toFixed(1);
      document.documentElement.style.setProperty('--lx', `${x}%`);
      document.documentElement.style.setProperty('--ly', `${y}%`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLocalSignIn = () => {
    login('local-token', {
      id: 'local-user',
      name: 'Vpple User',
      email: null,
      pictureUrl: null,
    });
  };

  const handleCustomSignIn = (email: string, name: string) => {
    login(`token-${Date.now()}`, {
      id: `user-${Date.now()}`,
      name,
      email,
      pictureUrl: null,
    });
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
    if (!clientId) return;

    const init = () => {
      if (!window.google?.accounts?.id) {
        setTimeout(init, 100);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential: string }) => {
          try {
            const { token, user } = await googleAuth(response.credential);
            login(token, user);
          } catch (err: any) {
            console.error('Sign-in failed:', err);
            handleLocalSignIn();
          }
        },
      });
    };

    init();
  }, [login]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#1c1c1e] flex flex-col items-center justify-center px-6 select-none overflow-hidden"
    >
      {/* Top Left Global Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 h-12 px-6 flex items-center justify-between z-30 border-b border-white/5 bg-[#1c1c1e]/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <SymbolVpplePeach className="w-5 h-5 text-white/90" />
          <span className="text-white text-[13px] font-semibold tracking-wide">iCloud Notes</span>
        </div>
        <LiquidGlassButton
          type="button"
          onClick={() => setShowSignInModal(true)}
          className="px-4 py-1.5 text-[13px] font-semibold text-white"
        >
          <span>Sign In</span>
        </LiquidGlassButton>
      </header>

      {/* Hero Liquid Glass Surface Card */}
      <LiquidGlassSurface className="rounded-3xl p-10 max-w-md w-full flex flex-col items-center text-center shadow-2xl relative z-20 mt-8">
        {/* Apple Notes Icon with Golden Gradient */}
        <div
          className="w-24 h-24 rounded-[22px] flex flex-col justify-center items-center gap-2 shadow-2xl relative overflow-hidden transition-transform hover:scale-105"
          style={{
            background: 'linear-gradient(180deg, #ffd60a 0%, #e59714 50%, #b87104 100%)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.7), 0 12px 32px rgba(0, 0, 0, 0.45)',
          }}
        >
          {/* Top light strip */}
          <div className="w-16 h-3 bg-[#fff3bf] rounded-sm opacity-95 shadow-sm" />

          {/* Lined paper lines */}
          <div className="flex flex-col gap-1.5 w-14">
            <div className="h-0.5 bg-[#6b4100] rounded-full opacity-65" />
            <div className="h-0.5 bg-[#6b4100] rounded-full opacity-65" />
            <div className="h-0.5 bg-[#6b4100] rounded-full opacity-65" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-white font-bold tracking-tight text-4xl">
          Notes
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-[#a1a1a6] text-[15px] leading-relaxed max-w-xs">
          Capture thoughts, create checklists, and organize ideas. Your notes stay up to date on all your devices.
        </p>

        {/* Prominent Official Apple "Sign In" Button */}
        <div className="mt-8 flex flex-col items-center gap-3 w-full">
          <button
            type="button"
            onClick={() => setShowSignInModal(true)}
            className="w-[260px] h-[46px] bg-white hover:bg-[#f2f2f7] text-[#1c1c1e] font-semibold text-[15px] rounded-full flex items-center justify-center transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Sign In
          </button>

          {/* Quick Offline / Guest Access */}
          <button
            type="button"
            onClick={handleLocalSignIn}
            className="text-[13px] text-[#e5a00d] hover:text-[#ffc519] transition-colors mt-2 cursor-pointer font-medium"
          >
            Continue with Local Notes &rsaquo;
          </button>
        </div>
      </LiquidGlassSurface>

      {/* Shared Interactive Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignIn={handleCustomSignIn}
      />
    </div>
  );
}
