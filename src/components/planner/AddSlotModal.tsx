import React, { useState } from 'react';
import { X, Calendar, Plus, Clock } from 'lucide-react';
import { DayOfWeek, Subject } from '../../types';
import { formatTime12h, parseTimeToMinutes, DAYS_OF_WEEK } from '../../utils/dateTime';

interface AddSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onAddSlot: (slot: {
    subjectId: string;
    subjectName: string;
    day: DayOfWeek;
    startTime: string;
    endTime: string;
    topic: string;
  }) => void;
  defaultDay: DayOfWeek;
}

export const AddSlotModal: React.FC<AddSlotModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onAddSlot,
  defaultDay,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [day, setDay] = useState<DayOfWeek>(defaultDay);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [topic, setTopic] = useState('');

  // Update default day whenever modal opens with a new defaultDay
  React.useEffect(() => {
    if (defaultDay) {
      setDay(defaultDay);
    }
  }, [defaultDay]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const sub = subjects.find((s) => s.id === selectedSubjectId);
    onAddSlot({
      subjectId: selectedSubjectId,
      subjectName: sub ? sub.name : 'General Study',
      day,
      startTime,
      endTime,
      topic: topic.trim(),
    });

    setTopic('');
    onClose();
  };

  const startMins = parseTimeToMinutes(startTime);
  const endMins = parseTimeToMinutes(endTime);
  const durationMins = endMins >= startMins ? endMins - startMins : 24 * 60 - startMins + endMins;
  const durationHours = (durationMins / 60).toFixed(1);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden"
        role="dialog"
        aria-labelledby="add-slot-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <h3 id="add-slot-title" className="text-sm font-semibold text-slate-900">
              Schedule Study Session
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Day of Week
            </label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value as DayOfWeek)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d} value={d}>
                  {d} {d === defaultDay ? '(Today)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-xs font-mono bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                required
              />
              <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                {formatTime12h(startTime)}
              </span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full text-xs font-mono bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                required
              />
              <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                {formatTime12h(endTime)}
              </span>
            </div>
          </div>

          {/* Time range preview */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between text-xs text-slate-600 font-mono">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatTime12h(startTime)} – {formatTime12h(endTime)}
            </span>
            <span className="font-semibold text-slate-900">
              {durationHours} hrs duration
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Study Topic or Milestone
            </label>
            <input
              type="text"
              placeholder="e.g. MERN Fullstack authentication & REST routing..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Save Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
