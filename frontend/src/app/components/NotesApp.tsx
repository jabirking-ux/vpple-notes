import { useEffect, useState, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { NotesList } from './NotesList';
import { NoteViewer } from './NoteViewer';
import { useNotes } from '../../context/NotesContext';
import { useToast } from '../../context/ToastContext';
import { syncFetchNotes, syncPendingChanges, startOnlineListener } from '../../utils/offlineSync';

export function NotesApp() {
  const { setNotes, selectedFolder } = useNotes();
  const { addToast } = useToast();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'editor'>('list');
  const appContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic Kyant0 InteractiveHighlight cursor tracking
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

  useEffect(() => {
    const cleanup = startOnlineListener(async (online) => {
      setIsOffline(!online);
      if (online) {
        addToast('Back online — syncing...', 'info');
        const result = await syncPendingChanges();
        if (result.synced > 0) {
          addToast(`Synced ${result.synced} note(s)`, 'success');
        }
        if (result.conflicts.length > 0) {
          addToast(`${result.conflicts.length} conflict(s) resolved`, 'warning');
        }
        if (result.failed > 0) {
          addToast(`${result.failed} note(s) failed to sync`, 'error');
        }
        const folderId = selectedFolder === 'All iCloud' ? undefined : selectedFolder;
        const notes = await syncFetchNotes(folderId).catch(() => []);
        if (notes.length > 0) setNotes(notes);
      } else {
        addToast('Operating offline — notes saved locally', 'info');
      }
    });
    return cleanup;
  }, [setNotes, addToast, selectedFolder]);

  return (
    <div
      ref={appContainerRef}
      className="flex flex-col md:flex-row h-screen bg-[#1e1e1e] text-white overflow-hidden select-none"
      style={{ pointerEvents: 'auto' }}
    >
      {isOffline && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-[#e5a00d] text-black text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
          Offline Mode
        </div>
      )}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <NotesList onOpenSidebar={() => setSidebarOpen(true)} mobileView={mobileView} onMobileViewChange={setMobileView} />
      <NoteViewer mobileView={mobileView} onMobileViewChange={setMobileView} />
    </div>
  );
}
