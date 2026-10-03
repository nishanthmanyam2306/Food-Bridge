import { createContext, useContext, useEffect, useState } from 'react'
import { auth, USE_MOCK_DATA } from '../firebase/config'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth'
import { mockUser } from '../services/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (USE_MOCK_DATA || !auth) {
      const stored = localStorage.getItem('fb_mock_user')
      if (stored) setUser(JSON.parse(stored))
      setLoading(false)
      return
    }
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsub
  }, [])

  // Mock-mode login: picks the seeded profile for the chosen role so every
  // dashboard is instantly explorable. Swap for real Firebase calls once
  // VITE_USE_MOCK_DATA=false and your Firebase keys are set.
  async function login(email, password, role) {
    if (USE_MOCK_DATA || !auth) {
      const profile = mockUser[role] || mockUser.donor
      const session = { ...profile, email }
      localStorage.setItem('fb_mock_user', JSON.stringify(session))
      localStorage.setItem('fb_token', 'mock-token')
      setUser(session)
      return session
    }
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const token = await cred.user.getIdToken()
    localStorage.setItem('fb_token', token)
    return cred.user
  }

  async function signup(email, password, role, name) {
    if (USE_MOCK_DATA || !auth) {
      const session = { id: `${role}_${Date.now()}`, name, email, role, location: mockUser[role]?.location }
      localStorage.setItem('fb_mock_user', JSON.stringify(session))
      localStorage.setItem('fb_token', 'mock-token')
      setUser(session)
      return session
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await sendEmailVerification(cred.user)
    return cred.user
  }

  async function logout() {
    localStorage.removeItem('fb_mock_user')
    localStorage.removeItem('fb_token')
    setUser(null)
    if (auth) await signOut(auth)
  }

  async function resetPassword(email) {
    if (USE_MOCK_DATA || !auth) return true
    return sendPasswordResetEmail(auth, email)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
