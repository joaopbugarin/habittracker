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
  <div className={`min-h-screen ${theme.colors.background.main}`}>
    {/* Header */}
    <nav className={`${theme.colors.background.card} shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              src="/images/rabbitlogo.png"
              alt="Logo"
              className="h-8 w-auto"
            />
            <h1 className={`ml-4 text-xl font-semibold ${theme.colors.text.primary}`}>
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
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Habits List */}
      <div className={`${theme.components.card} mb-6`}>
        {habits.length === 0 ? (
          <p className={`text-center ${theme.colors.text.muted}`}>
            hutch is empty, hop-portunities missed...*shame*
          </p>
        ) : (
          <ul className="space-y-4">
            {habits.map((habit: any) => (
              <li key={habit.id} className={`border-b pb-4 ${theme.colors.border.main}`}>
                <h3 className={`font-medium ${theme.colors.text.primary}`}>{habit.name}</h3>
                <p className={`text-sm ${theme.colors.text.muted}`}>
                  Frequency: {habit.frequency}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Habit Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className={theme.components.button.primary}
        >
          add new habit
        </button>
      </div>
    </main>

    {/* Add Habit Modal */}
    {showAddModal && (
      <div className={theme.components.modal}>
        <div className={`${theme.components.card} w-full max-w-md`}>
          <h2 className={`text-xl font-bold mb-4 ${theme.colors.text.primary}`}>save</h2>
          <form onSubmit={handleAddHabit}>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text.secondary}`}>
                  Habit Name
                </label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                  className={theme.components.input}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text.secondary}`}>
                  Frequency
                </label>
                <select
                value={newHabit.frequency}
                onChange={(e) => setNewHabit({
                  ...newHabit,
                  frequency: e.target.value as Frequency
                })}
                className={theme.components.input}
                >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text.secondary}`}>
                  Target Count
                </label>
                <input
                  type="number"
                  value={newHabit.targetCount}
                  onChange={(e) => setNewHabit({...newHabit, targetCount: parseInt(e.target.value)})}
                  className={theme.components.input}
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className={theme.components.button.secondary}
              >
                cancel
              </button>
              <button
                type="submit"
                className={theme.components.button.primary}
              >
                save
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
)
}