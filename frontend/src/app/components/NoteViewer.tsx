import { useState, useEffect, useRef, useCallback } from 'react';
import { useNotes, Note } from '../../context/NotesContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { syncUpdateNote, syncDeleteNote, syncFetchNotes, syncCreateNote } from '../../utils/offlineSync';
import {
  SymbolChecklist,
  SymbolTableCells,
  SymbolTextFormat,
  SymbolTrash,
  SymbolSquareAndPencil,
  SymbolSquareAndArrowUp,
  SymbolLockFill,
  SymbolChevronLeft,
  SymbolXmark
} from './SFSymbols';

interface NoteViewerProps {
  mobileView: 'list' | 'editor';
  onMobileViewChange: (v: 'list' | 'editor') => void;
}

function deriveTitle(body: string): string {
  const firstLine = body.split('\n')[0].trim();
  return firstLine.slice(0, 255) || 'New Note';
}

function formatFullTimestamp(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export function NoteViewer({ mobileView, onMobileViewChange }: NoteViewerProps) {
  const { notes, setNotes, selectedNote, setSelectedNote, selectedFolder } = useNotes();
  const { addToast } = useToast();
  const { user, logout } = useAuth();

  const [title, setTitle] = useState('');
  const [restBody, setRestBody] = useState('');
  const [isFormatOpen, setIsFormatOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);
  const formatDropdownRef = useRef<HTMLDivElement>(null);

  // Sync state with selectedNote
  useEffect(() => {
    const fullBody = selectedNote?.body ?? '';
    const newlineIdx = fullBody.indexOf('\n');
    if (newlineIdx === -1) {
      setTitle(fullBody);
      setRestBody('');
    } else {
      setTitle(fullBody.slice(0, newlineIdx));
      setRestBody(fullBody.slice(newlineIdx + 1));
    }
  }, [selectedNote?.id]);

  // Click outside format dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (formatDropdownRef.current && !formatDropdownRef.current.contains(e.target as Node)) {
        setIsFormatOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getFullBody = useCallback((t: string, r: string) => {
    return r ? `${t}\n${r}` : t;
  }, []);

  const saveNote = useCallback(async (noteId: string, noteBody: string, revision: number) => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    try {
      const updated = await syncUpdateNote(noteId, noteBody, revision);
      const folderId = selectedFolder === 'All iCloud' ? undefined : selectedFolder;
      const refreshedNotes = await syncFetchNotes(folderId);
      if (refreshedNotes && refreshedNotes.length > 0) {
        setNotes(refreshedNotes);
      } else {
        setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
      }
      setSelectedNote(updated);
    } catch {
      // Local fallback
      setNotes((prev) => {
        const next = prev.map((n) =>
          n.id === noteId
            ? { ...n, body: noteBody, title: deriveTitle(noteBody), updatedAt: new Date().toISOString() }
            : n
        );
        try {
          localStorage.setItem('vpple_cached_notes', JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    } finally {
      isSavingRef.current = false;
    }
  }, [selectedFolder, setNotes, setSelectedNote]);

  const scheduleSave = useCallback((fullBody: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (selectedNote) {
        saveNote(selectedNote.id, fullBody, selectedNote.revision || 1);
      }
    }, 600);
  }, [saveNote, selectedNote]);

  const handleTitleChange = (newTitle: string) => {
    if (newTitle.includes('\n')) return;
    setTitle(newTitle);
    const fullBody = getFullBody(newTitle, restBody);
    const derived = deriveTitle(fullBody);
    if (selectedNote) {
      setSelectedNote({ ...selectedNote, body: fullBody, title: derived });
      scheduleSave(fullBody);
    }
  };

  const handleRestBodyChange = (newRestBody: string) => {
    setRestBody(newRestBody);
    const fullBody = getFullBody(title, newRestBody);
    if (selectedNote) {
      setSelectedNote({ ...selectedNote, body: fullBody });
      scheduleSave(fullBody);
    }
  };

  const handleCreateNote = async () => {
    try {
      const folderId = selectedFolder === 'All iCloud' ? null : selectedFolder;
      const newNote = await syncCreateNote('New Note\n', folderId);
      setNotes((prev) => [newNote, ...prev]);
      setSelectedNote(newNote);
      localStorage.setItem('selectedNoteId', newNote.id);
      setTimeout(() => titleRef.current?.focus(), 50);
    } catch {
      const localNote: Note = {
        id: `note-${Date.now()}`,
        title: 'New Note',
        body: 'New Note\n',
        revision: 1,
        folderId: selectedFolder === 'All iCloud' ? null : selectedFolder,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes((prev) => [localNote, ...prev]);
      setSelectedNote(localNote);
      localStorage.setItem('selectedNoteId', localNote.id);
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;
    if (!window.confirm('Delete this note?')) return;
    try {
      await syncDeleteNote(selectedNote.id);
    } catch {
      // offline delete
    }
    const remaining = notes.filter((n) => n.id !== selectedNote.id);
    setNotes(remaining);
    setSelectedNote(remaining.length > 0 ? remaining[0] : null);
    try {
      localStorage.setItem('vpple_cached_notes', JSON.stringify(remaining));
    } catch {
      // ignore
    }
  };

  // Insert Checklist Item
  const insertChecklist = () => {
    const checklistTemplate = `\n[ ] `;
    setRestBody((prev) => {
      const updated = prev + checklistTemplate;
      const full = getFullBody(title, updated);
      scheduleSave(full);
      return updated;
    });
    setTimeout(() => bodyRef.current?.focus(), 50);
  };

  // Insert Table Template
  const insertTable = () => {
    const tableTemplate = `\n| Column 1 | Column 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n`;
    setRestBody((prev) => {
      const updated = prev + tableTemplate;
      const full = getFullBody(title, updated);
      scheduleSave(full);
      return updated;
    });
    setTimeout(() => bodyRef.current?.focus(), 50);
  };

  // Keyboard Shortcuts: Cmd+N (New Note), Shift+Cmd+L (Checklist), Opt+Cmd+T (Table)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleCreateNote();
      } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        insertChecklist();
      } else if ((e.metaKey || e.altKey) && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        insertTable();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCreateNote, insertChecklist, insertTable]);

  return (
    <main
      className={`${
        mobileView === 'list' ? 'hidden md:flex' : 'flex'
      } flex-col flex-1 bg-[#1e1e1e] h-full overflow-hidden select-text`}
    >
      {/* Apple Notes Top Action Toolbar */}
      <header className="h-12 px-4 border-b border-white/10 flex items-center justify-between select-none bg-[#262626]/80 backdrop-blur-md z-20">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onMobileViewChange('list')}
            className="md:hidden p-1.5 text-[#e5a00d] hover:bg-white/5 rounded-md cursor-pointer"
            title="Back to Notes"
          >
            <SymbolChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleDeleteNote}
            disabled={!selectedNote}
            className="p-1.5 text-[#86868b] hover:text-[#ff453a] hover:bg-white/5 rounded-md cursor-pointer disabled:opacity-30"
            title="Delete Note"
          >
            <SymbolTrash className="w-4 h-4" />
          </button>
        </div>

        {/* Center Formatting Controls */}
        <div className="flex items-center gap-1">
          {/* Checklist Button */}
          <button
            type="button"
            onClick={insertChecklist}
            className="p-1.5 text-[#86868b] hover:text-[#e5a00d] hover:bg-white/5 rounded-md transition-colors cursor-pointer"
            title="Checklist (⇧⌘L)"
          >
            <SymbolChecklist className="w-4 h-4" />
          </button>

          {/* Table Button */}
          <button
            type="button"
            onClick={insertTable}
            className="p-1.5 text-[#86868b] hover:text-[#e5a00d] hover:bg-white/5 rounded-md transition-colors cursor-pointer"
            title="Insert Table (⌥⌘T)"
          >
            <SymbolTableCells className="w-4 h-4" />
          </button>

          {/* Typography Format Dropdown */}
          <div className="relative" ref={formatDropdownRef}>
            <button
              type="button"
              onClick={() => setIsFormatOpen(!isFormatOpen)}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isFormatOpen
                  ? 'bg-white/10 text-[#e5a00d]'
                  : 'text-[#86868b] hover:text-[#e5a00d] hover:bg-white/5'
              }`}
              title="Text Styles (Aa)"
            >
              <SymbolTextFormat className="w-4 h-4" />
            </button>

            {isFormatOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 bg-[#2c2c2e] border border-white/10 rounded-xl shadow-2xl p-1.5 z-50">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormatOpen(false);
                    titleRef.current?.focus();
                  }}
                  className="w-full text-left px-3 py-1.5 text-[15px] font-bold text-white hover:bg-white/10 rounded-md"
                >
                  Title
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormatOpen(false);
                    setRestBody((prev) => prev + '\n## Heading\n');
                  }}
                  className="w-full text-left px-3 py-1.5 text-[14px] font-semibold text-white hover:bg-white/10 rounded-md"
                >
                  Heading
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormatOpen(false);
                    setRestBody((prev) => prev + '\n### Subheading\n');
                  }}
                  className="w-full text-left px-3 py-1.5 text-[13px] font-medium text-white hover:bg-white/10 rounded-md"
                >
                  Subheading
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormatOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-[13px] text-[#86868b] hover:bg-white/10 rounded-md"
                >
                  Body
                </button>
                <div className="border-t border-white/10 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setIsFormatOpen(false);
                    setRestBody((prev) => prev + '\n`code`\n');
                  }}
                  className="w-full text-left px-3 py-1.5 text-[12.5px] font-mono text-[#ff9f0a] hover:bg-white/10 rounded-md"
                >
                  Monospaced
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5">
          {/* Lock Note */}
          <button
            type="button"
            onClick={() => {
              setIsLocked(!isLocked);
              addToast(isLocked ? 'Note unlocked' : 'Note locked', 'info');
            }}
            className={`p-1.5 rounded-md cursor-pointer ${
              isLocked ? 'text-[#e5a00d]' : 'text-[#86868b] hover:text-white hover:bg-white/5'
            }`}
            title="Lock Note"
          >
            <SymbolLockFill className="w-4 h-4" />
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="p-1.5 text-[#86868b] hover:text-white hover:bg-white/5 rounded-md cursor-pointer"
            title="Share Note"
          >
            <SymbolSquareAndArrowUp className="w-4 h-4" />
          </button>

          {/* New Note Button */}
          <button
            type="button"
            onClick={handleCreateNote}
            className="p-1.5 text-[#e5a00d] hover:bg-white/5 rounded-md cursor-pointer ml-1"
            title="New Note (⌘N)"
          >
            <SymbolSquareAndPencil className="w-4 h-4" />
          </button>

          {/* Account Profile Avatar */}
          <div className="relative ml-1">
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-7 h-7 rounded-full bg-[#3a3a3c] border border-white/10 flex items-center justify-center text-[11px] font-semibold text-white/90 cursor-pointer hover:border-[#e5a00d] transition-colors"
              title="Account"
            >
              {user?.pictureUrl ? (
                <img src={user.pictureUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span>{user?.name ? user.name[0].toUpperCase() : 'V'}</span>
              )}
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#2c2c2e] border border-white/10 rounded-xl shadow-2xl p-2 z-50">
                <div className="px-2 py-1.5 border-b border-white/10 mb-1">
                  <div className="text-[13px] font-semibold text-white truncate">{user?.name || 'Vpple Account'}</div>
                  <div className="text-[11px] text-[#86868b] truncate">{user?.email || 'Local Storage Session'}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-2 py-1.5 text-[12px] text-[#ff453a] hover:bg-white/5 rounded-md cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Editor Surface */}
      <div className="flex-1 overflow-y-auto px-6 py-6 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          {selectedNote ? (
            <>
              {/* Centered Date Timestamp */}
              <div className="text-center text-[12px] font-medium text-[#86868b] mb-6 select-none">
                {formatFullTimestamp(selectedNote.updatedAt || selectedNote.createdAt)}
              </div>

              {/* Title Textarea */}
              <textarea
                ref={titleRef}
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    bodyRef.current?.focus();
                  }
                }}
                placeholder="Title"
                rows={1}
                className="w-full bg-transparent text-[#f5f5f7] text-3xl font-bold leading-tight resize-none outline-none placeholder:text-[#636366] mb-3 overflow-hidden font-sans tracking-tight"
                spellCheck={false}
              />

              {/* Body Textarea */}
              <textarea
                ref={bodyRef}
                value={restBody}
                onChange={(e) => handleRestBodyChange(e.target.value)}
                placeholder="Start typing..."
                className="w-full min-h-[380px] bg-transparent text-[#e5e5ea] text-[15px] leading-relaxed resize-none outline-none placeholder:text-[#636366] font-sans"
                spellCheck={false}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-[#86868b] select-none text-center">
              <SymbolSquareAndPencil className="w-12 h-12 text-[#636366] mb-3 opacity-60" />
              <p className="text-[14px]">No Note Selected</p>
              <button
                type="button"
                onClick={handleCreateNote}
                className="mt-3 text-[#e5a00d] text-[13px] font-semibold hover:underline"
              >
                Create a Note
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Share Dialog */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#2c2c2e] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-[16px] font-semibold">Share Note</h3>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="text-[#86868b] hover:text-white"
              >
                <SymbolXmark className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[#86868b] text-[13px] mb-4">
              Collaborate or send a copy of this note.
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(selectedNote?.body || '');
                  addToast('Note content copied to clipboard', 'success');
                  setIsShareModalOpen(false);
                }}
                className="w-full py-2 bg-[#e5a00d] text-white rounded-lg text-[13px] font-semibold hover:bg-[#d4940c] transition-colors"
              >
                Copy Note Text
              </button>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="w-full py-2 bg-white/5 text-[#f5f5f7] rounded-lg text-[13px] hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
