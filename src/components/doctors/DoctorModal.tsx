'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Doctor } from '@/lib/types';
import { api } from '@/lib/api';
import { formatErrorMessage } from '@/lib/errorHandler';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { CustomSelect } from '../ui/CustomSelect';

export interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor?: Doctor | null;
}

const SPECIALIZATIONS = [
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Neurology', label: 'Neurology' },
  { value: 'Pediatrics', label: 'Pediatrics' },
  { value: 'Orthopedics', label: 'Orthopedics' },
  { value: 'General Medicine', label: 'General Medicine' },
  { value: 'Dermatology', label: 'Dermatology' },
  { value: 'Oncology', label: 'Oncology' },
];

const HOSPITALS = [
  { value: 'Metropolitan General Hospital', label: 'Metropolitan General Hospital' },
  { value: 'St. Jude Medical Center', label: 'St. Jude Medical Center' },
  { value: 'University Healthcare Center', label: 'University Healthcare Center' },
  { value: 'Cedar-Sinai Clinic', label: 'Cedar-Sinai Clinic' },
];

export function DoctorModal({ isOpen, onClose, doctor }: DoctorModalProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    doctor_name: '',
    specialization: 'Cardiology',
    hospital: 'Metropolitan General Hospital',
    email: '',
    phone: '',
    bio: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (doctor) {
      setFormData({
        doctor_name: doctor.doctor_name || '',
        specialization: doctor.specialization || 'Cardiology',
        hospital: doctor.hospital || 'Metropolitan General Hospital',
        email: doctor.email || '',
        phone: doctor.phone || '',
        bio: doctor.bio || '',
      });
    } else {
      setFormData({
        doctor_name: '',
        specialization: 'Cardiology',
        hospital: 'Metropolitan General Hospital',
        email: '',
        phone: '',
        bio: '',
      });
    }
    setErrors({});
  }, [doctor, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: typeof formData) => {
      if (doctor?._id) {
        return api.put(`/doctors/${doctor._id}`, data);
      }
      return api.post('/doctors', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      onClose();
    },
    onError: (err: Error) => {
      setErrors({ form: formatErrorMessage(err) });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.doctor_name.trim()) {
      newErrors.doctor_name = 'Doctor name is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
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
      title={doctor ? 'Edit Practitioner Profile' : 'Register New Doctor'}
      description="Add or update doctor credentials, department affiliation, and contact details."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300">
            {errors.form}
          </div>
        )}

        <Input
          label="Doctor Full Name"
          required
          placeholder="e.g. Dr. Sarah Jenkins, MD"
          value={formData.doctor_name}
          onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
          error={errors.doctor_name}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomSelect
            label="Specialization"
            required
            options={SPECIALIZATIONS}
            value={formData.specialization}
            onChange={(val) => setFormData({ ...formData, specialization: val })}
          />

          <CustomSelect
            label="Hospital Facility"
            required
            options={HOSPITALS}
            value={formData.hospital}
            onChange={(val) => setFormData({ ...formData, hospital: val })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="doctor@clinic.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <Input
            label="Contact Phone"
            type="tel"
            placeholder="+1 (555) 019-2834"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-neutral-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={mutation.isPending}
          >
            {doctor ? 'Save Changes' : 'Register Doctor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
