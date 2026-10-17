import React, { useState } from 'react';
import { BookOpen, Clock, ChevronRight, Plus, CheckCircle2 } from 'lucide-react';
import { Subject, Task } from '../../types';
import { SubjectDetailModal } from './SubjectDetailModal';

interface SubjectListProps {
  subjects: Subject[];
  tasks: Task[];
  onToggleTopic: (subjectId: string, topicId: string) => void;
  onQuickLogHour: (subjectId: string) => void;
}

export const SubjectList: React.FC<SubjectListProps> = ({
  subjects,
  tasks,
  onToggleTopic,
  onQuickLogHour,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Core Curriculum Subjects</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your 6 foundational technical interview and university tracks
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono tabular-nums bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md">
          {subjects.length} Subjects Active · Comprehensive Coverage
        </div>
      </div>

      {/* Grid of 6 subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((sub) => {
          const percentHours = Math.round((sub.completedHours / sub.targetHours) * 100);
          const completedTopics = sub.topics.filter((t) => t.completed).length;
          const subTasks = tasks.filter((t) => t.subjectId === sub.id && t.status !== 'completed');

          return (
            <div
              key={sub.id}
              className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs"
            >
              <div>
                {/* Header line: Code & Category (Zero-pill discipline) */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono text-slate-400 font-medium">{sub.code}</span>
                  <span className="text-[11px] text-slate-400">{sub.category}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-1">{sub.name}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                  {sub.description}
                </p>

                {/* Quantitative stats */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Study Hours
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-slate-800">
                      {sub.completedHours}h <span className="text-slate-400 font-normal">/ {sub.targetHours}h</span>
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-900 h-full rounded-full transition-all duration-300"
                      style={{ width: `${percentHours}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono tabular-nums">
                    <span>{percentHours}% syllabus target</span>
                    <span>{completedTopics}/{sub.topics.length} topics mastered</span>
                  </div>
                </div>

                {/* Topics Preview snippet */}
                <div className="mt-3.5 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                    Core Topics
                  </span>
                  <div className="space-y-1">
                    {sub.topics.slice(0, 3).map((t) => (
                      <div key={t.id} className="flex items-center gap-1.5 text-[11px] text-slate-600 truncate">
                        {t.completed ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                        )}
                        <span className={`truncate ${t.completed ? 'line-through text-slate-400' : ''}`}>
                          {t.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onQuickLogHour(sub.id)}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition-colors"
                  title="Quick-log 1 hour of study into this subject"
                >
                  <Plus className="w-3 h-3" /> Log +1h
                </button>

                <button
                  onClick={() => setSelectedSubject(sub)}
                  className="flex items-center gap-1 text-xs font-medium text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  Syllabus & Tasks <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subject Detail & Topic Checkoff Modal */}
      <SubjectDetailModal
        subject={selectedSubject}
        tasks={tasks}
        onClose={() => setSelectedSubject(null)}
        onToggleTopic={onToggleTopic}
        onQuickLogHour={onQuickLogHour}
      />
    </div>
  );
};
