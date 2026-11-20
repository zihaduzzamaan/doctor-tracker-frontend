'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-xl bg-white dark:bg-[#121212] shadow-drawer border-l border-slate-200 dark:border-neutral-800 flex flex-col z-10 transition-colors">
          {/* Header */}
          <div className="sticky top-0 p-4 sm:p-6 border-b border-slate-200 dark:border-neutral-800 bg-white/95 dark:bg-[#121212]/95 backdrop-blur z-20 flex items-start justify-between gap-4">
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 id="drawer-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-neutral-100 tracking-tight truncate">
                  {title}
                </h2>
                {badge}
              </div>
              {subtitle && <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400 line-clamp-1 sm:line-clamp-none">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition focus-ring min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-neutral-800 bg-slate-50/80 dark:bg-neutral-900">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
