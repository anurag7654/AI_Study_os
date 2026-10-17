import React from 'react';
import { X, BookOpen, CheckCircle2, Circle, Clock, CheckSquare } from 'lucide-react';
import { Subject, Task } from '../../types';

interface SubjectDetailModalProps {
  subject: Subject | null;
  tasks: Task[];
  onClose: () => void;
  onToggleTopic: (subjectId: string, topicId: string) => void;
  onQuickLogHour: (subjectId: string) => void;
}

export const SubjectDetailModal: React.FC<SubjectDetailModalProps> = ({
  subject,
  tasks,
  onClose,
  onToggleTopic,
  onQuickLogHour,
}) => {
  if (!subject) return null;

  const subjectTasks = tasks.filter((t) => t.subjectId === subject.id);
  const percentHours = Math.round((subject.completedHours / subject.targetHours) * 100);
  const completedTopics = subject.topics.filter((t) => t.completed).length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-labelledby="subject-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                {subject.code} · {subject.category}
              </span>
            </div>
            <h3 id="subject-detail-title" className="text-base font-bold text-slate-900 mt-0.5">
              {subject.name}
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-600 leading-relaxed">
          <p className="text-slate-700 text-xs leading-relaxed">{subject.description}</p>

          {/* Hours Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Study Hours Progress</span>
              <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                {subject.completedHours}h <span className="text-xs font-normal text-slate-500">/ {subject.targetHours}h target</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded">
                {percentHours}% Complete
              </span>
              <button
                onClick={() => onQuickLogHour(subject.id)}
                className="px-3 py-1 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-xs"
              >
                +1 Hour Log
              </button>
            </div>
          </div>

          {/* Syllabus Topics Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Syllabus Modules & Topics
              </h4>
              <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                {completedTopics} of {subject.topics.length} mastered
              </span>
            </div>

            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden">
              {subject.topics.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onToggleTopic(subject.id, t.id)}
                  className="p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {t.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <span className={t.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                      {t.title}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono tabular-nums px-2 py-0.5 rounded ${
                    t.completed ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 bg-slate-100'
                  }`}>
                    {t.completed ? 'Mastered' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Associated Tasks */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 mb-2.5">
              <CheckSquare className="w-3.5 h-3.5 text-indigo-600" /> Linked Practical Tasks ({subjectTasks.length})
            </h4>

            {subjectTasks.length === 0 ? (
              <p className="text-slate-400 text-xs italic">No specific tasks currently tagged for this subject.</p>
            ) : (
              <div className="space-y-2">
                {subjectTasks.map((task) => (
                  <div key={task.id} className="p-2.5 border border-slate-200 rounded-md bg-white flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-800 font-medium">{task.title}</span>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-mono tabular-nums">
                        Due {task.dueDate} · ~{task.estimatedMinutes}m
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono capitalize px-2 py-0.5 rounded ${
                      task.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : task.status === 'in_progress'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
