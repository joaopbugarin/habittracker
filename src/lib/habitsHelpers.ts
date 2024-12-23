import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc
  } from 'firebase/firestore'
  import { db, auth } from './firebase'
  import { Habit, NewHabit } from '@/types/habit'
  import { useEffect } from 'react'
  import { startOfDay, endOfDay, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'
  
  // Create a new habit
export const createNewHabit = async (habitData: NewHabit) => {
    try {
      const currentUser = auth.currentUser;
      console.log('createNewHabit: Current user:', currentUser?.uid);
    
      if (!currentUser) {
        throw new Error('No user logged in');
      }
    
      // Be explicit about the data structure
      const newHabitData = {
        name: habitData.name,
        frequency: habitData.frequency,
        targetCount: habitData.targetCount,
        userId: currentUser.uid,
        completions: {},
        lastCompleted: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true
      };
    
      console.log('createNewHabit: Prepared data:', newHabitData);
    
      const habitsRef = collection(db, 'habits');
      const docRef = await addDoc(habitsRef, newHabitData);
    
      console.log('createNewHabit: Document added with ID:', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('createNewHabit: Error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
};

  // Load user's habits
  export const loadUserHabits = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error('No user logged in');
    }
  
    const habitsQuery = query(
      collection(db, 'habits'),
      where('userId', '==', auth.currentUser.uid),
      where('isActive', '==', true)
    );
  
    const querySnapshot = await getDocs(habitsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Habit[];
  } catch (error) {
    console.error('Error loading habits:', error);
    return [];
  }
  };
  
  // Check if a habit is completed for the current period
  export const checkHabitCompletion = (habit: Habit): boolean => {
  const now = new Date();
  const { frequency, targetCount, completions, lastCompleted } = habit;
  
  if (!lastCompleted) return false;
  
  let periodStart: Date;
  let periodEnd: Date;
  
  switch (frequency) {
    case 'daily':
      periodStart = startOfDay(now);
      periodEnd = endOfDay(now);
      break;
    case 'weekly':
      periodStart = startOfWeek(now);
      periodEnd = endOfWeek(now);
      break;
    default:
      periodStart = startOfDay(now);
      periodEnd = endOfDay(now);
  }
  
  const isCurrentPeriod = isWithinInterval(new Date(lastCompleted.periodStart), {
    start: periodStart,
    end: periodEnd
  });
  
  if (!isCurrentPeriod) return false;
  
  const currentCompletions = Object.entries(completions)
  .filter(([date]) => {
    const completionDate = new Date(date);
    return isWithinInterval(completionDate, {
      start: periodStart,
      end: periodEnd
    });
  })
  .reduce((sum, [_, count]) => sum + (count as number), 0);

  return currentCompletions >= targetCount;
};
  
export const getCompletedToday = (habits: Habit[]): number => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  return habits.filter(habit => {
    const completionsToday = (habit.completions?.[today] as number) || 0;
    return completionsToday > 0;
  }).length;
};

  // Toggle habit completion
export const toggleHabitCompletion = async (habitId: string) => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  
  try {
    const habitRef = doc(db, 'habits', habitId);
    const habitDoc = await getDoc(habitRef);
    
    if (!habitDoc.exists()) throw new Error('Habit not found');
    
    const habit = habitDoc.data() as Habit;
    const { frequency, completions = {} } = habit;
  
    const currentCompletions: number = (completions[todayStr] as number) || 0;
    
    let periodStart: Date;
    let periodEnd: Date;
  
    switch (frequency) {
      case 'daily':
        periodStart = startOfDay(now);
        periodEnd = endOfDay(now);
        break;
      case 'weekly':
        periodStart = startOfWeek(now);
        periodEnd = endOfWeek(now);
        break;
      default:
        periodStart = startOfDay(now);
        periodEnd = endOfDay(now);
    }
  
    const newCompletions = {
      ...completions,
      [todayStr]: currentCompletions + 1
    };
  
    const lastCompleted = {
      date: todayStr,
      count: currentCompletions + 1,
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString()
    };
  
    await updateDoc(habitRef, {
      completions: newCompletions,
      lastCompleted,
      updatedAt: serverTimestamp()
    });
  
    return { success: true };
  } catch (error) {
    console.error('Error toggling habit:', error);
    return { success: false, error };
  }
  };

  export const deleteHabit = async (habitId: string) => {
    try {
      const habitRef = doc(db, 'habits', habitId)
      
      // Soft delete by setting isActive to false
      await updateDoc(habitRef, {
        isActive: false,
        updatedAt: serverTimestamp()
      })
    
      return { success: true }
    } catch (error) {
      console.error('Error deleting habit:', error)
      return { success: false, error }
    }
}