import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  CheckSquare,
  BarChart2,
  Sparkles,
  BookMarked,
  X,
  GraduationCap,
  LogOut,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'planner' | 'subjects' | 'tasks' | 'progress' | 'aicoach';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  taskCount: number;
  userEmail?: string;
  onSignOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  taskCount,
  userEmail,
  onSignOut,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planner', label: 'Weekly Planner', icon: Calendar },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: taskCount },
    { id: 'progress', label: 'Progress', icon: BarChart2 },
    { id: 'aicoach', label: 'AI Coach', icon: Sparkles },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const content = (
    <div className="h-full flex flex-col justify-between p-4 bg-white border-r border-slate-200">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider">
              OS
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-slate-900 block leading-tight">
                AI Study OS
              </span>
              <span className="text-[11px] text-slate-400 font-mono">v1.0 · MVP Build</span>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1 text-slate-400 hover:text-slate-600 rounded-md"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="mt-5 space-y-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 stroke-[1.75] ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User / Student Profile Footer with Sign Out */}
      <div className="pt-4 border-t border-slate-200">
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs font-mono shrink-0">
              {userEmail ? userEmail.slice(0, 2).toUpperCase() : 'AR'}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-800 truncate block" title={userEmail}>
                {userEmail || 'anuragaeyan850@gmail.com'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono truncate block">
                Authorized Candidate
              </span>
            </div>
          </div>

          {onSignOut && (
            <button
              onClick={onSignOut}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-200 transition-colors shrink-0"
              title="Sign out of AI Study OS"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-200 ease-in-out md:hidden ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </div>
    </>
  );
};
