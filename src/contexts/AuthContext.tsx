import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { AuthService } from '../services/authService'
import type { UserProfile } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signUp: (data: any) => Promise<void>
  signIn: (data: any) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
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

  useEffect(() => {
    let mounted = true

    // Get initial session with faster timeout
    const getInitialSession = async () => {
      try {
        // Set a shorter timeout for initial load
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 3000)
        )
        
        const sessionPromise = AuthService.getCurrentUser()
        
        const currentUser = await Promise.race([sessionPromise, timeoutPromise]) as User | null
        
        if (!mounted) return
        
        setUser(currentUser)
        
        if (currentUser) {
          // Load profile in background, don't block UI
          AuthService.getUserProfile(currentUser.id)
            .then(userProfile => {
              if (mounted) setProfile(userProfile)
            })
            .catch(error => {
              console.error('Error fetching user profile:', error)
              if (mounted) setProfile(null)
            })
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        // Don't block the UI for session errors
        if (mounted) {
          setUser(null)
          setProfile(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes with optimized handling
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Load profile asynchronously
          AuthService.getUserProfile(session.user.id)
            .then(userProfile => {
              if (mounted) setProfile(userProfile)
            })
            .catch(error => {
              console.error('Error fetching user profile:', error)
              if (mounted) setProfile(null)
            })
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
      await AuthService.signUp(data)
      // Don't set loading to false here - let auth state change handle it
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signIn = async (data: any) => {
    try {
      setLoading(true)
      await AuthService.signIn(data)
      // Don't set loading to false here - let auth state change handle it
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await AuthService.signOut()
      setUser(null)
      setProfile(null)
      setSession(null)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in')
    
    try {
      const updatedProfile = await AuthService.updateUserProfile(user.id, updates)
      setProfile(updatedProfile)
    } catch (error) {
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}