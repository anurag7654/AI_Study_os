export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Subject {
  id: string;
  name: string;
  code: string;
  category: string;
  targetHours: number;
  completedHours: number;
  color: string; // Tailwind color token or hex
  description: string;
  topics: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // YYYY-MM-DD
  estimatedMinutes: number;
  notes?: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface ScheduleSlot {
  id: string;
  subjectId: string;
  subjectName: string;
  day: DayOfWeek;
  startTime: string; // HH:mm (24h)
  endTime: string;   // HH:mm (24h)
  topic: string;
  completed: boolean;
}

export interface DailyGoal {
  id: string;
  title: string;
  targetMinutes: number;
  completedMinutes: number;
  completed: boolean;
  subjectName: string;
}

export interface StudyLog {
  id: string;
  subjectId: string;
  subjectName: string;
  durationMinutes: number;
  timestamp: string; // ISO
  topicCovered: string;
}
