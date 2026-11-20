'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export function CustomSelect({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select option...',
  leftIcon,
  error,
  required,
  disabled = false,
  className = '',
  size = 'md',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const sizeStyles = {
    sm: 'min-h-[36px] py-1.5 px-3 text-xs',
    md: 'min-h-[44px] py-2.5 px-3.5 text-xs sm:text-sm',
  };

  return (
    <div className={`relative w-full ${isOpen ? 'z-40' : 'z-10'} ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2 rounded-xl border bg-white dark:bg-neutral-900 text-left font-medium select-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-500 disabled:opacity-50 disabled:cursor-not-allowed ${
          sizeStyles[size]
        } ${
          error
            ? 'border-rose-400 dark:border-rose-600'
            : isOpen
            ? 'border-clinical-600 dark:border-clinical-400 ring-2 ring-clinical-100 dark:ring-clinical-950/60'
            : 'border-slate-300 dark:border-neutral-700 hover:border-slate-400 dark:hover:border-neutral-600'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {leftIcon && <span className="text-clinical-600 dark:text-clinical-400 shrink-0">{leftIcon}</span>}
          <span
            className={`truncate ${
              selectedOption
                ? 'text-slate-900 dark:text-neutral-100 font-semibold'
                : 'text-slate-400 dark:text-neutral-500'
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 dark:text-neutral-500 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-clinical-600 dark:text-clinical-400' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Floating Custom Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#141414] shadow-2xl p-1.5 max-h-60 overflow-y-auto backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-left select-none transition-colors ${
                  isSelected
                    ? 'bg-clinical-100 dark:bg-clinical-950/85 text-clinical-900 dark:text-clinical-300 border border-clinical-300/80 dark:border-clinical-800/70 shadow-2xs'
                    : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-clinical-600 dark:text-clinical-400 shrink-0" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}
