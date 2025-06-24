import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { AuthService } from '../services/authService'
import { ProgressService } from '../services/progressService'
import type { UserProfile, UserProgressStats, SubjectProgress } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  progressStats: UserProgressStats | null
  subjectProgress: SubjectProgress[]
  session: Session | null
  loading: boolean
  error: string | null
  isNewUser: boolean
  signUp: (data: any) => Promise<void>
  signIn: (data: any) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>, profilePicture?: File) => Promise<void>
  retryProfileLoad: () => Promise<void>
  markProfileCompleted: () => void
  recordStudySession: (sessionType: 'lesson' | 'test' | 'ai_tutor' | 'materials', subject: string, durationMinutes: number, score?: number) => Promise<void>
  refreshProgress: () => Promise<void>
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
  const [progressStats, setProgressStats] = useState<UserProgressStats | null>(null)
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([])
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isNewUser, setIsNewUser] = useState(false)

  const loadUserProfile = async (userId: string) => {
    try {
      setError(null)
      console.log('Loading profile for user:', userId)
      const userProfile = await AuthService.getUserProfile(userId)
      setProfile(userProfile)
      console.log('Profile loaded successfully:', userProfile)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load user profile'
      console.error('Error fetching user profile:', errorMessage)
      
      // Handle different types of errors more specifically
      if (errorMessage.includes('SUPABASE_CONNECTION_FAILED') || 
          errorMessage.includes('Cannot connect to Supabase database')) {
        setError('🚨 Database Connection Failed\n\nPlease check:\n• Your .env file has correct Supabase credentials\n• Go to https://supabase.com → Settings → API to verify\n• Restart development server after updating .env\n• Ensure Auth Site URL includes http://localhost:5173')
      } else if (errorMessage.includes('No rows found') || 
                 errorMessage.includes('PGRST116')) {
        console.log('No user profile found - this is expected for new users')
        // Don't set error for missing profiles
      } else if (errorMessage.includes('JWT') || errorMessage.includes('Invalid API key')) {
        setError('🚨 Invalid API Key\n\nPlease check your VITE_SUPABASE_ANON_KEY in the .env file.\nGet the correct key from: https://supabase.com → Settings → API')
      } else if (errorMessage.includes('Failed to fetch') || 
                 errorMessage.includes('NetworkError') ||
                 errorMessage.includes('Connection timeout')) {
        setError('🚨 Network Connection Failed\n\nPlease check:\n• Your internet connection\n• VITE_SUPABASE_URL is correct in .env file\n• Supabase project is accessible')
      } else if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
        setError('🚨 Database Tables Missing\n\nPlease run the database migrations from the supabase/migrations/ folder in your Supabase SQL Editor.')
      } else {
        // For other errors, provide a more user-friendly message
        setError(`Unable to load profile: ${errorMessage}\n\nPlease check your Supabase configuration and try refreshing the page.`)
      }
      
      setProfile(null)
    }
  }

  const loadUserProgress = async (userId: string) => {
    try {
      console.log('Loading progress for user:', userId)
      
      // Load progress stats
      const stats = await ProgressService.getUserProgress(userId)
      setProgressStats(stats)
      
      // Load subject progress
      const subjects = await ProgressService.getSubjectProgress(userId)
      setSubjectProgress(subjects)
      
      console.log('Progress loaded successfully')
    } catch (error) {
      console.error('Error loading user progress:', error)
      // Don't set error for progress loading failures - it's not critical for basic functionality
    }
  }

  const refreshProgress = async () => {
    if (user) {
      await loadUserProgress(user.id)
    }
  }

  const recordStudySession = async (
    sessionType: 'lesson' | 'test' | 'ai_tutor' | 'materials',
    subject: string,
    durationMinutes: number,
    score?: number
  ) => {
    if (!user) throw new Error('No user logged in')
    
    try {
      await ProgressService.recordStudySession(user.id, sessionType, subject, durationMinutes, score)
      // Refresh progress after recording session
      await refreshProgress()
    } catch (error) {
      console.error('Error recording study session:', error)
      throw error
    }
  }

  const retryProfileLoad = async () => {
    if (user) {
      setError(null) // Clear any existing errors
      await loadUserProfile(user.id)
      await loadUserProgress(user.id)
    }
  }

  const markProfileCompleted = () => {
    setIsNewUser(false)
    // Clear the flag from localStorage
    localStorage.removeItem('isNewUser')
  }

  useEffect(() => {
    let mounted = true
    let subscription: any = null

    // Get initial session with improved error handling
    const getInitialSession = async () => {
      try {
        setError(null)
        console.log('Getting initial session...')
        
        // Reduced timeout for faster failure detection
        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
          controller.abort()
        }, 8000) // Increased timeout slightly for better reliability
        
        try {
          const currentUser = await AuthService.getCurrentUser()
          clearTimeout(timeoutId)
          
          if (!mounted) return
          
          console.log('Initial session result:', currentUser ? 'User found' : 'No user')
          setUser(currentUser)
          
          if (currentUser) {
            // Check if this is a new user
            const isNewUserFlag = localStorage.getItem('isNewUser') === 'true'
            setIsNewUser(isNewUserFlag)
            
            // Load profile and progress in background, don't block UI
            loadUserProfile(currentUser.id).catch(console.error)
            loadUserProgress(currentUser.id).catch(console.error)
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
          setProgressStats(null)
          setSubjectProgress([])
          
          // Provide more specific error messages
          const errorMessage = error instanceof Error ? error.message : 'Session initialization failed'
          if (errorMessage.includes('SUPABASE_CONNECTION_FAILED')) {
            setError('🚨 Supabase Connection Failed\n\nPlease verify your environment variables and restart the development server.')
          } else if (!errorMessage.includes('not configured') && 
                     !errorMessage.includes('timeout') &&
                     !errorMessage.includes('Failed to fetch')) {
            setError('Authentication service temporarily unavailable. Please check your Supabase configuration and try refreshing the page.')
          }
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes with improved error handling
    try {
      const authListener = AuthService.onAuthStateChange(
        async (event, session) => {
          if (!mounted) return
          
          console.log('Auth state change:', event, session ? 'Session exists' : 'No session')
          setError(null) // Clear errors on auth state change
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            // Check if this is a new user (from sign up)
            const isNewUserFlag = localStorage.getItem('isNewUser') === 'true'
            setIsNewUser(isNewUserFlag)
            
            // Load profile and progress asynchronously
            loadUserProfile(session.user.id).catch(console.error)
            loadUserProgress(session.user.id).catch(console.error)
          } else {
            setProfile(null)
            setProgressStats(null)
            setSubjectProgress([])
            setIsNewUser(false)
          }
          
          // Set loading to false immediately for auth state changes
          setLoading(false)
        }
      )

      // Safely extract subscription with null checks
      if (authListener && authListener.data && authListener.data.subscription) {
        subscription = authListener.data.subscription
      } else {
        console.warn('Auth listener did not return expected subscription object')
      }
    } catch (error) {
      console.error('Error setting up auth state listener:', error)
      // Set a more specific error message
      if (mounted) {
        const errorMessage = error instanceof Error ? error.message : 'Auth setup failed'
        if (errorMessage.includes('SUPABASE_CONNECTION_FAILED')) {
          setError('🚨 Supabase Connection Failed\n\nPlease check your .env file and restart the development server.')
        } else {
          setError('Authentication service not available. Please check your Supabase configuration and try refreshing the page.')
        }
        setLoading(false)
      }
    }

    return () => {
      mounted = false
      // Safely unsubscribe only if subscription exists and has unsubscribe method
      if (subscription && typeof subscription.unsubscribe === 'function') {
        try {
          subscription.unsubscribe()
        } catch (error) {
          console.error('Error unsubscribing from auth changes:', error)
        }
      }
    }
  }, [])

  const signUp = async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      
      // Mark as new user before sign up
      localStorage.setItem('isNewUser', 'true')
      setIsNewUser(true)
      
      await AuthService.signUp(data)
      // Don't set loading to false here - let auth state change handle it
    } catch (error) {
      setLoading(false)
      // Clear new user flag on error
      localStorage.removeItem('isNewUser')
      setIsNewUser(false)
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed'
      
      // Provide more specific error messages for sign up
      if (errorMessage.includes('SUPABASE_CONNECTION_FAILED')) {
        setError('🚨 Cannot sign up - Supabase connection failed\n\nPlease check your .env file and restart the development server.')
      } else {
        setError(errorMessage)
      }
      throw error
    }
  }

  const signIn = async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      
      // Clear any existing new user flag for sign in
      localStorage.removeItem('isNewUser')
      setIsNewUser(false)
      
      await AuthService.signIn(data)
      // Don't set loading to false here - let auth state change handle it
    } catch (error) {
      setLoading(false)
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed'
      
      // Provide more specific error messages for sign in
      if (errorMessage.includes('SUPABASE_CONNECTION_FAILED')) {
        setError('🚨 Cannot sign in - Supabase connection failed\n\nPlease check your .env file and restart the development server.')
      } else {
        setError(errorMessage)
      }
      throw error
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Clear new user flag on sign out
      localStorage.removeItem('isNewUser')
      setIsNewUser(false)
      
      await AuthService.signOut()
      setUser(null)
      setProfile(null)
      setProgressStats(null)
      setSubjectProgress([])
      setSession(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>, profilePicture?: File) => {
    if (!user) throw new Error('No user logged in')
    
    try {
      setError(null)
      
      // Merge updates with existing profile data to preserve required fields
      const profileData = {
        ...profile,
        ...updates,
        // Ensure required fields are always present
        first_name: updates.first_name || profile?.first_name || '',
        last_name: updates.last_name || profile?.last_name || '',
        grade: updates.grade || profile?.grade || ''
      }
      
      const updatedProfile = await AuthService.updateUserProfile(user.id, profileData, profilePicture)
      setProfile(updatedProfile)
      
      // If this was a new user completing their profile, mark as completed and initialize progress
      if (isNewUser) {
        markProfileCompleted()
        // Initialize progress tracking for new user
        await ProgressService.initializeUserProgress(user.id)
        await ProgressService.initializeSubjects(user.id)
        await loadUserProgress(user.id)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed'
      
      // Provide more specific error messages for profile updates
      if (errorMessage.includes('SUPABASE_CONNECTION_FAILED')) {
        setError('🚨 Cannot update profile - Supabase connection failed\n\nPlease check your .env file and restart the development server.')
      } else {
        setError(errorMessage)
      }
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    progressStats,
    subjectProgress,
    session,
    loading,
    error,
    isNewUser,
    signUp,
    signIn,
    signOut,
    updateProfile,
    retryProfileLoad,
    markProfileCompleted,
    recordStudySession,
    refreshProgress,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}