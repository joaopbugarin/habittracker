'use client'

import { useState } from 'react'
import { auth } from '@/lib/firebase'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useRouter } from 'next/navigation'  // Add this import

export default function AuthPage() {
  const router = useRouter()  // Add this line
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push('/dashboard')  // Now router is defined
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', { email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-purple-800 to-gray-900">
      <div className="bg-white w-full max-w-md mx-4 p-8 rounded-2xl shadow-2xl transform transition-all">
        <div className="text-center mb-8">
        <div className="mb-8 flex justify-center">
        <img
          src="/images/rabbitlogo.png"
          alt="Habit Tracker"
          className="h-48 w-auto hover:scale-105 transition-transform duration-300"
        />
        </div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-900">
              rabbittracker
            </span>
          </h1>
          <p className="mt-3 text-gray-500">
            {isLogin ? 'boost your aura' : 'Create your account'}
          </p>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full mb-4 py-4 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200 flex items-center justify-center"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-6 h-6 mr-2"
          />
          Continue with Google
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 text-sm border border-gray-300 rounded-lg outline-none focus:border-purple-500 transition duration-200"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 text-sm border border-gray-300 rounded-lg outline-none focus:border-purple-500 transition duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 text-white font-medium bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg hover:opacity-90 transition duration-200 shadow-lg"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  )
}