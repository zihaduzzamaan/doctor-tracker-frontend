'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Patient, Doctor, ApiResponse } from '@/lib/types';
import { api } from '@/lib/api';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

export interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: Patient | null;
  defaultDoctorId?: string | null;
}

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const STATUSES = [
  { value: 'admitted', label: 'Admitted (Inpatient)' },
  { value: 'observation', label: 'Clinical Observation' },
  { value: 'discharged', label: 'Discharged' },
];

export function PatientModal({
  isOpen,
  onClose,
  patient,
  defaultDoctorId,
}: PatientModalProps) {
  const queryClient = useQueryClient();

  // Query doctors for dropdown
  const { data: doctorsData } = useQuery({
    queryKey: ['doctors', 'dropdown'],
    queryFn: () => api.get<ApiResponse<Doctor[]>>('/doctors?limit=50'),
    enabled: isOpen,
  });

  const doctors = doctorsData?.data || [];
  const doctorOptions = doctors.map((d) => ({
    value: d._id,
    label: `${d.doctor_name} (${d.specialization})`,
  }));

  const [formData, setFormData] = useState({
    patient_name: '',
    age: 40,
    gender: 'male' as 'male' | 'female' | 'other',
    condition: '',
    admission_date: new Date().toISOString().split('T')[0],
    doctor_id: '',
    status: 'admitted' as 'admitted' | 'observation' | 'discharged',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (patient) {
      const docId =
        typeof patient.doctor_id === 'string'
          ? patient.doctor_id
          : patient.doctor_id?._id || '';

      setFormData({
        patient_name: patient.patient_name || '',
        age: patient.age || 40,
        gender: patient.gender || 'male',
        condition: patient.condition || '',
        admission_date: patient.admission_date
          ? new Date(patient.admission_date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        doctor_id: docId,
        status: patient.status || 'admitted',
        notes: patient.notes || '',
      });
    } else {
      setFormData({
        patient_name: '',
        age: 35,
        gender: 'male',
        condition: '',
        admission_date: new Date().toISOString().split('T')[0],
        doctor_id: defaultDoctorId || (doctorOptions[0]?.value || ''),
        status: 'admitted',
        notes: '',
      });
    }
    setErrors({});
  }, [patient, defaultDoctorId, isOpen, doctorOptions.length]);

  const mutation = useMutation({
    mutationFn: (data: typeof formData) => {
      if (patient?._id) {
        return api.put(`/patients/${patient._id}`, data);
      }
      return api.post('/patients', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      onClose();
    },
    onError: (err: Error) => {
      setErrors({ form: err.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.patient_name.trim()) {
      newErrors.patient_name = 'Patient name is required';
    }

    if (!formData.condition.trim()) {
      newErrors.condition = 'Clinical diagnosis is required';
    }

    if (!formData.doctor_id) {
      newErrors.doctor_id = 'Please assign an attending doctor';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={patient ? 'Edit Admission Record' : 'Register New Patient Admission'}
      description="Record inpatient medical details, assign attending doctor, and track clinical status."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700">
            {errors.form}
          </div>
        )}

        <Input
          label="Patient Full Name"
          required
          placeholder="e.g. Eleanor Vance"
          value={formData.patient_name}
          onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
          error={errors.patient_name}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Age"
            type="number"
            min={0}
            max={120}
            required
            value={formData.age}
            onChange={(e) =>
              setFormData({ ...formData, age: parseInt(e.target.value, 10) || 0 })
            }
          />

          <Select
            label="Gender"
            required
            options={GENDERS}
            value={formData.gender}
            onChange={(e) =>
              setFormData({
                ...formData,
                gender: e.target.value as 'male' | 'female' | 'other',
              })
            }
          />
        </div>

        <Input
          label="Clinical Diagnosis / Condition"
          required
          placeholder="e.g. Acute Coronary Syndrome, Type 2 Diabetes"
          value={formData.condition}
          onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
          error={errors.condition}
        />

        <Select
          label="Attending Doctor"
          required
          options={
            doctorOptions.length > 0
              ? doctorOptions
              : [{ value: '', label: 'Loading doctors...' }]
          }
          value={formData.doctor_id}
          onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
          error={errors.doctor_id}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Admission Date"
            type="date"
            required
            value={formData.admission_date}
            onChange={(e) => setFormData({ ...formData, admission_date: e.target.value })}
          />

          <Select
            label="Admission Status"
            required
            options={STATUSES}
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as 'admitted' | 'observation' | 'discharged',
              })
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Clinical Notes (Optional)
          </label>
          <textarea
            rows={2}
            className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-clinical-600 focus:ring-2 focus:ring-clinical-100 focus:outline-none"
            placeholder="Add relevant triage notes or treatment observations..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={mutation.isPending}
          >
            {patient ? 'Save Changes' : 'Record Admission'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
