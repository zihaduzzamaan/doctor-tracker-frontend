'use client';

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'admitted' | 'observation' | 'discharged' | 'clinical' | 'accent' | 'neutral';
  size?: 'sm' | 'md';
  withDot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  withDot = false,
  className = '',
}: BadgeProps) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  const variantStyles = {
    admitted: {
      badge: 'bg-accent-50 text-accent-900 border border-accent-200 font-semibold',
      dot: 'bg-accent-500',
    },
    observation: {
      badge: 'bg-clinical-50 text-clinical-900 border border-clinical-200 font-semibold',
      dot: 'bg-clinical-500',
    },
    discharged: {
      badge: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
      dot: 'bg-slate-400',
    },
    clinical: {
      badge: 'bg-clinical-50 text-clinical-800 border border-clinical-200 font-medium',
      dot: 'bg-clinical-600',
    },
    accent: {
      badge: 'bg-accent-50 text-accent-800 border border-accent-200 font-medium',
      dot: 'bg-accent-600',
    },
    neutral: {
      badge: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
      dot: 'bg-slate-500',
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide select-none ${sizeStyles[size]} ${currentVariant.badge} ${className}`}
    >
      {withDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${currentVariant.dot}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}
