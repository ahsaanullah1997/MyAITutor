// Mock Supabase client for offline development
console.log('🔄 Running in OFFLINE MODE - Supabase disconnected')
console.log('📝 To reconnect: Update .env with new Supabase credentials and restart server')

// Create a mock client that simulates Supabase functionality
const createMockClient = () => {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: (data: any) => {
        console.log('🔄 Mock sign up:', data.email)
        return Promise.resolve({ 
          data: { 
            user: { 
              id: 'mock-user-id', 
              email: data.email,
              created_at: new Date().toISOString()
            }, 
            session: null 
          }, 
          error: null 
        })
      },
      signInWithPassword: (data: any) => {
        console.log('🔄 Mock sign in:', data.email)
        return Promise.resolve({ 
          data: { 
            user: { 
              id: 'mock-user-id', 
              email: data.email,
              created_at: new Date().toISOString()
            }, 
            session: { 
              user: { 
                id: 'mock-user-id', 
                email: data.email 
              },
              access_token: 'mock-token'
            } 
          }, 
          error: null 
        })
      },
      signOut: () => {
        console.log('🔄 Mock sign out')
        return Promise.resolve({ error: null })
      },
      onAuthStateChange: (callback: any) => {
        console.log('🔄 Mock auth state listener setup')
        // Call callback immediately with no session
        setTimeout(() => callback('SIGNED_OUT', null), 100)
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
      resetPasswordForEmail: () => Promise.resolve({ error: null })
    },
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: () => {
            console.log(`🔄 Mock query: ${table}.select(${columns}).eq(${column}, ${value}).single()`)
            return Promise.resolve({ 
              data: null, 
              error: { 
                code: 'MOCK_MODE', 
                message: 'Running in offline mode - no database connection' 
              } 
            })
          },
          limit: (count: number) => ({
            abortSignal: (signal: any) => {
              console.log(`🔄 Mock query: ${table}.select(${columns}).eq(${column}, ${value}).limit(${count})`)
              return Promise.resolve({ data: [], error: null })
            }
          }),
          order: (column: string, options?: any) => ({
            limit: (count: number) => ({
              abortSignal: (signal: any) => {
                console.log(`🔄 Mock query: ${table}.select().order(${column}).limit(${count})`)
                return Promise.resolve({ data: [], error: null })
              }
            })
          })
        }),
        gte: (column: string, value: any) => ({
          order: (orderColumn: string, options?: any) => ({
            abortSignal: (signal: any) => {
              console.log(`🔄 Mock query: ${table}.select().gte(${column}, ${value}).order(${orderColumn})`)
              return Promise.resolve({ data: [], error: null })
            }
          })
        }),
        limit: (count: number) => ({
          abortSignal: (signal: any) => {
            console.log(`🔄 Mock query: ${table}.select(${columns}).limit(${count})`)
            return Promise.resolve({ data: [], error: null })
          }
        })
      }),
      insert: (data: any) => {
        console.log(`🔄 Mock insert: ${table}`, data)
        return Promise.resolve({ 
          data: { id: 'mock-id', ...data }, 
          error: null 
        })
      },
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: () => {
              console.log(`🔄 Mock update: ${table}.update().eq(${column}, ${value})`, data)
              return Promise.resolve({ 
                data: { id: value, ...data }, 
                error: null 
              })
            }
          })
        })
      }),
      upsert: (data: any, options?: any) => ({
        select: () => ({
          single: () => {
            console.log(`🔄 Mock upsert: ${table}`, data)
            return Promise.resolve({ 
              data: { id: 'mock-id', ...data }, 
              error: null 
            })
          }
        })
      })
    }),
    storage: {
      from: (bucket: string) => ({
        upload: (path: string, file: File) => {
          console.log(`🔄 Mock storage upload: ${bucket}/${path}`)
          return Promise.resolve({ 
            data: { path }, 
            error: null 
          })
        },
        remove: (paths: string[]) => {
          console.log(`🔄 Mock storage remove: ${bucket}`, paths)
          return Promise.resolve({ error: null })
        },
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `https://mock-storage.com/${bucket}/${path}` }
        })
      })
    }
  }
}

export const supabase = createMockClient()
export const isUsingMockClient = true

// Types for our database (keep these for TypeScript compatibility)
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