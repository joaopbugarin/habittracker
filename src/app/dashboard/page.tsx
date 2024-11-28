'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { handleSignOut } from '@/lib/authHelpers'
import { loadUserHabits, createNewHabit } from '@/lib/habitsHelpers'
import { Habit } from '@/types/habit'

export default function Dashboard() {
const router = useRouter()
const [habits, setHabits] = useState<Habit[]>([])
const [showAddModal, setShowAddModal] = useState(false)
const [newHabit, setNewHabit] = useState({
  name: '',
  frequency: 'daily' as const,
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
  <div className="min-h-screen bg-gray-100">
    {/* Header */}
<nav className="bg-white shadow-sm">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex justify-between items-center h-16"> {/* This flex container with justify-between already helps */}
    <div className="flex items-center">
      <img
        src="/images/rabbitlogo.png"
        alt="Logo"
        className="h-8 w-auto"
      />
      <h1 className="ml-4 text-xl font-semibold text-gray-800">
        Dashboard
      </h1>
    </div>
    {/* The button is already pushed right because of justify-between above */}
    <button
      onClick={onSignOut}
      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
    >
      Sign Out
    </button>
  </div>
</div>
</nav>

    {/* Main Content */}
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

{/* Habits List */}
<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
  {habits.length === 0 ? (
    <p className="text-gray-500 text-center">No habits added yet</p>
  ) : (
    <ul className="space-y-4">
      {habits.map((habit: any) => (
        <li key={habit.id} className="border-b pb-4">
          <h3 className="font-medium">{habit.name}</h3>
          <p className="text-sm text-gray-500">
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
    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
  >
    Add New Habit
  </button>
</div>
</main>

{/* Add Habit Modal */}
{showAddModal && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
  <div className="bg-white rounded-lg p-6 w-full max-w-md">
    <h2 className="text-xl font-bold mb-4">Add New Habit</h2>
    <form onSubmit={handleAddHabit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Habit Name
          </label>
          <input
            type="text"
            value={newHabit.name}
            onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Frequency
          </label>
          <select
            value={newHabit.frequency}
            onChange={(e) => setNewHabit({...newHabit, frequency: e.target.value})}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Target Count
          </label>
          <input
            type="number"
            value={newHabit.targetCount}
            onChange={(e) => setNewHabit({...newHabit, targetCount: parseInt(e.target.value)})}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            min="1"
            required
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setShowAddModal(false)}
          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Add Habit
        </button>
      </div>
    </form>
  </div>
</div>
)}
</div>
)
}