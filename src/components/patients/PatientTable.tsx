'use client';

import React from 'react';
import { Patient } from '@/lib/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Calendar, Stethoscope, CheckCircle2, Edit2, Trash2 } from 'lucide-react';

export interface PatientTableProps {
  patients: Patient[];
  isLoading?: boolean;
  onDischarge: (patientId: string) => void;
  onEdit?: (patient: Patient) => void;
  onDelete?: (patientId: string) => void;
}

export function PatientTable({
  patients,
  isLoading,
  onDischarge,
  onEdit,
  onDelete,
}: PatientTableProps) {
  if (isLoading) {
    return <PatientTableSkeleton />;
  }

  const getDoctorDisplay = (doc: Patient['doctor_id']) => {
    if (!doc) return 'Unassigned';
    if (typeof doc === 'string') return doc;
    return doc.doctor_name || 'Unassigned';
  };

  const getDoctorSpecialty = (doc: Patient['doctor_id']) => {
    if (!doc || typeof doc === 'string') return '';
    return doc.specialization || '';
  };

  const formatStatus = (status: string) => {
    if (status === 'under_observation') return 'Observation';
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#121212] shadow-subtle">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-neutral-800 bg-slate-50/75 dark:bg-neutral-900 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400">
              <th scope="col" className="py-3.5 px-4">Patient Name</th>
              <th scope="col" className="py-3.5 px-4">Age / Sex</th>
              <th scope="col" className="py-3.5 px-4">Clinical Diagnosis</th>
              <th scope="col" className="py-3.5 px-4">Attending Doctor</th>
              <th scope="col" className="py-3.5 px-4">Admitted</th>
              <th scope="col" className="py-3.5 px-4">Status</th>
              <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-neutral-800 text-sm">
            {patients.map((patient) => {
              const isDischarged = patient.status === 'discharged';
              return (
                <tr
                  key={patient._id}
                  className={`hover:bg-slate-50/80 dark:hover:bg-neutral-800/50 transition-colors ${
                    isDischarged ? 'bg-slate-50/40 dark:bg-neutral-900/30 text-slate-500 dark:text-neutral-400' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-neutral-100">
                    {patient.patient_name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-neutral-400">
                    {patient.age} yrs • {patient.gender}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 dark:text-neutral-200">
                      {patient.condition}
                    </span>
                    {patient.notes && (
                      <p className="text-xs text-slate-400 dark:text-neutral-500 truncate max-w-[200px]">
                        {patient.notes}
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-neutral-200">
                      <Stethoscope className="w-3.5 h-3.5 text-clinical-600 dark:text-clinical-400 shrink-0" />
                      <span>{getDoctorDisplay(patient.doctor_id)}</span>
                    </div>
                    {getDoctorSpecialty(patient.doctor_id) && (
                      <span className="text-xs text-slate-400 dark:text-neutral-500">
                        {getDoctorSpecialty(patient.doctor_id)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-neutral-400 whitespace-nowrap">
                    {formatDate(patient.admission_date)}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={patient.status} size="sm" withDot>
                      {formatStatus(patient.status)}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(patient)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-md transition focus-ring"
                        title="Edit Record"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(patient._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition focus-ring"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {!isDischarged && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDischarge(patient._id)}
                        className="py-1 px-2.5 text-xs text-slate-700 dark:text-neutral-300 hover:text-clinical-600 dark:hover:text-clinical-400 hover:border-clinical-300"
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Discharge
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List Fallback (< 768px) */}
      <div className="md:hidden space-y-3">
        {patients.map((patient) => {
          const isDischarged = patient.status === 'discharged';
          return (
            <div
              key={patient._id}
              className={`rounded-xl border p-4 bg-white dark:bg-[#121212] shadow-subtle ${
                isDischarged
                  ? 'border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/40 opacity-80'
                  : 'border-slate-200 dark:border-neutral-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-neutral-100">
                    {patient.patient_name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                    {patient.age} yrs • {patient.gender}
                  </p>
                </div>
                <Badge variant={patient.status} size="sm" withDot>
                  {formatStatus(patient.status)}
                </Badge>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-neutral-800 space-y-1.5 text-xs text-slate-600 dark:text-neutral-400">
                <div>
                  <span className="font-semibold text-slate-500 uppercase text-[10px]">
                    Condition:{' '}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-neutral-200">{patient.condition}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-clinical-600 dark:text-clinical-400 shrink-0" />
                  <span>Dr. {getDoctorDisplay(patient.doctor_id)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-neutral-500">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Admitted: {formatDate(patient.admission_date)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-end gap-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(patient)}
                    className="py-1 px-3 text-xs"
                  >
                    Edit
                  </Button>
                )}
                {!isDischarged && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onDischarge(patient._id)}
                    className="py-1 px-3 text-xs"
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Discharge
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(patient._id)}
                    className="py-1 px-3 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900"
                    leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PatientTableSkeleton() {
  return (
    <div>
      {/* Desktop Table Skeleton (>= md) */}
      <div className="hidden md:block w-full rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#121212] shadow-subtle p-4 space-y-4 animate-pulse">
        <div className="h-10 bg-slate-100 dark:bg-neutral-800 rounded-lg w-full" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-neutral-800 gap-4"
          >
            <div className="h-4 bg-slate-200 dark:bg-neutral-800 rounded w-1/4" />
            <div className="h-4 bg-slate-200 dark:bg-neutral-800 rounded w-1/6" />
            <div className="h-4 bg-slate-200 dark:bg-neutral-800 rounded w-1/4" />
            <div className="h-4 bg-slate-200 dark:bg-neutral-800 rounded w-1/6" />
            <div className="h-6 bg-slate-200 dark:bg-neutral-800 rounded-full w-20" />
          </div>
        ))}
      </div>

      {/* Mobile Card Skeletons (< md) */}
      <div className="md:hidden space-y-3 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#121212] p-4 shadow-subtle space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1.5 flex-1">
                <div className="h-5 bg-slate-200 dark:bg-neutral-800 rounded w-36" />
                <div className="h-3.5 bg-slate-200 dark:bg-neutral-800 rounded w-24" />
              </div>
              <div className="h-5 bg-slate-200 dark:bg-neutral-800 rounded-full w-20 shrink-0" />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-neutral-800">
              <div className="space-y-1">
                <div className="h-3 bg-slate-200 dark:bg-neutral-800 rounded w-16" />
                <div className="h-4 bg-slate-200 dark:bg-neutral-800 rounded w-28" />
              </div>
              <div className="space-y-1">
                <div className="h-3 bg-slate-200 dark:bg-neutral-800 rounded w-16" />
                <div className="h-4 bg-slate-200 dark:bg-neutral-800 rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
