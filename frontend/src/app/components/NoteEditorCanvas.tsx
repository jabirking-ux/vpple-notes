import React from 'react';
import { SymbolCircle, SymbolCheckmarkCircleFill, SymbolSquareAndPencil } from './SFSymbols';

interface NoteEditorCanvasProps {
  selectedNote: {
    id: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  title: string;
  restBody: string;
  isEditing: boolean;
  onStartEditing: () => void;
  onTitleChange: (val: string) => void;
  onBodyChange: (val: string) => void;
  onToggleChecklistLine: (index: number) => void;
  onCreateNote: () => void;
  titleRef: React.RefObject<any>;
  bodyRef: React.RefObject<any>;
}

function formatFullTimestamp(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export const NoteEditorCanvas: React.FC<NoteEditorCanvasProps> = ({
  selectedNote,
  title,
  restBody,
  isEditing,
  onStartEditing,
  onTitleChange,
  onBodyChange,
  onToggleChecklistLine,
  onCreateNote,
  titleRef,
  bodyRef,
}) => {
  const bodyLines = restBody.split('\n');

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto">
        {selectedNote ? (
          <>
            {/* Centered Date Timestamp */}
            <div className="text-center text-[12px] font-medium text-[#86868b] mb-6 select-none">
              {formatFullTimestamp(selectedNote.updatedAt || selectedNote.createdAt)}
            </div>

            {isEditing ? (
              <>
                {/* Title Textarea */}
                <textarea
                  ref={titleRef}
                  value={title}
                  onChange={(e) => onTitleChange(e.target.value)}
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
                  onChange={(e) => onBodyChange(e.target.value)}
                  placeholder="Start typing..."
                  autoFocus
                  className="w-full min-h-[380px] bg-transparent text-[#e5e5ea] text-[15px] leading-relaxed resize-none outline-none placeholder:text-[#636366] font-sans"
                  spellCheck={false}
                />
              </>
            ) : (
              <div
                onClick={onStartEditing}
                className="cursor-text min-h-[420px]"
              >
                <h1 className="text-3xl font-bold text-[#f5f5f7] mb-4 tracking-tight leading-tight">
                  {title || 'New Note'}
                </h1>

                <div className="space-y-1 text-[15px] text-[#e5e5ea] leading-relaxed font-sans">
                  {bodyLines.map((line, idx) => {
                    if (line.startsWith('[ ] ')) {
                      return (
                        <div
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleChecklistLine(idx);
                          }}
                          className="notes-checklist-item cursor-pointer group"
                        >
                          <SymbolCircle className="w-4 h-4 text-[#86868b] group-hover:text-[#e5a00d] flex-shrink-0 transition-colors" />
                          <span className="text-[15px] text-[#f5f5f7] leading-snug">{line.slice(4)}</span>
                        </div>
                      );
                    }
                    if (line.startsWith('[x] ')) {
                      return (
                        <div
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleChecklistLine(idx);
                          }}
                          className="notes-checklist-item completed cursor-pointer group"
                        >
                          <SymbolCheckmarkCircleFill className="w-4 h-4 text-[#e5a00d] flex-shrink-0" />
                          <span className="text-[15px] text-[#86868b] line-through leading-snug">{line.slice(4)}</span>
                        </div>
                      );
                    }
                    if (line.trim() === '') {
                      return <div key={idx} className="h-4" />;
                    }
                    return (
                      <p key={idx} className="my-1 whitespace-pre-wrap">
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-[#86868b] select-none text-center">
            <SymbolSquareAndPencil className="w-12 h-12 text-[#636366] mb-3 opacity-60" />
            <p className="text-[14px]">No Note Selected</p>
            <button
              type="button"
              onClick={onCreateNote}
              className="mt-3 text-[#e5a00d] text-[13px] font-semibold hover:underline cursor-pointer"
            >
              Create a Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
