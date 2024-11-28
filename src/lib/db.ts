import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { Habit } from '../types/habit';

export const createHabit = async (userId: string, habitData: Partial<Omit<Habit, 'id'>>) => {
  try {
    const habitToAdd = {
      name: habitData.name,
      frequency: habitData.frequency,
      targetCount: Number(habitData.targetCount),
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true
    };

    const docRef = await addDoc(collection(db, 'habits'), habitToAdd);
    return docRef.id;
  } catch (error) {
    console.error('Error creating habit:', error);
    throw error;
  }
  };

  export const getUserHabits = async (userId: string): Promise<Habit[]> => {
  try {
    const habitsQuery = query(
      collection(db, 'habits'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(habitsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Habit[];
  } catch (error) {
    console.error('Error getting habits:', error);
    throw error;
  }
  };
// Habit Logs
export const logHabitCompletion = async (habitId: string, notes?: string) => {
    try {
        const logRef = await addDoc(collection(db, 'habit_logs'), {
            habitId,
            logDate: new Date(),
            notes,
            loggedAt: serverTimestamp()
        });

        // Update statistics
        await updateStatistics(habitId);
        // Update streak
        await updateStreak(habitId);

        return logRef.id;
    } catch (error) {
        console.error('Error logging habit:', error);
        throw error;
    }
};

// Reminders
export const createReminder = async (habitId: string, reminderData: Partial<Reminder>) => {
    try {
        const docRef = await addDoc(collection(db, 'reminders'), {
            ...reminderData,
            habitId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            isActive: true
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating reminder:', error);
        throw error;
    }
};

// Streaks
const updateStreak = async (habitId: string) => {
    try {
        const streakRef = doc(db, 'streaks', habitId);
        const lastLog = await getLastHabitLog(habitId);

        // Calculate streak logic here
        const currentStreak = calculateStreak(lastLog);

        await updateDoc(streakRef, {
            currentStreak,
            lastLoggedDate: new Date(),
            longestStreak: Math.max(currentStreak, /* previous longest streak */)
        });
    } catch (error) {
        console.error('Error updating streak:', error);
        throw error;
    }
};

// Statistics
const updateStatistics = async (habitId: string) => {
    try {
        const statsRef = doc(db, 'statistics', habitId);
        const logs = await getHabitLogs(habitId);

        const totalCompletions = logs.length;
        const averagePerWeek = calculateAveragePerWeek(logs);

        await updateDoc(statsRef, {
            totalCompletions,
            averagePerWeek,
            lastUpdated: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating statistics:', error);
        throw error;
    }
};

