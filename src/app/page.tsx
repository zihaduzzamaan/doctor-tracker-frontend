'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Users, UserPlus, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">Doctor Tracker</span>
              <span className="ml-2 text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-semibold border border-teal-200">
                Clinic Admin
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Streamlined Practitioner & Inpatient Tracking
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            A high-performance portal built with Next.js 15, Node.js Express, and MongoDB. Monitor doctor schedules, patient caseloads, and admission analytics in real time.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/login"
              className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition shadow"
            >
              Access Portal
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Practitioner Directory</h3>
            <p className="mt-2 text-sm text-slate-600">
              Manage medical doctors across clinic branches with instant full-text search, department filtering, and active patient badges.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Patient Drawer Workflows</h3>
            <p className="mt-2 text-sm text-slate-600">
              Click any doctor to slide open their active caseload, review admission details, or assign new patient records.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Enterprise Security</h3>
            <p className="mt-2 text-sm text-slate-600">
              JWT session authorization, input sanitization, strict TypeScript typing, and WCAG 2.2 AA accessibility standards.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          Doctor Tracker Clinic Management System &bull; Production Ready
        </div>
      </footer>
    </div>
  );
}
