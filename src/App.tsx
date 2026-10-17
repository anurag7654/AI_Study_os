/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_SUBJECTS,
  INITIAL_TASKS,
  INITIAL_SCHEDULE,
  INITIAL_GOALS,
} from './data/mockData';
import {
  Subject,
  Task,
  ScheduleSlot,
  DailyGoal,
  TaskStatus,
  TaskPriority,
  DayOfWeek,
} from './types';
import {
  getTodayDayOfWeek,
  formatDisplayDate,
  formatCurrentTime,
} from './utils/dateTime';
import {
  loadFromStorage,
  saveToStorage,
  removeFromStorage,
} from './utils/storage';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { WeeklyPlanner } from './components/planner/WeeklyPlanner';
import { SubjectList } from './components/subjects/SubjectList';
import { TaskBoard } from './components/tasks/TaskBoard';
import { ProgressView } from './components/progress/ProgressView';
import { AiCoachView } from './components/aiCoach/AiCoachView';
import { StudyTimerModal } from './components/dashboard/StudyTimerModal';
import { ArchitectureModal } from './components/common/ArchitectureModal';
import { LoadingState } from './components/common/LoadingState';
import { LoginPage } from './components/auth/LoginPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() =>
    loadFromStorage<string | null>('ai_study_os_user_session', null)
  );
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isOpenMobileNav, setIsOpenMobileNav] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Live real-time clock synced with user's system
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 5000); // Sync every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const currentDay = getTodayDayOfWeek();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentDateStr = formatDisplayDate(now);
  const currentTimeStr = formatCurrentTime(now);

  // Core State with LocalStorage Persistence
  const [subjects, setSubjects] = useState<Subject[]>(() =>
    loadFromStorage('ai_study_os_subjects', INITIAL_SUBJECTS)
  );
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadFromStorage('ai_study_os_tasks', INITIAL_TASKS)
  );
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(() =>
    loadFromStorage('ai_study_os_schedule', INITIAL_SCHEDULE)
  );
  const [goals, setGoals] = useState<DailyGoal[]>(() =>
    loadFromStorage('ai_study_os_goals', INITIAL_GOALS)
  );

  // Auto-sync state changes to LocalStorage
  useEffect(() => {
    saveToStorage('ai_study_os_subjects', subjects);
  }, [subjects]);

  useEffect(() => {
    saveToStorage('ai_study_os_tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage('ai_study_os_schedule', schedule);
  }, [schedule]);

  useEffect(() => {
    saveToStorage('ai_study_os_goals', goals);
  }, [goals]);

  // Modals state
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [timerSubjectId, setTimerSubjectId] = useState<string | undefined>(undefined);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  // Simulate initial load to illustrate loading states
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers: Goals ---
  const handleToggleGoal = (goalId: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, completed: !g.completed } : g))
    );
  };

  const handleAddGoal = (title: string, subjectName: string, minutes: number) => {
    const newGoal: DailyGoal = {
      id: `goal-${Date.now()}`,
      title,
      subjectName,
      targetMinutes: minutes,
      completedMinutes: 0,
      completed: false,
    };
    setGoals((prev) => [newGoal, ...prev]);
  };

  // --- Handlers: Timetable ---
  const handleToggleSlot = (slotId: string) => {
    setSchedule((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleAddSlot = (newSlot: {
    subjectId: string;
    subjectName: string;
    day: DayOfWeek;
    startTime: string;
    endTime: string;
    topic: string;
  }) => {
    const slot: ScheduleSlot = {
      id: `slot-${Date.now()}`,
      ...newSlot,
      completed: false,
    };
    setSchedule((prev) => [...prev, slot]);
  };

  const handleDeleteSlot = (slotId: string) => {
    setSchedule((prev) => prev.filter((s) => s.id !== slotId));
  };

  // --- Handlers: Tasks ---
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleAddTask = (newTask: {
    title: string;
    subjectId: string;
    subjectName: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string;
    estimatedMinutes: number;
    notes?: string;
  }) => {
    const task: Task = {
      id: `task-${Date.now()}`,
      ...newTask,
    };
    setTasks((prev) => [task, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // --- Handlers: Subjects & Hours ---
  const handleToggleTopic = (subjectId: string, topicId: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          topics: sub.topics.map((t) =>
            t.id === topicId ? { ...t, completed: !t.completed } : t
          ),
        };
      })
    );
  };

  const handleQuickLogHour = (subjectId: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          completedHours: sub.completedHours + 1,
        };
      })
    );
  };

  const handleLogStudyTime = (subjectId: string, minutes: number, topic: string) => {
    // Add to subject completed hours (convert minutes to fractional or rounded hours)
    const hoursToAdd = Number((minutes / 60).toFixed(1));
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          completedHours: Number((sub.completedHours + Math.max(0.5, hoursToAdd)).toFixed(1)),
        };
      })
    );

    // Also mark or add a daily goal if matching
    const matchingSubject = subjects.find((s) => s.id === subjectId);
    if (matchingSubject) {
      handleAddGoal(`Studied ${topic}`, matchingSubject.name, minutes);
    }
  };

  const handleStartFocus = (subjectId: string, _topic: string) => {
    setTimerSubjectId(subjectId);
    setIsTimerOpen(true);
  };

  const handleResetData = () => {
    setSubjects(INITIAL_SUBJECTS);
    setTasks(INITIAL_TASKS);
    setSchedule(INITIAL_SCHEDULE);
    setGoals(INITIAL_GOALS);
    removeFromStorage('ai_study_os_subjects');
    removeFromStorage('ai_study_os_tasks');
    removeFromStorage('ai_study_os_schedule');
    removeFromStorage('ai_study_os_goals');
  };

  const handleLoginSuccess = (email: string) => {
    setCurrentUser(email);
    saveToStorage('ai_study_os_user_session', email);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    removeFromStorage('ai_study_os_user_session');
  };

  // If user is not authenticated, render Login Page
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpenMobile={isOpenMobileNav}
        onCloseMobile={() => setIsOpenMobileNav(false)}
        taskCount={tasks.filter((t) => t.status !== 'completed').length}
        userEmail={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          currentDateStr={currentDateStr}
          currentTimeStr={currentTimeStr}
          onOpenMobileNav={() => setIsOpenMobileNav(true)}
          onOpenTimer={() => {
            setTimerSubjectId(undefined);
            setIsTimerOpen(true);
          }}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
          onResetData={handleResetData}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {isLoading ? (
            <LoadingState message="Loading AI Study OS workspace..." />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  subjects={subjects}
                  tasks={tasks}
                  schedule={schedule}
                  goals={goals}
                  currentDay={currentDay}
                  currentMinutes={currentMinutes}
                  onToggleGoal={handleToggleGoal}
                  onAddGoal={handleAddGoal}
                  onToggleSlot={handleToggleSlot}
                  onStartFocus={handleStartFocus}
                  onQuickLogHour={handleQuickLogHour}
                  onNavigateTab={setActiveTab}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                />
              )}

              {activeTab === 'planner' && (
                <WeeklyPlanner
                  schedule={schedule}
                  subjects={subjects}
                  currentDay={currentDay}
                  currentMinutes={currentMinutes}
                  onToggleSlot={handleToggleSlot}
                  onAddSlot={handleAddSlot}
                  onDeleteSlot={handleDeleteSlot}
                  onStartFocus={handleStartFocus}
                />
              )}

              {activeTab === 'subjects' && (
                <SubjectList
                  subjects={subjects}
                  tasks={tasks}
                  onToggleTopic={handleToggleTopic}
                  onQuickLogHour={handleQuickLogHour}
                />
              )}

              {activeTab === 'tasks' && (
                <TaskBoard
                  tasks={tasks}
                  subjects={subjects}
                  onUpdateStatus={handleUpdateTaskStatus}
                  onAddTask={handleAddTask}
                  onDeleteTask={handleDeleteTask}
                />
              )}

              {activeTab === 'progress' && (
                <ProgressView
                  subjects={subjects}
                  tasks={tasks}
                  schedule={schedule}
                  onQuickLogHour={handleQuickLogHour}
                />
              )}

              {activeTab === 'aicoach' && (
                <AiCoachView subjects={subjects} tasks={tasks} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <StudyTimerModal
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        subjects={subjects}
        initialSubjectId={timerSubjectId}
        onLogStudyTime={handleLogStudyTime}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
}
