import { supabase } from '../lib/supabase'
import type { UserProgressStats, SubjectProgress, StudySession } from '../lib/supabase'

export class ProgressService {
  // Initialize user progress stats with zero values
  static async initializeUserProgress(userId: string): Promise<UserProgressStats> {
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

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error initializing user progress:', error)
      throw error
    }
  }

  // Get user progress stats
  static async getUserProgress(userId: string): Promise<UserProgressStats | null> {
    try {
      const { data, error } = await supabase
        .from('user_progress_stats')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No progress found, initialize with zeros
          return await this.initializeUserProgress(userId)
        }
        throw error
      }
      return data
    } catch (error) {
      console.error('Error fetching user progress:', error)
      return null
    }
  }

  // Initialize default subjects for a user
  static async initializeSubjects(userId: string): Promise<void> {
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

      if (error) throw error
    } catch (error) {
      console.error('Error initializing subjects:', error)
      throw error
    }
  }

  // Get subject progress for a user
  static async getSubjectProgress(userId: string): Promise<SubjectProgress[]> {
    try {
      const { data, error } = await supabase
        .from('subject_progress')
        .select('*')
        .eq('user_id', userId)
        .order('subject_name')

      if (error) throw error
      
      if (!data || data.length === 0) {
        // Initialize subjects if none exist
        await this.initializeSubjects(userId)
        return await this.getSubjectProgress(userId)
      }
      
      return data
    } catch (error) {
      console.error('Error fetching subject progress:', error)
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

      if (sessionError) throw sessionError

      // Update progress stats
      await this.updateProgressStats(userId, sessionType, durationMinutes, score)
      
      // Update subject progress if applicable
      if (sessionType === 'lesson') {
        await this.updateSubjectProgress(userId, subject)
      }
    } catch (error) {
      console.error('Error recording study session:', error)
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

      if (error) throw error
    } catch (error) {
      console.error('Error updating progress stats:', error)
      throw error
    }
  }

  // Update subject progress
  private static async updateSubjectProgress(userId: string, subject: string): Promise<void> {
    try {
      const { data: currentProgress, error: fetchError } = await supabase
        .from('subject_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('subject_name', subject)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

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

        if (updateError) throw updateError
      }
    } catch (error) {
      console.error('Error updating subject progress:', error)
      throw error
    }
  }

  // Get recent study sessions
  static async getRecentSessions(userId: string, limit: number = 10): Promise<StudySession[]> {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching recent sessions:', error)
      return []
    }
  }

  // Reset weekly/monthly stats (would be called by a scheduled job)
  static async resetPeriodicStats(userId: string, type: 'weekly' | 'monthly'): Promise<void> {
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

      if (error) throw error
    } catch (error) {
      console.error('Error resetting periodic stats:', error)
      throw error
    }
  }
}