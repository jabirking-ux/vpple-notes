import React from 'react';
import { SymbolXmark, SymbolSquareAndArrowUp } from './SFSymbols';
import { LiquidGlassSurface } from './LiquidGlassContainer';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  body: string;
  onNotify: (msg: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  body,
  onNotify,
}) => {
  if (!isOpen) return null;

  const fullText = title ? (body ? `${title}\n\n${body}` : title) : body;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      onNotify('Note copied to clipboard', 'success');
      onClose();
    } catch {
      onNotify('Failed to copy to clipboard', 'error');
    }
  };

  const handleDownloadFile = (extension: 'txt' | 'md') => {
    const filename = `${(title || 'Note').replace(/[/\\?%*:|"<>]/g, '-')}.${extension}`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onNotify(`Exported ${filename}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <LiquidGlassSurface className="rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-slide-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SymbolSquareAndArrowUp className="w-4 h-4 text-[#e5a00d]" />
            <h3 className="text-white text-[16px] font-semibold">Share & Export Note</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#86868b] hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <SymbolXmark className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[#86868b] text-[13px] mb-4">
          Export this note or copy content to collaborate with others.
        </p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="w-full py-2.5 bg-[#e5a00d] text-white rounded-xl text-[13px] font-semibold hover:bg-[#d4940c] transition-colors cursor-pointer shadow-md"
          >
            Copy Note Content
          </button>
          <button
            type="button"
            onClick={() => handleDownloadFile('md')}
            className="w-full py-2 bg-white/5 hover:bg-white/10 text-[#f5f5f7] rounded-xl text-[13px] transition-colors cursor-pointer border border-white/10"
          >
            Download Markdown (.md)
          </button>
          <button
            type="button"
            onClick={() => handleDownloadFile('txt')}
            className="w-full py-2 bg-white/5 hover:bg-white/10 text-[#f5f5f7] rounded-xl text-[13px] transition-colors cursor-pointer border border-white/10"
          >
            Download Plain Text (.txt)
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-[#86868b] hover:text-white text-[13px] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </LiquidGlassSurface>
    </div>
  );
};
