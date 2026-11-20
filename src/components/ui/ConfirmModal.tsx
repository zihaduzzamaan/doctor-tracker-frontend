'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Trash2, Info } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  const iconConfig = {
    danger: {
      icon: Trash2,
      containerClass: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/50',
      buttonVariant: 'danger' as const,
    },
    warning: {
      icon: AlertTriangle,
      containerClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/50',
      buttonVariant: 'accent' as const,
    },
    primary: {
      icon: Info,
      containerClass: 'bg-clinical-50 dark:bg-clinical-950/40 text-clinical-600 dark:text-clinical-400 border border-clinical-200/80 dark:border-clinical-900/50',
      buttonVariant: 'primary' as const,
    },
  };

  const currentConfig = iconConfig[variant];
  const Icon = currentConfig.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${currentConfig.containerClass}`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed pt-1">
            {message}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-neutral-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={currentConfig.buttonVariant}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
