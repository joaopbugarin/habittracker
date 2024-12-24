'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { collection, getDocs, query, limit, where } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import { 
loadUserHabits, 
getCompletedToday, 
toggleHabitCompletion, 
deleteHabit,
createNewHabit 
} from '@/lib/habitsHelpers'
import { HabitsList } from '@/components/HabitsList'
import { AddHabitModal } from '@/components/AddHabitModal'
import { theme } from '@/styles/theme'
import { Habit, NewHabit } from '@/types/habit'
import { auth, db } from '@/lib/firebase'
import { GrassAnimation } from '@/components/GrassAnimation'
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal'

export default function Dashboard() {
const router = useRouter()
const { user, loading } = useAuth()  // Get user from auth context
const [habits, setHabits] = useState<Habit[]>([])
const [showAddModal, setShowAddModal] = useState(false)
const [newHabit, setNewHabit] = useState<NewHabit>({
  name: '',
  frequency: 'daily',
  targetCount: 1
  })

  useEffect(() => {
    if (!loading && !user) {
      console.log('No authenticated user, redirecting to home');
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const handleCompleteHabit = async (habitId: string) => {
    try {
      const { success, error } = await toggleHabitCompletion(habitId)
      
      if (success) {
        // Refresh habits list to get updated completion status
        const userHabits = await loadUserHabits()
        setHabits(userHabits)
      } else {
        console.error('Failed to complete habit:', error)
        // Optionally add error notification here
      }
    } catch (error) {
      console.error('Error completing habit:', error)
      // Optionally add error notification here
    }
  }

  const onSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    };

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    habitId: string;
    habitName: string;
  }>({
    isOpen: false,
    habitId: '',
    habitName: ''
  });

  const handleDeleteHabit = async (habitId: string, habitName: string) => {
    setDeleteModal({
      isOpen: true,
      habitId,
      habitName
    });
  };

  const confirmDelete = async () => {
    try {
      const { success } = await deleteHabit(deleteModal.habitId);
      
      if (success) {
        const userHabits = await loadUserHabits();
        setHabits(userHabits);
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
    } finally {
      setDeleteModal({ isOpen: false, habitId: '', habitName: '' });
    }
};

return (
  <div className={`min-h-screen ${theme.colors.background.main} relative overflow-hidden`}>
    {/* Header */}
    <nav className={`${theme.colors.background.card} shadow-md w-full relative z-20`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            <img
              src="/images/rabbitlogo.png"
              alt="Logo"
              className="h-24 w-auto transform transition-all duration-300 hover:scale-125 hover:rotate-3 cursor-pointer"
            />
            <h1 className={`text-2xl font-bold ${theme.colors.text.primary}`}>
              my warren
            </h1>
          </div>
          <button
            onClick={onSignOut}
            className={theme.components.button.secondary}
          >
            sign out
          </button>
        </div>
      </div>
    </nav>
  
    {/* Main Content */}
    <div className="relative z-20">
      <main className="max-w-5xl mx-auto px-6 pt-2 pb-32">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
          <div className={`${theme.components.card} flex flex-col`}>
            <span className={`text-sm ${theme.colors.text.secondary} font-semibold`}>
              active habits
            </span>
            <span className={`text-3xl font-bold ${theme.colors.text.stats} mt-2`}>
              {habits.length}
            </span>
          </div>
          
          <div className={`${theme.components.card} flex flex-col`}>
            <span className={`text-sm ${theme.colors.text.secondary} font-semibold`}>
              completed today
            </span>
            <span className={`text-3xl font-bold ${theme.colors.text.stats} mt-2`}>
              {getCompletedToday(habits)}
            </span>
          </div>
          
          <div className={`${theme.components.card} flex flex-col`}>
            <span className={`text-sm ${theme.colors.text.secondary} font-semibold`}>
              current streak
            </span>
            <span className={`text-3xl font-bold ${theme.colors.text.stats} mt-2`}>
              0
            </span>
          </div>
        </div>
    
        {/* Habits Section */}
        <div className={`${theme.components.card}`}>
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <h2 className={`text-2xl font-bold border-b-2 border-emerald-500 ${theme.colors.text.secondary}`}>
                habits
              </h2>
              <span className={`text-sm ${theme.colors.text.muted}`}>
                ({habits.length})
              </span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className={`${theme.components.button.primary} flex items-center space-x-2`}
            >
              <span>+</span>
              <span>add new habit</span>
            </button>
          </div>
  
          <HabitsList 
            habits={habits} 
            onComplete={handleCompleteHabit}
            onDelete={handleDeleteHabit}
          />
        </div>
      </main>
    </div>
  
    {/* Position grass */}
    <div className="absolute bottom-0 left-0 right-0 z-10 h-24">
      <GrassAnimation />
    </div>
  
    {/* Modals */}
    {showAddModal && (
      <AddHabitModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={async (habit: NewHabit) => {
          console.log('Starting habit creation...', {
            habit,
            userId: user?.uid
          });
  
          const result = await createNewHabit(habit);
          console.log('Creation attempt result:', result);
  
          if (result.success) {
            console.log('Habit created successfully, refreshing list...');
            const userHabits = await loadUserHabits();
            setHabits(userHabits);
          }
  
          return result;
        }}
      />
    )}
  
    <DeleteConfirmationModal
      isOpen={deleteModal.isOpen}
      habitName={deleteModal.habitName}
      onConfirm={confirmDelete}
      onCancel={() => setDeleteModal({ isOpen: false, habitId: '', habitName: '' })}
    />
  </div>
)}