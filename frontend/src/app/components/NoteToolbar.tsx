import React, { useRef, useState, useEffect } from 'react';
import {
  SymbolChevronLeft,
  SymbolTrash,
  SymbolChecklist,
  SymbolTableCells,
  SymbolTextFormat,
  SymbolLockFill,
  SymbolSquareAndArrowUp,
  SymbolSquareAndPencil,
  SymbolVpplePeach,
} from './SFSymbols';
import { LiquidGlassButton, LiquidGlassSurface } from './LiquidGlassContainer';
import { TextFormatMenu } from './TextFormatMenu';
import { AuthUser } from '../../context/AuthContext';

interface NoteToolbarProps {
  onBackMobile: () => void;
  onDeleteNote: () => void;
  isNoteSelected: boolean;
  onInsertChecklist: () => void;
  onInsertTable: () => void;
  onApplyFormat: (prefix: string, suffix?: string) => void;
  onFocusTitle: () => void;
  isLocked: boolean;
  onToggleLock: () => void;
  onOpenShare: () => void;
  isEditing: boolean;
  onDoneEditing: () => void;
  onCreateNote: () => void;
  user: AuthUser | null;
  onOpenSignIn: () => void;
  onLogout: () => void;
}

export const NoteToolbar: React.FC<NoteToolbarProps> = ({
  onBackMobile,
  onDeleteNote,
  isNoteSelected,
  onInsertChecklist,
  onInsertTable,
  onApplyFormat,
  onFocusTitle,
  isLocked,
  onToggleLock,
  onOpenShare,
  isEditing,
  onDoneEditing,
  onCreateNote,
  user,
  onOpenSignIn,
  onLogout,
}) => {
  const [isFormatOpen, setIsFormatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const formatRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formatRef.current && !formatRef.current.contains(e.target as Node)) {
        setIsFormatOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isGuest = !user?.email;

  return (
    <header className="liquid-glass-toolbar h-12 px-4 flex items-center justify-between select-none z-20">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBackMobile}
          className="md:hidden p-1.5 text-[#e5a00d] hover:bg-white/10 rounded-md cursor-pointer transition-colors"
          title="Back to Notes"
        >
          <SymbolChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onDeleteNote}
          disabled={!isNoteSelected}
          className="p-1.5 text-[#86868b] hover:text-[#ff453a] hover:bg-white/10 rounded-md cursor-pointer disabled:opacity-30 transition-colors"
          title="Delete Note"
        >
          <SymbolTrash className="w-4 h-4" />
        </button>
      </div>

      {/* Center Section: Formatting Controls */}
      <div className="flex items-center gap-1.5">
        <LiquidGlassButton
          type="button"
          onClick={onInsertChecklist}
          className="p-1.5 text-[#86868b] hover:text-[#e5a00d] rounded-md transition-colors cursor-pointer"
          title="Checklist (Shift+Cmd+L)"
        >
          <SymbolChecklist className="w-4 h-4" />
        </LiquidGlassButton>

        <LiquidGlassButton
          type="button"
          onClick={onInsertTable}
          className="p-1.5 text-[#86868b] hover:text-[#e5a00d] rounded-md transition-colors cursor-pointer"
          title="Insert Table (Option+Cmd+T)"
        >
          <SymbolTableCells className="w-4 h-4" />
        </LiquidGlassButton>

        <div className="relative" ref={formatRef}>
          <LiquidGlassButton
            type="button"
            onClick={() => setIsFormatOpen(!isFormatOpen)}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isFormatOpen ? 'text-[#e5a00d] border-[#e5a00d]/50' : 'text-[#86868b] hover:text-[#e5a00d]'
            }`}
            title="Text Styles (Aa)"
          >
            <SymbolTextFormat className="w-4 h-4" />
          </LiquidGlassButton>

          <TextFormatMenu
            isOpen={isFormatOpen}
            onClose={() => setIsFormatOpen(false)}
            onApplyFormat={onApplyFormat}
            onFocusTitle={onFocusTitle}
          />
        </div>
      </div>

      {/* Right Section: Actions & Account */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleLock}
          className={`p-1.5 rounded-md cursor-pointer transition-colors ${
            isLocked ? 'text-[#e5a00d]' : 'text-[#86868b] hover:text-white hover:bg-white/10'
          }`}
          title={isLocked ? 'Unlock Note' : 'Lock Note'}
        >
          <SymbolLockFill className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onOpenShare}
          className="p-1.5 text-[#86868b] hover:text-white hover:bg-white/10 rounded-md cursor-pointer transition-colors"
          title="Share Note"
        >
          <SymbolSquareAndArrowUp className="w-4 h-4" />
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onDoneEditing}
            className="px-3 py-1 text-[13px] font-semibold text-[#e5a00d] hover:text-[#f5b800] rounded-md transition-colors cursor-pointer mr-1"
          >
            Done
          </button>
        )}

        <LiquidGlassButton
          type="button"
          onClick={onCreateNote}
          className="p-1.5 text-[#e5a00d] rounded-md cursor-pointer"
          title="New Note (Cmd+N)"
        >
          <SymbolSquareAndPencil className="w-4 h-4" />
        </LiquidGlassButton>

        {isGuest ? (
          <LiquidGlassButton
            type="button"
            onClick={onOpenSignIn}
            className="px-3.5 py-1 text-[12.5px] font-semibold text-white rounded-full flex items-center gap-1.5 cursor-pointer ml-1 hover:border-[#e5a00d]"
            title="Sign in with Apple ID"
          >
            <SymbolVpplePeach className="w-3.5 h-3.5 text-[#e5a00d]" />
            <span>Sign In</span>
          </LiquidGlassButton>
        ) : (
          <div className="relative ml-1" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-7 h-7 rounded-full bg-[#3a3a3c] border border-white/20 flex items-center justify-center text-[11px] font-semibold text-white cursor-pointer hover:border-[#e5a00d] transition-colors"
              title="Account Settings"
            >
              {user?.pictureUrl ? (
                <img src={user.pictureUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span>{user?.name ? user.name[0].toUpperCase() : 'V'}</span>
              )}
            </button>

            {profileOpen && (
              <LiquidGlassSurface className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl p-2 z-50 animate-slide-in">
                <div className="px-2 py-1.5 border-b border-white/10 mb-1">
                  <div className="text-[13px] font-semibold text-white truncate">{user?.name || 'Vpple Account'}</div>
                  <div className="text-[11px] text-[#86868b] truncate">{user?.email || 'Authenticated'}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-2 py-1.5 text-[12px] text-[#ff453a] hover:bg-white/10 rounded-md cursor-pointer transition-colors"
                >
                  Sign Out
                </button>
              </LiquidGlassSurface>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
