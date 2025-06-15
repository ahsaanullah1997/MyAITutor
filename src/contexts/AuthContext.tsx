import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { AuthService } from '../services/authService'
import type { UserProfile } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  error: string | null
  signUp: (data: any) => Promise<void>
  signIn: (data: any) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  retryProfileLoad: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUserProfile = async (userId: string) => {
    try {
      setError(null)
      console.log('Loading profile for user:', userId)
      const userProfile = await AuthService.getUserProfile(userId)
      setProfile(userProfile)
      console.log('Profile loaded successfully:', userProfile)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load user profile'
      
      // Only set error for critical issues, not missing profiles
      if (!errorMessage.includes('No rows found') && !errorMessage.includes('PGRST116')) {
        setError(errorMessage)
      }
      setProfile(null)
    }
  }

  const retryProfileLoad = async () => {
    if (user) {
      await loadUserProfile(user.id)
    }
  }

  useEffect(() => {
    let mounted = true

    // Get initial session with better error handling
    const getInitialSession = async () => {
      try {
        setError(null)
        console.log('Getting initial session...')
        
        // Reduced timeout for faster failure detection
        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
          controller.abort()
        }, 8000) // 8 seconds timeout
        
        try {
          const currentUser = await AuthService.getCurrentUser()
          clearTimeout(timeoutId)
          
          if (!mounted) return
          
          console.log('Initial session result:', currentUser ? 'User found' : 'No user')
          setUser(currentUser)
          
          if (currentUser) {
            // Load profile in background, don't block UI
            loadUserProfile(currentUser.id).catch(console.error)
          }
        } catch (authError) {
          clearTimeout(timeoutId)
          
          if (authError instanceof Error && authError.name === 'AbortError') {
            console.warn('Session check timeout - continuing without authentication')
            // Don't throw error, just continue without auth
          } else {
            throw authError
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        
        if (mounted) {
          setUser(null)
          setProfile(null)
          
          // Only set error for critical issues
          const errorMessage = error instanceof Error ? error.message : 'Session initialization failed'
          if (!errorMessage.includes('not configured') && !errorMessage.includes('timeout')) {
            setError('Authentication service temporarily unavailable')
          }
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes with optimized handling
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        console.log('Auth state change:', event, session ? 'Session exists' : 'No session')
        setError(null) // Clear errors on auth state change
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Load profile asynchronously
          loadUserProfile(session.user.id).catch(console.error)
        } else {
          setProfile(null)
        }
        
        // Set loading to false immediately for auth state changes
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      await AuthService.signUp(data)
      // Don't set loading to false here - let auth state change handle it
    } catch (error) {
      setLoading(false)
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed'
      setError(errorMessage)
      throw error
    }
  }

  const signIn = async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      await AuthService.signIn(data)
      // Don't set loading to false here - let auth state change handle it
    } catch (error) {
      setLoading(false)
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed'
      setError(errorMessage)
      throw error
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      await AuthService.signOut()
      setUser(null)
      setProfile(null)
      setSession(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in')
    
    try {
      setError(null)
      const updatedProfile = await AuthService.updateUserProfile(user.id, updates)
      setProfile(updatedProfile)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed'
      setError(errorMessage)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    retryProfileLoad,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}