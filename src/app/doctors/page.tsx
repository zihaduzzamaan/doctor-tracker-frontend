'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Navbar } from '@/components/layout/Navbar';
import { DoctorCard, DoctorCardSkeleton } from '@/components/doctors/DoctorCard';
import { PatientDrawer } from '@/components/doctors/PatientDrawer';
import { DoctorModal } from '@/components/doctors/DoctorModal';
import { PatientModal } from '@/components/patients/PatientModal';
import { Input } from '@/components/ui/Input';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { api } from '@/lib/api';
import { formatErrorMessage } from '@/lib/errorHandler';
import { Doctor, ApiResponse } from '@/lib/types';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Plus, Stethoscope, X } from 'lucide-react';

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

function DoctorsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    }
  }, [router]);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
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

  // Fetch doctors with filters (including date-wise) and stable placeholder data
  const { data, isPending, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['doctors', debouncedSearch, specialization, hospital, startDate, endDate],
    queryFn: ({ signal }) => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (specialization) params.append('specialization', specialization);
      if (hospital) params.append('hospital', hospital);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('limit', '50');
      return api.get<ApiResponse<Doctor[]>>(`/doctors?${params.toString()}`, { signal });
    },
    placeholderData: keepPreviousData,
  });

  const doctors = data?.data || [];

  // Synchronize modal and drawer state with URL query parameters for dedicated links
  useEffect(() => {
    const modalParam = searchParams.get('modal');
    const idParam = searchParams.get('id');
    const drawerParam = searchParams.get('drawer');
    const doctorIdParam = searchParams.get('doctorId');

    if (modalParam === 'register-doctor') {
      setEditingDoctor(null);
      setIsDoctorModalOpen(true);
    } else if (modalParam === 'edit-doctor' && idParam) {
      if (doctors.length > 0) {
        const found = doctors.find((d) => d._id === idParam);
        if (found) {
          setEditingDoctor(found);
          setIsDoctorModalOpen(true);
        }
      }
    } else {
      setIsDoctorModalOpen(false);
      setEditingDoctor(null);
    }

    if (modalParam === 'admit') {
      setTargetDoctorId(doctorIdParam || null);
      setIsPatientModalOpen(true);
    } else {
      setIsPatientModalOpen(false);
    }

    if (drawerParam) {
      if (doctors.length > 0) {
        const found = doctors.find((d) => d._id === drawerParam);
        if (found) {
          setSelectedDoctor(found);
          setIsDrawerOpen(true);
        }
      }
    } else {
      setIsDrawerOpen(false);
      setSelectedDoctor(null);
    }
  }, [searchParams, doctors]);

  const openRegisterDoctor = () => {
    setEditingDoctor(null);
    setIsDoctorModalOpen(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set('modal', 'register-doctor');
    params.delete('id');
    router.push(`/doctors?${params.toString()}`, { scroll: false });
  };

  const handleOpenDrawer = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDrawerOpen(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set('drawer', doctor._id);
    router.push(`/doctors?${params.toString()}`, { scroll: false });
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setIsDoctorModalOpen(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set('modal', 'edit-doctor');
    params.set('id', doctor._id);
    router.push(`/doctors?${params.toString()}`, { scroll: false });
  };

  const handleOpenAddPatient = (docId: string) => {
    setTargetDoctorId(docId);
    setIsPatientModalOpen(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set('modal', 'admit');
    params.set('doctorId', docId);
    router.push(`/doctors?${params.toString()}`, { scroll: false });
  };

  const closeDoctorModal = () => {
    setIsDoctorModalOpen(false);
    setEditingDoctor(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('modal');
    params.delete('id');
    const query = params.toString();
    router.push(query ? `/doctors?${query}` : '/doctors', { scroll: false });
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDoctor(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('drawer');
    const query = params.toString();
    router.push(query ? `/doctors?${query}` : '/doctors', { scroll: false });
  };

  const closePatientModal = () => {
    setIsPatientModalOpen(false);
    setTargetDoctorId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('modal');
    params.delete('doctorId');
    const query = params.toString();
    router.push(query ? `/doctors?${query}` : '/doctors', { scroll: false });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex flex-col transition-colors duration-150">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-neutral-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-neutral-100 tracking-tight">
              Medical Practitioners Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1">
              Browse doctor profiles, inspect real-time inpatient caseloads, and manage department staffing.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={openRegisterDoctor}
            className="w-full sm:w-auto justify-center"
          >
            Register Practitioner
          </Button>
        </div>

        {/* Filter Toolbar with Search, Department, Hospital & Date-wise Filter */}
        <div className="bg-white dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-subtle space-y-3 transition-colors">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              placeholder="Search by doctor name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />

            <CustomSelect
              options={SPECIALIZATIONS}
              value={specialization}
              onChange={(val) => setSpecialization(val)}
              placeholder="All Specializations"
            />

            <CustomSelect
              options={HOSPITALS}
              value={hospital}
              onChange={(val) => setHospital(val)}
              placeholder="All Hospital Facilities"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-neutral-800 text-xs">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 min-w-0">
              <span className="font-semibold text-slate-600 dark:text-neutral-400 shrink-0">Registered Date Range:</span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <CustomDatePicker
                  value={startDate}
                  onChange={(d) => setStartDate(d)}
                  placeholder="Start date..."
                  size="sm"
                  className="w-full sm:w-36"
                />
                <span className="text-slate-400 dark:text-neutral-500 shrink-0">to</span>
                <CustomDatePicker
                  value={endDate}
                  onChange={(d) => setEndDate(d)}
                  placeholder="End date..."
                  size="sm"
                  align="right"
                  className="w-full sm:w-36"
                />
              </div>
            </div>

            {(search || specialization || hospital || startDate || endDate) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSpecialization('');
                  setHospital('');
                  setStartDate('');
                  setEndDate('');
                }}
                className="w-full sm:w-auto sm:ml-auto h-9 px-3 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/50 transition-colors flex items-center justify-center gap-1.5 shrink-0 focus:outline-none"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear All Filters</span>
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

        {/* 5-State Doctor Grid with Min-Height to eliminate scrollbar jump */}
        <div className="min-h-[520px]">
          {isPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <DoctorCardSkeleton key={i} />
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <EmptyState
              icon={<Stethoscope className="w-6 h-6 text-slate-400 dark:text-neutral-500" />}
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
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${isFetching ? 'opacity-75' : 'opacity-100'}`}>
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
        </div>
      </main>

      {/* Slide-over Patient Drawer */}
      <PatientDrawer
        doctor={selectedDoctor}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        onOpenAddPatient={handleOpenAddPatient}
      />

      {/* Add / Edit Doctor Modal */}
      <DoctorModal
        isOpen={isDoctorModalOpen}
        onClose={closeDoctorModal}
        doctor={editingDoctor}
      />

      {/* Inpatient Admission Modal */}
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={closePatientModal}
        defaultDoctorId={targetDoctorId}
      />
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={null}>
      <DoctorsContent />
    </Suspense>
  );
}
