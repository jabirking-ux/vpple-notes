import { useState, useEffect, useRef, useCallback } from 'react';
import { useNotes, Note } from '../../context/NotesContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { syncUpdateNote, syncDeleteNote, syncFetchNotes, syncCreateNote } from '../../utils/offlineSync';
import { NoteToolbar } from './NoteToolbar';
import { NoteEditorCanvas } from './NoteEditorCanvas';
import { SignInModal } from './SignInModal';
import { ShareModal } from './ShareModal';

interface NoteViewerProps {
  mobileView: 'list' | 'editor';
  onMobileViewChange: (v: 'list' | 'editor') => void;
}

function deriveTitle(body: string): string {
  const firstLine = body.split('\n')[0].trim();
  return firstLine.slice(0, 255) || 'New Note';
}

export function NoteViewer({ mobileView, onMobileViewChange }: NoteViewerProps) {
  const { setNotes, selectedNote, setSelectedNote, selectedFolder } = useNotes();
  const { addToast } = useToast();
  const { user, login, logout } = useAuth();

  const [title, setTitle] = useState('');
  const [restBody, setRestBody] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);

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
    setIsEditing(false);
  }, [selectedNote?.id]);

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
      setNotes(refreshedNotes);
      setSelectedNote(updated);
    } catch {
      // offline fallback
      setNotes((prev: Note[]) =>
        prev.map((n) =>
          n.id === noteId
            ? {
                ...n,
                title: deriveTitle(noteBody),
                body: noteBody,
                updatedAt: new Date().toISOString(),
                revision: (n.revision || 0) + 1,
              }
            : n
        )
      );
    } finally {
      isSavingRef.current = false;
    }
  }, [selectedFolder, setNotes, setSelectedNote]);

  const scheduleSave = useCallback(
    (newBody: string) => {
      if (!selectedNote) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        saveNote(selectedNote.id, newBody, selectedNote.revision || 1);
      }, 500);
    },
    [selectedNote, saveNote]
  );

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    const full = getFullBody(newTitle, restBody);
    scheduleSave(full);
  };

  const handleRestBodyChange = (newRest: string) => {
    setRestBody(newRest);
    const full = getFullBody(title, newRest);
    scheduleSave(full);
  };

  const handleCreateNote = async () => {
    const targetFolderId = selectedFolder === 'All iCloud' ? null : selectedFolder;
    try {
      const newNote = await syncCreateNote('New Note', targetFolderId);
      const folderId = selectedFolder === 'All iCloud' ? undefined : selectedFolder;
      const refreshed = await syncFetchNotes(folderId);
      setNotes(refreshed);
      setSelectedNote(newNote);
      setIsEditing(true);
      setTimeout(() => titleRef.current?.focus(), 50);
      addToast('Created new note', 'success');
    } catch {
      const fallbackNote: Note = {
        id: `note-${Date.now()}`,
        folderId: targetFolderId,
        title: 'New Note',
        body: '',
        isPinned: false,
        revision: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes((prev) => [fallbackNote, ...prev]);
      setSelectedNote(fallbackNote);
      setIsEditing(true);
      setTimeout(() => titleRef.current?.focus(), 50);
      addToast('Created local note', 'info');
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;
    try {
      await syncDeleteNote(selectedNote.id);
      const folderId = selectedFolder === 'All iCloud' ? undefined : selectedFolder;
      const refreshed = await syncFetchNotes(folderId);
      setNotes(refreshed);
      setSelectedNote(refreshed.length > 0 ? refreshed[0] : null);
      addToast('Note deleted', 'info');
    } catch {
      setNotes((prev) => prev.filter((n) => n.id !== selectedNote.id));
      setSelectedNote(null);
      addToast('Note deleted locally', 'info');
    }
  };

  const insertChecklist = () => {
    setIsEditing(true);
    setRestBody((prev) => (prev ? `${prev}\n[ ] ` : '[ ] '));
    const full = getFullBody(title, restBody ? `${restBody}\n[ ] ` : '[ ] ');
    scheduleSave(full);
    setTimeout(() => bodyRef.current?.focus(), 50);
  };

  const toggleChecklistLine = (index: number) => {
    const lines = restBody.split('\n');
    if (lines[index].startsWith('[ ] ')) {
      lines[index] = '[x] ' + lines[index].slice(4);
    } else if (lines[index].startsWith('[x] ')) {
      lines[index] = '[ ] ' + lines[index].slice(4);
    }
    const updated = lines.join('\n');
    setRestBody(updated);
    const full = getFullBody(title, updated);
    scheduleSave(full);
  };

  const insertTable = () => {
    setIsEditing(true);
    const tableTemplate = '\n\n| Item | Description | Status |\n|---|---|---|\n| Task | Details | Pending |\n';
    setRestBody((prev) => prev + tableTemplate);
    const full = getFullBody(title, restBody + tableTemplate);
    scheduleSave(full);
    setTimeout(() => bodyRef.current?.focus(), 50);
  };

  const applyFormat = (prefix: string, suffix: string = '') => {
    setIsEditing(true);
    setRestBody((prev) => `${prev}\n${prefix}${suffix ? `formatted${suffix}` : ''}`);
    const full = getFullBody(title, `${restBody}\n${prefix}${suffix ? `formatted${suffix}` : ''}`);
    scheduleSave(full);
    setTimeout(() => bodyRef.current?.focus(), 50);
  };

  const handleSignIn = (email: string, name: string) => {
    login(`token-${Date.now()}`, {
      id: `user-${Date.now()}`,
      name,
      email,
      pictureUrl: null,
    });
    addToast(`Signed in as ${name}`, 'success');
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + N: New Note
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleCreateNote();
      }
      // Shift + Cmd/Ctrl + L: Checklist
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        insertChecklist();
      }
      // Alt + Cmd/Ctrl + T: Insert Table
      if (e.altKey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 't') {
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
      } flex-col flex-1 h-full overflow-hidden select-text relative bg-[#1e1e1e]`}
    >
      {/* Top Liquid Glass Action Toolbar */}
      <NoteToolbar
        onBackMobile={() => onMobileViewChange('list')}
        onDeleteNote={handleDeleteNote}
        isNoteSelected={Boolean(selectedNote)}
        onInsertChecklist={insertChecklist}
        onInsertTable={insertTable}
        onApplyFormat={applyFormat}
        onFocusTitle={() => {
          setIsEditing(true);
          titleRef.current?.focus();
        }}
        isLocked={isLocked}
        onToggleLock={() => {
          setIsLocked(!isLocked);
          addToast(isLocked ? 'Note unlocked' : 'Note locked', 'info');
        }}
        onOpenShare={() => setIsShareModalOpen(true)}
        isEditing={isEditing}
        onDoneEditing={() => {
          setIsEditing(false);
          const full = getFullBody(title, restBody);
          scheduleSave(full);
        }}
        onCreateNote={handleCreateNote}
        user={user}
        onOpenSignIn={() => setIsSignInModalOpen(true)}
        onLogout={() => {
          logout();
          addToast('Signed out', 'info');
        }}
      />

      {/* Editor Surface */}
      <NoteEditorCanvas
        selectedNote={selectedNote}
        title={title}
        restBody={restBody}
        isEditing={isEditing}
        onStartEditing={() => setIsEditing(true)}
        onTitleChange={handleTitleChange}
        onBodyChange={handleRestBodyChange}
        onToggleChecklistLine={toggleChecklistLine}
        onCreateNote={handleCreateNote}
        titleRef={titleRef}
        bodyRef={bodyRef}
      />

      {/* Reusable Apple ID / Vpple ID Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSignIn={handleSignIn}
      />

      {/* Reusable Share & Export Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={title}
        body={restBody}
        onNotify={addToast}
      />
    </main>
  );
}
