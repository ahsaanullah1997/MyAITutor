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
  console.error('   1. Go to https://supabase.com and check your project status')
  console.error('   2. If project is PAUSED → Click "Resume" button')
  console.error('   3. If project is DELETED → Create a new project')
  console.error('   4. Update your .env file with correct credentials')
  console.error('   5. Run database migrations from supabase/migrations/')
  console.error('   6. Restart your development server')
  console.error('   📖 See SUPABASE_CONNECTION_FIX.md for detailed instructions')
  
  isUsingMockClient = true
  
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: () => Promise.resolve({ 
        data: { user: null, session: null }, 
        error: { 
          message: '🚨 SUPABASE CONNECTION FAILED\n\nYour Supabase project appears to be paused, deleted, or misconfigured.\n\nPlease check:\n1. Project status at https://supabase.com\n2. Environment variables in .env file\n3. See SUPABASE_CONNECTION_FIX.md for help' 
        } 
      }),
      signInWithPassword: () => Promise.resolve({ 
        data: { user: null, session: null }, 
        error: { 
          message: '🚨 SUPABASE CONNECTION FAILED\n\nYour Supabase project appears to be paused, deleted, or misconfigured.\n\nPlease check:\n1. Project status at https://supabase.com\n2. Environment variables in .env file\n3. See SUPABASE_CONNECTION_FIX.md for help' 
        } 
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
              code: 'SUPABASE_CONNECTION_FAILED', 
              message: '🚨 Cannot connect to Supabase database.\n\nThis usually means:\n• Your Supabase project is PAUSED or DELETED\n• Wrong project URL or API key\n• Network connectivity issues\n\nCheck https://supabase.com for your project status.' 
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
        error: { message: '🚨 Database connection failed. Check your Supabase project status.' } 
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ 
              data: null, 
              error: { message: '🚨 Database connection failed. Check your Supabase project status.' } 
            })
          })
        })
      }),
      upsert: () => ({
        select: () => ({
          single: () => Promise.resolve({ 
            data: null, 
            error: { message: '🚨 Database connection failed. Check your Supabase project status.' } 
          })
        })
      })
    })
  }
}

// Enhanced connection testing
const testSupabaseConnection = async (client: any): Promise<boolean> => {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    // Create a promise that rejects after 3 seconds (faster timeout)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout after 3 seconds')), 3000)
    })
    
    // Test basic connectivity with timeout
    const connectionPromise = client
      .from('user_profiles')
      .select('count')
      .limit(1)
    
    const { data, error } = await Promise.race([connectionPromise, timeoutPromise])
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('✅ Supabase connection successful - database is ready')
        return true
      } else if (error.code === '42P01' || error.message.includes('relation "user_profiles" does not exist')) {
        console.warn('⚠️ DATABASE SETUP REQUIRED: Tables do not exist.')
        console.warn('📋 Run the database migration from supabase/migrations/')
        return true // Connection works, just needs setup
      } else if (error.code === 'PGRST002' || error.message.includes('Could not query the database')) {
        console.error('❌ Database connection failed - Supabase project may be inactive')
        return false
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        console.error('❌ Network error - Cannot reach Supabase servers')
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
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('Connection timeout') ||
          error.message.includes('upstream connect error') ||
          error.message.includes('503') ||
          error.message.includes('NetworkError') ||
          error.message.includes('fetch')) {
        console.error('❌ SUPABASE PROJECT ISSUE DETECTED')
        console.error('🔧 This usually means:')
        console.error('   • Your Supabase project is PAUSED or DELETED')
        console.error('   • The project URL is incorrect')
        console.error('   • Network connectivity issues')
        console.error('📋 To fix this:')
        console.error('   1. Go to https://supabase.com and check your project status')
        console.error('   2. If PAUSED → Click "Resume" button')
        console.error('   3. If DELETED → Create a new project and update .env')
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
      // Create the real client with enhanced error handling
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
      })

      // Test connection immediately and switch to mock if it fails
      testSupabaseConnection(realClient).then((success) => {
        if (!success) {
          console.error('🚨 CRITICAL: Supabase connection failed - your project may be paused or deleted')
          console.error('📋 IMMEDIATE ACTION: Check https://supabase.com for your project status')
          // The mock client will handle subsequent requests gracefully
        }
      }).catch(() => {
        console.error('🚨 CRITICAL: Supabase connection test failed')
      })

      // Wrap the client to catch runtime fetch errors
      supabase = new Proxy(realClient, {
        get(target, prop) {
          const value = target[prop]
          
          // Intercept auth methods to catch connection errors
          if (prop === 'auth') {
            return new Proxy(value, {
              get(authTarget, authProp) {
                const authValue = authTarget[authProp]
                
                if (typeof authValue === 'function') {
                  return async (...args: any[]) => {
                    try {
                      return await authValue.apply(authTarget, args)
                    } catch (error) {
                      if (error instanceof Error && 
                          (error.message.includes('Failed to fetch') || 
                           error.message.includes('NetworkError') ||
                           error.message.includes('fetch'))) {
                        console.error('🚨 Auth request failed - Supabase connection issue')
                        console.error('📋 Check your Supabase project status at https://supabase.com')
                        
                        // Handle onAuthStateChange specifically
                        if (authProp === 'onAuthStateChange') {
                          const callback = args[0]
                          if (typeof callback === 'function') {
                            setTimeout(() => callback('SIGNED_OUT', null), 100)
                          }
                          return { data: { subscription: { unsubscribe: () => {} } } }
                        }
                        
                        // Return mock response for other auth failures
                        if (authProp === 'getUser' || authProp === 'getSession') {
                          return { data: { user: null, session: null }, error: null }
                        }
                        return { 
                          data: { user: null, session: null }, 
                          error: { 
                            message: '🚨 SUPABASE CONNECTION FAILED\n\nYour Supabase project appears to be paused or deleted.\nCheck https://supabase.com for your project status.' 
                          } 
                        }
                      }
                      throw error
                    }
                  }
                }
                
                return authValue
              }
            })
          }
          
          return value
        }
      })

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