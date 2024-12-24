import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

interface HabitLog {
habitId: string;
logDate: any; // Firebase Timestamp
notes?: string;
loggedAt: any;
}

// Get the last habit log
export const getLastHabitLog = async (habitId: string) => {
try {
  const logsQuery = query(
    collection(db, 'habit_logs'),
    where('habitId', '==', habitId),
    orderBy('logDate', 'desc'),
    limit(1)
  );
  const querySnapshot = await getDocs(logsQuery);
  return querySnapshot.docs[0]?.data() as HabitLog;
} catch (error) {
  console.error('Error getting last habit log:', error);
  throw error;
}
};

// Get all habit logs
export const getHabitLogs = async (habitId: string): Promise<HabitLog[]> => {
try {
  const logsQuery = query(
    collection(db, 'habit_logs'),
    where('habitId', '==', habitId)
  );
  const querySnapshot = await getDocs(logsQuery);
  return querySnapshot.docs.map(doc => doc.data() as HabitLog);
} catch (error) {
  console.error('Error getting habit logs:', error);
  throw error;
}
};

// Calculate current streak
export const calculateStreak = (lastLog: HabitLog | undefined): number => {
if (!lastLog) return 0;

const lastLogDate = lastLog.logDate.toDate();
const today = new Date();
const diffTime = Math.abs(today.getTime() - lastLogDate.getTime());
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

return diffDays <= 1 ? 1 : 0; // Simple streak calculation
};

// Calculate average completions per week
export const calculateAveragePerWeek = (logs: HabitLog[]): number => {
if (logs.length === 0) return 0;

const firstLog = logs[0].logDate.toDate();
const lastLog = logs[logs.length - 1].logDate.toDate();
const weeksDiff = Math.ceil(
  (lastLog.getTime() - firstLog.getTime()) / (1000 * 60 * 60 * 24 * 7)
);

return weeksDiff === 0 ? logs.length : Number((logs.length / weeksDiff).toFixed(2));
};

// Additional helper functions can be added here
export const getCompletionRate = (logs: HabitLog[], days: number): number => {
const today = new Date();
const startDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

const recentLogs = logs.filter(log =>
  log.logDate.toDate() >= startDate && log.logDate.toDate() <= today
);

return Number(((recentLogs.length / days) * 100).toFixed(2));
};