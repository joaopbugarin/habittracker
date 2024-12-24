'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { User } from 'firebase/auth'

interface AuthContextType {
user: User | null;
loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
const [user, setUser] = useState<User | null>(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  console.log('Setting up auth listener');
  
  const unsubscribe = auth.onAuthStateChanged((user) => {
    console.log('Auth state changed:', user?.email);
    setUser(user)
    setLoading(false)
  }, (error) => {
    console.error('Auth error:', error);
    setLoading(false)
  });

  // Cleanup subscription
  return () => {
    console.log('Cleaning up auth listener');
    unsubscribe()
  }
}, [])

const value = {
  user,
  loading
}

return (
  <AuthContext.Provider value={value}>
    {loading ? (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    ) : (
      children
    )}
  </AuthContext.Provider>
)
}

export const useAuth = () => {
const context = useContext(AuthContext)
if (context === undefined) {
  throw new Error('useAuth must be used within an AuthProvider')
}
return context
}