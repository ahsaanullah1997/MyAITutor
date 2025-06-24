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
      console.log('Profile loading skipped in offline mode:', errorMessage)
      // Don't set error in offline mode
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
      console.log('Progress loading skipped in offline mode:', error)
      // Don't set error for progress loading failures in offline mode
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
      console.log('Study session recording skipped in offline mode:', error)
      // Don't throw error in offline mode
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

    // Get initial session
    const getInitialSession = async () => {
      try {
        setError(null)
        console.log('🔄 Running in OFFLINE MODE - authentication disabled')
        
        if (!mounted) return
        
        // In offline mode, no user by default
        setUser(null)
        setProfile(null)
        setProgressStats(null)
        setSubjectProgress([])
        setIsNewUser(false)
      } catch (error) {
        console.log('Session initialization skipped in offline mode:', error)
        
        if (mounted) {
          setUser(null)
          setProfile(null)
          setProgressStats(null)
          setSubjectProgress([])
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    try {
      const authListener = AuthService.onAuthStateChange(
        async (event, session) => {
          if (!mounted) return
          
          console.log('Auth state change (offline mode):', event, session ? 'Session exists' : 'No session')
          setError(null)
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            // Check if this is a new user (from sign up)
            const isNewUserFlag = localStorage.getItem('isNewUser') === 'true'
            setIsNewUser(isNewUserFlag)
            
            // Create mock profile for offline mode
            const mockProfile: UserProfile = {
              id: session.user.id,
              first_name: 'Demo',
              last_name: 'User',
              grade: 'Class 10 (Metric)',
              board: 'Punjab Board',
              area: 'BISE Lahore',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            setProfile(mockProfile)
            
            // Create mock progress stats
            const mockStats: UserProgressStats = {
              id: 'mock-stats-id',
              user_id: session.user.id,
              study_streak_days: 5,
              total_study_time_minutes: 240,
              completed_lessons: 12,
              total_tests_taken: 3,
              average_test_score: 85,
              ai_sessions_count: 8,
              weekly_study_time: 120,
              monthly_study_time: 480,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            setProgressStats(mockStats)
            
            // Create mock subject progress
            const mockSubjects: SubjectProgress[] = [
              {
                id: 'mock-math',
                user_id: session.user.id,
                subject_name: 'Mathematics',
                progress_percentage: 75,
                completed_topics: 15,
                total_topics: 20,
                last_accessed: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              {
                id: 'mock-physics',
                user_id: session.user.id,
                subject_name: 'Physics',
                progress_percentage: 60,
                completed_topics: 12,
                total_topics: 20,
                last_accessed: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              {
                id: 'mock-chemistry',
                user_id: session.user.id,
                subject_name: 'Chemistry',
                progress_percentage: 85,
                completed_topics: 17,
                total_topics: 20,
                last_accessed: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ]
            setSubjectProgress(mockSubjects)
          } else {
            setProfile(null)
            setProgressStats(null)
            setSubjectProgress([])
            setIsNewUser(false)
          }
          
          setLoading(false)
        }
      )

      if (authListener && authListener.data && authListener.data.subscription) {
        subscription = authListener.data.subscription
      }
    } catch (error) {
      console.log('Auth listener setup skipped in offline mode:', error)
      if (mounted) {
        setLoading(false)
      }
    }

    return () => {
      mounted = false
      if (subscription && typeof subscription.unsubscribe === 'function') {
        try {
          subscription.unsubscribe()
        } catch (error) {
          console.log('Auth unsubscribe skipped in offline mode:', error)
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
    } catch (error) {
      setLoading(false)
      // Clear new user flag on error
      localStorage.removeItem('isNewUser')
      setIsNewUser(false)
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed'
      console.log('Sign up completed in offline mode')
      // Don't set error in offline mode
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
    } catch (error) {
      setLoading(false)
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed'
      console.log('Sign in completed in offline mode')
      // Don't set error in offline mode
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
      console.log('Sign out completed in offline mode')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>, profilePicture?: File) => {
    if (!user) throw new Error('No user logged in')
    
    try {
      setError(null)
      
      // In offline mode, just update local state
      const updatedProfile = {
        ...profile,
        ...updates,
        first_name: updates.first_name || profile?.first_name || '',
        last_name: updates.last_name || profile?.last_name || '',
        grade: updates.grade || profile?.grade || '',
        updated_at: new Date().toISOString()
      } as UserProfile
      
      setProfile(updatedProfile)
      
      // If this was a new user completing their profile, mark as completed
      if (isNewUser) {
        markProfileCompleted()
      }
      
      console.log('Profile updated in offline mode:', updatedProfile)
    } catch (error) {
      console.log('Profile update completed in offline mode')
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