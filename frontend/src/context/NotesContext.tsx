import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Folder } from '../utils/api';

export interface Note {
  id: string;
  title: string;
  body: string;
  revision: number;
  folderId: string | null;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotesContextType {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFolder: string;
  setSelectedFolder: (folder: string) => void;
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  viewMode: 'list' | 'gallery';
  setViewMode: (mode: 'list' | 'gallery') => void;
  togglePinNote: (noteId: string) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const stored = localStorage.getItem('vpple_cached_notes');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [
      {
        id: 'welcome-apple-notes',
        title: 'Welcome to Vpple Notes',
        body: 'Welcome to Vpple Notes\nAn exact 1:1 reverse-engineered implementation of Apple Notes.\n\nKey features:\n• 3-column supplemental split view\n• Pure vector SF Symbols with zero emojis\n• Interactive checklists and tables\n• Real-time autosave with offline IndexedDB storage\n• macOS Tahoe & Sequoia Dark Theme styling',
        revision: 1,
        folderId: 'notes-folder',
        isPinned: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'release-notes',
        title: 'macOS Tahoe Features',
        body: 'macOS Tahoe Features\nLiquid Glass dynamic materials, Snell\'s Law refraction, and Amber Gold accent highlights throughout.',
        revision: 1,
        folderId: 'notes-folder',
        isPinned: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      }
    ];
  });

  const [selectedNote, setSelectedNote] = useState<Note | null>(() => {
    return notes.length > 0 ? notes[0] : null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(() => {
    return localStorage.getItem('selectedFolderId') || 'All iCloud';
  });
  const [folders, setFolders] = useState<Folder[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'gallery'>('list');

  const togglePinNote = (noteId: string) => {
    setNotes((prev) => {
      const next = prev.map((n) => (n.id === noteId ? { ...n, isPinned: !n.isPinned } : n));
      try {
        localStorage.setItem('vpple_cached_notes', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote((prev) => (prev ? { ...prev, isPinned: !prev.isPinned } : null));
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        setNotes,
        selectedNote,
        setSelectedNote,
        searchQuery,
        setSearchQuery,
        selectedFolder,
        setSelectedFolder,
        folders,
        setFolders,
        viewMode,
        setViewMode,
        togglePinNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
