'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navbar } from '@/components/layout/Navbar';
import { PatientTable, PatientTableSkeleton } from '@/components/patients/PatientTable';
import { PatientModal } from '@/components/patients/PatientModal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { api } from '@/lib/api';
import { formatErrorMessage } from '@/lib/errorHandler';
import { Patient, ApiResponse } from '@/lib/types';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Plus, BedDouble, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function PatientsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

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
  const [status, setStatus] = useState<string>('');
  const [condition, setCondition] = useState('');
  const debouncedCondition = useDebounce(condition, 300);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Fetch patients
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['patients', debouncedSearch, status, debouncedCondition, startDate, endDate, page],
    queryFn: ({ signal }) => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (status) params.append('status', status);
      if (debouncedCondition) params.append('condition', debouncedCondition);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      return api.get<ApiResponse<Patient[]>>(`/patients?${params.toString()}`, { signal });
    },
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

  const patients = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const statusFilters = [
    { label: 'All Inpatients', value: '' },
    { label: 'Admitted', value: 'admitted' },
    { label: 'Observation', value: 'under_observation' },
    { label: 'Discharged', value: 'discharged' },
  ];

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex flex-col transition-colors duration-150">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-neutral-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-neutral-100 tracking-tight">
              Inpatient Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1">
              Track clinical admissions, monitor attending doctors, and process patient discharges.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingPatient(null);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto justify-center"
          >
            Record Admission
          </Button>
        </div>

        {/* Search & Segmented Status Filter Tabs */}
        <div className="bg-white dark:bg-[#121212] p-4 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-subtle space-y-3 transition-colors">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="w-full sm:max-w-xs">
              <Input
                placeholder="Search by patient name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>

            {/* Responsive 2x2 on Mobile, Inline on Desktop without Clipping */}
            <div
              className="grid grid-cols-2 sm:flex sm:flex-row p-1 bg-slate-100 dark:bg-neutral-900 rounded-xl border border-slate-200/80 dark:border-neutral-800 gap-1 w-full sm:w-auto"
              role="tablist"
              aria-label="Filter patients by clinical status"
            >
              {statusFilters.map((f) => {
                const active = status === f.value;
                return (
                  <button
                    key={f.value}
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setStatus(f.value);
                      setPage(1);
                    }}
                    className={`px-3 py-2 sm:py-1.5 sm:px-3.5 rounded-lg text-xs font-semibold text-center whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-clinical-500 ${
                      active
                        ? 'bg-clinical-600 text-white shadow-sm font-bold ring-1 ring-inset ring-clinical-500'
                        : 'text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Condition and Date-Wise Filters with Zero Horizontal Overflow */}
          <div className="pt-2 border-t border-slate-100 dark:border-neutral-800 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 flex-1 min-w-0">
              <span className="font-semibold text-slate-500 dark:text-neutral-400 shrink-0">Condition:</span>
              <Input
                placeholder="e.g. Cardiology, Hypertension"
                value={condition}
                onChange={(e) => {
                  setCondition(e.target.value);
                  setPage(1);
                }}
                className="w-full sm:w-48 text-xs py-1.5 min-h-[36px]"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 flex-1 min-w-0">
              <span className="font-semibold text-slate-500 dark:text-neutral-400 shrink-0">Admission Date:</span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full sm:w-auto min-w-0 border border-slate-300 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-clinical-500"
                  title="Start Date"
                />
                <span className="text-slate-400 dark:text-neutral-500 shrink-0">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full sm:w-auto min-w-0 border border-slate-300 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-clinical-500"
                  title="End Date"
                />
              </div>
            </div>

            {(search || status || condition || startDate || endDate) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setStatus('');
                  setCondition('');
                  setStartDate('');
                  setEndDate('');
                  setPage(1);
                }}
                className="w-full sm:w-auto sm:ml-auto py-1 px-2.5 text-xs text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-slate-100 justify-center"
                leftIcon={<X className="w-3.5 h-3.5" />}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <ErrorAlert
            title="Unable to load inpatient records"
            message={formatErrorMessage(error)}
            onRetry={() => refetch()}
          />
        )}

        {/* 5-State Patient Table */}
        {isLoading ? (
          <PatientTableSkeleton />
        ) : patients.length === 0 ? (
          <EmptyState
            icon={<BedDouble className="w-6 h-6 text-slate-400 dark:text-neutral-500" />}
            title="No Inpatient Records"
            description="No admissions match your search filter or active category."
            actionLabel="Reset Search"
            onAction={() => {
              setSearch('');
              setStatus('');
              setCondition('');
              setStartDate('');
              setEndDate('');
              setPage(1);
            }}
          />
        ) : (
          <div className="space-y-4">
            <PatientTable
              patients={patients}
              onDischarge={(id) => dischargeMutation.mutate(id)}
              onEdit={handleEdit}
              onDelete={(id) => {
                if (window.confirm('Are you sure you want to delete this patient admission record?')) {
                  deleteMutation.mutate(id);
                }
              }}
            />

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-500 dark:text-neutral-400">
              <span>
                Showing {patients.length} of {pagination.total} records (Page {page} of{' '}
                {pagination.totalPages})
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Admission Modal */}
      <PatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={editingPatient}
      />
    </div>
  );
}
