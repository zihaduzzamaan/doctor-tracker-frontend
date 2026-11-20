'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface CustomDatePickerProps {
  value: string; // 'YYYY-MM-DD' or ''
  onChange: (dateStr: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md';
  align?: 'left' | 'right';
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function CustomDatePicker({
  value,
  onChange,
  label,
  placeholder = 'Select date...',
  error,
  required,
  disabled = false,
  className = '',
  size = 'md',
  align = 'left',
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize view year and month based on value or today
  const initialDate = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewYear, setViewYear] = useState(
    isNaN(initialDate.getFullYear()) ? new Date().getFullYear() : initialDate.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(
    isNaN(initialDate.getMonth()) ? new Date().getMonth() : initialDate.getMonth()
  );

  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

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

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    onChange(`${viewYear}-${formattedMonth}-${formattedDay}`);
    setIsOpen(false);
  };

  const handleSelectToday = () => {
    const today = new Date();
    const formattedYear = today.getFullYear();
    const formattedMonth = String(today.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(today.getDate()).padStart(2, '0');
    onChange(`${formattedYear}-${formattedMonth}-${formattedDay}`);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onChange('');
    setIsOpen(false);
  };

  // Calendar calculations
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const today = new Date();
  const isTodayMonth = today.getFullYear() === viewYear && today.getMonth() === viewMonth;
  const todayDate = today.getDate();

  // Format display string
  const formatDisplayValue = (val: string) => {
    if (!val) return '';
    try {
      const d = new Date(val + 'T00:00:00');
      if (isNaN(d.getTime())) return val;
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return val;
    }
  };

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

      {/* Trigger Box */}
      <div
        className={`w-full flex items-center justify-between gap-1.5 rounded-xl border bg-white dark:bg-neutral-900 text-left font-medium select-none transition-all ${
          sizeStyles[size]
        } ${
          error
            ? 'border-rose-400 dark:border-rose-600'
            : isOpen
            ? 'border-clinical-600 dark:border-clinical-400 bg-clinical-50/15 dark:bg-clinical-950/20'
            : 'border-slate-300 dark:border-neutral-700 hover:border-slate-400 dark:hover:border-neutral-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className="flex items-center gap-2 min-w-0 flex-1 text-left focus:outline-none focus-visible:outline-none select-none"
        >
          <CalendarIcon className="w-4 h-4 text-clinical-600 dark:text-clinical-400 shrink-0" aria-hidden="true" />
          <span
            className={`truncate ${
              value
                ? 'text-slate-900 dark:text-neutral-100 font-semibold'
                : 'text-slate-400 dark:text-neutral-500'
            }`}
          >
            {value ? formatDisplayValue(value) : placeholder}
          </span>
        </button>

        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0 focus:outline-none"
            title="Clear date"
            aria-label="Clear selected date"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Floating Custom Calendar Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Calendar date picker"
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } top-full mt-1.5 z-50 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#141414] shadow-2xl p-4 w-72 select-none backdrop-blur-md animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* Calendar Navigation Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-500"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-slate-900 dark:text-neutral-100 tracking-tight">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-500"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Row */}
          <div className="grid grid-cols-7 gap-1 mb-1 text-center">
            {DAYS_OF_WEEK.map((d) => (
              <span key={d} className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const formattedMonth = String(viewMonth + 1).padStart(2, '0');
              const formattedDay = String(day).padStart(2, '0');
              const cellDateStr = `${viewYear}-${formattedMonth}-${formattedDay}`;
              const isSelected = value === cellDateStr;
              const isToday = isTodayMonth && day === todayDate;

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 w-8 mx-auto rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-clinical-600 text-white shadow-xs font-bold scale-[1.05]'
                      : isToday
                      ? 'border border-clinical-500 text-clinical-600 dark:text-clinical-400 hover:bg-clinical-50 dark:hover:bg-clinical-950/40'
                      : 'text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer Shortcuts */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-neutral-800 text-xs">
            <button
              type="button"
              onClick={handleSelectToday}
              className="text-xs font-semibold text-clinical-600 dark:text-clinical-400 hover:text-clinical-700 dark:hover:text-clinical-300"
            >
              Today
            </button>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400"
              >
                Clear Date
              </button>
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}
