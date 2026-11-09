import { useEffect } from 'react';
import { useNotes, Note } from '../../context/NotesContext';
import { syncFetchNotes } from '../../utils/offlineSync';
import {
  SymbolMagnifyingGlass,
  SymbolSidebarLeft,
  SymbolPinFill,
  SymbolListBullet,
  SymbolSquareGrid2x2,
  SymbolXmark,
} from './SFSymbols';
import { LiquidGlassButton } from './LiquidGlassContainer';

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
    togglePinNote,
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

  // Apple Notes List View Card
  const renderListNoteCard = (note: Note) => {
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
            className={`p-1 rounded transition-opacity cursor-pointer ${
              note.isPinned
                ? 'opacity-100 text-[#e5a00d]'
                : 'opacity-0 group-hover:opacity-60 hover:!opacity-100'
            } ${isSelected && note.isPinned ? 'text-white' : ''}`}
            title={note.isPinned ? 'Unpin Note' : 'Pin Note'}
          >
            <SymbolPinFill className="w-3.5 h-3.5" />
          </button>
        </div>

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

  // Apple Notes Gallery View Card
  const renderGalleryNoteCard = (note: Note) => {
    const isSelected = selectedNote?.id === note.id;
    const dateStr = formatAppleNotesDate(note.updatedAt || note.createdAt);
    const snippet = getPreviewSnippet(note.body);

    return (
      <div
        key={note.id}
        onClick={() => handleSelectNote(note)}
        className={`group flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all select-none border ${
          isSelected
            ? 'border-[#e5a00d] ring-2 ring-[#e5a00d]/40 shadow-lg'
            : 'border-white/10 hover:border-white/20'
        } bg-[#28282a]`}
      >
        {/* Note Paper Preview Sheet */}
        <div className="relative p-3 h-28 bg-[#202022] border-b border-white/5 overflow-hidden flex flex-col justify-between">
          <p className="text-[11px] text-[#86868b] line-clamp-4 leading-relaxed font-sans select-none">
            {snippet}
          </p>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
            <span className="text-[10px] text-[#636366] font-mono">{dateStr}</span>
            {note.isPinned && (
              <SymbolPinFill className="w-3 h-3 text-[#e5a00d] flex-shrink-0" />
            )}
          </div>
        </div>

        {/* Card Footer Title */}
        <div className={`p-2.5 ${isSelected ? 'bg-[#e5a00d]/15' : 'bg-transparent'}`}>
          <h4 className="text-[13px] font-semibold text-white truncate leading-tight">
            {note.title || 'New Note'}
          </h4>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${
        mobileView === 'editor' ? 'hidden md:flex' : 'flex'
      } flex-col w-full md:w-[300px] lg:w-[320px] flex-shrink-0 bg-[#1c1c1e] border-r border-white/5 select-none h-full`}
    >
      {/* Top Controls Toolbar with Real Kyant Liquid Glass */}
      <div className="liquid-glass-toolbar h-12 px-3 flex items-center justify-between gap-2">
        <LiquidGlassButton
          type="button"
          onClick={onOpenSidebar}
          className="p-1.5 text-[#86868b] hover:text-white rounded-md cursor-pointer"
          title="Toggle Sidebar (Option+Cmd+S)"
        >
          <SymbolSidebarLeft className="w-4 h-4" />
        </LiquidGlassButton>

        <div className="flex items-center gap-1">
          <LiquidGlassButton
            type="button"
            onClick={() => setViewMode(viewMode === 'list' ? 'gallery' : 'list')}
            className={`p-1.5 rounded-md cursor-pointer ${
              viewMode === 'gallery' ? 'text-[#e5a00d]' : 'text-[#86868b] hover:text-white'
            }`}
            title={viewMode === 'list' ? 'Switch to Gallery View' : 'Switch to List View'}
          >
            {viewMode === 'list' ? (
              <SymbolSquareGrid2x2 className="w-4 h-4" />
            ) : (
              <SymbolListBullet className="w-4 h-4" />
            )}
          </LiquidGlassButton>
        </div>
      </div>

      {/* Apple Notes Search Field */}
      <div className="px-3 py-2 border-b border-white/5">
        <div className="flex items-center gap-2 bg-[#2c2c2e] rounded-lg px-2.5 py-1.5 border border-transparent focus-within:border-[#e5a00d]/50 transition-colors">
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
              className="p-0.5 text-[#86868b] hover:text-white cursor-pointer"
            >
              <SymbolXmark className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Notes List / Gallery Content */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12 text-[#86868b] text-[13px]">
            No Notes Found
          </div>
        ) : viewMode === 'gallery' ? (
          <div className="space-y-4">
            {pinnedNotes.length > 0 && (
              <div>
                <div className="flex items-center gap-1 px-1 py-1 text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                  <SymbolPinFill className="w-3 h-3 text-[#e5a00d]" />
                  <span>Pinned</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {pinnedNotes.map(renderGalleryNoteCard)}
                </div>
              </div>
            )}
            <div>
              {pinnedNotes.length > 0 && unpinnedNotes.length > 0 && (
                <div className="px-1 py-1 text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                  Notes
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                {unpinnedNotes.map(renderGalleryNoteCard)}
              </div>
            </div>
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
                {pinnedNotes.map(renderListNoteCard)}
              </div>
            )}

            {/* Regular Notes Section */}
            <div>
              {pinnedNotes.length > 0 && unpinnedNotes.length > 0 && (
                <div className="px-3 py-1 text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                  Notes
                </div>
              )}
              {unpinnedNotes.map(renderListNoteCard)}
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
