export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse';
}

export interface Doctor {
  _id: string;
  doctor_name: string;
  specialization: string;
  hospital: string;
  email?: string;
  phone?: string;
  bio?: string;
  active_patient_count: number;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  _id: string;
  patient_name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  condition: string;
  admission_date: string;
  doctor_id: string | { _id: string; doctor_name: string; specialization: string; hospital: string };
  status: 'admitted' | 'observation' | 'discharged';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsSummary {
  totalDoctors: number;
  totalPatients: number;
  statusBreakdown: Array<{ _id: string; count: number }>;
  conditionBreakdown: Array<{ _id: string; count: number }>;
  intakeTrends: Array<{ _id: string; count: number }>;
  doctorWorkload: Array<{
    _id: string;
    doctor_name: string;
    specialization: string;
    active_patient_count: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
