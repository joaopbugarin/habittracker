import { auth } from './firebase'
import { signOut } from 'firebase/auth'

export const handleSignOut = async () => {
try {
  await signOut(auth)
  return { success: true }
} catch (error) {
  console.error('Error signing out:', error)
  return { success: false, error }
}
}