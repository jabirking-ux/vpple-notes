import React from 'react';

// Exact Apple SF Symbols Vector Iconography (Zero Emojis Policy)
// Rendered as resolution-independent monochrome SVGs matching macOS Tahoe & iOS 26 SF Symbols.

export const SymbolFolder: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
  </svg>
);

export const SymbolFolderBadgePlus: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v6m-3-3h6"/>
  </svg>
);

export const SymbolPinFill: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3.1c0 .5-.2 1-.6 1.4L5.6 11c-.8.8-.8 2.1 0 2.8l1.4 1.4c.4.4.6.9.6 1.4V19h2.3c.5 0 1 .2 1.4.6l1.3 1.3c.8.8 2.1.8 2.8 0l1.3-1.3c.4-.4.9-.6 1.4-.6H18v-2.4c0-.5.2-1 .6-1.4l1.4-1.4c.8-.8.8-2.1 0-2.8l-1.8-2.5c-.4-.4-.6-.9-.6-1.4V4z"/>
  </svg>
);

export const SymbolSquareAndPencil: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
  </svg>
);

export const SymbolChecklist: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4"/>
  </svg>
);

export const SymbolCircle: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9"/>
  </svg>
);

export const SymbolCheckmarkCircleFill: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" clipRule="evenodd"/>
  </svg>
);

export const SymbolTableCells: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
  </svg>
);

export const SymbolTextFormat: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <span className={`font-bold text-[13px] tracking-tight leading-none inline-flex items-center justify-center font-sans ${className}`}>Aa</span>
);

export const SymbolTrash: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
);

export const SymbolSquareAndArrowUp: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
  </svg>
);

export const SymbolSidebarLeft: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="3"/>
    <path d="M9 3v18"/>
  </svg>
);

export const SymbolMagnifyingGlass: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/>
  </svg>
);

export const SymbolLockFill: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
  </svg>
);

export const SymbolListBullet: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
  </svg>
);

export const SymbolSquareGrid2x2: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
);

export const SymbolChevronLeft: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
  </svg>
);

export const SymbolChevronRight: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
  </svg>
);

export const SymbolChevronDown: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
  </svg>
);

export const SymbolEllipsisCircle: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01"/>
  </svg>
);

export const SymbolXmark: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
  </svg>
);

// macOS Tahoe Traffic Light Controls
export const SymbolTrafficLights: React.FC<{ className?: string }> = ({ className = "flex items-center gap-2" }) => (
  <div className={className}>
    <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 inline-block shadow-sm" />
    <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/40 inline-block shadow-sm" />
    <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/40 inline-block shadow-sm" />
  </div>
);

// Vpple Minimalist Monochrome Peach Silhouette (Apple Iconic Style, ZERO emoji)
export const SymbolVpplePeach: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 170 170" fill="currentColor">
    {/* Clean Leaf silhouette */}
    <path d="M98 22 C115 12 138 18 145 28 C138 48 118 52 98 42 C92 38 90 28 98 22 Z"/>
    {/* Peach silhouette with gentle cleft */}
    <path d="M85 48 C50 48 20 72 20 110 C20 148 55 168 85 168 C115 168 150 148 150 110 C150 72 120 48 85 48 Z M85 60 C98 76 100 100 94 124 C88 142 78 156 85 162 C62 158 42 136 42 110 C42 82 62 60 85 60 Z"/>
  </svg>
);
