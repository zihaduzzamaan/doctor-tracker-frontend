'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      id,
      className = '',
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = selectId ? `${selectId}-error` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-neutral-300 mb-1.5"
          >
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className={`w-full appearance-none rounded-lg border bg-white dark:bg-neutral-900 px-3.5 py-2.5 pr-10 text-sm text-slate-900 dark:text-neutral-100 transition-colors min-h-[44px] ${
              error
                ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-950/60'
                : 'border-slate-300 dark:border-neutral-700 hover:border-slate-400 dark:hover:border-neutral-600 focus:border-clinical-600 dark:focus:border-clinical-400 focus:ring-2 focus:ring-clinical-100 dark:focus:ring-clinical-950/60'
            } disabled:bg-slate-50 dark:disabled:bg-neutral-950 disabled:text-slate-500 disabled:cursor-not-allowed focus:outline-none ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-neutral-900 text-slate-900 dark:text-neutral-100">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 dark:text-neutral-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
            {error}
          </p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-neutral-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
