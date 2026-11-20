'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Doctor, Patient, ApiResponse } from '@/lib/types';
import { api } from '@/lib/api';
import { formatErrorMessage } from '@/lib/errorHandler';
import { Drawer } from '../ui/Drawer';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { ErrorAlert } from '../ui/ErrorAlert';
import { User, Calendar, CheckCircle2, UserPlus, Stethoscope, Trash2 } from 'lucide-react';

export interface PatientDrawerProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAddPatient: (doctorId: string) => void;
}

export function PatientDrawer({
  doctor,
  isOpen,
  onClose,
  onOpenAddPatient,
}: PatientDrawerProps) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['patients', 'doctor', doctor?._id],
    queryFn: ({ signal }) =>
      api.get<ApiResponse<Patient[]>>(`/patients?doctor_id=${doctor?._id}`, { signal }),
    enabled: Boolean(doctor?._id && isOpen),
  });

  const dischargeMutation = useMutation({
    mutationFn: (patientId: string) =>
      api.put(`/patients/${patientId}`, { status: 'discharged' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (patientId: string) =>
      api.delete(`/patients/${patientId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  if (!doctor) return null;

  const patients = data?.data || [];
  const activePatients = patients.filter((p) => p.status !== 'discharged');

  const formatStatus = (s: string) => {
    if (s === 'under_observation') return 'Observation';
    if (!s) return 'Unknown';
    return s.charAt(0).toUpperCase() + s.slice(1);
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
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={doctor.doctor_name}
      subtitle={`${doctor.specialization} • ${doctor.hospital}`}
      badge={
        <Badge variant="clinical" size="sm">
          {activePatients.length} Active Cases
        </Badge>
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-1/3"
          >
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="w-2/3"
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={() => {
              onClose();
              onOpenAddPatient(doctor._id);
            }}
          >
            Assign Inpatient
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Doctor Summary Banner */}
        <div className="rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-clinical-100 dark:bg-clinical-950/60 text-clinical-700 dark:text-clinical-400 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Department Caseload
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-neutral-100">
                {activePatients.length} of {patients.length} total assigned records
              </p>
            </div>
          </div>
        </div>

        {/* 5-State Coverage */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 dark:border-neutral-800 p-4 space-y-3 bg-white dark:bg-[#121212] animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-3 w-2/3" />
                <div className="pt-2 border-t border-slate-100 dark:border-neutral-800 flex justify-between">
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-7 w-24 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorAlert
            title="Failed to load patient caseload"
            message={formatErrorMessage(error)}
            onRetry={() => refetch()}
          />
        ) : patients.length === 0 ? (
          <EmptyState
            icon={<User className="w-6 h-6 text-slate-400 dark:text-neutral-500" />}
            title="No Assigned Patients"
            description={`There are currently no patient admissions assigned to ${doctor.doctor_name}.`}
            actionLabel="Admit First Patient"
            onAction={() => {
              onClose();
              onOpenAddPatient(doctor._id);
            }}
          />
        ) : (
          <div className="space-y-3">
            {patients.map((patient) => {
              const isDischarged = patient.status === 'discharged';
              return (
                <div
                  key={patient._id}
                  className={`rounded-xl border p-4 transition-all ${
                    isDischarged
                      ? 'border-slate-200 dark:border-neutral-800 bg-slate-50/60 dark:bg-neutral-900/40 opacity-75'
                      : 'border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#121212] hover:border-clinical-300 dark:hover:border-clinical-600 shadow-subtle'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-neutral-100">
                        {patient.patient_name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                        {patient.age} yrs • {patient.gender} • Condition:{' '}
                        <span className="font-semibold text-slate-700 dark:text-neutral-300">
                          {patient.condition}
                        </span>
                      </p>
                    </div>
                    <Badge variant={patient.status} size="sm" withDot>
                      {formatStatus(patient.status)}
                    </Badge>
                  </div>

                  {patient.notes && (
                    <p className="mt-2 text-xs text-slate-600 dark:text-neutral-300 bg-slate-50 dark:bg-neutral-900 rounded-lg p-2 border border-slate-100 dark:border-neutral-800">
                      {patient.notes}
                    </p>
                  )}

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
                      <span>
                        Admitted: {formatDate(patient.admission_date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!isDischarged && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="py-1 px-2.5 text-xs text-slate-700 dark:text-neutral-300 hover:text-clinical-700 dark:hover:text-clinical-400 hover:border-clinical-300"
                          isLoading={dischargeMutation.isPending}
                          onClick={() => dischargeMutation.mutate(patient._id)}
                          leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        >
                          Discharge
                        </Button>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete patient record for ${patient.patient_name}?`)) {
                            deleteMutation.mutate(patient._id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition focus-ring"
                        title="Delete Patient Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Drawer>
  );
}
