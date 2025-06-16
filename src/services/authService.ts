import { supabase } from '../lib/supabase'
import type { UserProfile } from '../lib/supabase'

export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  grade: string
  board?: string
  area?: string
}

export interface SignInData {
  email: string
  password: string
}

export class AuthService {
  // Sign up new user with optimized flow
  static async signUp(data: SignUpData) {
    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            grade: data.grade,
            board: data.board || '',
            area: data.area || '',
          }
        }
      })

      if (authError) {
        // Provide more user-friendly error messages
        if (authError.message.includes('already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.')
        }
        if (authError.message.includes('Password should be at least')) {
          throw new Error('Password must be at least 6 characters long.')
        }
        if (authError.message.includes('Invalid email')) {
          throw new Error('Please enter a valid email address.')
        }
        if (authError.message.includes('not configured')) {
          throw new Error('Authentication service is not configured. Please set up your Supabase credentials.')
        }
        if (authError.message.includes('Failed to fetch') || authError.message.includes('Connection timeout')) {
          throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.')
        }
        throw new Error(authError.message)
      }

      if (authData.user) {
        // Create user profile - this will be handled by database trigger if set up
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: authData.user.id,
              first_name: data.firstName,
              last_name: data.lastName,
              grade: data.grade,
              board: data.board || '',
              area: data.area || '',
            })

          if (profileError && !profileError.message.includes('duplicate key') && !profileError.message.includes('not configured')) {
            console.error('Profile creation error:', profileError)
            // Don't throw error for profile creation - user can update later
          }
        } catch (profileError) {
          console.error('Profile creation failed:', profileError)
          // Continue without throwing - profile can be created later
        }
      }

      return { user: authData.user, session: authData.session }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  // Optimized sign in with faster response
  static async signIn(data: SignInData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        // Provide more user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.')
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.')
        }
        if (error.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please wait a few minutes before trying again.')
        }
        if (error.message.includes('not configured')) {
          throw new Error('Authentication service is not configured. Please set up your Supabase credentials.')
        }
        if (error.message.includes('Failed to fetch') || error.message.includes('Connection timeout')) {
          throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.')
        }
        throw new Error(error.message)
      }

      return { user: authData.user, session: authData.session }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  // Sign out user
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error && !error.message.includes('not configured')) {
        throw error
      }
    } catch (error) {
      console.error('Sign out error:', error)
      if (error instanceof Error && !error.message.includes('not configured')) {
        throw error
      }
    }
  }

  // Get current user with timeout
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        // Handle the specific "Auth session missing!" error gracefully
        if (error.message === 'Auth session missing!' || error.message.includes('not configured')) {
          return null
        }
        if (error.message.includes('Failed to fetch') || error.message.includes('Connection timeout')) {
          console.warn('Unable to verify user session due to connection issues')
          return null
        }
        throw error
      }
      return user
    } catch (error) {
      console.error('Get current user error:', error)
      return null // Return null instead of throwing to prevent blocking
    }
  }

  // Get user profile with enhanced error handling
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('Attempting to fetch user profile for:', userId)
      
      // First check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError && !sessionError.message.includes('not configured')) {
        console.error('Session error:', sessionError)
        if (sessionError.message.includes('Failed to fetch') || sessionError.message.includes('Connection timeout')) {
          throw new Error('Unable to verify session due to connection issues. Please check your internet connection and try again.')
        }
        throw new Error('Authentication session error. Please sign in again.')
      }

      if (!session && !sessionError?.message.includes('not configured')) {
        console.error('No active session found')
        throw new Error('No active session. Please sign in.')
      }

      console.log('Making database request...')

      // Make the profile request with timeout and better error handling
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // Reduced to 5 second timeout

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .abortSignal(controller.signal)
          .single()

        clearTimeout(timeoutId)

        if (error) {
          console.log('Database query error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          })

          // Handle "no rows found" cases - this is expected when user profile doesn't exist yet
          if (error.code === 'PGRST116' || 
              error.message.includes('JSON object requested, multiple (or no) rows returned') ||
              error.message.includes('The result contains 0 rows')) {
            console.log('No profile found for user, returning null')
            return null
          }
          
          // Check for specific error types
          if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('Connection timeout')) {
            throw new Error('Unable to connect to the database. Please check your internet connection and Supabase project status.')
          }
          
          if (error.message.includes('relation "user_profiles" does not exist')) {
            throw new Error('Database table not found. Please run the database migration to create the user_profiles table.')
          }
          
          if (error.message.includes('JWT')) {
            throw new Error('Authentication token expired. Please sign in again.')
          }

          if (error.message.includes('not configured')) {
            console.log('Database not configured, returning null profile')
            return null
          }
          
          throw new Error(`Database error: ${error.message}`)
        }
        
        console.log('Profile fetched successfully')
        return data
      } catch (fetchError) {
        clearTimeout(timeoutId)
        
        if (fetchError instanceof Error) {
          if (fetchError.name === 'AbortError') {
            throw new Error('Database request timed out. Please check your internet connection and Supabase project status.')
          }
          
          if (fetchError.message.includes('not configured')) {
            return null
          }
          
          if (fetchError.message.includes('Failed to fetch')) {
            throw new Error('Unable to connect to the database. Please verify your Supabase project URL and internet connection.')
          }
        }
        
        // Check if this is a PGRST116 error (no rows found) in the fetchError
        if (fetchError && typeof fetchError === 'object' && 'code' in fetchError && fetchError.code === 'PGRST116') {
          console.log('No profile found for user (from fetchError), returning null')
          return null
        }
        
        // Also check if the error message indicates no rows found
        if (fetchError instanceof Error && 
            (fetchError.message.includes('JSON object requested, multiple (or no) rows returned') ||
             fetchError.message.includes('The result contains 0 rows'))) {
          console.log('No profile found for user (from error message), returning null')
          return null
        }
        
        throw fetchError
      }
    } catch (error) {
      console.error('Get user profile error:', error)
      
      // Check if we're offline
      if (!navigator.onLine) {
        throw new Error('You appear to be offline. Please check your internet connection and try again.')
      }
      
      // Handle configuration errors gracefully
      if (error instanceof Error && error.message.includes('not configured')) {
        return null
      }
      
      // Handle "no rows found" errors at the top level as well
      if (error instanceof Error && 
          (error.message.includes('JSON object requested, multiple (or no) rows returned') ||
           error.message.includes('The result contains 0 rows') ||
           (typeof error === 'object' && 'code' in error && error.code === 'PGRST116'))) {
        console.log('No profile found for user (top level catch), returning null')
        return null
      }
      
      // Re-throw the error with more context if it's a network error
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the database. Please verify your Supabase project is running and accessible.')
      }
      
      throw error
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        if (error.message.includes('not configured')) {
          throw new Error('Database not configured. Please set up your Supabase credentials.')
        }
        if (error.message.includes('Failed to fetch') || error.message.includes('Connection timeout')) {
          throw new Error('Unable to connect to the database. Please check your internet connection and try again.')
        }
        throw error
      }
      return data
    } catch (error) {
      console.error('Update user profile error:', error)
      throw error
    }
  }

  // Reset password
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        if (error.message.includes('Invalid email')) {
          throw new Error('Please enter a valid email address.')
        }
        if (error.message.includes('not configured')) {
          throw new Error('Password reset is not available. Please contact support.')
        }
        if (error.message.includes('Failed to fetch') || error.message.includes('Connection timeout')) {
          throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.')
        }
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}