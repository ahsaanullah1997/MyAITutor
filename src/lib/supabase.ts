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
console.log('🔍 Supabase Environment Check:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : '❌ MISSING',
  key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : '❌ MISSING',
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  hasPlaceholders: hasPlaceholderValues
})

// Create a mock client if environment variables are missing or contain placeholders
let supabase: any
let isUsingMockClient = false

// Create mock client function with better error messages
const createMockClient = (reason: string) => {
  console.error(`🚨 CRITICAL: Using mock Supabase client - ${reason}`)
  console.error('📋 IMMEDIATE ACTION REQUIRED:')
  console.error('   1. Go to https://supabase.com → Your Project → Settings → API')
  console.error('   2. Copy the exact Project URL and anon public key')
  console.error('   3. Update your .env file with these correct values')
  console.error('   4. Ensure Site URL includes http://localhost:5173 in Auth settings')
  console.error('   5. Restart your development server')
  
  isUsingMockClient = true
  
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: () => Promise.resolve({ 
        data: { user: null, session: null }, 
        error: { 
          message: '🚨 SUPABASE CONNECTION FAILED\n\nPlease check your environment variables:\n1. Go to https://supabase.com → Settings → API\n2. Copy the correct Project URL and anon key\n3. Update your .env file\n4. Restart the development server' 
        } 
      }),
      signInWithPassword: () => Promise.resolve({ 
        data: { user: null, session: null }, 
        error: { 
          message: '🚨 SUPABASE CONNECTION FAILED\n\nPlease check your environment variables:\n1. Go to https://supabase.com → Settings → API\n2. Copy the correct Project URL and anon key\n3. Update your .env file\n4. Restart the development server' 
        } 
      }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: (callback: any) => {
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
              code: 'SUPABASE_CONNECTION_FAILED', 
              message: '🚨 Cannot connect to Supabase database.\n\nPlease verify:\n• Environment variables are correct\n• Project URL and API key match your Supabase dashboard\n• Site URL includes http://localhost:5173 in Auth settings\n• Development server was restarted after .env changes' 
            } 
          }),
          limit: () => ({
            abortSignal: () => Promise.resolve({ data: [], error: null })
          })
        }),
        limit: () => ({
          abortSignal: () => Promise.resolve({ data: [], error: null })
        }),
        order: () => ({
          limit: () => ({
            abortSignal: () => Promise.resolve({ data: [], error: null })
          })
        })
      }),
      insert: () => Promise.resolve({ 
        data: null, 
        error: { message: '🚨 Database connection failed. Check your environment variables and Supabase settings.' } 
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ 
              data: null, 
              error: { message: '🚨 Database connection failed. Check your environment variables and Supabase settings.' } 
            })
          })
        })
      }),
      upsert: () => ({
        select: () => ({
          single: () => Promise.resolve({ 
            data: null, 
            error: { message: '🚨 Database connection failed. Check your environment variables and Supabase settings.' } 
            })
        })
      })
    })
  }
}

// Enhanced connection testing with better error handling
const testSupabaseConnection = async (client: any): Promise<boolean> => {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    // Create a promise that rejects after 5 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout after 5 seconds')), 5000)
    })
    
    // Test basic connectivity with timeout
    const connectionPromise = client
      .from('user_profiles')
      .select('count')
      .limit(1)
    
    const { data, error } = await Promise.race([connectionPromise, timeoutPromise])
    
    if (error) {
      console.log('Connection test error details:', error)
      
      if (error.code === 'PGRST116') {
        console.log('✅ Supabase connection successful - database is ready')
        return true
      } else if (error.code === '42P01' || error.message.includes('relation "user_profiles" does not exist')) {
        console.warn('⚠️ DATABASE SETUP REQUIRED: Tables do not exist.')
        console.warn('📋 Run the database migration from supabase/migrations/')
        return true // Connection works, just needs setup
      } else if (error.message.includes('JWT') || error.message.includes('Invalid API key')) {
        console.error('❌ Invalid API key - check your VITE_SUPABASE_ANON_KEY')
        return false
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        console.error('❌ Network error - Cannot reach Supabase servers')
        console.error('   Check if your VITE_SUPABASE_URL is correct')
        return false
      } else {
        console.error('❌ Database error:', error.message)
        return false
      }
    } else {
      console.log('✅ Supabase connection test successful')
      return true
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Connection test failed:', error.message)
      
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('Connection timeout') ||
          error.message.includes('NetworkError') ||
          error.message.includes('fetch')) {
        console.error('❌ CONNECTION ISSUE DETECTED')
        console.error('🔧 Common causes:')
        console.error('   • Incorrect VITE_SUPABASE_URL in .env file')
        console.error('   • Invalid VITE_SUPABASE_ANON_KEY in .env file')
        console.error('   • Network connectivity issues')
        console.error('   • Supabase project settings misconfigured')
        console.error('📋 To fix:')
        console.error('   1. Verify credentials at https://supabase.com → Settings → API')
        console.error('   2. Update .env file with correct values')
        console.error('   3. Add http://localhost:5173 to Auth Site URLs')
        console.error('   4. Restart development server')
        
        return false
      }
    }
    return false
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
      // Create the real client with enhanced configuration
      const realClient = createClient(supabaseUrl, supabaseAnonKey, {
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
        global: {
          headers: {
            'X-Client-Info': 'supabase-js-web'
          }
        }
      })

      // Test connection and provide detailed feedback
      testSupabaseConnection(realClient).then((success) => {
        if (success) {
          console.log('✅ Supabase connection established successfully')
        } else {
          console.error('🚨 CRITICAL: Supabase connection failed')
          console.error('📋 NEXT STEPS:')
          console.error('   1. Check your .env file values')
          console.error('   2. Verify credentials in Supabase dashboard')
          console.error('   3. Ensure Auth settings include localhost:5173')
          console.error('   4. Restart your development server')
        }
      }).catch((error) => {
        console.error('🚨 Connection test error:', error.message)
      })

      supabase = realClient

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