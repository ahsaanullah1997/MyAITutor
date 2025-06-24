import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { AuthService } from '../services/authService'
import { ProgressService } from '../services/progressService'
import { DatabaseService } from '../services/databaseService'
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
      
      // Handle expected scenarios (no profile found) differently from actual errors
      if (errorMessage.includes('No rows found') || 
          errorMessage.includes('PGRST116') || 
          errorMessage.includes('not configured')) {
        console.log('No user profile found for user:', userId, '- this is expected for new users')
      } else {
        console.error('Error fetching user profile:', error)
      }
      
      // Only set error for critical issues, not missing profiles or connection issues
      if (!errorMessage.includes('No rows found') && 
          !errorMessage.includes('PGRST116') && 
          !errorMessage.includes('not configured')) {
        
        // For connection issues, provide a more user-friendly message
        if (errorMessage.includes('Unable to connect') || 
            errorMessage.includes('Connection timeout') ||
            errorMessage.includes('Failed to fetch')) {
          setError('Unable to load profile data. Please check your internet connection and try refreshing the page.')
        } else if (errorMessage.includes('Database table not found')) {
          setError('Database setup incomplete. Please contact support or check the setup instructions.')
        } else {
          setError(errorMessage)
        }
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
      // Don't set error for progress loading failures - it's not critical
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
      await loadUserProfile(user.id)
      await loadUserProgress(user.id)
    }
  }

  const markProfileCompleted = () => {
    setIsNewUser(false)
    // Clear the flag from localStorage
    localStorage.removeItem('isNewUser')
  }

  // Helper function to handle post-authentication redirect
  const handlePostAuthRedirect = (user: User, profile: UserProfile | null) => {
    // Check if user needs to complete profile
    if (!profile || !profile.first_name || !profile.last_name || !profile.grade) {
      console.log('User needs to complete profile, redirecting to complete-profile')
      window.location.href = '/complete-profile'
    } else {
      console.log('User profile is complete, redirecting to dashboard')
      window.location.href = '/dashboard'
    }
  }

  useEffect(() => {
    let mounted = true
    let subscription: any = null

    // Get initial session with better error handling
    const getInitialSession = async () => {
      try {
        setError(null)
        console.log('Getting initial session...')
        
        // Reduced timeout for faster failure detection
        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
          controller.abort()
        }, 5000) // Reduced to 5 seconds timeout
        
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
          
          // Only set error for critical issues
          const errorMessage = error instanceof Error ? error.message : 'Session initialization failed'
          if (!errorMessage.includes('not configured') && 
              !errorMessage.includes('timeout') &&
              !errorMessage.includes('Failed to fetch')) {
            setError('Authentication service temporarily unavailable. Please try refreshing the page.')
          }
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes with optimized handling and proper error handling
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
            try {
              const userProfile = await AuthService.getUserProfile(session.user.id)
              setProfile(userProfile)
              
              // Handle redirect after successful sign in (but not for initial page load)
              if (event === 'SIGNED_IN' && window.location.pathname === '/login') {
                handlePostAuthRedirect(session.user, userProfile)
              }
            } catch (error) {
              console.error('Error loading profile after auth change:', error)
              setProfile(null)
              
              // If this was a sign in event and we're on login page, still redirect
              if (event === 'SIGNED_IN' && window.location.pathname === '/login') {
                handlePostAuthRedirect(session.user, null)
              }
            }
            
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
      // Set a user-friendly error message
      if (mounted) {
        setError('Authentication service not available. Please check your connection and try refreshing the page.')
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
      setError(errorMessage)
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
      // Don't redirect here - let the auth state change handler handle the redirect
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
        
        // Create personalized database for the user
        try {
          await DatabaseService.createUserDatabase(user.id, updatedProfile)
          console.log('User database created successfully')
        } catch (dbError) {
          console.error('Error creating user database:', dbError)
          // Don't throw error - profile update was successful
        }
        
        // Initialize progress tracking for new user
        await ProgressService.initializeUserProgress(user.id)
        await ProgressService.initializeSubjects(user.id)
        await loadUserProgress(user.id)
      } else {
        // For existing users, update their database if grade/board changed
        if (updates.grade || updates.board) {
          try {
            await DatabaseService.updateUserDatabase(user.id, updatedProfile)
            console.log('User database updated successfully')
            // Refresh progress to reflect new subjects
            await loadUserProgress(user.id)
          } catch (dbError) {
            console.error('Error updating user database:', dbError)
            // Don't throw error - profile update was successful
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed'
      setError(errorMessage)
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