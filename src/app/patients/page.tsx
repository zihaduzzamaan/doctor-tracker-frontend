'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
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

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

function PatientsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  // Fetch patients with stable placeholder data to eliminate layout shifts
  const { data, isPending, isFetching, isError, error, refetch } = useQuery({
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
    placeholderData: keepPreviousData,
  });

  const patients = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  // Synchronize modal state with URL query parameters for dedicated links
  useEffect(() => {
    const modalParam = searchParams.get('modal');
    const idParam = searchParams.get('id');

    if (modalParam === 'admit') {
      setEditingPatient(null);
      setIsModalOpen(true);
    } else if (modalParam === 'edit' && idParam) {
      if (patients.length > 0) {
        const found = patients.find((p) => p._id === idParam);
        if (found) {
          setEditingPatient(found);
          setIsModalOpen(true);
        }
      }
    } else if (!modalParam) {
      setIsModalOpen(false);
      setEditingPatient(null);
    }
  }, [searchParams, patients]);

  const openAdmitModal = () => {
    setEditingPatient(null);
    setIsModalOpen(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set('modal', 'admit');
    params.delete('id');
    router.push(`/patients?${params.toString()}`, { scroll: false });
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set('modal', 'edit');
    params.set('id', patient._id);
    router.push(`/patients?${params.toString()}`, { scroll: false });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('modal');
    params.delete('id');
    const query = params.toString();
    router.push(query ? `/patients?${query}` : '/patients', { scroll: false });
  };

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

  const statusFilters = [
    { label: 'All Inpatients', value: '' },
    { label: 'Admitted', value: 'admitted' },
    { label: 'Observation', value: 'under_observation' },
    { label: 'Discharged', value: 'discharged' },
  ];

  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    ready: boolean;
  }>({ left: 0, top: 0, width: 0, height: 0, ready: false });

  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useIsomorphicLayoutEffect(() => {
    const updateIndicator = () => {
      const activeIndex = statusFilters.findIndex((f) => f.value === status);
      const activeEl = tabRefs.current[activeIndex >= 0 ? activeIndex : 0];
      if (activeEl) {
        setIndicatorStyle({
          left: activeEl.offsetLeft,
          top: activeEl.offsetTop,
          width: activeEl.offsetWidth,
          height: activeEl.offsetHeight,
          ready: true,
        });
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => {
      window.removeEventListener('resize', updateIndicator);
    };
  }, [status]);

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
            onClick={openAdmitModal}
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

            {/* Responsive 2x2 on Mobile, Inline on Desktop with Zero-CLS Sliding Indicator */}
            <div
              ref={tabContainerRef}
              className="relative grid grid-cols-2 sm:flex sm:flex-row p-1 bg-slate-100 dark:bg-neutral-900 rounded-xl border border-slate-200/80 dark:border-neutral-800 gap-1 w-full sm:w-auto select-none sm:h-10 sm:items-center"
              role="tablist"
              aria-label="Filter patients by clinical status"
            >
              {/* Sliding Active Pill Indicator (Compositor translate3d) */}
              <span
                aria-hidden="true"
                className={`absolute top-0 left-0 rounded-lg bg-clinical-100 dark:bg-clinical-950/85 border border-clinical-300/80 dark:border-clinical-800/70 shadow-xs pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
                  indicatorStyle.ready ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  transform: `translate3d(${indicatorStyle.left}px, ${indicatorStyle.top}px, 0)`,
                  width: `${indicatorStyle.width}px`,
                  height: `${indicatorStyle.height}px`,
                }}
              />

              {statusFilters.map((f, idx) => {
                const active = status === f.value;
                return (
                  <button
                    key={f.value}
                    ref={(el) => {
                      tabRefs.current[idx] = el;
                    }}
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setStatus(f.value);
                      setPage(1);
                    }}
                    className={`relative z-10 px-3.5 h-9 sm:h-8 rounded-lg text-xs font-semibold text-center whitespace-nowrap select-none transition-colors duration-200 flex items-center justify-center focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clinical-500/50 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-neutral-900 active:outline-none ${
                      active
                        ? 'text-clinical-900 dark:text-clinical-300'
                        : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-100 hover:bg-slate-200/40 dark:hover:bg-neutral-800/40'
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

        {/* 5-State Patient Table with Min-Height to eliminate scrollbar jump */}
        <div className="min-h-[520px]">
          {isPending ? (
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
            <div className={`space-y-4 transition-opacity duration-200 ${isFetching ? 'opacity-75' : 'opacity-100'}`}>
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
        </div>
      </main>

      {/* Admission Modal */}
      <PatientModal
        isOpen={isModalOpen}
        onClose={closeModal}
        patient={editingPatient}
      />
    </div>
  );
}

export default function PatientsPage() {
  return (
    <Suspense fallback={null}>
      <PatientsContent />
    </Suspense>
  );
}
