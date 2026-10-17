import React from 'react';
import { Calendar, Clock, Play, CheckCircle, Radio, Sparkles, AlertCircle } from 'lucide-react';
import { ScheduleSlot, DayOfWeek } from '../../types';
import {
  parseTimeToMinutes,
  formatTime12h,
  getSlotTimingStatus,
  SlotTimingStatus,
} from '../../utils/dateTime';

interface NextUpSessionProps {
  schedule: ScheduleSlot[];
  currentDay: DayOfWeek;
  currentMinutes: number;
  onToggleSlot: (slotId: string) => void;
  onStartFocus: (subjectId: string, topic: string) => void;
  onScheduleForToday?: () => void;
}

export const NextUpSession: React.FC<NextUpSessionProps> = ({
  schedule,
  currentDay,
  currentMinutes,
  onToggleSlot,
  onStartFocus,
  onScheduleForToday,
}) => {
  // Filter all slots for today
  const todaySlots = schedule.filter((s) => s.day === currentDay);

  // Check if there is an active ongoing session
  const ongoingSlot = todaySlots.find(
    (s) => !s.completed && getSlotTimingStatus(s, currentDay, currentMinutes) === 'ongoing'
  );

  // Next upcoming slot today (start time is in the future)
  const upcomingSlot = todaySlots
    .filter((s) => !s.completed && parseTimeToMinutes(s.startTime) > currentMinutes)
    .sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime))[0];

  // Most relevant slot to highlight (ongoing first, then next upcoming, then any uncompleted today, or first today)
  const featuredSlot =
    ongoingSlot ||
    upcomingSlot ||
    todaySlots.find((s) => !s.completed) ||
    todaySlots[0];

  const featuredStatus: SlotTimingStatus | null = featuredSlot
    ? getSlotTimingStatus(featuredSlot, currentDay, currentMinutes)
    : null;

  // Calculate elapsed and remaining minutes for featured slot if ongoing
  let ongoingElapsed = 0;
  let ongoingRemaining = 0;
  if (featuredSlot && featuredStatus === 'ongoing') {
    const startMins = parseTimeToMinutes(featuredSlot.startTime);
    const endMins = parseTimeToMinutes(featuredSlot.endTime);
    ongoingElapsed = Math.max(0, currentMinutes - startMins);
    ongoingRemaining = Math.max(0, endMins - currentMinutes);
  }

  const formatMinutesToHoursMinutes = (totalMins: number) => {
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Today's Timetable Session
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono tabular-nums">
            <span className="font-semibold text-slate-800">{currentDay}</span>
            <span>·</span>
            <span>{todaySlots.length} {todaySlots.length === 1 ? 'slot' : 'slots'}</span>
          </div>
        </div>

        {/* Featured Slot Display */}
        {featuredSlot ? (
          <div
            className={`mt-4 p-4 rounded-lg border transition-all ${
              featuredStatus === 'ongoing'
                ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            {/* Status indicator bar */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {featuredStatus === 'ongoing' ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-600 text-white shadow-2xs font-mono">
                    <Radio className="w-3 h-3 animate-pulse" />
                    LIVE ONGOING SESSION
                  </span>
                ) : featuredSlot.completed ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    <Clock className="w-3 h-3" /> Upcoming Today
                  </span>
                )}
              </div>

              <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                {featuredSlot.startTime} – {featuredSlot.endTime} (
                {formatTime12h(featuredSlot.startTime)} – {formatTime12h(featuredSlot.endTime)})
              </span>
            </div>

            {/* Subject and Topic */}
            <div className="mt-2">
              <span className="text-xs font-semibold text-indigo-700 tracking-wide uppercase">
                {featuredSlot.subjectName}
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">{featuredSlot.topic}</h4>
            </div>

            {/* Live progress info for ongoing session */}
            {featuredStatus === 'ongoing' && (
              <div className="mt-3 p-2.5 bg-white/80 rounded border border-emerald-200 text-xs text-emerald-900 font-mono tabular-nums flex items-center justify-between">
                <span>Started {formatMinutesToHoursMinutes(ongoingElapsed)} ago</span>
                <span className="font-semibold text-emerald-700">
                  {formatMinutesToHoursMinutes(ongoingRemaining)} remaining
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center gap-2">
              <button
                onClick={() => onStartFocus(featuredSlot.subjectId, featuredSlot.topic)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors shadow-sm ${
                  featuredStatus === 'ongoing'
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white font-semibold'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                {featuredStatus === 'ongoing' ? 'Open Live Focus Timer' : 'Start Focus Session'}
              </button>

              <button
                onClick={() => onToggleSlot(featuredSlot.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                  featuredSlot.completed
                    ? 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    : 'border-emerald-600 bg-white text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {featuredSlot.completed ? 'Mark Incomplete' : 'Mark Completed'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 py-8 px-4 text-center border border-dashed border-slate-200 rounded-lg">
            <p className="text-xs text-slate-600 font-medium mb-1">
              No study sessions scheduled for {currentDay}.
            </p>
            <p className="text-[11px] text-slate-400 mb-3">
              Add study slots for {currentDay} in the Weekly Planner to see live ongoing sessions here.
            </p>
            {onScheduleForToday && (
              <button
                onClick={onScheduleForToday}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md transition-colors shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" /> Schedule for {currentDay}
              </button>
            )}
          </div>
        )}

        {/* List of all slots scheduled for today */}
        {todaySlots.length > 0 && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                All {currentDay} Sessions ({todaySlots.length})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Real-time status</span>
            </div>

            <div className="space-y-2">
              {todaySlots.map((slot) => {
                const status = getSlotTimingStatus(slot, currentDay, currentMinutes);
                const isSelectedFeatured = featuredSlot?.id === slot.id;

                return (
                  <div
                    key={slot.id}
                    className={`flex items-center justify-between text-xs p-2.5 rounded-md border transition-colors ${
                      status === 'ongoing'
                        ? 'bg-emerald-50 border-emerald-300'
                        : isSelectedFeatured
                        ? 'bg-slate-50 border-slate-300'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-600 text-[11px] tabular-nums font-medium whitespace-nowrap">
                          {formatTime12h(slot.startTime)} – {formatTime12h(slot.endTime)}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="font-semibold text-slate-800 truncate">
                          {slot.subjectName}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {slot.topic}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {status === 'ongoing' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-emerald-600 text-white flex items-center gap-1 shadow-2xs">
                          <Radio className="w-2.5 h-2.5 animate-pulse" /> Ongoing
                        </span>
                      )}
                      {status === 'upcoming' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          Upcoming
                        </span>
                      )}
                      {status === 'past' && !slot.completed && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                          Ended
                        </span>
                      )}
                      {slot.completed && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Done
                        </span>
                      )}

                      <button
                        onClick={() => onToggleSlot(slot.id)}
                        className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
                          slot.completed
                            ? 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                            : 'bg-white border-emerald-600 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {slot.completed ? 'Undo' : 'Done'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
