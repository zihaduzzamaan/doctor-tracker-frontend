import React from 'react';

export interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withGlow?: boolean;
}

export function BrandLogo({ className = '', size = 'md', withGlow = true }: BrandLogoProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center select-none ${currentSize} ${className}`}
      role="img"
      aria-label="Doctor Tracker Brand Logo"
    >
      {withGlow && (
        <div className="absolute inset-0 rounded-xl bg-clinical-500/20 blur-sm -z-10 group-hover:bg-clinical-500/30 transition" />
      )}
      <svg
        viewBox="0 0 48 48"
        className="w-full h-full drop-shadow-sm transition-transform duration-200 group-hover:scale-[1.02]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="brandLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#0F766E" />
          </linearGradient>
          <filter id="logoInnerShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Squircle Background Base */}
        <rect width="48" height="48" rx="12" fill="url(#brandLogoGrad)" />

        {/* Subtle Inner Highlight Border */}
        <rect
          x="0.75"
          y="0.75"
          width="46.5"
          height="46.5"
          rx="11.25"
          stroke="#FFFFFF"
          strokeOpacity="0.25"
          strokeWidth="1.5"
        />

        {/* Solid Pure White Medical Cross */}
        <g filter="url(#logoInnerShadow)">
          <rect x="19" y="8" width="10" height="32" rx="3.5" fill="#FFFFFF" />
          <rect x="8" y="19" width="32" height="10" rx="3.5" fill="#FFFFFF" />
        </g>

        {/* Contrast Heartbeat ECG Waveform Inset */}
        <path
          d="M9 24h9l3-7 5 14 3.5-9 2.5 2h7"
          stroke="#0D9488"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
