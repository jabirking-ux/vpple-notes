import React, { useRef, useState } from 'react';
import { computeKyantHighlight } from '../../utils/KyantLiquidGlass';

/*
 * Kyant0 Real Liquid Glass Component for React
 * Directly ports Kyant0/AndroidLiquidGlass (Apache License 2.0)
 * Uses SDF rounded rect distance field and directional specular highlight logic
 */

interface LiquidGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  isAccent?: boolean;
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  children,
  className = '',
  isAccent = false,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [highlightStyle, setHighlightStyle] = useState<string>(
    'inset 0 1px 0 rgba(255, 255, 255, 0.32), inset 0 -1px 0 rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.25)'
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const { insetBoxShadow } = computeKyantHighlight(rect.width, rect.height, cx, cy, 2.0);
    setHighlightStyle(`${insetBoxShadow}, inset 0 -1px 0 rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.25)`);
  };

  const handleMouseLeave = () => {
    setHighlightStyle(
      'inset 0 1px 0 rgba(255, 255, 255, 0.32), inset 0 -1px 0 rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.25)'
    );
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center justify-center rounded-full text-[13px] font-medium transition-transform active:scale-[0.97] cursor-pointer select-none ${
        isAccent
          ? 'bg-[#d4940c] text-white hover:bg-[#e5a00d]'
          : 'bg-[#121212]/40 text-[#f5f5f7] hover:bg-white/10'
      } border border-white/15 ${className}`}
      style={{
        boxShadow: highlightStyle,
        backdropFilter: 'blur(20px) saturate(190%)',
        WebkitBackdropFilter: 'blur(20px) saturate(190%)',
      }}
      {...props}
    >
      {children}
    </button>
  );
};

interface LiquidGlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export const LiquidGlassSurface: React.FC<LiquidGlassSurfaceProps> = ({
  children,
  className = '',
  interactive = true,
  style = {},
  ...props
}) => {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [highlightStyle, setHighlightStyle] = useState<string>(
    'inset 0 1px 0 rgba(255, 255, 255, 0.22), inset 0 -1px 0 rgba(0, 0, 0, 0.50), 0 16px 40px rgba(0, 0, 0, 0.45)'
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !surfaceRef.current) return;
    const rect = surfaceRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const { insetBoxShadow } = computeKyantHighlight(rect.width, rect.height, cx, cy, 2.5);
    setHighlightStyle(`${insetBoxShadow}, inset 0 -1px 0 rgba(0, 0, 0, 0.50), 0 16px 40px rgba(0, 0, 0, 0.45)`);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHighlightStyle(
      'inset 0 1px 0 rgba(255, 255, 255, 0.22), inset 0 -1px 0 rgba(0, 0, 0, 0.50), 0 16px 40px rgba(0, 0, 0, 0.45)'
    );
  };

  return (
    <div
      ref={surfaceRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`bg-[#1c1c1e]/75 border border-white/10 backdrop-blur-2xl ${className}`}
      style={{
        boxShadow: highlightStyle,
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
