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
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING',
  key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING',
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  hasPlaceholders: hasPlaceholderValues
})

// Create a mock client if environment variables are missing or contain placeholders
let supabase: any
let isUsingMockClient = false

// Create mock client function
const createMockClient = (reason: string) => {
  console.warn(`🔄 Using mock Supabase client: ${reason}`)
  console.warn('📋 To fix this:')
  console.warn('   1. Go to https://supabase.com and create a new project')
  console.warn('   2. Get your Project URL and anon key from Settings > API')
  console.warn('   3. Update your .env file with the new credentials')
  console.warn('   4. Run database migrations from supabase/migrations/')
  console.warn('   5. Restart your development server')
  
  isUsingMockClient = true
  
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: () => Promise.resolve({ 
        data: { user: null, session: null }, 
        error: { message: '⚠️ Supabase not configured. Please update your .env file with valid credentials.' } 
      }),
      signInWithPassword: () => Promise.resolve({ 
        data: { user: null, session: null }, 
        error: { message: '⚠️ Supabase not configured. Please update your .env file with valid credentials.' } 
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
              message: 'Unable to connect to the database. Please check your internet connection and Supabase project status.' 
            } 
          }),
          limit: () => ({
            abortSignal: () => Promise.resolve({ data: [], error: null })
          })
        }),
        limit: () => ({
          abortSignal: () => Promise.resolve({ data: [], error: null })
        })
      }),
      insert: () => Promise.resolve({ 
        data: null, 
        error: { message: '⚠️ Supabase not configured. Please update your .env file with valid credentials.' } 
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ 
              data: null, 
              error: { message: '⚠️ Supabase not configured. Please update your .env file with valid credentials.' } 
            })
          })
        })
      }),
      upsert: () => ({
        select: () => ({
          single: () => Promise.resolve({ 
            data: null, 
            error: { message: '⚠️ Supabase not configured. Please update your .env file with valid credentials.' } 
          })
        })
      })
    })
  }
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

      // Test connection with timeout and better error handling
      const testConnection = async () => {
        try {
          console.log('🔍 Testing Supabase connection...')
          
          // Create a promise that rejects after 10 seconds
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
          })
          
          // Test basic connectivity with timeout
          const connectionPromise = supabase
            .from('user_profiles')
            .select('count')
            .limit(1)
          
          const { data, error } = await Promise.race([connectionPromise, timeoutPromise])
          
          if (error) {
            if (error.code === 'PGRST116') {
              console.log('✅ Supabase connection successful - user_profiles table exists but is empty')
            } else if (error.code === '42P01' || error.message.includes('relation "user_profiles" does not exist')) {
              console.warn('⚠️ DATABASE SETUP REQUIRED: The user_profiles table does not exist.')
              console.warn('📋 Please run the database migration from supabase/migrations/')
              console.warn('🔗 See SUPABASE_SETUP.md for detailed instructions')
            } else if (error.code === 'PGRST002' || error.message.includes('Could not query the database')) {
              console.error('❌ Database connection failed - Supabase project may be inactive')
              console.error('📋 To fix this:')
              console.error('   1. Check if your Supabase project is active at https://supabase.com')
              console.error('   2. Verify your project URL and API key in .env file')
              console.error('   3. Create a new project if the current one is deleted')
              throw new Error('Supabase project inactive or deleted')
            } else {
              throw error
            }
          } else {
            console.log('✅ Supabase connection test successful')
          }
        } catch (error) {
          if (error instanceof Error) {
            if (error.message.includes('Failed to fetch') || 
                error.message.includes('Connection timeout') ||
                error.message.includes('upstream connect error') ||
                error.message.includes('503')) {
              console.error('❌ Cannot connect to Supabase project')
              console.error('🔧 This usually means:')
              console.error('   • Your Supabase project is inactive or deleted')
              console.error('   • The project URL is incorrect')
              console.error('   • Network connectivity issues')
              console.error('📋 To fix this:')
              console.error('   1. Go to https://supabase.com and check your project status')
              console.error('   2. Create a new project if needed')
              console.error('   3. Update your .env file with new credentials')
              console.error('   4. Restart your development server')
              
              // Don't switch to mock client here as it would break the module
              throw error
            } else {
              console.warn('⚠️ Supabase connection test failed:', error.message)
              throw error
            }
          }
        }
      }

      // Run connection test in development
      if (import.meta.env.DEV) {
        // Use setTimeout to avoid blocking the initial app load
        setTimeout(() => {
          testConnection().catch((error) => {
            console.error('🔄 Supabase connection test failed - switching to mock mode')
            // The app will continue with limited functionality
          })
        }, 1000)
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