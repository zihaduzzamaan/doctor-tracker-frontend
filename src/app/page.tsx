'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/layout/Navbar';
import { MetricCard, MetricCardSkeleton } from '@/components/analytics/MetricCard';
import { IntakeChart } from '@/components/analytics/IntakeChart';
import { ConditionDonut } from '@/components/analytics/ConditionDonut';
import { DoctorWorkload } from '@/components/analytics/DoctorWorkload';
import { DoctorModal } from '@/components/doctors/DoctorModal';
import { PatientModal } from '@/components/patients/PatientModal';
import { Button } from '@/components/ui/Button';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { api } from '@/lib/api';
import { formatErrorMessage } from '@/lib/errorHandler';
import { AnalyticsSummary, ApiResponse } from '@/lib/types';
import {
  Users,
  BedDouble,
  Activity,
  CheckCircle2,
  UserPlus,
  Stethoscope,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    }
  }, [router]);

  const {
    data: summaryData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: ({ signal }) =>
      api.get<ApiResponse<AnalyticsSummary>>('/analytics/summary', { signal }),
  });

  const summary = summaryData?.data;

  // Compute status metrics
  const activeAdmissions =
    summary?.statusBreakdown.find((s) => s._id === 'admitted')?.count || 0;
  const observationCount =
    summary?.statusBreakdown.find((s) => s._id === 'observation')?.count || 0;
  const dischargedCount =
    summary?.statusBreakdown.find((s) => s._id === 'discharged')?.count || 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header & Quick Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Clinical Operations Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time monitoring of practitioner workloads, inpatient admissions, and diagnostic trends.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Stethoscope className="w-4 h-4 text-clinical-600" />}
              onClick={() => setIsDoctorModalOpen(true)}
            >
              Add Doctor
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsPatientModalOpen(true)}
            >
              New Admission
            </Button>
          </div>
        </div>

        {isError && (
          <ErrorAlert
            title="Failed to fetch clinical analytics"
            message={formatErrorMessage(error)}
            onRetry={() => refetch()}
          />
        )}

        {/* 4 Core Caseload Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {isLoading ? (
            <>
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
            </>
          ) : (
            <>
              <MetricCard
                title="Total Doctors"
                value={summary?.totalDoctors || 0}
                subtitle="Active registered practitioners"
                icon={<Users className="w-5 h-5" />}
                variant="clinical"
                badgeText="All Departments"
              />
              <MetricCard
                title="Total Patients"
                value={summary?.totalPatients || 0}
                subtitle="Cumulative admission cases"
                icon={<BedDouble className="w-5 h-5" />}
                variant="clinical"
                badgeText="Historical Records"
              />
              <MetricCard
                title="Active Inpatients"
                value={activeAdmissions + observationCount}
                subtitle={`${activeAdmissions} admitted, ${observationCount} observation`}
                icon={<Activity className="w-5 h-5" />}
                variant="accent"
                badgeText="In Bed"
              />
              <MetricCard
                title="Discharged"
                value={dischargedCount}
                subtitle="Completed clinical treatments"
                icon={<CheckCircle2 className="w-5 h-5" />}
                variant="slate"
                badgeText="Resolved"
              />
            </>
          )}
        </div>

        {/* Charts & Visual Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IntakeChart
            data={summary?.intakeTrends || []}
            isLoading={isLoading}
          />
          <ConditionDonut
            data={summary?.conditionBreakdown || []}
            isLoading={isLoading}
          />
        </div>

        {/* Doctor Workload Ranking */}
        <DoctorWorkload
          doctors={summary?.doctorWorkload || []}
          isLoading={isLoading}
        />
      </main>

      {/* Reusable Modals */}
      <DoctorModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
      />
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
      />
    </div>
  );
}
