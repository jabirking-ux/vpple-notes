import { useEffect } from 'react';
import { useNotes, Note } from '../../context/NotesContext';
import { syncFetchNotes } from '../../utils/offlineSync';
import {
  SymbolMagnifyingGlass,
  SymbolSidebarLeft,
  SymbolPinFill,
  SymbolListBullet,
  SymbolSquareGrid2x2,
  SymbolXmark
} from './SFSymbols';

interface NotesListProps {
  onOpenSidebar: () => void;
  mobileView: 'list' | 'editor';
  onMobileViewChange: (v: 'list' | 'editor') => void;
}

function formatAppleNotesDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0 && d.getDate() === now.getDate()) {
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  if (diffDays === 1 || (diffDays === 0 && d.getDate() !== now.getDate())) {
    return 'Yesterday';
  }
  if (diffDays < 7) {
    return d.toLocaleDateString([], { weekday: 'long' });
  }
  return d.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: '2-digit' });
}

export function NotesList({ onOpenSidebar, mobileView, onMobileViewChange }: NotesListProps) {
  const {
    notes,
    setNotes,
    selectedNote,
    setSelectedNote,
    searchQuery,
    setSearchQuery,
    selectedFolder,
    viewMode,
    setViewMode,
    togglePinNote
  } = useNotes();

  useEffect(() => {
    const folderId = selectedFolder === 'All iCloud' ? undefined : selectedFolder;
    syncFetchNotes(folderId)
      .then((data) => {
        if (data && data.length > 0) {
          setNotes(data);
          const savedNoteId = localStorage.getItem('selectedNoteId');
          if (savedNoteId) {
            const found = data.find((n) => n.id === savedNoteId);
            if (found) setSelectedNote(found);
          }
        }
      })
      .catch(() => {
        // Fall back gracefully to cached notes in context
      });
  }, [selectedFolder, setNotes, setSelectedNote]);

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    localStorage.setItem('selectedNoteId', note.id);
    onMobileViewChange('editor');
  };

  const q = (searchQuery || '').trim().toLowerCase();
  const folderFiltered = notes.filter((n) => {
    if (selectedFolder === 'All iCloud') return true;
    return n.folderId === selectedFolder;
  });

  const filteredNotes = folderFiltered.filter((n) => {
    if (!q) return true;
    return (
      (n.title || '').toLowerCase().includes(q) ||
      (n.body || '').toLowerCase().includes(q)
    );
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.isPinned);

  const getPreviewSnippet = (body: string) => {
    const lines = (body || '').split('\n').filter((l) => l.trim().length > 0);
    if (lines.length <= 1) return 'No additional text';
    return lines.slice(1).join(' ').trim().slice(0, 75);
  };

  const renderNoteCard = (note: Note) => {
    const isSelected = selectedNote?.id === note.id;
    const dateStr = formatAppleNotesDate(note.updatedAt || note.createdAt);
    const snippet = getPreviewSnippet(note.body);

    return (
      <div
        key={note.id}
        onClick={() => handleSelectNote(note)}
        className={`group relative px-3 py-2.5 rounded-lg mb-1 cursor-pointer transition-colors select-none ${
          isSelected
            ? 'bg-[#e5a00d] text-white shadow-sm'
            : 'text-[#f5f5f7] hover:bg-white/5'
        }`}
      >
        {/* Title row */}
        <div className="flex items-center justify-between gap-1">
          <h3
            className={`text-[14px] font-semibold truncate leading-snug ${
              isSelected ? 'text-white' : 'text-[#f5f5f7]'
            }`}
          >
            {note.title || 'New Note'}
          </h3>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              togglePinNote(note.id);
            }}
            className={`p-1 rounded transition-opacity ${
              note.isPinned
                ? 'opacity-100 text-[#e5a00d]'
                : 'opacity-0 group-hover:opacity-60 hover:!opacity-100'
            } ${isSelected && note.isPinned ? 'text-white' : ''}`}
            title={note.isPinned ? 'Unpin Note' : 'Pin Note'}
          >
            <SymbolPinFill className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Date + Snippet Row */}
        <div className="flex items-center gap-2 mt-1 text-[12px]">
          <span
            className={`flex-shrink-0 font-medium ${
              isSelected ? 'text-white/85' : 'text-[#86868b]'
            }`}
          >
            {dateStr}
          </span>
          <span
            className={`truncate ${
              isSelected ? 'text-white/70' : 'text-[#636366]'
            }`}
          >
            {snippet}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${
        mobileView === 'editor' ? 'hidden md:flex' : 'flex'
      } flex-col w-full md:w-[300px] lg:w-[320px] flex-shrink-0 border-r border-white/10 select-none h-full`}
      style={{
        background: 'rgba(20, 22, 28, 0.78)',
        backdropFilter: 'blur(40px) saturate(200%)',
      }}
    >
      {/* Top Controls Toolbar */}
      <div className="liquid-glass-toolbar h-12 px-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-1.5 text-[#86868b] hover:text-white rounded hover:bg-white/5 cursor-pointer"
          title="Toggle Sidebar (⌥⌘S)"
        >
          <SymbolSidebarLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'list' ? 'gallery' : 'list')}
            className="p-1.5 text-[#86868b] hover:text-white rounded hover:bg-white/5 cursor-pointer"
            title={viewMode === 'list' ? 'Switch to Gallery View' : 'Switch to List View'}
          >
            {viewMode === 'list' ? (
              <SymbolSquareGrid2x2 className="w-4 h-4" />
            ) : (
              <SymbolListBullet className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Apple Notes Search Field */}
      <div className="px-3 py-2 border-b border-white/5">
        <div className="flex items-center gap-2 bg-[#2c2c2e] rounded-lg px-2.5 py-1.5">
          <SymbolMagnifyingGlass className="w-3.5 h-3.5 text-[#86868b] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[13px] text-white placeholder:text-[#86868b] outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-0.5 text-[#86868b] hover:text-white"
            >
              <SymbolXmark className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Notes List Content */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12 text-[#86868b] text-[13px]">
            No Notes Found
          </div>
        ) : (
          <>
            {/* Pinned Section */}
            {pinnedNotes.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1 px-3 py-1 text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                  <SymbolPinFill className="w-3 h-3 text-[#e5a00d]" />
                  <span>Pinned</span>
                </div>
                {pinnedNotes.map(renderNoteCard)}
              </div>
            )}

            {/* Regular Notes Section */}
            <div>
              {pinnedNotes.length > 0 && unpinnedNotes.length > 0 && (
                <div className="px-3 py-1 text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                  Notes
                </div>
              )}
              {unpinnedNotes.map(renderNoteCard)}
            </div>
          </>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="h-9 px-4 border-t border-white/5 flex items-center justify-center text-[11px] text-[#86868b] tabular-nums font-mono">
        {filteredNotes.length} {filteredNotes.length === 1 ? 'Note' : 'Notes'}
      </div>
    </div>
  );
}
