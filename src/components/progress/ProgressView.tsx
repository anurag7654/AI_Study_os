import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, Clock, Award } from 'lucide-react';
import { Subject, Task, ScheduleSlot } from '../../types';

interface ProgressViewProps {
  subjects: Subject[];
  tasks: Task[];
  schedule: ScheduleSlot[];
  onQuickLogHour: (subjectId: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  subjects,
  tasks,
  schedule,
  onQuickLogHour,
}) => {
  const totalCompletedHours = subjects.reduce((acc, s) => acc + s.completedHours, 0);
  const totalTargetHours = subjects.reduce((acc, s) => acc + s.targetHours, 0);
  const totalCompletionPercent = totalTargetHours > 0 ? Math.round((totalCompletedHours / totalTargetHours) * 100) : 0;

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const totalSlots = schedule.length;
  const completedSlots = schedule.filter((s) => s.completed).length;
  const timetableRate = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

  // Highest and lowest progress subjects
  const sortedSubjects = [...subjects].sort((a, b) => {
    const rateA = a.completedHours / a.targetHours;
    const rateB = b.completedHours / b.targetHours;
    return rateB - rateA;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Learning & Subject Progress</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Subject-wise logged hours, syllabus target fulfillment, and velocity metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md text-xs font-mono tabular-nums text-slate-700">
            Total Logged: <strong className="text-slate-900">{totalCompletedHours}h</strong> / {totalTargetHours}h
          </div>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Overall Syllabus Hours</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalCompletionPercent}%
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {totalCompletedHours} of {totalTargetHours} cumulative target hours
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${totalCompletionPercent}%` }} />
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Practical Task Velocity</span>
            <CheckCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {taskCompletionRate}%
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {completedTasks} of {tasks.length} tasks successfully resolved
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${taskCompletionRate}%` }} />
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Timetable Compliance</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {timetableRate}%
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {completedSlots} of {totalSlots} sessions completed on time
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-violet-600 h-full rounded-full" style={{ width: `${timetableRate}%` }} />
          </div>
        </div>
      </div>

      {/* Subject-Wise Detailed Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Subject-Wise Hours & Syllabus Mastery
          </h3>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            Ranked by completion rate
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Subject Track</th>
                <th className="py-3 px-4">Code / Category</th>
                <th className="py-3 px-4 text-right">Logged Hours</th>
                <th className="py-3 px-4 text-right">Target Hours</th>
                <th className="py-3 px-5">Progress Bar</th>
                <th className="py-3 px-4 text-right">Completion</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {sortedSubjects.map((sub) => {
                const percent = Math.round((sub.completedHours / sub.targetHours) * 100);
                const remaining = Math.max(0, sub.targetHours - sub.completedHours);

                return (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-900">
                      {sub.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {sub.code} · <span className="font-sans text-[11px]">{sub.category}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800 tabular-nums">
                      {sub.completedHours}h
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400 tabular-nums">
                      {sub.targetHours}h
                    </td>
                    <td className="py-3.5 px-5 w-48">
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-900 h-full rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums text-slate-800">
                      {percent}%
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onQuickLogHour(sub.id)}
                        className="text-[11px] font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition-colors whitespace-nowrap"
                        title="Add 1 hour to this subject"
                      >
                        +1 Hour
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Relative Time Distribution (SaaS high-density horizontal breakdown) */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <h4 className="text-sm font-semibold text-slate-900 mb-2">
          Study Time Allocation Across Curricula
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Visual ratio of total hours spent across all 6 subjects
        </p>

        {/* Multi-segment proportional bar */}
        <div className="w-full h-4 rounded-md overflow-hidden flex bg-slate-100">
          {totalCompletedHours === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-[11px] text-slate-400 font-mono">
              0 study hours logged yet
            </div>
          ) : (
            subjects.map((sub, idx) => {
              const widthPercent = (sub.completedHours / totalCompletedHours) * 100;
              const colors = [
                'bg-indigo-600',
                'bg-blue-500',
                'bg-emerald-600',
                'bg-amber-500',
                'bg-violet-600',
                'bg-rose-500',
              ];
              return (
                <div
                  key={sub.id}
                  className={`${colors[idx % colors.length]} h-full transition-all hover:opacity-90`}
                  style={{ width: `${widthPercent}%` }}
                  title={`${sub.name}: ${sub.completedHours}h (${Math.round(widthPercent)}%)`}
                />
              );
            })
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 pt-3 border-t border-slate-100">
          {subjects.map((sub, idx) => {
            const widthPercent = totalCompletedHours > 0 
              ? Math.round((sub.completedHours / totalCompletedHours) * 100)
              : 0;
            const dotColors = [
              'bg-indigo-600',
              'bg-blue-500',
              'bg-emerald-600',
              'bg-amber-500',
              'bg-violet-600',
              'bg-rose-500',
            ];
            return (
              <div key={sub.id} className="text-xs">
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <span className={`w-2.5 h-2.5 rounded-xs ${dotColors[idx % dotColors.length]}`} />
                  <span className="truncate">{sub.name}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono tabular-nums mt-0.5 ml-4">
                  {sub.completedHours}h · {widthPercent}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
