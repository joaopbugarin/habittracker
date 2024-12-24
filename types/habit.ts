// User type
export interface User {
    uid: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

// Habit type
export interface Habit {
    id: string;
    userId: string;
    name: string;
    frequency: Frequency;
    targetCount: number;
    completions: { [date: string]: number };
    lastCompleted: {
      date: string;
      count: number;
      periodStart: string;
      periodEnd: string;
    } | null;
    createdAt: any; // Firebase Timestamp
    updatedAt: any; // Firebase Timestamp
    isActive: boolean;
}

// New Habit type (for creation)
export type Frequency = 'daily' | 'weekly';

export interface NewHabit {
name: string;
frequency: Frequency;
targetCount: number; // How many times per frequency
}

// Habit Log type
export interface HabitLog {
    id?: string;
    habitId: string;
    logDate: Date;
    notes?: string;
    loggedAt: Date;
}

// Reminder type
export interface Reminder {
    id?: string;
    habitId: string;
    reminderTime: string;
    reminderDays: string[];
    isActive: boolean;
    createdAt: any; // Firebase Timestamp
    updatedAt: any; // Firebase Timestamp
}

// Streak type (can be used for historical tracking if needed)
export interface Streak {
    id?: string;
    habitId: string;
    currentStreak: number;
    longestStreak: number;
    lastLoggedDate: Date;
}

// Statistics type
export interface Statistics {
    id?: string;
    habitId: string;
    totalCompletions: number;
    averagePerWeek: number;
    lastUpdated: Date;
}