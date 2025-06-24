import { supabase } from '../lib/supabase'
import type { StudySession, UserProgressStats, SubjectProgress } from '../lib/supabase'

export interface WeeklyAnalytics {
  totalStudyTime: number
  sessionsCompleted: number
  averageSessionLength: number
  mostStudiedSubject: string
  weeklyGoalProgress: number
  streakDays: number
}

export interface MonthlyAnalytics {
  totalStudyTime: number
  lessonsCompleted: number
  testsCompleted: number
  averageTestScore: number
  subjectBreakdown: { subject: string; time: number; progress: number }[]
  improvementAreas: string[]
  achievements: string[]
}

export interface LearningInsights {
  preferredStudyTime: string
  strongSubjects: string[]
  weakSubjects: string[]
  studyPatterns: string[]
  recommendations: string[]
}

export class AnalyticsService {
  // Get weekly analytics for dashboard
  static async getWeeklyAnalytics(userId: string): Promise<WeeklyAnalytics> {
    try {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      
      // Get sessions from the last week with timeout and error handling
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      try {
        const { data: sessions, error } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('user_id', userId)
          .gte('session_date', oneWeekAgo.toISOString().split('T')[0])
          .order('created_at', { ascending: false })
          .abortSignal(controller.signal)

        clearTimeout(timeoutId)

        if (error) {
          console.error('Database error in getWeeklyAnalytics:', error)
          
          // Handle specific database errors
          if (error.message.includes('Failed to fetch') || 
              error.message.includes('NetworkError') ||
              error.message.includes('Connection timeout')) {
            throw new Error('Unable to connect to the database. Please check your internet connection and Supabase project status.')
          }
          
          if (error.message.includes('relation "study_sessions" does not exist')) {
            throw new Error('Database tables not found. Please run the database migration.')
          }
          
          throw error
        }

        // Get current progress stats with error handling
        const { data: progressStats, error: progressError } = await supabase
          .from('user_progress_stats')
          .select('*')
          .eq('user_id', userId)
          .single()

        // Don't throw error for missing progress stats, just use defaults
        if (progressError && !progressError.message.includes('No rows found')) {
          console.warn('Could not fetch progress stats:', progressError)
        }

        const totalStudyTime = sessions?.reduce((sum, session) => sum + session.duration_minutes, 0) || 0
        const sessionsCompleted = sessions?.length || 0
        const averageSessionLength = sessionsCompleted > 0 ? Math.round(totalStudyTime / sessionsCompleted) : 0

        // Find most studied subject
        const subjectTimes: { [key: string]: number } = {}
        sessions?.forEach(session => {
          subjectTimes[session.subject] = (subjectTimes[session.subject] || 0) + session.duration_minutes
        })
        
        const mostStudiedSubject = Object.keys(subjectTimes).length > 0 ? 
          Object.keys(subjectTimes).reduce((a, b) => 
            subjectTimes[a] > subjectTimes[b] ? a : b
          ) : 'None'

        // Calculate weekly goal progress (assuming 300 minutes per week goal)
        const weeklyGoal = 300
        const weeklyGoalProgress = Math.min((totalStudyTime / weeklyGoal) * 100, 100)

        return {
          totalStudyTime,
          sessionsCompleted,
          averageSessionLength,
          mostStudiedSubject,
          weeklyGoalProgress,
          streakDays: progressStats?.study_streak_days || 0
        }
      } catch (fetchError) {
        clearTimeout(timeoutId)
        
        if (fetchError instanceof Error) {
          if (fetchError.name === 'AbortError') {
            throw new Error('Database request timed out. Please check your internet connection and Supabase project status.')
          }
          
          if (fetchError.message.includes('Failed to fetch') || 
              fetchError.message.includes('NetworkError')) {
            throw new Error('Unable to connect to the database. Please verify your Supabase project is active and accessible.')
          }
        }
        
        throw fetchError
      }
    } catch (error) {
      console.error('Error fetching weekly analytics:', error)
      
      // Return default values instead of throwing to prevent UI crashes
      return {
        totalStudyTime: 0,
        sessionsCompleted: 0,
        averageSessionLength: 0,
        mostStudiedSubject: 'None',
        weeklyGoalProgress: 0,
        streakDays: 0
      }
    }
  }

  // Get monthly analytics for detailed progress view
  static async getMonthlyAnalytics(userId: string): Promise<MonthlyAnalytics> {
    try {
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

      // Get sessions from the last month with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      try {
        const { data: sessions, error: sessionsError } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('user_id', userId)
          .gte('session_date', oneMonthAgo.toISOString().split('T')[0])
          .abortSignal(controller.signal)

        clearTimeout(timeoutId)

        if (sessionsError) {
          console.error('Database error in getMonthlyAnalytics:', sessionsError)
          throw sessionsError
        }

        // Get subject progress
        const { data: subjectProgress, error: subjectError } = await supabase
          .from('subject_progress')
          .select('*')
          .eq('user_id', userId)

        if (subjectError && !subjectError.message.includes('No rows found')) {
          console.warn('Could not fetch subject progress:', subjectError)
        }

        const totalStudyTime = sessions?.reduce((sum, session) => sum + session.duration_minutes, 0) || 0
        const lessonsCompleted = sessions?.filter(s => s.session_type === 'lesson').length || 0
        const testsCompleted = sessions?.filter(s => s.session_type === 'test').length || 0
        
        const testScores = sessions?.filter(s => s.session_type === 'test' && s.score !== null).map(s => s.score!) || []
        const averageTestScore = testScores.length > 0 ? 
          Math.round(testScores.reduce((sum, score) => sum + score, 0) / testScores.length) : 0

        // Subject breakdown
        const subjectTimes: { [key: string]: number } = {}
        sessions?.forEach(session => {
          subjectTimes[session.subject] = (subjectTimes[session.subject] || 0) + session.duration_minutes
        })

        const subjectBreakdown = subjectProgress?.map(subject => ({
          subject: subject.subject_name,
          time: subjectTimes[subject.subject_name] || 0,
          progress: subject.progress_percentage
        })) || []

        // Identify improvement areas (subjects with low progress)
        const improvementAreas = subjectProgress?.filter(s => s.progress_percentage < 50)
          .map(s => s.subject_name) || []

        // Generate achievements based on progress
        const achievements: string[] = []
        if (testScores.some(score => score >= 90)) achievements.push('High Achiever')
        if (lessonsCompleted >= 20) achievements.push('Dedicated Learner')
        if (totalStudyTime >= 1200) achievements.push('Study Champion') // 20+ hours
        if (subjectProgress?.some(s => s.progress_percentage >= 80)) achievements.push('Subject Master')

        return {
          totalStudyTime,
          lessonsCompleted,
          testsCompleted,
          averageTestScore,
          subjectBreakdown,
          improvementAreas,
          achievements
        }
      } catch (fetchError) {
        clearTimeout(timeoutId)
        throw fetchError
      }
    } catch (error) {
      console.error('Error fetching monthly analytics:', error)
      return {
        totalStudyTime: 0,
        lessonsCompleted: 0,
        testsCompleted: 0,
        averageTestScore: 0,
        subjectBreakdown: [],
        improvementAreas: [],
        achievements: []
      }
    }
  }

  // Generate learning insights and recommendations
  static async getLearningInsights(userId: string): Promise<LearningInsights> {
    try {
      // Get all sessions to analyze patterns with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      try {
        const { data: sessions, error: sessionsError } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(100) // Last 100 sessions
          .abortSignal(controller.signal)

        clearTimeout(timeoutId)

        if (sessionsError) {
          console.error('Database error in getLearningInsights:', sessionsError)
          throw sessionsError
        }

        // Get subject progress
        const { data: subjectProgress, error: subjectError } = await supabase
          .from('subject_progress')
          .select('*')
          .eq('user_id', userId)

        if (subjectError && !subjectError.message.includes('No rows found')) {
          console.warn('Could not fetch subject progress for insights:', subjectError)
        }

        // Analyze preferred study time
        const hourCounts: { [key: number]: number } = {}
        sessions?.forEach(session => {
          const hour = new Date(session.created_at).getHours()
          hourCounts[hour] = (hourCounts[hour] || 0) + 1
        })

        const preferredHour = Object.keys(hourCounts).length > 0 ? 
          Object.keys(hourCounts).reduce((a, b) => 
            hourCounts[parseInt(a)] > hourCounts[parseInt(b)] ? a : b
          ) : '9'

        const preferredStudyTime = this.getTimeOfDayLabel(parseInt(preferredHour))

        // Identify strong and weak subjects
        const strongSubjects = subjectProgress?.filter(s => s.progress_percentage >= 70)
          .map(s => s.subject_name) || []
        
        const weakSubjects = subjectProgress?.filter(s => s.progress_percentage < 50)
          .map(s => s.subject_name) || []

        // Analyze study patterns
        const studyPatterns: string[] = []
        const avgSessionLength = sessions?.length ? 
          sessions.reduce((sum, s) => sum + s.duration_minutes, 0) / sessions.length : 0

        if (avgSessionLength > 45) studyPatterns.push('Long study sessions')
        else if (avgSessionLength < 20) studyPatterns.push('Short, frequent sessions')
        else studyPatterns.push('Moderate session length')

        // Check for consistency
        const recentSessions = sessions?.slice(0, 14) || [] // Last 14 sessions
        const uniqueDays = new Set(recentSessions.map(s => s.session_date)).size
        if (uniqueDays >= 10) studyPatterns.push('Consistent daily study')
        else if (uniqueDays >= 5) studyPatterns.push('Regular study schedule')

        // Generate recommendations
        const recommendations: string[] = []
        
        if (weakSubjects.length > 0) {
          recommendations.push(`Focus more time on ${weakSubjects.slice(0, 2).join(' and ')}`)
        }
        
        if (avgSessionLength < 20) {
          recommendations.push('Try longer study sessions for better retention')
        }
        
        if (uniqueDays < 5) {
          recommendations.push('Aim for more consistent daily study habits')
        }
        
        const testSessions = sessions?.filter(s => s.session_type === 'test') || []
        if (testSessions.length < 5) {
          recommendations.push('Take more practice tests to assess your knowledge')
        }

        const aiSessions = sessions?.filter(s => s.session_type === 'ai_tutor') || []
        if (aiSessions.length < 3) {
          recommendations.push('Use the AI tutor more often for personalized help')
        }

        return {
          preferredStudyTime,
          strongSubjects,
          weakSubjects,
          studyPatterns,
          recommendations
        }
      } catch (fetchError) {
        clearTimeout(timeoutId)
        throw fetchError
      }
    } catch (error) {
      console.error('Error generating learning insights:', error)
      return {
        preferredStudyTime: 'Morning',
        strongSubjects: [],
        weakSubjects: [],
        studyPatterns: [],
        recommendations: []
      }
    }
  }

  // Get study streak information
  static async getStudyStreakInfo(userId: string) {
    try {
      const { data: progressStats } = await supabase
        .from('user_progress_stats')
        .select('study_streak_days, last_study_date')
        .eq('user_id', userId)
        .single()

      const today = new Date().toISOString().split('T')[0]
      const lastStudyDate = progressStats?.last_study_date
      
      let streakStatus = 'active'
      if (lastStudyDate) {
        const daysSinceLastStudy = Math.floor(
          (new Date(today).getTime() - new Date(lastStudyDate).getTime()) / (1000 * 60 * 60 * 24)
        )
        
        if (daysSinceLastStudy > 1) {
          streakStatus = 'broken'
        } else if (daysSinceLastStudy === 1) {
          streakStatus = 'at_risk'
        }
      }

      return {
        currentStreak: progressStats?.study_streak_days || 0,
        lastStudyDate,
        streakStatus,
        daysUntilRisk: streakStatus === 'active' ? 1 : 0
      }
    } catch (error) {
      console.error('Error fetching streak info:', error)
      return {
        currentStreak: 0,
        lastStudyDate: null,
        streakStatus: 'broken',
        daysUntilRisk: 0
      }
    }
  }

  // Helper method to convert hour to time of day label
  private static getTimeOfDayLabel(hour: number): string {
    if (hour >= 5 && hour < 12) return 'Morning'
    if (hour >= 12 && hour < 17) return 'Afternoon'
    if (hour >= 17 && hour < 21) return 'Evening'
    return 'Night'
  }

  // Get performance trends over time
  static async getPerformanceTrends(userId: string, days: number = 30) {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select('session_date, session_type, duration_minutes, score')
        .eq('user_id', userId)
        .gte('session_date', startDate.toISOString().split('T')[0])
        .order('session_date', { ascending: true })

      if (error) throw error

      // Group by date and calculate daily metrics
      const dailyMetrics: { [date: string]: { studyTime: number; testScore: number; sessions: number } } = {}
      
      sessions?.forEach(session => {
        const date = session.session_date
        if (!dailyMetrics[date]) {
          dailyMetrics[date] = { studyTime: 0, testScore: 0, sessions: 0 }
        }
        
        dailyMetrics[date].studyTime += session.duration_minutes
        dailyMetrics[date].sessions += 1
        
        if (session.session_type === 'test' && session.score) {
          dailyMetrics[date].testScore = session.score
        }
      })

      return Object.entries(dailyMetrics).map(([date, metrics]) => ({
        date,
        ...metrics
      }))
    } catch (error) {
      console.error('Error fetching performance trends:', error)
      return []
    }
  }
}