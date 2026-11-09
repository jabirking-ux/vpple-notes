import React from 'react';
import { LiquidGlassSurface } from './LiquidGlassContainer';

interface TextFormatMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFormat: (prefix: string, suffix?: string) => void;
  onFocusTitle: () => void;
}

export const TextFormatMenu: React.FC<TextFormatMenuProps> = ({
  isOpen,
  onClose,
  onApplyFormat,
  onFocusTitle,
}) => {
  if (!isOpen) return null;

  return (
    <LiquidGlassSurface className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 rounded-xl shadow-2xl p-1.5 z-50 animate-slide-in">
      {/* Title */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onFocusTitle();
        }}
        className="w-full text-left px-3 py-1.5 text-[15px] font-bold text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
      >
        Title
      </button>

      {/* Heading */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onApplyFormat('## ');
        }}
        className="w-full text-left px-3 py-1.5 text-[14px] font-semibold text-[#f5f5f7] hover:bg-white/10 rounded-md transition-colors cursor-pointer"
      >
        Heading
      </button>

      {/* Subheading */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onApplyFormat('### ');
        }}
        className="w-full text-left px-3 py-1.5 text-[13px] font-medium text-[#d1d1d6] hover:bg-white/10 rounded-md transition-colors cursor-pointer"
      >
        Subheading
      </button>

      {/* Body */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onApplyFormat('');
        }}
        className="w-full text-left px-3 py-1.5 text-[13px] text-[#86868b] hover:bg-white/10 rounded-md transition-colors cursor-pointer"
      >
        Body
      </button>

      <div className="h-px bg-white/10 my-1" />

      {/* Bulleted List */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onApplyFormat('• ');
        }}
        className="w-full text-left px-3 py-1.5 text-[13px] text-[#f5f5f7] hover:bg-white/10 rounded-md transition-colors cursor-pointer"
      >
        Bulleted List
      </button>

      {/* Dashed List */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onApplyFormat('- ');
        }}
        className="w-full text-left px-3 py-1.5 text-[13px] text-[#f5f5f7] hover:bg-white/10 rounded-md transition-colors cursor-pointer"
      >
        Dashed List
      </button>

      {/* Numbered List */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onApplyFormat('1. ');
        }}
        className="w-full text-left px-3 py-1.5 text-[13px] text-[#f5f5f7] hover:bg-white/10 rounded-md transition-colors cursor-pointer"
      >
        Numbered List
      </button>

      <div className="h-px bg-white/10 my-1" />

      {/* Monospaced */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onApplyFormat('`', '`');
        }}
        className="w-full text-left px-3 py-1.5 text-[12.5px] font-mono text-[#ff9f0a] hover:bg-white/10 rounded-md transition-colors cursor-pointer"
      >
        Monospaced
      </button>
    </LiquidGlassSurface>
  );
};
