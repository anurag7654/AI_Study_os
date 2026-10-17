import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Target } from 'lucide-react';
import { DailyGoal } from '../../types';

interface TodayGoalsProps {
  goals: DailyGoal[];
  onToggleGoal: (goalId: string) => void;
  onAddGoal: (title: string, subjectName: string, minutes: number) => void;
}

export const TodayGoals: React.FC<TodayGoalsProps> = ({
  goals,
  onToggleGoal,
  onAddGoal,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('MERN Stack');
  const [newMinutes, setNewMinutes] = useState(45);

  const completedCount = goals.filter((g) => g.completed).length;
  const percentage = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddGoal(newTitle.trim(), newSubject, newMinutes);
    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-semibold text-slate-900">Today's Study Goals</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {completedCount} of {goals.length} completed
            </span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
              title="Add a goal"
              aria-label="Add a goal"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span>Daily target progress</span>
            <span className="font-mono tabular-nums font-medium text-slate-700">{percentage}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Add goal inline form */}
        {showAddForm && (
          <form onSubmit={handleCreate} className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2">
            <input
              type="text"
              placeholder="What is your study goal for today?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-700"
              >
                <option value="MERN Stack">MERN Stack</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="OOSE">OOSE</option>
                <option value="Distributed Computing">Distributed Computing</option>
              </select>
              <input
                type="number"
                min={15}
                step={15}
                value={newMinutes}
                onChange={(e) => setNewMinutes(Number(e.target.value))}
                className="w-20 text-xs bg-white border border-slate-300 rounded px-2 py-1 font-mono text-slate-700"
                placeholder="Mins"
              />
              <span className="text-[11px] text-slate-500">mins</span>
              <div className="ml-auto flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-1 text-xs bg-slate-900 text-white rounded hover:bg-slate-800"
                >
                  Add
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Goals List */}
        <div className="mt-4 space-y-2.5">
          {goals.length === 0 ? (
            <div className="py-6 px-4 text-center border border-dashed border-slate-200 rounded-lg text-xs text-slate-400">
              No goals set for today yet. Click the <span className="font-semibold text-slate-600">+</span> button above to set your first daily target.
            </div>
          ) : (
            goals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => onToggleGoal(goal.id)}
              className={`p-2.5 rounded-md border text-xs cursor-pointer transition-colors flex items-start justify-between group ${
                goal.completed
                  ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 group-hover:text-slate-700 transition-colors"
                  aria-label={goal.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {goal.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300" />
                  )}
                </button>
                <div>
                  <span className={goal.completed ? 'line-through text-slate-400' : 'font-medium text-slate-800'}>
                    {goal.title}
                  </span>
                  {/* Zero-pill unboxed metadata */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                    <span>{goal.subjectName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{goal.targetMinutes}m target</span>
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                  goal.completed
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-500 bg-slate-100'
                }`}
              >
                {goal.completed ? 'Done' : 'Pending'}
              </span>
            </div>
          ))
          )}
        </div>
      </div>
    </div>
  );
};
