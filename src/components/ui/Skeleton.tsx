'use client';

import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'pulse' | 'shimmer';
}

export function Skeleton({
  className = '',
  variant = 'pulse',
  ...props
}: SkeletonProps) {
  const animationClass =
    variant === 'shimmer' ? 'skeleton-shimmer' : 'animate-pulse bg-slate-200 dark:bg-neutral-800';

  return (
    <div
      role="status"
      aria-label="Loading..."
      className={`rounded-md ${animationClass} ${className}`}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function SkeletonText({
  lines = 2,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <Skeleton
          key={idx}
          className={`h-4 ${idx === lines - 1 && lines > 1 ? 'w-3/5' : 'w-full'}`}
        />
      ))}
    </div>
  );
}
