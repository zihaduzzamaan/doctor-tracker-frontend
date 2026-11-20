/**
 * Central Reusable Design System Tokens
 * Single source of truth for color definitions, badges, pills, icon containers, and UI state styling.
 * Complies with Impeccable Design System principles and WCAG 2.2 Level AA/AAA contrast ratios.
 */

export const colorPalette = {
  // Brand Clinical Palette (30% secondary / primary brand)
  clinical: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
    950: '#042f2e',
  },
  // Clinical Accent / Amber Palette (10% intentional triage & attention)
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  // True Black & Neutral Dark Gray Surfaces
  darkSurfaces: {
    canvas: '#000000',
    card: '#121212',
    pill: '#18181b', // dark gray for pills and icon containers in dark mode
    border: '#262626',
    borderMuted: '#1f1f1f',
  },
} as const;

export interface BadgeTokenStyle {
  badge: string;
  dot: string;
}

/**
 * Reusable Badge and Pill Variants with optional status dots
 * Guarantees zero white backgrounds in dark mode and high-contrast readability (> 8:1 contrast).
 */
export const badgeTokens = {
  // Clinical Teal Pills (e.g. "All Departments", "In Bed", "Observation", etc.)
  clinical: {
    badge:
      'bg-clinical-50 dark:bg-neutral-900 text-clinical-800 dark:text-clinical-400 border border-clinical-200/80 dark:border-neutral-800 font-semibold',
    dot: 'bg-clinical-500',
  },
  // Amber Accent Pills (e.g. "Admitted", Heavy Caseload warnings)
  accent: {
    badge:
      'bg-accent-50 dark:bg-neutral-900 text-accent-800 dark:text-amber-400 border border-accent-200/80 dark:border-neutral-800 font-semibold',
    dot: 'bg-accent-500',
  },
  // Neutral / Gray Pills (e.g. "Discharged", "Resolved", Historical)
  neutral: {
    badge:
      'bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-800 font-medium',
    dot: 'bg-slate-400 dark:bg-neutral-500',
  },
  // Status-Specific Mappings
  admitted: {
    badge:
      'bg-accent-50 dark:bg-neutral-900 text-accent-800 dark:text-amber-400 border border-accent-200/80 dark:border-neutral-800 font-semibold',
    dot: 'bg-accent-500',
  },
  observation: {
    badge:
      'bg-clinical-50 dark:bg-neutral-900 text-clinical-800 dark:text-clinical-400 border border-clinical-200/80 dark:border-neutral-800 font-semibold',
    dot: 'bg-clinical-500',
  },
  under_observation: {
    badge:
      'bg-clinical-50 dark:bg-neutral-900 text-clinical-800 dark:text-clinical-400 border border-clinical-200/80 dark:border-neutral-800 font-semibold',
    dot: 'bg-clinical-500',
  },
  discharged: {
    badge:
      'bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-800 font-medium',
    dot: 'bg-slate-400 dark:bg-neutral-500',
  },
} as const;

/**
 * Reusable Pill Tokens (including navigation pills)
 */
export const pillTokens = {
  clinical: badgeTokens.clinical,
  accent: badgeTokens.accent,
  neutral: badgeTokens.neutral,
  admitted: badgeTokens.admitted,
  observation: badgeTokens.observation,
  under_observation: badgeTokens.under_observation,
  discharged: badgeTokens.discharged,
  navActive:
    'bg-white dark:bg-neutral-800 text-clinical-700 dark:text-clinical-400 shadow-xs font-bold',
  navInactive:
    'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-100 hover:bg-slate-200/50 dark:hover:bg-neutral-800/50',
} as const;

/**
 * Reusable Icon Container Token Classes
 * Used in MetricCards, Doctor Cards, Workload rankings, and modal headers.
 * Uses refined dark gray/black backgrounds with vibrant colored icons in dark mode.
 */
export const iconContainerTokens = {
  clinical:
    'bg-clinical-50 dark:bg-neutral-900 text-clinical-600 dark:text-clinical-400 border border-clinical-200/80 dark:border-neutral-800',
  accent:
    'bg-accent-50 dark:bg-neutral-900 text-accent-700 dark:text-amber-400 border border-accent-200/80 dark:border-neutral-800',
  slate:
    'bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-800',
  neutral:
    'bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-800',
} as const;
