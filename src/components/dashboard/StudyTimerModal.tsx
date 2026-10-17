import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Subject } from '../../types';

interface StudyTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  initialSubjectId?: string;
  onLogStudyTime: (subjectId: string, minutes: number, topic: string) => void;
}

export const StudyTimerModal: React.FC<StudyTimerModalProps> = ({
  isOpen,
  onClose,
  subjects,
  initialSubjectId,
  onLogStudyTime,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    initialSubjectId || subjects[0]?.id || ''
  );
  const [topic, setTopic] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60); // 25 min default
  const [isActive, setIsActive] = useState(false);
  const [initialMinutes, setInitialMinutes] = useState(25);

  useEffect(() => {
    if (initialSubjectId) {
      setSelectedSubjectId(initialSubjectId);
    }
  }, [initialSubjectId]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  if (!isOpen) return null;

  const handleSetDuration = (mins: number) => {
    setIsActive(false);
    setInitialMinutes(mins);
    setSecondsLeft(mins * 60);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(initialMinutes * 60);
  };

  const handleCompleteAndLog = () => {
    const elapsedSeconds = initialMinutes * 60 - secondsLeft;
    // Minimum 1 min logged, or the selected duration if completed
    const minutesLogged = Math.max(1, Math.round(elapsedSeconds / 60));
    const subject = subjects.find((s) => s.id === selectedSubjectId);
    const logTopic = topic.trim() || `Focused study block (${subject?.name || 'Subject'})`;

    onLogStudyTime(selectedSubjectId, minutesLogged, logTopic);
    handleReset();
    setTopic('');
    onClose();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(
    100,
    Math.round(((initialMinutes * 60 - secondsLeft) / (initialMinutes * 60)) * 100)
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden"
        role="dialog"
        aria-labelledby="timer-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 id="timer-modal-title" className="text-sm font-semibold text-slate-900">
              Focus Study Session
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

        <div className="p-6 space-y-5">
          {/* Subject Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.completedHours}h / {sub.targetHours}h)
                </option>
              ))}
            </select>
          </div>

          {/* Topic / Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Specific Topic or Goal
            </label>
            <input
              type="text"
              placeholder="e.g. Raft Consensus heartbeats or Express middleware..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Duration Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700">Interval</span>
              <span className="text-xs text-slate-400">Pomodoro / Deep Work</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleSetDuration(mins)}
                  className={`py-1.5 text-xs font-medium rounded-md border transition-colors ${
                    initialMinutes === mins
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Big Clock Display */}
          <div className="py-6 px-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center">
            <span className="text-4xl font-semibold tracking-tight text-slate-900 font-mono tabular-nums">
              {formatTime(secondsLeft)}
            </span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between w-full text-[11px] text-slate-500 mt-2 font-mono tabular-nums">
              <span>{progressPercent}% elapsed</span>
              <span>{formatTime(initialMinutes * 60 - secondsLeft)} logged</span>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-semibold transition-colors shadow-sm ${
                isActive
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Start Timer
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 text-slate-600 border border-slate-200 hover:bg-slate-100 rounded-md transition-colors"
              title="Reset timer"
              aria-label="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleCompleteAndLog}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold transition-colors shadow-sm"
              title="Save and log elapsed time to subject progress"
            >
              <Check className="w-4 h-4" /> Log Study Time
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
