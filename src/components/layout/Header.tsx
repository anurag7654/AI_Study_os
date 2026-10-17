import React from 'react';
import { Menu, Play, BookOpen, RotateCcw } from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  activeTab: NavTab;
  currentDateStr: string;
  currentTimeStr: string;
  onOpenMobileNav: () => void;
  onOpenTimer: () => void;
  onOpenArchitecture: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  currentDateStr,
  currentTimeStr,
  onOpenMobileNav,
  onOpenTimer,
  onOpenArchitecture,
  onResetData,
}) => {
  const titles: Record<NavTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Study Dashboard', subtitle: 'Overview of daily goals, timetable & progress' },
    planner: { title: 'Weekly Planner', subtitle: 'Detailed schedule across your technical tracks' },
    subjects: { title: 'Subjects & Curricula', subtitle: 'Syllabus modules and targeted study hours' },
    tasks: { title: 'Tasks Kanban Board', subtitle: 'Pending, in-progress and completed study items' },
    progress: { title: 'Learning Progress', subtitle: 'Hour allocations, completion velocity & metrics' },
    aicoach: { title: 'AI Study Coach', subtitle: 'Phase 2 Gemini architectural roadmap & preview' },
  };

  const current = titles[activeTab];

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left zone: Mobile trigger + Breadcrumb / Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileNav}
          className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
            <span>Workspace</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-600 capitalize">{activeTab}</span>
          </div>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight truncate">
            {current.title}
          </h1>
        </div>
      </div>

      {/* Right zone: Live time + primary actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md tabular-nums">
          <span>{currentDateStr}</span>
          <span className="text-slate-300">·</span>
          <span className="font-semibold text-slate-900">{currentTimeStr}</span>
        </div>

        <button
          onClick={onResetData}
          className="hidden lg:flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded hover:bg-slate-100 transition-colors"
          title="Reset workspace to clean slate"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">Reset to Clean State</span>
        </button>

        <button
          onClick={onOpenArchitecture}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-2xs whitespace-nowrap"
          title="View fullstack interview explanation guide"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">Architecture & Interview Guide</span>
          <span className="sm:hidden">Guide</span>
        </button>

        <button
          onClick={onOpenTimer}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Focus Session</span>
        </button>
      </div>
    </header>
  );
};
