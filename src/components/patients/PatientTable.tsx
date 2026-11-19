'use client';

import React from 'react';
import { Patient, Doctor } from '@/lib/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Calendar, User, Stethoscope, CheckCircle2, MoreVertical, Edit2 } from 'lucide-react';

export interface PatientTableProps {
  patients: Patient[];
  isLoading?: boolean;
  onDischarge: (patientId: string) => void;
  onEdit?: (patient: Patient) => void;
}

export function PatientTable({
  patients,
  isLoading,
  onDischarge,
  onEdit,
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

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-subtle">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-600">
              <th scope="col" className="py-3.5 px-4">Patient Name</th>
              <th scope="col" className="py-3.5 px-4">Age / Sex</th>
              <th scope="col" className="py-3.5 px-4">Clinical Diagnosis</th>
              <th scope="col" className="py-3.5 px-4">Attending Doctor</th>
              <th scope="col" className="py-3.5 px-4">Admitted</th>
              <th scope="col" className="py-3.5 px-4">Status</th>
              <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {patients.map((patient) => {
              const isDischarged = patient.status === 'discharged';
              return (
                <tr
                  key={patient._id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isDischarged ? 'bg-slate-50/40 text-slate-500' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {patient.patient_name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {patient.age} yrs • {patient.gender}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">
                      {patient.condition}
                    </span>
                    {patient.notes && (
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">
                        {patient.notes}
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <Stethoscope className="w-3.5 h-3.5 text-clinical-600 shrink-0" />
                      <span>{getDoctorDisplay(patient.doctor_id)}</span>
                    </div>
                    {getDoctorSpecialty(patient.doctor_id) && (
                      <span className="text-xs text-slate-400">
                        {getDoctorSpecialty(patient.doctor_id)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                    {new Date(patient.admission_date).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={patient.status} size="sm" withDot>
                      {patient.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(patient)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition focus-ring"
                        title="Edit Record"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {!isDischarged && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDischarge(patient._id)}
                        className="py-1 px-2.5 text-xs text-slate-700 hover:text-clinical-700 hover:border-clinical-300"
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
              className={`rounded-xl border p-4 bg-white shadow-subtle ${
                isDischarged ? 'border-slate-200 bg-slate-50/50 opacity-80' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-base text-slate-900">
                    {patient.patient_name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {patient.age} yrs • {patient.gender}
                  </p>
                </div>
                <Badge variant={patient.status} size="sm" withDot>
                  {patient.status}
                </Badge>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-500 uppercase text-[10px]">
                    Condition:{' '}
                  </span>
                  <span className="font-bold text-slate-800">{patient.condition}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-clinical-600 shrink-0" />
                  <span>Dr. {getDoctorDisplay(patient.doctor_id)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Admitted: {new Date(patient.admission_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-end gap-2">
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
    <div className="w-full rounded-xl border border-slate-200 bg-white shadow-subtle p-4 space-y-4 animate-pulse">
      <div className="h-10 bg-slate-100 rounded-lg w-full" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-3 border-b border-slate-100 gap-4"
        >
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-200 rounded w-1/6" />
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-200 rounded w-1/6" />
          <div className="h-6 bg-slate-200 rounded-full w-20" />
        </div>
      ))}
    </div>
  );
}
