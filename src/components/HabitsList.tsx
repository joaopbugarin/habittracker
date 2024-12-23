import { Habit } from '@/types/habit'
import { theme } from '@/styles/theme'
import { checkHabitCompletion } from '@/lib/habitsHelpers'

interface HabitsListProps {
    habits: Habit[]
    onComplete: (habitId: string) => void
    onDelete: (habitId: string) => void
}

export function HabitsList({ habits, onComplete, onDelete }: HabitsListProps) {
  const getFrequencyText = (habit: Habit) => {
  switch (habit.frequency) {
    case 'daily':
      return 'every day'
    case 'weekly':
      return `${habit.targetCount} ${habit.targetCount === 1 ? 'time' : 'times'} per week`
    default:
      return `${habit.targetCount} ${habit.targetCount === 1 ? 'time' : 'times'} per ${habit.frequency}`
  }
}

const sortedHabits = [...habits].sort((a, b) => {
  const aCompleted = checkHabitCompletion(a)
  const bCompleted = checkHabitCompletion(b)
  
  if (aCompleted && !bCompleted) return -1
  if (!aCompleted && bCompleted) return 1
  
  // If completion status is the same, sort alphabetically
  return a.name.localeCompare(b.name)
})

return (
  <ul className="divide-y divide-gray-200 -mx-8"> {/* Negative margin to extend to edges */}
    {sortedHabits.map((habit) => {
      const isCompleted = checkHabitCompletion(habit)
      
      return (
        <li 
        key={habit.id}
        className={`
          px-8 py-4
          flex justify-between items-center
          transition-all duration-300 w-full
          ${isCompleted ? 'bg-gray-50' : 'hover:bg-gray-50'}
        `}
        >
        <div className="flex-grow min-w-0">
          <h3 className={`
            font-medium text-lg truncate
            ${theme.colors.text.primary}
            ${isCompleted ? 'line-through opacity-50' : ''}
          `}>
            {habit.name.toLowerCase()}
          </h3>
          <p className={`
            text-sm mt-1
            ${theme.colors.text.muted}
            ${isCompleted ? 'line-through opacity-50' : ''}
          `}>
            {habit.frequency === 'daily' 
              ? 'every day' 
              : `${habit.targetCount} times per week`}
          </p>
        </div>

          <div className="flex items-center space-x-2 ml-4 flex-shrink-0"> {/* Added flex-shrink-0 */}
            <button
              onClick={() => onComplete(habit.id)}
              className={`
                p-2 rounded-full transition-colors duration-200
                ${isCompleted 
                  ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
              aria-label={isCompleted ? 'mark as incomplete' : 'mark as complete'}
            >
              {isCompleted ? <CheckIcon /> : <CircleIcon />}
            </button>

            <button
              onClick={() => onDelete(habit.id)}
              className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
              aria-label="delete habit"
            >
              <TrashIcon />
            </button>
          </div>
        </li>
      )
    })}
  </ul>
)
}

const CheckIcon = ({ className = "w-5 h-5" }) => (
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

const CircleIcon = ({ className = "w-5 h-5" }) => (
<svg 
  className={className} 
  fill="none" 
  stroke="currentColor" 
  viewBox="0 0 24 24"
>
  <circle cx="12" cy="12" r="10" strokeWidth={2} />
</svg>
)

const TrashIcon = ({ className = "w-5 h-5" }) => (
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
    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
  />
</svg>
)