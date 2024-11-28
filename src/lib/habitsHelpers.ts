import { auth } from './firebase'
import { createHabit as dbCreateHabit, getUserHabits as dbGetUserHabits } from './db'
import { Habit } from '@/types/habit'

export const loadUserHabits = async () => {
if (!auth.currentUser) return []
try {
  return await dbGetUserHabits(auth.currentUser.uid)
} catch (error) {
  console.error('Error loading habits:', error)
  return []
}
}

export const createNewHabit = async (habitData: Partial<Habit>) => {
if (!auth.currentUser) return { success: false, error: 'No user logged in' }
try {
  await dbCreateHabit(auth.currentUser.uid, habitData)
  return { success: true }
} catch (error) {
  console.error('Error creating habit:', error)
  return { success: false, error }
}
}