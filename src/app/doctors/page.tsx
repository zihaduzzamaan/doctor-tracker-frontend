'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/layout/Navbar';
import { DoctorCard, DoctorCardSkeleton } from '@/components/doctors/DoctorCard';
import { PatientDrawer } from '@/components/doctors/PatientDrawer';
import { DoctorModal } from '@/components/doctors/DoctorModal';
import { PatientModal } from '@/components/patients/PatientModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { api } from '@/lib/api';
import { formatErrorMessage } from '@/lib/errorHandler';
import { Doctor, ApiResponse } from '@/lib/types';
import { Search, Plus, Stethoscope, Filter } from 'lucide-react';

const SPECIALIZATIONS = [
  { value: '', label: 'All Specializations' },
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Neurology', label: 'Neurology' },
  { value: 'Pediatrics', label: 'Pediatrics' },
  { value: 'Orthopedics', label: 'Orthopedics' },
  { value: 'General Medicine', label: 'General Medicine' },
  { value: 'Dermatology', label: 'Dermatology' },
  { value: 'Oncology', label: 'Oncology' },
];

const HOSPITALS = [
  { value: '', label: 'All Hospital Facilities' },
  { value: 'Metropolitan General Hospital', label: 'Metropolitan General Hospital' },
  { value: 'St. Jude Medical Center', label: 'St. Jude Medical Center' },
  { value: 'University Healthcare Center', label: 'University Healthcare Center' },
  { value: 'Cedar-Sinai Clinic', label: 'Cedar-Sinai Clinic' },
];

export default function DoctorsPage() {
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [hospital, setHospital] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals and Drawer state
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [targetDoctorId, setTargetDoctorId] = useState<string | null>(null);

  // Fetch doctors with filters (including date-wise)
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['doctors', search, specialization, hospital, startDate, endDate],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (specialization) params.append('specialization', specialization);
      if (hospital) params.append('hospital', hospital);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('limit', '50');
      return api.get<ApiResponse<Doctor[]>>(`/doctors?${params.toString()}`);
    },
  });

  const doctors = data?.data || [];

  const handleOpenDrawer = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDrawerOpen(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setIsDoctorModalOpen(true);
  };

  const handleOpenAddPatient = (docId: string) => {
    setTargetDoctorId(docId);
    setIsPatientModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Medical Practitioners Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse doctor profiles, inspect real-time inpatient caseloads, and manage department staffing.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingDoctor(null);
              setIsDoctorModalOpen(true);
            }}
          >
            Register Practitioner
          </Button>
        </div>

        {/* Filter Toolbar with Search, Department, Hospital & Date-wise Filter */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              placeholder="Search by doctor name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />

            <Select
              options={SPECIALIZATIONS}
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />

            <Select
              options={HOSPITALS}
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="font-semibold text-slate-600">Registered Date Range:</span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-clinical-600"
                  title="Registered Start Date"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-clinical-600"
                  title="Registered End Date"
                />
              </div>
            </div>

            {(search || specialization || hospital || startDate || endDate) && (
              <button
                onClick={() => {
                  setSearch('');
                  setSpecialization('');
                  setHospital('');
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline self-start sm:self-auto"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <ErrorAlert
            title="Unable to load practitioners"
            message={formatErrorMessage(error)}
            onRetry={() => refetch()}
          />
        )}

        {/* 5-State Doctor Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <EmptyState
            icon={<Stethoscope className="w-6 h-6 text-slate-400" />}
            title="No Practitioners Found"
            description="No medical doctors match your current search criteria or department filter."
            actionLabel="Reset Search Filters"
            onAction={() => {
              setSearch('');
              setSpecialization('');
              setHospital('');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                onOpenDrawer={handleOpenDrawer}
                onEdit={handleEditDoctor}
              />
            ))}
          </div>
        )}
      </main>

      {/* Slide-over Patient Drawer */}
      <PatientDrawer
        doctor={selectedDoctor}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenAddPatient={handleOpenAddPatient}
      />

      {/* Add / Edit Doctor Modal */}
      <DoctorModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        doctor={editingDoctor}
      />

      {/* Inpatient Admission Modal */}
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        defaultDoctorId={targetDoctorId}
      />
    </div>
  );
}
