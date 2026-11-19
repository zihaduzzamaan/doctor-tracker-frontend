import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/lib/query-provider';

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
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
