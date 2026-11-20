'use client';

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'admitted'
    | 'observation'
    | 'under_observation'
    | 'discharged'
    | 'clinical'
    | 'accent'
    | 'neutral'
    | string;
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

  const variantStyles: Record<string, { badge: string; dot: string }> = {
    admitted: {
      badge:
        'bg-accent-50 dark:bg-amber-950/40 text-accent-800 dark:text-amber-300 border border-accent-200 dark:border-amber-800/60 font-semibold',
      dot: 'bg-accent-500',
    },
    observation: {
      badge:
        'bg-clinical-50 dark:bg-clinical-950/40 text-clinical-800 dark:text-clinical-300 border border-clinical-200 dark:border-clinical-800/60 font-semibold',
      dot: 'bg-clinical-500',
    },
    under_observation: {
      badge:
        'bg-clinical-50 dark:bg-clinical-950/40 text-clinical-800 dark:text-clinical-300 border border-clinical-200 dark:border-clinical-800/60 font-semibold',
      dot: 'bg-clinical-500',
    },
    discharged: {
      badge:
        'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700 font-medium',
      dot: 'bg-slate-400 dark:bg-neutral-500',
    },
    clinical: {
      badge:
        'bg-clinical-50 dark:bg-clinical-950/40 text-clinical-800 dark:text-clinical-300 border border-clinical-200 dark:border-clinical-800/60 font-medium',
      dot: 'bg-clinical-600',
    },
    accent: {
      badge:
        'bg-accent-50 dark:bg-amber-950/40 text-accent-800 dark:text-amber-300 border border-accent-200 dark:border-amber-800/60 font-medium',
      dot: 'bg-accent-600',
    },
    neutral: {
      badge:
        'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700 font-medium',
      dot: 'bg-slate-500',
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.neutral;

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
      <span className="whitespace-nowrap">{children}</span>
    </span>
  );
}
