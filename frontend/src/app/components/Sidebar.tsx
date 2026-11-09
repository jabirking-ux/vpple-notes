import { useEffect, useState } from 'react';
import { useNotes } from '../../context/NotesContext';
import { getFolders, createFolder as apiCreateFolder, deleteFolder as apiDeleteFolder } from '../../utils/api';
import {
  SymbolFolder,
  SymbolFolderBadgePlus,
  SymbolTrash,
  SymbolXmark,
  SymbolTrafficLights,
  SymbolVpplePeach
} from './SFSymbols';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { selectedFolder, setSelectedFolder, folders, setFolders, notes } = useNotes();
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    getFolders()
      .then(setFolders)
      .catch(() => {
        // Fallback to local default folders if backend is offline
        const localFolders = localStorage.getItem('vpple_notes_folders');
        if (localFolders) {
          try {
            setFolders(JSON.parse(localFolders));
          } catch {
            // ignore
          }
        } else {
          const defaultFolders = [
            { id: 'notes-folder', name: 'Notes', userId: 'local', createdAt: new Date().toISOString() },
            { id: 'quick-notes-folder', name: 'Quick Notes', userId: 'local', createdAt: new Date().toISOString() },
            { id: 'personal-folder', name: 'Personal', userId: 'local', createdAt: new Date().toISOString() },
            { id: 'work-folder', name: 'Work', userId: 'local', createdAt: new Date().toISOString() }
          ];
          setFolders(defaultFolders);
          localStorage.setItem('vpple_notes_folders', JSON.stringify(defaultFolders));
        }
      });
  }, [setFolders]);

  const handleSelectFolder = (folderId: string) => {
    setSelectedFolder(folderId);
    localStorage.setItem('selectedFolderId', folderId);
    onClose();
  };

  const handleNewFolderSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newFolderName.trim();
    if (!trimmed) {
      setIsCreatingFolder(false);
      return;
    }

    try {
      const folder = await apiCreateFolder(trimmed);
      const updated = [...folders, folder].sort((a, b) => a.name.localeCompare(b.name));
      setFolders(updated);
      localStorage.setItem('vpple_notes_folders', JSON.stringify(updated));
    } catch {
      // Offline fallback
      const localFolder = {
        id: `folder-${Date.now()}`,
        name: trimmed,
        userId: 'local',
        createdAt: new Date().toISOString()
      };
      const updated = [...folders, localFolder].sort((a, b) => a.name.localeCompare(b.name));
      setFolders(updated);
      localStorage.setItem('vpple_notes_folders', JSON.stringify(updated));
    }

    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const handleDeleteFolder = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await apiDeleteFolder(id);
    } catch {
      // offline fallback
    }
    const updated = folders.filter((f) => f.id !== id);
    setFolders(updated);
    localStorage.setItem('vpple_notes_folders', JSON.stringify(updated));
    if (selectedFolder === id) {
      handleSelectFolder('All iCloud');
    }
  };

  const countForFolder = (folderId: string) => {
    if (folderId === 'All iCloud') return notes.length;
    return notes.filter((n) => n.folderId === folderId).length;
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-[240px] flex-shrink-0 bg-[#1e1e1e] border-r border-white/5 flex flex-col transition-transform select-none md:static md:z-auto md:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* macOS Window Controls + App Identity */}
      <div className="liquid-glass-toolbar h-12 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SymbolTrafficLights />
          <div className="flex items-center gap-1.5 ml-2">
            <SymbolVpplePeach className="w-4 h-4 text-[#e5a00d]" />
            <span className="text-white text-[13px] font-semibold tracking-tight">Notes</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="md:hidden p-1 text-[#86868b] hover:text-white"
          aria-label="Close Sidebar"
        >
          <SymbolXmark className="w-4 h-4" />
        </button>
      </div>

      {/* Account Section */}
      <div className="px-3 pt-3 pb-1">
        <span className="px-2 text-[11px] font-semibold tracking-wider text-[#86868b] uppercase">
          iCloud
        </span>
      </div>

      {/* Folder Navigation */}
      <nav className="flex-1 px-2 py-1 overflow-y-auto space-y-0.5">
        {/* All iCloud Item */}
        <button
          type="button"
          onClick={() => handleSelectFolder('All iCloud')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[13px] rounded-md transition-colors cursor-pointer ${
            selectedFolder === 'All iCloud'
              ? 'bg-white/10 text-white font-medium'
              : 'text-[#d1d1d6] hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <SymbolFolder
              className="w-4 h-4 flex-shrink-0 text-[#e5a00d]"
            />
            <span className="truncate">All iCloud</span>
          </div>
          <span
            className={`text-[12px] font-mono tabular-nums ${
              selectedFolder === 'All iCloud' ? 'text-white/80' : 'text-[#86868b]'
            }`}
          >
            {countForFolder('All iCloud')}
          </span>
        </button>

        {/* User Folders */}
        {folders.map((folder) => {
          const isSelected = selectedFolder === folder.id;
          return (
            <div
              key={folder.id}
              onClick={() => handleSelectFolder(folder.id)}
              className={`group flex items-center justify-between px-2.5 py-1.5 text-[13px] rounded-md transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-[#d1d1d6] hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <SymbolFolder
                  className="w-4 h-4 flex-shrink-0 text-[#e5a00d]"
                />
                <span className="truncate">{folder.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[12px] font-mono tabular-nums group-hover:hidden ${
                    isSelected ? 'text-white/80' : 'text-[#86868b]'
                  }`}
                >
                  {countForFolder(folder.id)}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleDeleteFolder(e, folder.id)}
                  className="hidden group-hover:inline-flex p-0.5 text-white/70 hover:text-red-400"
                  title="Delete Folder"
                >
                  <SymbolTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Inline Folder Creation Form */}
        {isCreatingFolder && (
          <form onSubmit={handleNewFolderSubmit} className="px-2 pt-1">
            <input
              type="text"
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsCreatingFolder(false);
                  setNewFolderName('');
                }
              }}
              onBlur={() => handleNewFolderSubmit()}
              placeholder="Folder Name"
              className="w-full bg-[#2a2a2a] text-white text-[13px] px-2 py-1 rounded border border-[#e5a00d] outline-none"
            />
          </form>
        )}
      </nav>

      {/* New Folder Action Button */}
      <div className="p-2 border-t border-white/5">
        <button
          type="button"
          onClick={() => setIsCreatingFolder(true)}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[13px] text-[#86868b] hover:text-white hover:bg-white/5 rounded-md transition-colors cursor-pointer"
        >
          <SymbolFolderBadgePlus className="w-4 h-4 text-[#e5a00d]" />
          <span>New Folder</span>
        </button>
      </div>
    </aside>
  );
}
