import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if we have placeholder values
const hasPlaceholderValues = 
  supabaseUrl.includes('your-project') || 
  supabaseAnonKey.includes('your-anon-key') ||
  !supabaseUrl || 
  !supabaseAnonKey ||
  supabaseUrl === 'your-project-url-here' ||
  supabaseAnonKey === 'your-anon-key-here'

// Enhanced debugging for environment variables
console.log('Supabase Environment Check:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
  key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING',
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  hasPlaceholders: hasPlaceholderValues
})

// Create a mock client if environment variables are missing or contain placeholders
let supabase: any
let isUsingMockClient = false

// Create mock client function with enhanced error messages
const createMockClient = (reason: string) => {
  console.warn(`🔄 Using mock Supabase client: ${reason}`)
  console.warn('📋 To fix this:')
  console.warn('   1. Check if your Supabase project is active at https://supabase.com')
  console.warn('   2. Verify your project URL and anon key in Settings > API')
  console.warn('   3. Update your .env file if credentials have changed')
  console.warn('   4. Restart your development server')
  
  isUsingMockClient = true
  
  const mockError = { 
    message: '⚠️ Supabase connection failed. Please check your project status and credentials.',
    code: 'SUPABASE_CONNECTION_ERROR'
  }
  
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: () => Promise.resolve({ 
        data: { user: null, session: null }, 
        error: mockError
      }),
      signInWithPassword: () => Promise.resolve({ 
        data: { user: null, session: null }, 
        error: mockError
      }),
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
          single: () => Promise.resolve({ 
            data: null, 
            error: { 
              code: 'SUPABASE_NOT_CONFIGURED', 
              message: 'Unable to connect to the database. Please check your Supabase project status.' 
            } 
          }),
          limit: () => Promise.resolve({ data: [], error: null }),
          maybeSingle: () => Promise.resolve({ 
            data: null, 
            error: { 
              code: 'SUPABASE_NOT_CONFIGURED', 
              message: 'Unable to connect to the database. Please check your Supabase project status.' 
            } 
          }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null })
          })
        }),
        limit: () => Promise.resolve({ data: [], error: null }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null })
        })
      }),
      insert: () => Promise.resolve({ 
        data: null, 
        error: mockError
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ 
              data: null, 
              error: mockError
            })
          })
        })
      }),
      upsert: () => ({
        select: () => ({
          single: () => Promise.resolve({ 
            data: null, 
            error: mockError
          })
        })
      })
    })
  }
}

// Create standard Supabase client with basic configuration
const createStandardClient = (url: string, key: string) => {
  return createClient(url, key, {
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
    }
  })
}

if (hasPlaceholderValues) {
  supabase = createMockClient('Environment variables missing or contain placeholder values')
} else {
  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch (error) {
    console.error(`❌ Invalid Supabase URL format: ${supabaseUrl}`)
    supabase = createMockClient('Invalid Supabase URL format')
  }

  if (!isUsingMockClient) {
    try {
      supabase = createStandardClient(supabaseUrl, supabaseAnonKey)

      // Simple connection test
      const testConnection = async () => {
        try {
          console.log('🔍 Testing Supabase connection...')
          
          // Test basic connectivity with a simple query to user_profiles table
          const { data, error } = await supabase
            .from('user_profiles')
            .select('count')
            .limit(1)
          
          if (error) {
            if (error.code === 'PGRST116') {
              console.log('✅ Supabase connection successful - database is ready')
              return true
            } else if (error.code === '42P01' || error.message.includes('relation "user_profiles" does not exist')) {
              console.warn('⚠️ DATABASE SETUP REQUIRED: The user_profiles table does not exist.')
              console.warn('📋 Please run the database migration from supabase/migrations/')
              return true // Connection works, just needs setup
            } else if (error.code === 'PGRST002' || error.message.includes('Could not query the database')) {
              console.error('❌ Database connection failed - Supabase project may be inactive')
              throw new Error('Supabase project inactive or deleted')
            } else {
              console.warn('⚠️ Unexpected database error:', error)
              throw error
            }
          } else {
            console.log('✅ Supabase connection test successful')
            return true
          }
        } catch (error) {
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              console.error('❌ Supabase connection timeout - project may be slow or inactive')
              return false
            } else if (error.message.includes('Failed to fetch') || 
                       error.message.includes('upstream connect error') ||
                       error.message.includes('503') ||
                       error.message.includes('NetworkError') ||
                       error.message.includes('fetch')) {
              console.error('❌ Cannot connect to Supabase project')
              console.error('🔧 This usually means:')
              console.error('   • Your Supabase project is paused or inactive')
              console.error('   • The project URL is incorrect')
              console.error('   • Network connectivity issues')
              console.error('📋 To fix this:')
              console.error('   1. Go to https://supabase.com and check your project status')
              console.error('   2. If paused, restart your project')
              console.error('   3. Verify the project URL in your .env file')
              console.error('   4. Restart your development server')
              
              return false
            } else {
              console.warn('⚠️ Supabase connection test failed:', error.message)
              return false
            }
          }
          return false
        }
      }

      // Run connection test in development mode
      if (import.meta.env.DEV) {
        testConnection().catch(console.error)
      }

    } catch (error) {
      console.error('❌ Failed to create Supabase client:', error)
      supabase = createMockClient('Failed to create Supabase client')
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

export interface UserDatabase {
  id: string
  user_id: string
  database_name: string
  grade: string
  board?: string
  subjects: string[]
  subject_group?: string
  created_at: string
  updated_at: string
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
      user_databases: {
        Row: UserDatabase
        Insert: Omit<UserDatabase, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserDatabase, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}