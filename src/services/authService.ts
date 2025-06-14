import { supabase } from '../lib/supabase'
import type { UserProfile } from '../lib/supabase'

export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  grade: string
}

export interface SignInData {
  email: string
  password: string
}

export class AuthService {
  // Sign up new user
  static async signUp(data: SignUpData) {
    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
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
        throw new Error(authError.message)
      }

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            first_name: data.firstName,
            last_name: data.lastName,
            grade: data.grade,
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          throw new Error('Account created but profile setup failed. Please contact support.')
        }
      }

      return { user: authData.user, session: authData.session }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  // Sign in user
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
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        // Handle the specific "Auth session missing!" error gracefully
        if (error.message === 'Auth session missing!') {
          return null
        }
        throw error
      }
      return user
    } catch (error) {
      console.error('Get current user error:', error)
      throw error
    }
  }

  // Get user profile
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found
          return null
        }
        throw error
      }
      return data
    } catch (error) {
      console.error('Get user profile error:', error)
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

      if (error) throw error
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