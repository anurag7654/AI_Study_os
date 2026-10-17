import { DayOfWeek, ScheduleSlot } from '../types';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Returns the current day of the week based on local browser time
 */
export const getTodayDayOfWeek = (): DayOfWeek => {
  const dayIndex = new Date().getDay();
  return DAYS_OF_WEEK[dayIndex];
};

/**
 * Formats current date for display, e.g. "Saturday, Oct 17, 2026"
 */
export const formatDisplayDate = (d = new Date()): string => {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats current time in 12h format with am/pm or 24h
 */
export const formatCurrentTime = (d = new Date()): string => {
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Converts "HH:mm" (24h) to total minutes from midnight (0 to 1439)
 */
export const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
};

/**
 * Formats 24h "HH:mm" string into readable 12h format "12:00 AM" or "3:00 PM"
 */
export const formatTime12h = (time24: string): string => {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr ? mStr.padStart(2, '0') : '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // hour '0' should be '12'
  return `${h}:${m} ${ampm}`;
};

export type SlotTimingStatus = 'ongoing' | 'upcoming' | 'completed' | 'past';

/**
 * Calculates whether a slot on today is ongoing, upcoming, past, or completed
 */
export const getSlotTimingStatus = (
  slot: ScheduleSlot,
  currentDay: DayOfWeek,
  currentMinutes: number
): SlotTimingStatus => {
  if (slot.completed) return 'completed';
  if (slot.day !== currentDay) {
    return 'upcoming';
  }

  const startMins = parseTimeToMinutes(slot.startTime);
  const endMins = parseTimeToMinutes(slot.endTime);

  // Handle slot spanning past midnight (e.g. 23:00 to 01:00)
  const isOngoing =
    endMins >= startMins
      ? currentMinutes >= startMins && currentMinutes < endMins
      : currentMinutes >= startMins || currentMinutes < endMins;

  if (isOngoing) return 'ongoing';

  if (currentMinutes < startMins) return 'upcoming';

  return 'past';
};
