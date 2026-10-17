import React from 'react';
import { Subject, Task, ScheduleSlot, DailyGoal, TaskStatus, DayOfWeek } from '../../types';
import { MetricCards } from './MetricCards';
import { TodayGoals } from './TodayGoals';
import { NextUpSession } from './NextUpSession';
import { BookOpen, CheckSquare, ArrowRight, Plus } from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface DashboardViewProps {
  subjects: Subject[];
  tasks: Task[];
  schedule: ScheduleSlot[];
  goals: DailyGoal[];
  currentDay: DayOfWeek;
  currentMinutes: number;
  onToggleGoal: (goalId: string) => void;
  onAddGoal: (title: string, subjectName: string, minutes: number) => void;
  onToggleSlot: (slotId: string) => void;
  onStartFocus: (subjectId: string, topic: string) => void;
  onQuickLogHour: (subjectId: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  subjects,
  tasks,
  schedule,
  goals,
  currentDay,
  currentMinutes,
  onToggleGoal,
  onAddGoal,
  onToggleSlot,
  onStartFocus,
  onQuickLogHour,
  onNavigateTab,
  onUpdateTaskStatus,
}) => {
  const activeTasks = tasks.filter((t) => t.status !== 'completed').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 4 Summary Metric Cards */}
      <MetricCards
        subjects={subjects}
        tasks={tasks}
        schedule={schedule}
        goals={goals}
        currentDay={currentDay}
      />

      {/* 2-Column Split: Today's Goals & Next Timetable Session */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <TodayGoals
          goals={goals}
          onToggleGoal={onToggleGoal}
          onAddGoal={onAddGoal}
        />
        <NextUpSession
          schedule={schedule}
          currentDay={currentDay}
          currentMinutes={currentMinutes}
          onToggleSlot={onToggleSlot}
          onStartFocus={onStartFocus}
          onScheduleForToday={() => onNavigateTab('planner')}
        />
      </div>

      {/* 6 Subjects Quick Progress Overview */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" /> 6 Core Technical Tracks
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live progress and hours completion across your curricula
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('subjects')}
            className="flex items-center gap-1 text-xs font-medium text-slate-900 hover:text-indigo-600 transition-colors"
          >
            <span>All Curricula</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {subjects.map((sub) => {
            const percent = Math.round((sub.completedHours / sub.targetHours) * 100);
            return (
              <div
                key={sub.id}
                className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-md flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{sub.code}</span>
                    <span>{sub.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{sub.name}</h4>
                  
                  <div className="mt-3 flex items-center justify-between text-xs font-mono tabular-nums">
                    <span className="text-slate-500 font-sans text-[11px]">Logged vs Target</span>
                    <span className="font-semibold text-slate-800">
                      {sub.completedHours}h / {sub.targetHours}h
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-slate-900 h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">{percent}% complete</span>
                  <button
                    onClick={() => onQuickLogHour(sub.id)}
                    className="text-[10px] font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs hover:bg-slate-50"
                  >
                    +1h Log
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority Tasks Highlighting */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-600" /> Urgent Practice Tasks
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              High-priority engineering tasks due this week
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('tasks')}
            className="flex items-center gap-1 text-xs font-medium text-slate-900 hover:text-indigo-600 transition-colors"
          >
            <span>Open Tasks Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeTasks.length === 0 ? (
          <div className="mt-4 py-8 px-4 text-center border border-dashed border-slate-200 rounded-lg">
            <p className="text-xs text-slate-500 mb-3">No active study tasks in your queue right now.</p>
            <button
              onClick={() => onNavigateTab('tasks')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Create First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {activeTasks.map((t) => (
              <div
                key={t.id}
                className="p-3 bg-white border border-slate-200 rounded-md flex items-start justify-between gap-3 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                    <span className="text-slate-700 font-semibold">{t.subjectName}</span>
                    <span aria-hidden="true">·</span>
                    <span className={t.priority === 'high' ? 'text-rose-600 font-mono' : 'font-mono'}>
                      {t.priority}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">Due {t.dueDate}</span>
                  </div>
                  <h4 className="text-xs font-medium text-slate-900 leading-snug">{t.title}</h4>
                </div>

                <button
                  onClick={() => onUpdateTaskStatus(t.id, t.status === 'in_progress' ? 'completed' : 'in_progress')}
                  className={`text-[10px] font-mono px-2 py-1 rounded shrink-0 whitespace-nowrap ${
                    t.status === 'in_progress'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t.status === 'in_progress' ? 'Finish' : 'Start'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
