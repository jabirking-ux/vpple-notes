import { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { googleAuth } from '../../utils/api';
import { SymbolVpplePeach } from './SFSymbols';

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
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleContinueLocal = () => {
    login('local-token', {
      id: 'local-user',
      name: 'Vpple User',
      email: null,
      pictureUrl: null,
    });
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
    if (!clientId) {
      // Offline / Local mode without OAuth alert spam
      return;
    }

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
            handleContinueLocal();
          }
        },
      });

      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'filled_black',
          size: 'large',
          width: 220,
        });
      }
    };

    init();
  }, [login]);

  return (
    <div className="relative min-h-screen bg-[#1c1c1e] flex flex-col items-center justify-center px-6 select-none">
      {/* Top Left Vpple Branding */}
      <div className="absolute top-5 left-6 flex items-center gap-2">
        <SymbolVpplePeach className="w-5 h-5 text-white/80" />
        <span className="text-white/90 text-sm font-medium tracking-wide">Vpple iCloud</span>
      </div>

      <div className="flex flex-col items-center text-center max-w-sm">
        {/* Apple Notes Icon with Golden Gradient */}
        <div
          className="w-24 h-24 rounded-[22px] flex flex-col justify-center items-center gap-2 shadow-2xl relative overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #ffd60a 0%, #d48806 100%)' }}
        >
          {/* Top amber strip */}
          <div className="w-16 h-3 bg-[#ffeaa0] rounded-sm opacity-90 shadow-sm" />
          {/* Lined paper lines */}
          <div className="flex flex-col gap-1.5 w-14">
            <div className="h-0.5 bg-[#7c4d00] rounded-full opacity-60" />
            <div className="h-0.5 bg-[#7c4d00] rounded-full opacity-60" />
            <div className="h-0.5 bg-[#7c4d00] rounded-full opacity-60" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-7 text-white font-bold tracking-tight text-4xl">
          Notes
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-[#86868b] text-[15px] leading-relaxed">
          Capture thoughts, checklists, and rich tables. Your notes are stored securely and remain accessible offline.
        </p>

        {/* Action Controls */}
        <div className="mt-8 flex flex-col items-center gap-3 w-full">
          <button
            type="button"
            onClick={handleContinueLocal}
            className="w-[220px] h-[44px] bg-[#e5a00d] hover:bg-[#d4940c] text-white font-semibold text-[14px] rounded-xl flex items-center justify-center transition-colors shadow-lg cursor-pointer"
          >
            Open Notes
          </button>

          {/* Optional OAuth Container if VITE_GOOGLE_CLIENT_ID exists */}
          <div ref={buttonRef} className="w-[220px] flex justify-center" />
        </div>
      </div>
    </div>
  );
}
