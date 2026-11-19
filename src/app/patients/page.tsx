'use client';

import React, { useState } from 'react';
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
import { Search, Plus, BedDouble, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PatientsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Fetch patients
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['patients', search, status, page],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      return api.get<ApiResponse<Patient[]>>(`/patients?${params.toString()}`);
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

  const patients = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const statusFilters = [
    { label: 'All Inpatients', value: '' },
    { label: 'Admitted', value: 'admitted' },
    { label: 'Observation', value: 'observation' },
    { label: 'Discharged', value: 'discharged' },
  ];

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Inpatient Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
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
          >
            Record Admission
          </Button>
        </div>

        {/* Search & Status Pill Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
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

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {statusFilters.map((f) => {
              const active = status === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => {
                    setStatus(f.value);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition focus-ring ${
                    active
                      ? 'bg-clinical-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
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
            icon={<BedDouble className="w-6 h-6 text-slate-400" />}
            title="No Inpatient Records"
            description="No admissions match your search filter or active category."
            actionLabel="Reset Search"
            onAction={() => {
              setSearch('');
              setStatus('');
            }}
          />
        ) : (
          <div className="space-y-4">
            <PatientTable
              patients={patients}
              onDischarge={(id) => dischargeMutation.mutate(id)}
              onEdit={handleEdit}
            />

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-500">
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
