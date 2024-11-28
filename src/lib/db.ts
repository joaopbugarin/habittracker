import { db } from './firebase';
import {
doc,
getDoc,
updateDoc,
deleteDoc
} from 'firebase/firestore';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { Habit, Reminder } from '@/types/habit'
import {
  getLastHabitLog,
  getHabitLogs,
  calculateStreak,
  calculateAveragePerWeek,
  } from './statsHelpers';

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

const updateStreak = async (habitId: string) => {
  try {
      const streakRef = doc(db, 'streaks', habitId);
      const lastLog = await getLastHabitLog(habitId);
      const currentStreak = calculateStreak(lastLog);

      // Get current streak document
      const streakDoc = await getDoc(streakRef);
      const currentData = streakDoc.data();
      const longestStreak = Math.max(currentStreak, currentData?.longestStreak || 0);

      await updateDoc(streakRef, {
          currentStreak,
          lastLoggedDate: new Date(),
          longestStreak
      });
  } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
  }
};

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

// Get current streak
export const getStreak = async (habitId: string) => {
  try {
      const streakRef = doc(db, 'streaks', habitId);
      const streakDoc = await getDoc(streakRef);
      return streakDoc.data();
  } catch (error) {
      console.error('Error getting streak:', error);
      throw error;
  }
  };

  // Get statistics
  export const getStatistics = async (habitId: string) => {
  try {
      const statsRef = doc(db, 'statistics', habitId);
      const statsDoc = await getDoc(statsRef);
      return statsDoc.data();
  } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
  }
  };

export const deleteHabit = async (habitId: string) => {
  try {
      await deleteDoc(doc(db, 'habits', habitId));
      // Optionally delete related data
      await deleteDoc(doc(db, 'streaks', habitId));
      await deleteDoc(doc(db, 'statistics', habitId));
  } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
  }
};

export const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
  try {
      const habitRef = doc(db, 'habits', habitId);
      await updateDoc(habitRef, {
          ...updates,
          updatedAt: serverTimestamp()
      });
  } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
  }
};