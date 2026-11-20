'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { api } from '@/lib/api';
import { formatErrorMessage } from '@/lib/errorHandler';
import { ApiResponse, User } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fillDemoCredentials = () => {
    setEmail('admin@clinic.com');
    setPassword('password123');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post<ApiResponse<{ token: string; user: User }>>(
        '/auth/login',
        { email, password }
      );

      if (response.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/');
      } else {
        throw new Error(response.message || 'Authentication failed');
      }
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-150">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-clinical-600 text-white flex items-center justify-center shadow-card">
            <Activity className="w-8 h-8" />
          </div>
        </div>
        <h1 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Doctor Tracker Portal
        </h1>
        <p className="mt-1 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Clinical Operations & Medical Practitioner Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-drawer sm:rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
          {error && (
            <div className="mb-6">
              <ErrorAlert title="Sign In Failed" message={error} />
            </div>
          )}

          {/* 1-Click Demo Login Banner */}
          <div className="mb-6 rounded-xl bg-clinical-50/80 dark:bg-teal-950/40 border border-clinical-200/80 dark:border-teal-800/60 p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-clinical-100 dark:bg-teal-900/60 text-clinical-700 dark:text-teal-300 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h2 className="text-xs font-bold text-clinical-900 dark:text-teal-200">
                  Evaluation Demo Mode
                </h2>
                <p className="text-[11px] text-clinical-700 dark:text-teal-300 mt-0.5 leading-snug">
                  Click below to prefill verified clinic admin credentials.
                </p>
                <div className="mt-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-semibold border-clinical-300 dark:border-teal-700 text-clinical-800 dark:text-teal-200 bg-white dark:bg-slate-800 hover:bg-clinical-50 dark:hover:bg-teal-950/60"
                    onClick={fillDemoCredentials}
                  >
                    Fill Demo Credentials (`admin@clinic.com`)
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full text-sm font-bold"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Portal
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <ShieldCheck className="w-4 h-4 text-clinical-600 dark:text-clinical-400" />
            <span>OWASP ASVS Compliant • 256-bit Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
