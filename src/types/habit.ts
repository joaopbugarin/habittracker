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
    id?: string;
    userId: string;
    name: string;
    frequency: 'daily' | 'weekly';
    targetCount: number;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
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
    createdAt: Date;
    updatedAt: Date;
}

// Streak type
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