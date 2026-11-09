import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { googleAuth } from '../../utils/api';
import { SymbolVpplePeach, SymbolChevronRight, SymbolXmark, SymbolLockFill } from './SFSymbols';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse-tracking for dynamic Snell's Law specular sheen
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      containerRef.current.style.setProperty('--liquid-mx', `${x.toFixed(1)}%`);
      containerRef.current.style.setProperty('--liquid-my', `${y.toFixed(1)}%`);
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

  const handleCustomSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your Vpple ID or email');
      return;
    }
    const cleanEmail = email.trim();
    const namePart = cleanEmail.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    login(`token-${Date.now()}`, {
      id: `user-${Date.now()}`,
      name: formattedName,
      email: cleanEmail,
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

      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          width: 280,
        });
      }
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
        <button
          type="button"
          onClick={() => setShowSignInModal(true)}
          className="liquid-glass-btn px-4 py-1.5 text-[13px] font-semibold text-white rounded-full flex items-center gap-1.5 cursor-pointer"
        >
          <span>Sign In</span>
        </button>
      </header>

      {/* Hero Liquid Glass Card */}
      <main className="liquid-glass rounded-3xl p-10 max-w-md w-full flex flex-col items-center text-center shadow-2xl relative z-20 mt-8">
        {/* Apple Notes Icon with Golden Gradient */}
        <div
          className="w-24 h-24 rounded-[22px] flex flex-col justify-center items-center gap-2 shadow-2xl relative overflow-hidden transition-transform hover:scale-105"
          style={{
            background: 'linear-gradient(180deg, #ffd60a 0%, #e59714 50%, #b87104 100%)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.7), 0 12px 32px rgba(0, 0, 0, 0.45)'
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
      </main>

      {/* Interactive Apple ID / Vpple ID Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="liquid-glass rounded-2xl max-w-sm w-full p-6 relative shadow-2xl animate-slide-in">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowSignInModal(false)}
              className="absolute top-4 right-4 p-1 text-[#86868b] hover:text-white rounded-full hover:bg-white/10"
              aria-label="Close"
            >
              <SymbolXmark className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <SymbolLockFill className="w-6 h-6 text-[#e5a00d]" />
              </div>
              <h2 className="text-white text-[20px] font-bold">Sign in with Apple ID</h2>
              <p className="text-[#86868b] text-[13px] mt-1">
                Enter your Vpple ID or Apple ID to continue.
              </p>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleCustomSignIn} className="space-y-3">
              <div>
                <input
                  type="text"
                  autoFocus
                  placeholder="Apple ID or Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full bg-[#1c1c1e]/80 border border-white/20 rounded-xl px-3.5 py-2.5 text-white text-[14px] outline-none focus:border-[#e5a00d] transition-colors placeholder:text-[#636366]"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1c1c1e]/80 border border-white/20 rounded-xl px-3.5 py-2.5 text-white text-[14px] outline-none focus:border-[#e5a00d] transition-colors placeholder:text-[#636366]"
                />
              </div>

              {errorMsg && (
                <div className="text-[#ff453a] text-[12px] text-center font-medium">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full h-11 bg-[#e5a00d] hover:bg-[#d4940c] text-white font-semibold text-[14px] rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <span>Continue</span>
                <SymbolChevronRight className="w-4 h-4" />
              </button>
            </form>

            {/* Google OAuth Button Container */}
            <div ref={googleBtnRef} className="mt-4 flex justify-center w-full" />

            {/* Offline Fallback inside Modal */}
            <div className="mt-5 pt-4 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={handleLocalSignIn}
                className="text-[13px] text-[#86868b] hover:text-white transition-colors cursor-pointer"
              >
                Use Local Notes Without Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
