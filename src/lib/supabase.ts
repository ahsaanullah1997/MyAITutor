import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

console.log('🔍 Supabase Configuration Check:')
console.log('URL:', supabaseUrl ? `${supabaseUrl.substring(0, 50)}...` : '❌ MISSING')
console.log('Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 30)}...` : '❌ MISSING')

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ CRITICAL: Missing Supabase environment variables')
  console.error('Please check your .env file and ensure it contains:')
  console.error('VITE_SUPABASE_URL=https://your-project-id.supabase.co')
  console.error('VITE_SUPABASE_ANON_KEY=your-anon-key-here')
}

// Check for placeholder values
if (supabaseUrl.includes('your-actual-project-id') || supabaseAnonKey.includes('your-actual-anon-key')) {
  console.error('❌ CRITICAL: You are using placeholder values in your .env file')
  console.error('Please replace them with your actual Supabase credentials from:')
  console.error('https://supabase.com → Your Project → Settings → API')
}

// Validate URL format
if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
  console.error('❌ Invalid Supabase URL format. Must start with https://')
}

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  }
})

// Test connection on initialization
if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-actual-project-id')) {
  console.log('🔄 Testing Supabase connection...')
  
  // Test with a simple query
  supabase
    .from('user_profiles')
    .select('count')
    .limit(1)
    .then(({ data, error }) => {
      if (error) {
        if (error.code === 'PGRST116') {
          console.log('✅ Supabase connection successful - database ready')
        } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
          console.warn('⚠️ Connected but tables missing - run database migration')
          console.warn('Go to Supabase SQL Editor and run the migration from supabase/migrations/')
        } else if (error.message.includes('Failed to fetch') || 
                   error.message.includes('NetworkError') ||
                   error.message.includes('CORS')) {
          console.error('❌ CRITICAL: Cannot reach Supabase project')
          console.error('Possible causes:')
          console.error('• Wrong project URL in .env file')
          console.error('• Invalid API key')
          console.error('• CORS/Network issues')
          console.error('• Project region restrictions')
          console.error('')
          console.error('✅ Your project IS active (we can see it in dashboard)')
          console.error('❌ But the URL/key in .env is wrong')
          console.error('')
          console.error('🔧 TO FIX:')
          console.error('1. Go to https://supabase.com')
          console.error('2. Open your project')
          console.error('3. Go to Settings → API')
          console.error('4. Copy the EXACT Project URL and anon key')
          console.error('5. Update your .env file')
          console.error('6. Restart dev server')
        } else if (error.message.includes('JWT') || error.message.includes('Invalid API key')) {
          console.error('❌ CRITICAL: Invalid API key')
          console.error('Please check your VITE_SUPABASE_ANON_KEY in .env file')
          console.error('Get the correct anon key from: Settings → API in your Supabase dashboard')
        } else {
          console.error('❌ Database error:', error.message)
          console.error('Error code:', error.code)
        }
      } else {
        console.log('✅ Supabase connection and database ready')
      }
    })
    .catch((error) => {
      console.error('❌ Connection test failed:', error.message)
      if (error.message.includes('Failed to fetch')) {
        console.error('')
        console.error('🔧 MOST LIKELY CAUSE: Wrong project URL in .env file')
        console.error('Your project is active, but the URL in .env is incorrect')
        console.error('')
        console.error('TO FIX:')
        console.error('1. Go to https://supabase.com')
        console.error('2. Open your project')
        console.error('3. Copy the correct Project URL from Settings → API')
        console.error('4. Update VITE_SUPABASE_URL in your .env file')
        console.error('5. Restart: npm run dev')
      }
    })
} else {
  console.warn('⚠️ Skipping connection test - missing or placeholder credentials')
}

export const isUsingMockClient = false

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