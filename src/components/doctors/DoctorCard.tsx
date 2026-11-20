'use client';

import React from 'react';
import { Doctor } from '@/lib/types';
import { User, Building2, Stethoscope, ChevronRight, Mail, Phone } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface DoctorCardProps {
  doctor: Doctor;
  onOpenDrawer: (doctor: Doctor) => void;
  onEdit?: (doctor: Doctor) => void;
}

export function DoctorCard({ doctor, onOpenDrawer, onEdit }: DoctorCardProps) {
  const activeCount = doctor.active_patient_count || 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-subtle hover:shadow-card transition flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-clinical-50 dark:bg-teal-950/60 border border-clinical-200 dark:border-teal-800/80 text-clinical-700 dark:text-clinical-400 flex items-center justify-center font-bold text-base shrink-0 group-hover:bg-clinical-100 dark:group-hover:bg-teal-900/40 transition">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                {doctor.doctor_name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-clinical-700 dark:text-clinical-400 font-medium mt-0.5">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>{doctor.specialization}</span>
              </div>
            </div>
          </div>
          <Badge
            variant={activeCount > 0 ? 'accent' : 'neutral'}
            size="sm"
            withDot={activeCount > 0}
          >
            {activeCount} {activeCount === 1 ? 'Patient' : 'Patients'}
          </Badge>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate">{doctor.hospital}</span>
          </div>
          {doctor.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="truncate">{doctor.email}</span>
            </div>
          )}
          {doctor.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="truncate">{doctor.phone}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          className="w-full justify-between"
          onClick={() => onOpenDrawer(doctor)}
          rightIcon={<ChevronRight className="w-4 h-4" />}
        >
          <span>Patient Caseload</span>
        </Button>
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(doctor)}
            className="px-2.5"
            title="Edit Doctor"
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}

export function DoctorCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-subtle flex flex-col justify-between h-[210px] animate-pulse">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 w-3/4">
            <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="space-y-2 w-full">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            </div>
          </div>
          <div className="w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
      </div>
    </div>
  );
}
