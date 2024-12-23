'use client'

import { useEffect, useState } from 'react'
import { theme } from '@/styles/theme'
import { NewHabit } from '@/types/habit'

interface AddHabitModalProps {
show: boolean
onClose: () => void
onSubmit: (habit: NewHabit) => Promise<{ success: boolean; error?: string; id?: string }>
}

export function AddHabitModal({ show, onClose, onSubmit }: AddHabitModalProps) {
const [habit, setHabit] = useState<NewHabit>({
  name: '',
  frequency: 'daily',
  targetCount: 1
})

const [status, setStatus] = useState<{
  type: 'success' | 'error' | null
  message: string
}>({ type: null, message: '' })

const [isSubmitting, setIsSubmitting] = useState(false)

useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  document.addEventListener('keydown', handleEscape)
  return () => document.removeEventListener('keydown', handleEscape)
}, [onClose])

useEffect(() => {
  if (!show) {
    setStatus({ type: null, message: '' })
    setHabit({ name: '', frequency: 'daily', targetCount: 1 })
  }
}, [show])

const handleOverlayClick = (e: React.MouseEvent) => {
  if (e.target === e.currentTarget) {
    onClose()
  }
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (status.type === 'success' || isSubmitting) return

  setIsSubmitting(true)
  try {
    const result = await onSubmit(habit)
    if (result.success) {
      setStatus({ type: 'success', message: 'habit created successfully!' })
      setTimeout(() => {
        onClose()
      }, 1500)
    } else {
      throw new Error(result.error || 'Failed to create habit')
    }
  } catch (error) {
    console.error('Error creating habit:', error)
    setStatus({ 
      type: 'error', 
      message: error instanceof Error 
        ? error.message 
        : 'failed to create habit. please try again.' 
    })
  } finally {
    setIsSubmitting(false)
  }
}

if (!show) return null

return (
  <div className={theme.components.modal.overlay} onClick={handleOverlayClick}>
    <div className={theme.components.modal.container}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${theme.colors.text.primary}`}>
          new habit
        </h2>
        <button 
          onClick={onClose}
          className={theme.components.modal.closeButton}
        >
          ✕
        </button>
      </div>

      {status.type && (
        <div className={`mb-4 p-3 rounded-lg ${
          status.type === 'success' 
            ? 'bg-emerald-50 text-emerald-500 border border-emerald-200'
            : 'bg-red-50 text-red-500 border border-red-200'
        }`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={`block text-sm font-medium ${theme.colors.text.secondary} mb-2`}>
            habit name *
          </label>
          <input
            type="text"
            value={habit.name}
            onChange={(e) => setHabit({...habit, name: e.target.value})}
            className={theme.components.input}
            placeholder="e.g., morning run, read books"
            required
            minLength={3}
            maxLength={50}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme.colors.text.secondary} mb-2`}>
            frequency *
          </label>
          <select
            value={habit.frequency}
            onChange={(e) => setHabit({...habit, frequency: e.target.value as 'daily' | 'weekly'})}
            className={theme.components.input}
            required
          >
            <option value="daily">daily</option>
            <option value="weekly">weekly</option>
          </select>
          <p className={`mt-1 text-sm ${theme.colors.text.muted}`}>
            how often do you want to track this habit?
          </p>
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme.colors.text.secondary} mb-2`}>
            target count *
          </label>
          <input
            type="number"
            value={habit.targetCount}
            onChange={(e) => setHabit({...habit, targetCount: parseInt(e.target.value)})}
            className={theme.components.input}
            min="1"
            max="99"
            required
          />
          <p className={`mt-1 text-sm ${theme.colors.text.muted}`}>
            how many times per {habit.frequency === 'daily' ? 'day' : 'week'}?
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={onClose}
            className={theme.components.button.secondary}
          >
            cancel
          </button>
          <button
            type="submit"
            className={theme.components.button.primary}
            disabled={status.type === 'success' || isSubmitting}
          >
            {status.type === 'success' ? (
              <span className="flex items-center">
                <CheckIcon className="w-5 h-5 mr-2" />
                created!
              </span>
            ) : isSubmitting ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                creating...
              </span>
            ) : (
              'create habit'
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)
}

const CheckIcon = ({ className = "w-6 h-6" }) => (
<svg 
  className={className} 
  fill="none" 
  stroke="currentColor" 
  viewBox="0 0 24 24"
>
  <path 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth={2} 
    d="M5 13l4 4L19 7" 
  />
</svg>
)