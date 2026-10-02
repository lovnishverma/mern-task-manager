import { useMemo } from 'react';
import { Task } from '../types/task';

interface TaskInsightsProps {
  tasks: Task[];
}

export interface TaskMetrics {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  completionRate: number;
  overdue: number;
  priorityCounts: {
    low: number;
    medium: number;
    high: number;
  };
}

export function calculateTaskMetrics(tasks: Task[]): TaskMetrics {
  const total = tasks.length;
  let completed = 0;
  let inProgress = 0;
  let todo = 0;
  let overdue = 0;
  let low = 0;
  let medium = 0;
  let high = 0;

  const now = Date.now();

  for (const task of tasks) {
    // Status counts
    if (task.status === 'DONE') {
      completed += 1;
    } else if (task.status === 'IN_PROGRESS') {
      inProgress += 1;
    } else {
      todo += 1;
    }

    // Priority counts
    if (task.priority === 'HIGH') {
      high += 1;
    } else if (task.priority === 'LOW') {
      low += 1;
    } else {
      medium += 1;
    }

    // Overdue logic: dueDate exists, dueDate < now, and status !== 'DONE'
    if (task.dueDate && task.status !== 'DONE') {
      const dueTime = new Date(task.dueDate).getTime();
      if (!isNaN(dueTime) && dueTime < now) {
        overdue += 1;
      }
    }
  }

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    inProgress,
    todo,
    completionRate,
    overdue,
    priorityCounts: {
      low,
      medium,
      high,
    },
  };
}

export default function TaskInsights({ tasks }: TaskInsightsProps) {
  const metrics = useMemo(() => calculateTaskMetrics(tasks), [tasks]);

  return (
    <section
      aria-label="Task Insights Dashboard"
      className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-4 mb-6"
    >
      <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-base">📊</span>
          <h2 className="text-sm font-semibold text-gray-900 tracking-tight">
            Task Insights
          </h2>
        </div>
        <span className="text-xs text-gray-500 font-medium">
          {metrics.total} {metrics.total === 1 ? 'task' : 'tasks'} tracked
        </span>
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Tasks */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-3 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Total Tasks
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-800">
              {metrics.total}
            </span>
            <span className="text-xs text-slate-400">📋</span>
          </div>
        </div>

        {/* To Do */}
        <div className="bg-gray-50 border border-gray-200/80 rounded-lg p-3 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            To Do
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-gray-800">
              {metrics.todo}
            </span>
            <span className="text-[11px] text-gray-400">
              {metrics.total > 0
                ? `${Math.round((metrics.todo / metrics.total) * 100)}%`
                : '0%'}
            </span>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-blue-50/60 border border-blue-200/80 rounded-lg p-3 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-blue-600 uppercase tracking-wider">
            In Progress
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-blue-800">
              {metrics.inProgress}
            </span>
            <span className="text-[11px] text-blue-500">
              {metrics.total > 0
                ? `${Math.round((metrics.inProgress / metrics.total) * 100)}%`
                : '0%'}
            </span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-lg p-3 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider">
            Completed
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-emerald-800">
              {metrics.completed}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">
              ✓
            </span>
          </div>
        </div>

        {/* Completion Rate with Progress Bar */}
        <div className="bg-emerald-50/40 border border-emerald-200/70 rounded-lg p-3 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">
            Completion Rate
          </span>
          <div className="mt-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-emerald-800">
                {metrics.completionRate}%
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-emerald-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${metrics.completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div
          className={`rounded-lg p-3 flex flex-col justify-between border transition-colors ${
            metrics.overdue > 0
              ? 'bg-red-50/70 border-red-300 text-red-900'
              : 'bg-slate-50/60 border-slate-200/80 text-slate-700'
          }`}
        >
          <span
            className={`text-[11px] font-medium uppercase tracking-wider ${
              metrics.overdue > 0 ? 'text-red-700' : 'text-slate-500'
            }`}
          >
            Overdue
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span
              className={`text-xl font-bold ${
                metrics.overdue > 0 ? 'text-red-700' : 'text-slate-800'
              }`}
            >
              {metrics.overdue}
            </span>
            {metrics.overdue > 0 ? (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800"
                title="Tasks needing immediate attention"
              >
                Action
              </span>
            ) : (
              <span className="text-xs text-emerald-600 font-medium">None</span>
            )}
          </div>
        </div>
      </div>

      {/* Priority Distribution Footer Bar */}
      <div className="mt-3.5 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-gray-600">
        <span className="font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
          Priority Distribution:
        </span>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Low */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
            <span className="text-gray-600">
              Low:{' '}
              <strong className="text-gray-900">
                {metrics.priorityCounts.low}
              </strong>
            </span>
          </div>

          {/* Medium */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span className="text-gray-600">
              Medium:{' '}
              <strong className="text-gray-900">
                {metrics.priorityCounts.medium}
              </strong>
            </span>
          </div>

          {/* High */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            <span className="text-gray-600">
              High:{' '}
              <strong className="text-gray-900">
                {metrics.priorityCounts.high}
              </strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
