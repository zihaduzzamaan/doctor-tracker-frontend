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

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { period: string; admissions: number } }>;
}

function CustomBarTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 dark:bg-slate-950/95 border border-slate-700/80 px-3 py-2 rounded-lg shadow-xl text-xs backdrop-blur-sm z-50">
        <p className="font-medium text-slate-300">{data.period}</p>
        <p className="text-clinical-400 font-bold mt-0.5 text-sm">
          {data.admissions} <span className="text-xs font-normal text-slate-400">admissions</span>
        </p>
      </div>
    );
  }
  return null;
}

export function IntakeChart({ data, isLoading }: IntakeChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-subtle h-[340px] flex flex-col justify-between animate-pulse">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        </div>
        <div className="h-[230px] bg-slate-100 dark:bg-slate-800/50 rounded-lg flex items-end justify-between p-4 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-200 dark:bg-slate-700 rounded-t w-full"
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
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-subtle flex flex-col justify-between transition-colors">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Monthly Inpatient Admissions
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Historical intake trends over recent reporting periods
        </p>
      </div>

      <div className="h-[250px] w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
            No admission history available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
              <XAxis
                dataKey="period"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} content={<CustomBarTooltip />} />
              <Bar dataKey="admissions" fill="#0D9488" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
