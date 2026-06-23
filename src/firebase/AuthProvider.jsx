import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { auth, isFirebaseConfigured } from './firebase'
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const DEMO_AUTH_KEY = 'attendflow_demo_user'

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // If not configured, attempt to restore demo user from localStorage
      try {
        const raw = localStorage.getItem(DEMO_AUTH_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          setUser(parsed)
        } else {
          setUser(null)
        }
      } catch (err) {
        setUser(null)
      }
      setLoading(false)
      return undefined
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const logout = useCallback(async () => {
    if (!isFirebaseConfigured) {
      try {
        localStorage.removeItem(DEMO_AUTH_KEY)
      } catch (e) {}
      setUser(null)
      return
    }
    await firebaseSignOut(auth)
    setUser(null)
  }, [])

  const signInWithEmail = useCallback(async (email, password) => {
    // Support demo credentials when Firebase isn't configured
    const DEMO_CREDENTIALS = { email: 'demo@attendflow.com', password: 'Demo1234' }
    if (!isFirebaseConfigured) {
      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        const demoUser = { uid: 'demo', email: DEMO_CREDENTIALS.email, displayName: 'Demo User', demo: true }
        try {
          localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(demoUser))
        } catch (e) {
          // ignore
        }
        setUser(demoUser)
        return demoUser
      }
      throw new Error('Firebase not configured — demo credentials required')
    }
    const cred = await signInWithEmailAndPassword(auth, email, password)
    setUser(cred.user)
    return cred.user
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured) throw new Error('Firebase not configured')
    const provider = new GoogleAuthProvider()
    const cred = await signInWithPopup(auth, provider)
    setUser(cred.user)
    return cred.user
  }, [])

  const value = {
    user,
    loading,
    logout,
    signInWithEmail,
    signInWithGoogle,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
