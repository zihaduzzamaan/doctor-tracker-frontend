'use client';

import React from 'react';
import { iconContainerTokens, pillTokens } from '@/lib/themeTokens';

export interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'clinical' | 'accent' | 'slate';
  badgeText?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  variant = 'clinical',
  badgeText,
}: MetricCardProps) {
  const pillStyle =
    variant === 'accent'
      ? pillTokens.accent.badge
      : variant === 'slate'
      ? pillTokens.neutral.badge
      : pillTokens.clinical.badge;

  return (
    <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-neutral-800 p-5 sm:p-6 shadow-subtle hover:shadow-card transition flex flex-col justify-between min-h-[145px]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400 truncate">
            {title}
          </p>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-neutral-100 tracking-tight">
            {value}
          </p>
        </div>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconContainerTokens[variant]}`}
        >
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-neutral-400 pt-2 border-t border-slate-100 dark:border-neutral-800">
        <span className="truncate" title={subtitle}>
          {subtitle || 'Real-time clinic metric'}
        </span>
        {badgeText && (
          <span
            className={`shrink-0 whitespace-nowrap text-[11px] px-2 py-0.5 rounded-full leading-tight select-none ${pillStyle}`}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-neutral-800 p-5 sm:p-6 shadow-subtle flex flex-col justify-between min-h-[145px] animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2.5 w-2/3">
          <div className="h-3 bg-slate-200 dark:bg-neutral-800 rounded w-1/2" />
          <div className="h-8 bg-slate-200 dark:bg-neutral-800 rounded w-3/4" />
        </div>
        <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-neutral-800 shrink-0" />
      </div>
      <div className="mt-4 pt-2 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between">
        <div className="h-3 bg-slate-200 dark:bg-neutral-800 rounded w-1/3" />
        <div className="h-3 bg-slate-200 dark:bg-neutral-800 rounded w-1/4" />
      </div>
    </div>
  );
}
