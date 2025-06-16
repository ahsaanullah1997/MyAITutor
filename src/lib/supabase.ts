import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if we have placeholder values
const hasPlaceholderValues = 
  supabaseUrl.includes('your-project-id') || 
  supabaseAnonKey.includes('your-anon-key') ||
  !supabaseUrl || 
  !supabaseAnonKey

// Enhanced debugging for environment variables
console.log('Supabase Environment Check:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING',
  key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING',
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  hasPlaceholders: hasPlaceholderValues
})

// Create a mock client if environment variables are missing or contain placeholders
let supabase: any
let isUsingMockClient = false

if (hasPlaceholderValues) {
  console.warn('Supabase environment variables missing or contain placeholder values. Creating mock client for development.')
  isUsingMockClient = true
  
  // Create a mock Supabase client for development
  supabase = {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: (callback: any) => {
        // Call callback immediately with no session
        setTimeout(() => callback('SIGNED_OUT', null), 100)
        return { data: { subscription: { unsubscribe: () => {} } } }
      }
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { code: 'PGRST116', message: 'No rows found' } }),
          limit: () => ({
            abortSignal: () => Promise.resolve({ data: [], error: null })
          })
        }),
        limit: () => ({
          abortSignal: () => Promise.resolve({ data: [], error: null })
        })
      }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
          })
        })
      }),
      upsert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
        })
      })
    })
  }
} else {
  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch (error) {
    console.error(`Invalid Supabase URL format: ${supabaseUrl}. Using mock client.`)
    isUsingMockClient = true
    // Use mock client for invalid URL
    supabase = {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Invalid Supabase URL' } }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Invalid Supabase URL' } }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: (callback: any) => {
          setTimeout(() => callback('SIGNED_OUT', null), 100)
          return { data: { subscription: { unsubscribe: () => {} } } }
        }
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { code: 'PGRST116', message: 'No rows found' } })
          })
        }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Invalid Supabase URL' } }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: { message: 'Invalid Supabase URL' } })
            })
          })
        }),
        upsert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Invalid Supabase URL' } })
          })
        })
      })
    }
  }

  if (!isUsingMockClient) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      db: {
        schema: 'public',
      },
      realtime: {
        params: {
          eventsPerSecond: 2,
        },
      },
    })

    // Simple connection test without custom fetch wrapper
    const testConnection = async () => {
      try {
        console.log('Testing Supabase connection...')
        
        // Test basic connectivity first
        const { data, error } = await supabase
          .from('user_profiles')
          .select('count')
          .limit(1)
        
        if (error) {
          if (error.code === 'PGRST116') {
            console.log('Supabase connection successful - user_profiles table exists but is empty')
          } else if (error.code === '42P01' || error.message.includes('relation "user_profiles" does not exist')) {
            console.error('❌ DATABASE SETUP REQUIRED: The user_profiles table does not exist.')
            console.error('📋 To fix this issue:')
            console.error('1. Go to your Supabase project dashboard')
            console.error('2. Navigate to SQL Editor')
            console.error('3. Copy and paste the contents of supabase/migrations/20250614110210_small_river.sql')
            console.error('4. Click "Run" to execute the migration')
            console.error('5. Refresh this page after the migration completes')
            console.error('🔗 See SUPABASE_SETUP.md for detailed instructions')
          } else {
            console.warn('Supabase connection test failed:', error.message)
          }
        } else {
          console.log('Supabase connection test successful')
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('Failed to fetch')) {
            console.warn('Cannot connect to Supabase - please verify your project URL and internet connection')
          } else {
            console.warn('Supabase connection test error:', error.message)
          }
        }
      }
    }

    // Run connection test in development - but don't let it block the app
    if (import.meta.env.DEV) {
      testConnection().catch(() => {
        // Silently handle any connection test failures
        console.warn('Supabase connection test failed - app will continue with limited functionality')
      })
    }
  }
}

export { supabase, isUsingMockClient }

// Types for our database
export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  grade: string
  board?: string
  area?: string
  profile_picture_url?: string
  created_at: string
  updated_at: string
}

export interface UserProgressStats {
  id: string
  user_id: string
  study_streak_days: number
  total_study_time_minutes: number
  completed_lessons: number
  total_tests_taken: number
  average_test_score: number
  ai_sessions_count: number
  weekly_study_time: number
  monthly_study_time: number
  last_study_date?: string
  created_at: string
  updated_at: string
}

export interface SubjectProgress {
  id: string
  user_id: string
  subject_name: string
  progress_percentage: number
  completed_topics: number
  total_topics: number
  last_accessed: string
  created_at: string
  updated_at: string
}

export interface StudySession {
  id: string
  user_id: string
  session_type: 'lesson' | 'test' | 'ai_tutor' | 'materials'
  subject: string
  duration_minutes: number
  score?: number
  session_date: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
      }
      user_progress_stats: {
        Row: UserProgressStats
        Insert: Omit<UserProgressStats, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProgressStats, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
      subject_progress: {
        Row: SubjectProgress
        Insert: Omit<SubjectProgress, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SubjectProgress, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
      study_sessions: {
        Row: StudySession
        Insert: Omit<StudySession, 'id' | 'created_at'>
        Update: Partial<Omit<StudySession, 'id' | 'user_id' | 'created_at'>>
      }
    }
  }
}