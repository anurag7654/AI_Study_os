import React from 'react';
import { Clock, CheckSquare, Calendar, Award } from 'lucide-react';
import { Subject, Task, ScheduleSlot, DailyGoal, DayOfWeek } from '../../types';

interface MetricCardsProps {
  subjects: Subject[];
  tasks: Task[];
  schedule: ScheduleSlot[];
  goals: DailyGoal[];
  currentDay: DayOfWeek;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  subjects,
  tasks,
  schedule,
  goals,
  currentDay,
}) => {
  // Quantitative calculations
  const totalCompletedHours = subjects.reduce((sum, s) => sum + s.completedHours, 0);
  const totalTargetHours = subjects.reduce((sum, s) => sum + s.targetHours, 0);
  const overallHoursPercent = totalTargetHours > 0 ? Math.round((totalCompletedHours / totalTargetHours) * 100) : 0;

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;

  const todaySlots = schedule.filter((s) => s.day === currentDay);
  const completedSlots = todaySlots.filter((s) => s.completed).length;

  const completedGoals = goals.filter((g) => g.completed).length;
  const goalsPercent = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  const metrics = [
    {
      label: 'Study Hours Logged',
      value: `${totalCompletedHours}h`,
      subtext: totalTargetHours > 0 
        ? `Target: ${totalTargetHours}h (${overallHoursPercent}% syllabus coverage)`
        : 'No target hours configured',
      icon: Clock,
      progress: overallHoursPercent,
      color: 'bg-indigo-600',
    },
    {
      label: 'Today Goals Completed',
      value: `${completedGoals}/${goals.length}`,
      subtext: goals.length > 0 ? `${goalsPercent}% daily checklist fulfilled` : 'No goals logged today',
      icon: Award,
      progress: goalsPercent,
      color: 'bg-emerald-600',
    },
    {
      label: 'Active Study Tasks',
      value: `${tasks.length}`,
      subtext: tasks.length > 0 
        ? `${completedTasks} done · ${inProgressTasks} in progress · ${pendingTasks} pending`
        : 'No study tasks logged yet',
      icon: CheckSquare,
      progress: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
      color: 'bg-blue-600',
    },
    {
      label: "Today's Schedule Slots",
      value: `${completedSlots}/${todaySlots.length}`,
      subtext: todaySlots.length > 0 ? `${currentDay} timetable sessions` : `No sessions scheduled for ${currentDay}`,
      icon: Calendar,
      progress: todaySlots.length > 0 ? Math.round((completedSlots / todaySlots.length) * 100) : 0,
      color: 'bg-violet-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.label}
            className="p-4 bg-white border border-slate-200 rounded-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{m.label}</span>
                <Icon className="w-4 h-4 text-slate-400 stroke-[1.75]" />
              </div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                {m.value}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">{m.subtext}</p>
            </div>

            <div className="mt-4 pt-2">
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${m.color} rounded-full transition-all duration-300`}
                  style={{ width: `${m.progress}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
