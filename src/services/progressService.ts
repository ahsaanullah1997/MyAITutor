import { supabase, isUsingMockClient } from '../lib/supabase'
import type { UserProgressStats, SubjectProgress, StudySession } from '../lib/supabase'

export class ProgressService {
  // Check if we can safely make database calls
  private static canMakeDbCalls(): boolean {
    if (isUsingMockClient) {
      console.warn('ProgressService: Using mock client, database operations will be simulated')
      return false
    }
    return true
  }

  // Create mock progress data for when database is unavailable
  private static createMockProgressStats(userId: string): UserProgressStats {
    return {
      id: 'mock-id',
      user_id: userId,
      study_streak_days: 0,
      total_study_time_minutes: 0,
      completed_lessons: 0,
      total_tests_taken: 0,
      average_test_score: 0,
      ai_sessions_count: 0,
      weekly_study_time: 0,
      monthly_study_time: 0,
      last_study_date: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  // Create mock subject progress data
  private static createMockSubjectProgress(userId: string): SubjectProgress[] {
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Urdu']
    return subjects.map((subject, index) => ({
      id: `mock-${index}`,
      user_id: userId,
      subject_name: subject,
      progress_percentage: Math.floor(Math.random() * 50), // Random progress 0-50%
      completed_topics: Math.floor(Math.random() * 10),
      total_topics: 20,
      last_accessed: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))
  }

  // Initialize user progress stats with zero values
  static async initializeUserProgress(userId: string): Promise<UserProgressStats> {
    if (!this.canMakeDbCalls()) {
      console.log('ProgressService: Returning mock progress stats (database unavailable)')
      return this.createMockProgressStats(userId)
    }

    try {
      const { data, error } = await supabase
        .from('user_progress_stats')
        .upsert({
          user_id: userId,
          study_streak_days: 0,
          total_study_time_minutes: 0,
          completed_lessons: 0,
          total_tests_taken: 0,
          average_test_score: 0,
          ai_sessions_count: 0,
          weekly_study_time: 0,
          monthly_study_time: 0,
          last_study_date: null
        }, { onConflict: 'user_id' })
        .select()
        .single()

      if (error) {
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError') ||
            error.message.includes('not configured')) {
          console.warn('ProgressService: Database connection failed, returning mock data')
          return this.createMockProgressStats(userId)
        }
        throw error
      }
      return data
    } catch (error) {
      console.error('Error initializing user progress:', error)
      if (error instanceof Error && 
          (error.message.includes('Failed to fetch') || 
           error.message.includes('NetworkError') ||
           error.message.includes('not configured'))) {
        console.warn('ProgressService: Returning mock progress stats due to connection error')
        return this.createMockProgressStats(userId)
      }
      throw error
    }
  }

  // Get user progress stats
  static async getUserProgress(userId: string): Promise<UserProgressStats | null> {
    if (!this.canMakeDbCalls()) {
      console.log('ProgressService: Returning mock progress stats (database unavailable)')
      return this.createMockProgressStats(userId)
    }

    try {
      const { data, error } = await supabase
        .from('user_progress_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError') ||
            error.message.includes('not configured')) {
          console.warn('ProgressService: Database connection failed, returning mock data')
          return this.createMockProgressStats(userId)
        }
        throw error
      }

      if (!data) {
        // No progress found, initialize with zeros
        return await this.initializeUserProgress(userId)
      }
      
      return data
    } catch (error) {
      console.error('Error fetching user progress:', error)
      if (error instanceof Error && 
          (error.message.includes('Failed to fetch') || 
           error.message.includes('NetworkError') ||
           error.message.includes('not configured'))) {
        console.warn('ProgressService: Returning mock progress stats due to connection error')
        return this.createMockProgressStats(userId)
      }
      return null
    }
  }

  // Initialize default subjects for a user
  static async initializeSubjects(userId: string): Promise<void> {
    if (!this.canMakeDbCalls()) {
      console.log('ProgressService: Skipping subject initialization (database unavailable)')
      return
    }

    const defaultSubjects = [
      { name: 'Mathematics', total_topics: 20 },
      { name: 'Physics', total_topics: 20 },
      { name: 'Chemistry', total_topics: 20 },
      { name: 'Biology', total_topics: 20 },
      { name: 'English', total_topics: 15 },
      { name: 'Urdu', total_topics: 15 }
    ]

    try {
      const subjectData = defaultSubjects.map(subject => ({
        user_id: userId,
        subject_name: subject.name,
        progress_percentage: 0,
        completed_topics: 0,
        total_topics: subject.total_topics,
        last_accessed: new Date().toISOString()
      }))

      const { error } = await supabase
        .from('subject_progress')
        .upsert(subjectData, { onConflict: 'user_id,subject_name' })

      if (error) {
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError') ||
            error.message.includes('not configured')) {
          console.warn('ProgressService: Database connection failed, skipping subject initialization')
          return
        }
        throw error
      }
    } catch (error) {
      console.error('Error initializing subjects:', error)
      if (error instanceof Error && 
          (error.message.includes('Failed to fetch') || 
           error.message.includes('NetworkError') ||
           error.message.includes('not configured'))) {
        console.warn('ProgressService: Skipping subject initialization due to connection error')
        return
      }
      throw error
    }
  }

  // Get subject progress for a user
  static async getSubjectProgress(userId: string): Promise<SubjectProgress[]> {
    if (!this.canMakeDbCalls()) {
      console.log('ProgressService: Returning mock subject progress (database unavailable)')
      return this.createMockSubjectProgress(userId)
    }

    try {
      const { data, error } = await supabase
        .from('subject_progress')
        .select('*')
        .eq('user_id', userId)
        .order('subject_name')

      if (error) {
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError') ||
            error.message.includes('not configured')) {
          console.warn('ProgressService: Database connection failed, returning mock data')
          return this.createMockSubjectProgress(userId)
        }
        throw error
      }
      
      if (!data || data.length === 0) {
        // Initialize subjects if none exist
        await this.initializeSubjects(userId)
        return await this.getSubjectProgress(userId)
      }
      
      return data
    } catch (error) {
      console.error('Error fetching subject progress:', error)
      if (error instanceof Error && 
          (error.message.includes('Failed to fetch') || 
           error.message.includes('NetworkError') ||
           error.message.includes('not configured'))) {
        console.warn('ProgressService: Returning mock subject progress due to connection error')
        return this.createMockSubjectProgress(userId)
      }
      return []
    }
  }

  // Record a study session
  static async recordStudySession(
    userId: string,
    sessionType: 'lesson' | 'test' | 'ai_tutor' | 'materials',
    subject: string,
    durationMinutes: number,
    score?: number
  ): Promise<void> {
    if (!this.canMakeDbCalls()) {
      console.log('ProgressService: Simulating study session recording (database unavailable)')
      console.log(`Mock session: ${sessionType} - ${subject} - ${durationMinutes}min${score ? ` - ${score}%` : ''}`)
      return
    }

    try {
      // Record the session
      const { error: sessionError } = await supabase
        .from('study_sessions')
        .insert({
          user_id: userId,
          session_type: sessionType,
          subject: subject,
          duration_minutes: durationMinutes,
          score: score,
          session_date: new Date().toISOString().split('T')[0]
        })

      if (sessionError) {
        if (sessionError.message.includes('Failed to fetch') || 
            sessionError.message.includes('NetworkError') ||
            sessionError.message.includes('not configured')) {
          console.warn('ProgressService: Database connection failed, simulating session recording')
          return
        }
        throw sessionError
      }

      // Update progress stats
      await this.updateProgressStats(userId, sessionType, durationMinutes, score)
      
      // Update subject progress if applicable
      if (sessionType === 'lesson') {
        await this.updateSubjectProgress(userId, subject)
      }
    } catch (error) {
      console.error('Error recording study session:', error)
      if (error instanceof Error && 
          (error.message.includes('Failed to fetch') || 
           error.message.includes('NetworkError') ||
           error.message.includes('not configured'))) {
        console.warn('ProgressService: Simulating study session recording due to connection error')
        return
      }
      throw error
    }
  }

  // Update progress statistics
  private static async updateProgressStats(
    userId: string,
    sessionType: string,
    durationMinutes: number,
    score?: number
  ): Promise<void> {
    if (!this.canMakeDbCalls()) {
      console.log('ProgressService: Skipping progress stats update (database unavailable)')
      return
    }

    try {
      // Get current stats
      const currentStats = await this.getUserProgress(userId)
      if (!currentStats) return

      const today = new Date().toISOString().split('T')[0]
      const lastStudyDate = currentStats.last_study_date
      
      // Calculate study streak
      let newStreakDays = currentStats.study_streak_days
      if (lastStudyDate) {
        const lastDate = new Date(lastStudyDate)
        const todayDate = new Date(today)
        const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysDiff === 1) {
          // Consecutive day
          newStreakDays += 1
        } else if (daysDiff > 1) {
          // Streak broken
          newStreakDays = 1
        }
        // If daysDiff === 0, it's the same day, keep current streak
      } else {
        // First study session
        newStreakDays = 1
      }

      // Calculate new averages for test scores
      let newAverageScore = currentStats.average_test_score
      let newTestCount = currentStats.total_tests_taken
      
      if (sessionType === 'test' && score !== undefined) {
        newTestCount += 1
        newAverageScore = ((currentStats.average_test_score * currentStats.total_tests_taken) + score) / newTestCount
      }

      // Update stats
      const updates: any = {
        study_streak_days: newStreakDays,
        total_study_time_minutes: currentStats.total_study_time_minutes + durationMinutes,
        weekly_study_time: currentStats.weekly_study_time + durationMinutes,
        monthly_study_time: currentStats.monthly_study_time + durationMinutes,
        last_study_date: today
      }

      if (sessionType === 'lesson') {
        updates.completed_lessons = currentStats.completed_lessons + 1
      } else if (sessionType === 'test') {
        updates.total_tests_taken = newTestCount
        updates.average_test_score = Math.round(newAverageScore)
      } else if (sessionType === 'ai_tutor') {
        updates.ai_sessions_count = currentStats.ai_sessions_count + 1
      }

      const { error } = await supabase
        .from('user_progress_stats')
        .update(updates)
        .eq('user_id', userId)

      if (error) {
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError') ||
            error.message.includes('not configured')) {
          console.warn('ProgressService: Database connection failed, skipping progress stats update')
          return
        }
        throw error
      }
    } catch (error) {
      console.error('Error updating progress stats:', error)
      if (error instanceof Error && 
          (error.message.includes('Failed to fetch') || 
           error.message.includes('NetworkError') ||
           error.message.includes('not configured'))) {
        console.warn('ProgressService: Skipping progress stats update due to connection error')
        return
      }
      throw error
    }
  }

  // Update subject progress
  private static async updateSubjectProgress(userId: string, subject: string): Promise<void> {
    if (!this.canMakeDbCalls()) {
      console.log('ProgressService: Skipping subject progress update (database unavailable)')
      return
    }

    try {
      const { data: currentProgress, error: fetchError } = await supabase
        .from('subject_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('subject_name', subject)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        if (fetchError.message.includes('Failed to fetch') || 
            fetchError.message.includes('NetworkError') ||
            fetchError.message.includes('not configured')) {
          console.warn('ProgressService: Database connection failed, skipping subject progress update')
          return
        }
        throw fetchError
      }

      if (currentProgress) {
        const newCompletedTopics = currentProgress.completed_topics + 1
        const newProgressPercentage = Math.min(
          Math.round((newCompletedTopics / currentProgress.total_topics) * 100),
          100
        )

        const { error: updateError } = await supabase
          .from('subject_progress')
          .update({
            completed_topics: newCompletedTopics,
            progress_percentage: newProgressPercentage,
            last_accessed: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('subject_name', subject)

        if (updateError) {
          if (updateError.message.includes('Failed to fetch') || 
              updateError.message.includes('NetworkError') ||
              updateError.message.includes('not configured')) {
            console.warn('ProgressService: Database connection failed, skipping subject progress update')
            return
          }
          throw updateError
        }
      }
    } catch (error) {
      console.error('Error updating subject progress:', error)
      if (error instanceof Error && 
          (error.message.includes('Failed to fetch') || 
           error.message.includes('NetworkError') ||
           error.message.includes('not configured'))) {
        console.warn('ProgressService: Skipping subject progress update due to connection error')
        return
      }
      throw error
    }
  }

  // Get recent study sessions
  static async getRecentSessions(userId: string, limit: number = 10): Promise<StudySession[]> {
    if (!this.canMakeDbCalls()) {
      console.log('ProgressService: Returning empty sessions list (database unavailable)')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError') ||
            error.message.includes('not configured')) {
          console.warn('ProgressService: Database connection failed, returning empty sessions')
          return []
        }
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Error fetching recent sessions:', error)
      if (error instanceof Error && 
          (error.message.includes('Failed to fetch') || 
           error.message.includes('NetworkError') ||
           error.message.includes('not configured'))) {
        console.warn('ProgressService: Returning empty sessions due to connection error')
        return []
      }
      return []
    }
  }

  // Reset weekly/monthly stats (would be called by a scheduled job)
  static async resetPeriodicStats(userId: string, type: 'weekly' | 'monthly'): Promise<void> {
    if (!this.canMakeDbCalls()) {
      console.log('ProgressService: Skipping periodic stats reset (database unavailable)')
      return
    }

    try {
      const updates: any = {}
      if (type === 'weekly') {
        updates.weekly_study_time = 0
      } else if (type === 'monthly') {
        updates.monthly_study_time = 0
      }

      const { error } = await supabase
        .from('user_progress_stats')
        .update(updates)
        .eq('user_id', userId)

      if (error) {
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError') ||
            error.message.includes('not configured')) {
          console.warn('ProgressService: Database connection failed, skipping periodic stats reset')
          return
        }
        throw error
      }
    } catch (error) {
      console.error('Error resetting periodic stats:', error)
      if (error instanceof Error && 
          (error.message.includes('Failed to fetch') || 
           error.message.includes('NetworkError') ||
           error.message.includes('not configured'))) {
        console.warn('ProgressService: Skipping periodic stats reset due to connection error')
        return
      }
      throw error
    }
  }
}