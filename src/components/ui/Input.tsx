'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      className = '',
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helperId = inputId ? `${inputId}-helper` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5"
          >
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`w-full rounded-lg border bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-neutral-100 transition-colors placeholder:text-slate-400 dark:placeholder:text-neutral-500 min-h-[44px] ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error
                ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/25'
                : 'border-slate-300 dark:border-neutral-700 hover:border-slate-400 dark:hover:border-neutral-600 focus:border-clinical-600 dark:focus:border-clinical-400 focus:ring-1 focus:ring-clinical-600/25 dark:focus:ring-clinical-400/25'
            } disabled:bg-slate-50 dark:disabled:bg-neutral-950 disabled:text-slate-500 disabled:cursor-not-allowed focus:outline-none ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex items-center text-slate-400 dark:text-neutral-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="mt-1.5 text-xs text-slate-500 dark:text-neutral-400">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
