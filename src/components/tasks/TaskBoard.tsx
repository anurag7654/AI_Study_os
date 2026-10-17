import React, { useState } from 'react';
import { Plus, Search, Filter, CheckSquare } from 'lucide-react';
import { Task, Subject, TaskStatus, TaskPriority } from '../../types';
import { TaskCard } from './TaskCard';
import { AddTaskModal } from './AddTaskModal';
import { EmptyState } from '../common/EmptyState';

interface TaskBoardProps {
  tasks: Task[];
  subjects: Subject[];
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (task: {
    title: string;
    subjectId: string;
    subjectName: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string;
    estimatedMinutes: number;
    notes?: string;
  }) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  subjects,
  onUpdateStatus,
  onAddTask,
  onDeleteTask,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSubject = selectedSubjectId === 'all' || t.subjectId === selectedSubjectId;
    const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;
    const matchesSearch =
      searchQuery.trim() === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesPriority && matchesSearch;
  });

  const pendingTasks = filteredTasks.filter((t) => t.status === 'pending');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  const columns: { title: string; status: TaskStatus; items: Task[]; countColor: string }[] = [
    { title: 'Pending Backlog', status: 'pending', items: pendingTasks, countColor: 'text-slate-600' },
    { title: 'In Progress', status: 'in_progress', items: inProgressTasks, countColor: 'text-blue-600' },
    { title: 'Completed', status: 'completed', items: completedTasks, countColor: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Study Tasks Board</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize practice problems, implementation tasks, and interview concepts
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Add Task
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, algorithms, frameworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full sm:w-auto text-xs bg-white border border-slate-200 rounded-md px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Subjects ({tasks.length})</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full sm:w-auto text-xs bg-white border border-slate-200 rounded-md px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Kanban 3-Column Grid */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks match your filters"
          description="Try broadening your subject/priority filters or create a new targeted study task."
          actionLabel="Add New Task"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {columns.map((col) => (
            <div key={col.status} className="flex flex-col space-y-3">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900 tracking-wide uppercase">
                  {col.title}
                </span>
                <span className={`text-xs font-mono font-semibold ${col.countColor} tabular-nums`}>
                  {col.items.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-3">
                {col.items.length === 0 ? (
                  <div className="py-8 px-4 text-center border border-dashed border-slate-200 rounded-lg text-xs text-slate-400">
                    No tasks {col.status === 'completed' ? 'finished yet' : `in ${col.title.toLowerCase()}`}
                  </div>
                ) : (
                  col.items.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdateStatus={onUpdateStatus}
                      onDeleteTask={onDeleteTask}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        subjects={subjects}
        onAddTask={onAddTask}
      />
    </div>
  );
};
