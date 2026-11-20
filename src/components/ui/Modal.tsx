'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}: ModalProps) {
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

  const maxWidthStyles = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-description' : undefined}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Window: Fullscreen Page-Like View on Mobile (< sm), Centered Dialog on Tablet/Desktop (sm:) */}
      <div
        className={`relative w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] rounded-none border-0 flex flex-col bg-white dark:bg-[#121212] z-10 overflow-hidden transition-colors ${maxWidthStyles[maxWidth]} sm:relative sm:h-auto sm:min-h-0 sm:max-h-[88vh] sm:rounded-2xl sm:shadow-drawer sm:border sm:border-slate-200 sm:dark:border-neutral-800 sm:my-auto`}
      >
        {/* Sticky Header: Always visible, never cropped on mobile or desktop */}
        <div className="shrink-0 px-4 py-3.5 sm:px-6 sm:py-4.5 border-b border-slate-200 dark:border-neutral-800 bg-white/95 dark:bg-[#121212]/95 backdrop-blur z-20 flex items-center justify-between gap-3">
          <div className="min-w-0 pr-2">
            <h2
              id="modal-title"
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-neutral-100 tracking-tight leading-snug truncate"
            >
              {title}
            </h2>
            {description && (
              <p
                id="modal-description"
                className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400 line-clamp-1 sm:line-clamp-none leading-relaxed"
              >
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:text-slate-700 dark:hover:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition focus-ring min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body: Internal scroll ensures header remains pinned */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain pb-12 sm:pb-6 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
