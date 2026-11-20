'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatedThemeToggler } from '@/registry/magicui/animated-theme-toggler';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { pillTokens } from '@/lib/themeTokens';
import {
  Activity,
  Users,
  BedDouble,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUserEmail(parsed.email || 'admin@clinic.com');
        } catch {
          setUserEmail('admin@clinic.com');
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.push('/login');
  };

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/doctors', label: 'Doctors', icon: Users },
    { href: '/patients', label: 'Inpatients', icon: BedDouble },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#121212] border-b border-slate-200 dark:border-neutral-800 shadow-subtle transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group focus-ring rounded-lg p-1" aria-label="Doctor Tracker Home">
              <BrandLogo size="md" />
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-neutral-100 tracking-tight leading-tight">
                  Doctor Tracker
                </span>
                <span className="text-[11px] font-semibold text-clinical-600 dark:text-clinical-400 tracking-wide">
                  Clinical Care Portal
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links: Impeccable Segmented Pill Track */}
            <nav
              className="hidden md:flex items-center p-1 rounded-xl bg-slate-100/70 dark:bg-neutral-900/80 border border-slate-200/60 dark:border-neutral-800 gap-1 backdrop-blur-xs select-none"
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold select-none transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-500 ${
                      active ? pillTokens.navActive : pillTokens.navInactive
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 transition-colors duration-200 ${
                        active ? 'text-clinical-600 dark:text-clinical-400' : 'text-slate-400 dark:text-neutral-500'
                      }`}
                    />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Animated Theme Toggler from Magic UI / shadcn */}
            <AnimatedThemeToggler />

            {/* Unified Session Pill: Authenticated User + Integrated Sign Out */}
            <div className="flex items-center h-9 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs overflow-hidden shadow-2xs">
              <div className="flex items-center gap-2 pl-2.5 pr-3 h-full select-none">
                <div className="w-5 h-5 rounded-md bg-clinical-500/15 dark:bg-clinical-500/20 text-clinical-600 dark:text-clinical-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-slate-700 dark:text-neutral-200 max-w-[150px] truncate tracking-tight">
                  {userEmail || 'admin@clinic.com'}
                </span>
              </div>

              <div className="w-px h-4 bg-slate-200 dark:bg-neutral-800 shrink-0" aria-hidden="true" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 h-full font-semibold text-slate-500 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 shrink-0"
                title="Sign out of portal"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Mobile Actions: Animated Theme Toggler + Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <AnimatedThemeToggler />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition focus-ring min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Flyout Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#121212] px-4 pt-3 pb-5 space-y-2 shadow-drawer">
          <nav className="flex flex-col gap-1.5" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold min-h-[48px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-500 ${
                    active
                      ? 'bg-clinical-50 dark:bg-neutral-800 text-clinical-700 dark:text-clinical-400 font-bold'
                      : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      active ? 'text-clinical-600 dark:text-clinical-400' : 'text-slate-400 dark:text-neutral-500'
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 mt-3 border-t border-slate-200 dark:border-neutral-800 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-xs">
              <div className="w-6 h-6 rounded-md bg-clinical-500/15 dark:bg-clinical-500/20 text-clinical-600 dark:text-clinical-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-neutral-500 tracking-wider">Authenticated Staff</span>
                <span className="font-semibold text-slate-800 dark:text-neutral-200 truncate">{userEmail || 'admin@clinic.com'}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50/70 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-lg transition min-h-[44px]"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
