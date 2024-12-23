import { theme } from '@/styles/theme'
import { useEffect } from 'react'

type Frequency = 'daily' | 'weekly';

interface NewHabit {
name: string;
frequency: Frequency;
targetCount: number;
}

interface AddHabitModalProps {
show: boolean;
onClose: () => void;
onSubmit: (e: React.FormEvent) => Promise<void>;
habit: NewHabit;
setHabit: (habit: NewHabit) => void;
}


export function AddHabitModal({ show, onClose, onSubmit, habit, setHabit }: AddHabitModalProps) {
    if (!show) return null;
    // Add keyboard support
    useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
        onClose();
        }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
    };
    return (
    <div 
        className={theme.components.modal.overlay}
        onClick={handleOverlayClick}  // Add click handler here
    >
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
      
            <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className={`block text-sm font-medium ${theme.colors.text.secondary} mb-2`}>
            habit name
          </label>
          <input
            type="text"
            value={habit.name}
            onChange={(e) => setHabit({...habit, name: e.target.value})}
            className={theme.components.input}
            placeholder="Enter habit name"
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme.colors.text.secondary} mb-2`}>
            frequency
          </label>
          <select
            value={habit.frequency}
            onChange={(e) => setHabit({...habit, frequency: e.target.value as Frequency})}
            className={theme.components.input}
          >
            <option value="daily">daily</option>
            <option value="weekly">weekly</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme.colors.text.secondary} mb-2`}>
            target count
          </label>
          <input
            type="number"
            value={habit.targetCount}
            onChange={(e) => setHabit({...habit, targetCount: parseInt(e.target.value)})}
            className={theme.components.input}
            min="1"
            required
          />
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
          >
            create habbit
          </button>
        </div>
      </form>
    </div>
  </div>
)
}