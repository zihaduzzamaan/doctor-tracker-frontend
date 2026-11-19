'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export interface IntakeChartProps {
  data: Array<{ _id: string; count: number }>;
  isLoading?: boolean;
}

export function IntakeChart({ data, isLoading }: IntakeChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle h-[340px] flex flex-col justify-between animate-pulse">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-3 bg-slate-200 rounded w-1/4" />
        </div>
        <div className="h-[230px] bg-slate-100 rounded-lg flex items-end justify-between p-4 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-200 rounded-t w-full"
              style={{ height: `${30 + (i * 10) % 60}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    period: item._id,
    admissions: item.count,
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-subtle flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Monthly Inpatient Admissions
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Historical intake trends over recent reporting periods
        </p>
      </div>

      <div className="h-[250px] w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No admission history available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="period"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: '#F1F5F9' }}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="admissions" fill="#0D9488" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
