import React, { useState } from 'react';
import { Calendar, Plus, Clock, CheckCircle2, Circle, Trash2, Play, Radio } from 'lucide-react';
import { ScheduleSlot, Subject, DayOfWeek } from '../../types';
import { AddSlotModal } from './AddSlotModal';
import { EmptyState } from '../common/EmptyState';
import {
  formatTime12h,
  getSlotTimingStatus,
  DAYS_OF_WEEK,
} from '../../utils/dateTime';

interface WeeklyPlannerProps {
  schedule: ScheduleSlot[];
  subjects: Subject[];
  currentDay: DayOfWeek;
  currentMinutes: number;
  onToggleSlot: (slotId: string) => void;
  onAddSlot: (slot: {
    subjectId: string;
    subjectName: string;
    day: DayOfWeek;
    startTime: string;
    endTime: string;
    topic: string;
  }) => void;
  onDeleteSlot: (slotId: string) => void;
  onStartFocus: (subjectId: string, topic: string) => void;
}

export const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({
  schedule,
  subjects,
  currentDay,
  currentMinutes,
  onToggleSlot,
  onAddSlot,
  onDeleteSlot,
  onStartFocus,
}) => {
  // Default to user's real current day (e.g. Saturday)
  const [selectedDay, setSelectedDay] = useState<string>(currentDay);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter schedule slots
  const filteredSlots =
    selectedDay === 'all'
      ? schedule
      : schedule.filter((s) => s.day === selectedDay);

  // Quantitative stats
  const totalSlots = schedule.length;
  const completedSlots = schedule.filter((s) => s.completed).length;
  const percentDone = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

  // Slots for today
  const todayTotal = schedule.filter((s) => s.day === currentDay).length;
  const todayCompleted = schedule.filter((s) => s.day === currentDay && s.completed).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Weekly Study Timetable</h2>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Today is {currentDay}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized with your local system clock · Sessions highlight as ongoing in real-time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono tabular-nums text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md">
            <span>{completedSlots} / {totalSlots} completed</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-900">{percentDone}%</span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Study Slot
          </button>
        </div>
      </div>

      {/* Day Selector Segmented Control */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedDay === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Full Week ({schedule.length})
          </button>
          {DAYS_OF_WEEK.map((d) => {
            const count = schedule.filter((s) => s.day === d).length;
            const isToday = d === currentDay;
            const isSelected = selectedDay === d;

            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{d.slice(0, 3)}</span>
                {isToday && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-indigo-100 text-indigo-700">
                    Today
                  </span>
                )}
                <span className="text-[10px] text-slate-400 font-mono tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slots List / Table */}
      {filteredSlots.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={`No study sessions scheduled for ${selectedDay === 'all' ? 'the week' : selectedDay}`}
          description={`Plan a dedicated study slot for ${selectedDay === 'all' ? 'any day' : selectedDay} to keep consistent progress towards your technical goals.`}
          actionLabel={`Schedule for ${selectedDay === 'all' ? currentDay : selectedDay}`}
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
          <div className="divide-y divide-slate-100">
            {filteredSlots.map((slot) => {
              const timingStatus = getSlotTimingStatus(slot, currentDay, currentMinutes);
              const isOngoing = timingStatus === 'ongoing' && slot.day === currentDay;

              return (
                <div
                  key={slot.id}
                  className={`p-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isOngoing
                      ? 'bg-emerald-50/80 border-l-4 border-l-emerald-600 ring-1 ring-emerald-200/50'
                      : slot.completed
                      ? 'bg-slate-50/60'
                      : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleSlot(slot.id)}
                      className="mt-0.5 text-slate-400 hover:text-slate-800 transition-colors"
                      title={slot.completed ? 'Mark pending' : 'Mark completed'}
                    >
                      {slot.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300" />
                      )}
                    </button>

                    <div>
                      {/* Metadata row with ongoing status and 12h/24h time */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                        <span className="font-semibold text-slate-900">{slot.subjectName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums text-slate-700 font-medium">
                          {slot.day} {slot.day === currentDay && '(Today)'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums flex items-center gap-1 text-slate-700">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {formatTime12h(slot.startTime)} – {formatTime12h(slot.endTime)}
                          <span className="text-slate-400 text-[10px]">({slot.startTime}–{slot.endTime})</span>
                        </span>

                        {isOngoing && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-600 text-white shadow-2xs">
                            <Radio className="w-2.5 h-2.5 animate-pulse" />
                            LIVE ONGOING NOW
                          </span>
                        )}
                        {!isOngoing && timingStatus === 'upcoming' && slot.day === currentDay && !slot.completed && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-50 text-blue-700">
                            Upcoming Today
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-sm mt-1 ${
                          slot.completed
                            ? 'line-through text-slate-400'
                            : isOngoing
                            ? 'font-bold text-slate-900'
                            : 'text-slate-800 font-medium'
                        }`}
                      >
                        {slot.topic}
                      </h4>
                    </div>
                  </div>

                  {/* Actions Strip */}
                  <div className="flex items-center gap-2 sm:self-center ml-7 sm:ml-0">
                    <button
                      onClick={() => onStartFocus(slot.subjectId, slot.topic)}
                      className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded transition-colors ${
                        isOngoing
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-2xs'
                          : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                      }`}
                      title="Launch timer with this topic"
                    >
                      <Play className="w-3 h-3" />
                      {isOngoing ? 'Open Focus Timer' : 'Focus Now'}
                    </button>

                    <button
                      onClick={() => onToggleSlot(slot.id)}
                      className={`text-[11px] font-mono tabular-nums px-2.5 py-1 rounded transition-colors ${
                        slot.completed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {slot.completed ? 'Done' : 'Mark Done'}
                    </button>

                    <button
                      onClick={() => onDeleteSlot(slot.id)}
                      className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors"
                      title="Remove session"
                      aria-label="Remove session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      <AddSlotModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        subjects={subjects}
        onAddSlot={onAddSlot}
        defaultDay={selectedDay !== 'all' ? (selectedDay as DayOfWeek) : currentDay}
      />
    </div>
  );
};
