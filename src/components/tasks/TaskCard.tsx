import React from 'react';
import { Clock, Trash2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Task, TaskStatus } from '../../types';

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdateStatus,
  onDeleteTask,
}) => {
  const priorityColor =
    task.priority === 'high'
      ? 'text-rose-600'
      : task.priority === 'medium'
      ? 'text-amber-600'
      : 'text-slate-500';

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between">
      <div>
        {/* Unboxed metadata line with typographic separators */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-slate-800">{task.subjectName}</span>
            <span aria-hidden="true">·</span>
            <span className={`font-mono capitalize text-[11px] ${priorityColor}`}>
              {task.priority} Priority
            </span>
          </div>

          <button
            onClick={() => onDeleteTask(task.id)}
            className="text-slate-300 hover:text-rose-600 transition-colors p-1"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Task Title */}
        <h4 className={`text-xs font-semibold leading-snug ${
          task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'
        }`}>
          {task.title}
        </h4>

        {/* Notes if present */}
        {task.notes && (
          <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded border border-slate-100 leading-relaxed">
            {task.notes}
          </p>
        )}

        {/* Timing info */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-3 font-mono tabular-nums">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>Due {task.dueDate}</span>
          <span aria-hidden="true">·</span>
          <span>~{task.estimatedMinutes}m</span>
        </div>
      </div>

      {/* State Transitions Strip */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
        {task.status === 'pending' && (
          <button
            onClick={() => onUpdateStatus(task.id, 'in_progress')}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition-colors w-full justify-center"
          >
            Start Work <ArrowRight className="w-3 h-3" />
          </button>
        )}

        {task.status === 'in_progress' && (
          <div className="flex items-center gap-1.5 w-full">
            <button
              onClick={() => onUpdateStatus(task.id, 'pending')}
              className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors"
              title="Move back to pending"
            >
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
            <button
              onClick={() => onUpdateStatus(task.id, 'completed')}
              className="flex items-center gap-1 text-[11px] font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded transition-colors flex-1 justify-center shadow-2xs"
            >
              <CheckCircle2 className="w-3 h-3" /> Complete
            </button>
          </div>
        )}

        {task.status === 'completed' && (
          <button
            onClick={() => onUpdateStatus(task.id, 'in_progress')}
            className="text-[11px] text-slate-500 hover:text-slate-800 underline decoration-slate-300 w-full text-center py-1"
          >
            Reopen Task
          </button>
        )}
      </div>
    </div>
  );
};
