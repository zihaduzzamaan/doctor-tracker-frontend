'use client';

import React from 'react';

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
  const iconVariantStyles = {
    clinical: 'bg-clinical-50 text-clinical-600 border border-clinical-200',
    accent: 'bg-accent-50 text-accent-700 border border-accent-200',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-subtle hover:shadow-card transition flex flex-col justify-between min-h-[140px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </p>
        </div>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconVariantStyles[variant]}`}
        >
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span>{subtitle || 'Real-time clinic metric'}</span>
        {badgeText && (
          <span className="font-semibold text-clinical-700 bg-clinical-50 px-2 py-0.5 rounded-full border border-clinical-200/80">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-subtle flex flex-col justify-between min-h-[140px] animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2.5 w-2/3">
          <div className="h-3 bg-slate-200 rounded w-1/2" />
          <div className="h-8 bg-slate-200 rounded w-3/4" />
        </div>
        <div className="w-11 h-11 rounded-xl bg-slate-200 shrink-0" />
      </div>
      <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-3 bg-slate-200 rounded w-1/4" />
      </div>
    </div>
  );
}
