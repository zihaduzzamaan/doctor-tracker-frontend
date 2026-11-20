'use client';

import React from 'react';
import { badgeTokens, BadgeTokenStyle } from '@/lib/themeTokens';

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

  const currentVariant: BadgeTokenStyle =
    (badgeTokens as Record<string, BadgeTokenStyle>)[variant] || badgeTokens.neutral;

  return (
    <span
      className={`inline-flex items-center rounded-full shrink-0 tracking-wide select-none ${sizeStyles[size]} ${currentVariant.badge} ${className}`}
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
