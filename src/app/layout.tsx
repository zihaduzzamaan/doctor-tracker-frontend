import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/lib/query-provider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export const metadata: Metadata = {
  title: 'Doctor Tracker: Healthcare Admin Portal',
  description: 'Production-grade healthcare portal for tracking practitioners, admissions, and clinical workload.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 antialiased transition-colors duration-150">
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
