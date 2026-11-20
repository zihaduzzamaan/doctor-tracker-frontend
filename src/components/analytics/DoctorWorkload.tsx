'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, User } from 'lucide-react';

export interface DoctorWorkloadProps {
  doctors: Array<{
    _id: string;
    doctor_name: string;
    specialization: string;
    active_patient_count: number;
  }>;
  isLoading?: boolean;
}

export function DoctorWorkload({ doctors, isLoading }: DoctorWorkloadProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-subtle space-y-4 animate-pulse">
        <div className="space-y-1.5">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        </div>
        <div className="space-y-3 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 w-1/2">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="space-y-1.5 w-full">
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-subtle flex flex-col justify-between transition-colors">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Practitioner Caseload Ranking
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Active assigned inpatient distribution across medical staff
            </p>
          </div>
          <Link
            href="/doctors"
            className="text-xs font-semibold text-clinical-600 dark:text-clinical-400 hover:text-clinical-700 dark:hover:text-clinical-300 flex items-center gap-1 focus-ring rounded p-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {doctors.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
              No active doctor records found
            </p>
          ) : (
            doctors.slice(0, 6).map((doc) => {
              const count = doc.active_patient_count || 0;
              const isHeavy = count >= 6;
              const percentage = Math.min(100, Math.round((count / 10) * 100));

              return (
                <div key={doc._id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-clinical-600 dark:text-clinical-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {doc.doctor_name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{doc.specialization}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-20 hidden sm:block bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isHeavy ? 'bg-accent-500' : 'bg-clinical-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isHeavy
                          ? 'bg-accent-50 dark:bg-amber-950/40 text-accent-800 dark:text-amber-300 border border-accent-200 dark:border-amber-800/60'
                          : 'bg-clinical-50 dark:bg-teal-950/40 text-clinical-800 dark:text-teal-300 border border-clinical-200 dark:border-teal-800/60'
                      }`}
                    >
                      {count} {count === 1 ? 'patient' : 'patients'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
