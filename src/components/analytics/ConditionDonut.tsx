'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export interface ConditionDonutProps {
  data: Array<{ _id: string; count: number }>;
  isLoading?: boolean;
}

const PALETTE = [
  '#0D9488', // clinical-600
  '#14B8A6', // clinical-500
  '#F59E0B', // accent-500
  '#D97706', // accent-600
  '#10B981', // emerald-500
  '#71717A', // zinc-500 neutral
];

interface TooltipPayload {
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: TooltipPayload }>;
}

function CustomDonutTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-[#121212] dark:bg-black border border-neutral-700 dark:border-neutral-800 px-3 py-2 rounded-lg shadow-xl text-xs z-50">
        <p className="font-semibold text-white">{item.name}</p>
        <p className="text-clinical-400 font-bold mt-0.5 text-sm">
          {item.value} <span className="text-xs font-normal text-neutral-400">cases</span>
        </p>
      </div>
    );
  }
  return null;
}

export function ConditionDonut({ data, isLoading }: ConditionDonutProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-neutral-800 p-6 shadow-subtle h-[340px] flex flex-col justify-between animate-pulse">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-neutral-800 rounded w-1/3" />
          <div className="h-3 bg-slate-200 dark:bg-neutral-800 rounded w-1/4" />
        </div>
        <div className="flex items-center justify-center h-[230px]">
          <div className="w-40 h-40 rounded-full border-8 border-slate-200 dark:border-neutral-800 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-neutral-800" />
          </div>
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item._id || 'Unspecified',
    value: item.count,
  }));

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-neutral-800 p-6 shadow-subtle flex flex-col justify-between transition-colors">
      <div className="mb-2">
        <h3 className="text-base font-bold text-slate-900 dark:text-neutral-100 tracking-tight">
          Clinical Conditions Distribution
        </h3>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
          Top primary diagnosis categories for active inpatients
        </p>
      </div>

      <div className="h-[200px] w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-neutral-500">
            No diagnostic data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PALETTE[index % PALETTE.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomDonutTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="mt-2 grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-neutral-800">
        {chartData.slice(0, 4).map((entry, idx) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}
            />
            <span className="truncate text-slate-600 dark:text-neutral-300 font-medium">
              {entry.name}
            </span>
            <span className="text-slate-400 dark:text-neutral-500 ml-auto font-semibold">
              {total > 0 ? Math.round((entry.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
