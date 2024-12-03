'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { handleSignOut } from '@/lib/authHelpers'
import { loadUserHabits, createNewHabit } from '@/lib/habitsHelpers'
import { Habit, Reminder } from '@/types/habit'
import { theme } from '@/styles/theme'

type Frequency = 'daily' | 'weekly';

interface NewHabit {
name: string;
frequency: Frequency;
targetCount: number;
}

export default function Dashboard() {
const router = useRouter()
const [habits, setHabits] = useState<Habit[]>([])
const [showAddModal, setShowAddModal] = useState(false)
const [newHabit, setNewHabit] = useState<NewHabit>({
  name: '',
  frequency: 'daily',
  targetCount: 1
  })

useEffect(() => {
  const fetchHabits = async () => {
    const userHabits = await loadUserHabits()
    setHabits(userHabits)
  }
  fetchHabits()
}, [])

const onSignOut = async () => {
  const { success } = await handleSignOut()
  if (success) {
    router.push('/')
  }
}

const handleAddHabit = async (e: React.FormEvent) => {
  e.preventDefault()
  const { success } = await createNewHabit(newHabit)

  if (success) {
    const userHabits = await loadUserHabits()
    setHabits(userHabits)
    setShowAddModal(false)
    setNewHabit({
      name: '',
      frequency: 'daily',
      targetCount: 1
    })
  }
}

return (
  <div className={`min-h-screen ${theme.colors.background.main} p-6`}>
    {/* Header */}
    <nav className={`${theme.colors.background.card} shadow-md mb-8 rounded-lg`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <img
              src="/images/rabbitlogo.png"
              alt="Logo"
              className="h-10 w-auto"
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
    <main className="max-w-5xl mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className={`${theme.components.card} flex flex-col`}>
          <span className={`text-sm ${theme.colors.text.secondary} font-medium`}>Active Habits</span>
          <span className={`text-3xl font-bold ${theme.colors.text.primary} mt-2`}>
            {habits.length}
          </span>
        </div>
        <div className={`${theme.components.card} flex flex-col`}>
          <span className={`text-sm ${theme.colors.text.secondary} font-medium`}>Completed Today</span>
          <span className={`text-3xl font-bold ${theme.colors.text.primary} mt-2`}>0</span>
        </div>
        <div className={`${theme.components.card} flex flex-col`}>
          <span className={`text-sm ${theme.colors.text.secondary} font-medium`}>Current Streak</span>
          <span className={`text-3xl font-bold ${theme.colors.text.primary} mt-2`}>0</span>
        </div>
      </div>
  
      {/* Habits Section */}
      <div className={`${theme.components.card}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-xl font-semibold ${theme.colors.text.primary}`}>
            Habits
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className={theme.components.button.primary}
          >
            add new habit
          </button>
        </div>
  
        {habits.length === 0 ? (
          <div className="text-center py-8">
            <p className={`${theme.colors.text.secondary} mb-4`}>
              hutch is empty, hop-portunities missed...*shame*
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className={`${theme.colors.text.primary} font-medium hover:underline`}
            >
              Add your first habit
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {habits.map((habit: any) => (
              <li key={habit.id} className="py-6 flex justify-between items-center">
                <div>
                  <h3 className={`font-medium ${theme.colors.text.primary} text-lg`}>
                    {habit.name}
                  </h3>
                  <p className={`${theme.colors.text.secondary} mt-1`}>
                    {habit.frequency}
                  </p>
                </div>
                <button
                  className={theme.components.button.secondary}
                >
                  Complete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  
    {/* Modal */}
    {showAddModal && (
      <div className={theme.components.modal}>
        <div className={`${theme.components.card} w-full max-w-md`}>
          <h2 className={`text-xl font-bold mb-6 ${theme.colors.text.primary}`}>save</h2>
          {/* ... rest of modal content with theme colors ... */}
        </div>
      </div>
    )}
  </div>
  )
}