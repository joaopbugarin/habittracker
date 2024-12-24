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
    <div className={`${theme.components.modal.container} max-w-md w-full`}>
      {/* Cute Image Section - Using regular img tag */}
      <div className="flex justify-center mb-6">
        <img
          src="/images/happy-rabbit.png"
          alt="Happy Rabbit"
          className="w-24 h-30 object-contain transform transition-all duration-300 hover:scale-110"
        />
      </div>

      {/* Title Section */}
      <div className="text-center mb-6">
        <h2 className={`text-2xl font-bold ${theme.colors.text.primary}`}>
          new habit hop!
        </h2>
        <p className={`mt-2 text-sm ${theme.colors.text.muted}`}>
          let's create a new healthy habit together!
        </p>
      </div>


      {/* Status Message */}
      {status.type && (
        <div className={`mb-4 p-4 rounded-lg text-center transition-all duration-300 ${
          status.type === 'success' 
            ? 'bg-emerald-50 text-emerald-500 border border-emerald-200'
            : 'bg-red-50 text-red-500 border border-red-200'
        }`}>
          <p className="font-medium">{status.message}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="group">
          <label className={`block text-sm font-medium ${theme.colors.text.secondary} mb-2`}>
            what's your new habit? 🌱
          </label>
          <input
            type="text"
            value={habit.name}
            onChange={(e) => setHabit({...habit, name: e.target.value})}
            className={`${theme.components.input} transition-all duration-200 group-hover:shadow-md`}
            placeholder="e.g., morning hop, carrot munching"
            required
            minLength={3}
            maxLength={50}
          />
        </div>

        <div className="group">
          <label className={`block text-sm font-medium ${theme.colors.text.secondary} mb-2`}>
            how often? ⏰
          </label>
          <select
            value={habit.frequency}
            onChange={(e) => setHabit({...habit, frequency: e.target.value as 'daily' | 'weekly'})}
            className={`${theme.components.input} transition-all duration-200 group-hover:shadow-md`}
            required
          >
            <option value="daily">daily burrow check</option>
            <option value="weekly">weekly warren visit</option>
          </select>
          <p className={`mt-1 text-sm ${theme.colors.text.muted}`}>
            pick your perfect rhythm! 🎵
          </p>
        </div>

        <div className="group">
          <label className={`block text-sm font-medium ${theme.colors.text.secondary} mb-2`}>
            how many times? 🔢
          </label>
          <input
            type="number"
            value={habit.targetCount}
            onChange={(e) => setHabit({...habit, targetCount: parseInt(e.target.value)})}
            className={`${theme.components.input} transition-all duration-200 group-hover:shadow-md`}
            min="1"
            max="99"
            required
          />
          <p className={`mt-1 text-sm ${theme.colors.text.muted}`}>
            target hops per {habit.frequency === 'daily' ? 'day' : 'week'}
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={onClose}
            className={`${theme.components.button.secondary} transform transition-all duration-200 hover:scale-105`}
          >
            hop away 🐾
          </button>
          <button
            type="submit"
            className={`${theme.components.button.primary} transform transition-all duration-200 hover:scale-105`}
            disabled={status.type === 'success' || isSubmitting}
          >
            {status.type === 'success' ? (
              <span className="flex items-center">
                <CheckIcon className="w-5 h-5 mr-2" />
                hopping success! 🎉
              </span>
            ) : isSubmitting ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                creating burrow...
              </span>
            ) : (
              'create habit 🌟'
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