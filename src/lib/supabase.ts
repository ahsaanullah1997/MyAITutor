import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Enhanced debugging for environment variables
console.log('Supabase Environment Check:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING',
  key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING',
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey
})

if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = []
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL')
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY')
  
  throw new Error(`Missing Supabase environment variables: ${missingVars.join(', ')}. Please check your .env file and restart the development server.`)
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}. Please check your VITE_SUPABASE_URL in the .env file.`)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Add timeout configuration for auth operations
    flowType: 'pkce'
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
    // Add fetch configuration with timeout
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(30000) // 30 second timeout for all requests
      })
    }
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

// Test connection on initialization with better error handling
const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout for test
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1)
      .abortSignal(controller.signal)
    
    clearTimeout(timeoutId)
    
    if (error) {
      console.error('Supabase connection test failed:', error.message)
      console.error('Please verify your Supabase URL and API key in the .env file')
    } else {
      console.log('Supabase connection test successful')
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Supabase connection test timed out - check your network connection and Supabase project status')
      } else {
        console.error('Supabase connection test error:', error.message)
      }
    }
    console.error('Please verify your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the .env file')
  }
}

// Run connection test in development
if (import.meta.env.DEV) {
  testConnection()
}

// Types for our database
export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  grade: string
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
    }
  }
}