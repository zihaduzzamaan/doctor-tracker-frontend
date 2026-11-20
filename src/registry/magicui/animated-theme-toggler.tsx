'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';

export interface AnimatedThemeTogglerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onToggle'> {
  className?: string;
  onToggle?: (isDark: boolean) => void;
}

/**
 * AnimatedThemeToggler component from Magic UI / shadcn registry.
 * Uses browser View Transitions API with expanding radial clip-path animation
 * and lucide Sun/Moon iconography with clean mutual exclusion to prevent icon collision.
 */
export function AnimatedThemeToggler({
  className = '',
  onToggle,
  ...props
}: AnimatedThemeTogglerProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { theme, toggleTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const isCurrentlyDark = theme === 'dark';
    const nextTheme = isCurrentlyDark ? 'light' : 'dark';

    // If View Transitions API is not supported in the browser or ref is unavailable,
    // fall back cleanly to instant state toggle
    if (
      typeof document === 'undefined' ||
      !('startViewTransition' in document) ||
      !buttonRef.current
    ) {
      toggleTheme();
      onToggle?.(!isCurrentlyDark);
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const doc = document as unknown as {
      startViewTransition: (callback: () => void) => {
        ready: Promise<void>;
      };
    };

    const transition = doc.startViewTransition(() => {
      setTheme(nextTheme);
      onToggle?.(!isCurrentlyDark);
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 450,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      })
      .catch(() => {
        // Safe fallback if transition animation is interrupted
      });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      {...props}
    >
      {mounted ? (
        theme === 'dark' ? (
          <Moon className="h-4 w-4 text-neutral-200 transition-all duration-200" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500 transition-all duration-200" />
        )
      ) : (
        <>
          <Sun className="h-4 w-4 text-amber-500 dark:hidden" />
          <Moon className="h-4 w-4 text-neutral-200 hidden dark:block" />
        </>
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

export function AnimatedThemeTogglerDemo() {
  return (
    <div className="flex justify-center p-6">
      <AnimatedThemeToggler />
    </div>
  );
}
