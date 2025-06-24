import { supabase } from '../lib/supabase'
import type { UserProfile } from '../lib/supabase'

export interface UserDatabase {
  id: string
  user_id: string
  database_name: string
  grade: string
  board?: string
  subjects: string[]
  created_at: string
  updated_at: string
}

export class DatabaseService {
  // Create a personalized database structure for each user
  static async createUserDatabase(userId: string, profile: UserProfile): Promise<UserDatabase> {
    try {
      // Generate database name based on user info
      const databaseName = `user_${userId.replace(/-/g, '_')}_db`
      
      // Determine subjects based on grade and board
      const subjects = this.getSubjectsForGrade(profile.grade, profile.board)
      
      // Create user database record
      const { data, error } = await supabase
        .from('user_databases')
        .insert({
          user_id: userId,
          database_name: databaseName,
          grade: profile.grade,
          board: profile.board || null,
          subjects: subjects
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating user database:', error)
        throw new Error('Failed to create user database')
      }

      // Initialize subject-specific tables and data
      await this.initializeSubjectTables(userId, subjects, profile.grade, profile.board)
      
      return data
    } catch (error) {
      console.error('Database creation error:', error)
      throw error
    }
  }

  // Get subjects based on grade and board
  private static getSubjectsForGrade(grade: string, board?: string): string[] {
    const baseSubjects = ['Mathematics', 'English', 'Urdu']
    
    switch (grade) {
      case 'Class 9 (Metric)':
      case 'Class 10 (Metric)':
        return [
          ...baseSubjects,
          'Physics',
          'Chemistry',
          'Biology',
          'Pakistan Studies',
          'Islamiyat',
          'Computer Science'
        ]
      
      case 'Class 11 (FSc)':
      case 'Class 12 (FSc)':
        return [
          ...baseSubjects,
          'Physics',
          'Chemistry',
          'Biology',
          'Pakistan Studies',
          'Islamiyat',
          'Computer Science',
          'Statistics'
        ]
      
      case 'O-levels':
        return [
          'Mathematics',
          'English Language',
          'Physics',
          'Chemistry',
          'Biology',
          'Pakistan Studies',
          'Islamiyat',
          'Computer Science',
          'Economics',
          'Accounting'
        ]
      
      case 'A-Levels':
        return [
          'Mathematics',
          'Further Mathematics',
          'Physics',
          'Chemistry',
          'Biology',
          'Economics',
          'Computer Science',
          'Psychology',
          'Business Studies'
        ]
      
      case 'MDCAT':
        return [
          'Biology',
          'Chemistry',
          'Physics',
          'English',
          'Logical Reasoning'
        ]
      
      case 'ECAT':
        return [
          'Mathematics',
          'Physics',
          'Chemistry',
          'English'
        ]
      
      default:
        return baseSubjects
    }
  }

  // Initialize subject-specific tables and content
  private static async initializeSubjectTables(
    userId: string, 
    subjects: string[], 
    grade: string, 
    board?: string
  ): Promise<void> {
    try {
      // Create subject progress entries
      const subjectProgressData = subjects.map(subject => ({
        user_id: userId,
        subject_name: subject,
        progress_percentage: 0,
        completed_topics: 0,
        total_topics: this.getTotalTopicsForSubject(subject, grade),
        last_accessed: new Date().toISOString()
      }))

      const { error: progressError } = await supabase
        .from('subject_progress')
        .upsert(subjectProgressData, { onConflict: 'user_id,subject_name' })

      if (progressError) {
        console.error('Error creating subject progress:', progressError)
      }

      // Create curriculum-specific content entries
      await this.createCurriculumContent(userId, subjects, grade, board)
      
      // Initialize user progress stats
      const { error: statsError } = await supabase
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
          monthly_study_time: 0
        }, { onConflict: 'user_id' })

      if (statsError) {
        console.error('Error creating progress stats:', statsError)
      }

    } catch (error) {
      console.error('Error initializing subject tables:', error)
      throw error
    }
  }

  // Get total topics for a subject based on grade
  private static getTotalTopicsForSubject(subject: string, grade: string): number {
    const topicCounts: { [key: string]: { [key: string]: number } } = {
      'Mathematics': {
        'Class 9 (Metric)': 15,
        'Class 10 (Metric)': 18,
        'Class 11 (FSc)': 20,
        'Class 12 (FSc)': 22,
        'O-levels': 16,
        'A-Levels': 25,
        'ECAT': 30
      },
      'Physics': {
        'Class 9 (Metric)': 12,
        'Class 10 (Metric)': 15,
        'Class 11 (FSc)': 18,
        'Class 12 (FSc)': 20,
        'O-levels': 14,
        'A-Levels': 22,
        'MDCAT': 25,
        'ECAT': 28
      },
      'Chemistry': {
        'Class 9 (Metric)': 10,
        'Class 10 (Metric)': 12,
        'Class 11 (FSc)': 16,
        'Class 12 (FSc)': 18,
        'O-levels': 12,
        'A-Levels': 20,
        'MDCAT': 22,
        'ECAT': 20
      },
      'Biology': {
        'Class 9 (Metric)': 8,
        'Class 10 (Metric)': 10,
        'Class 11 (FSc)': 14,
        'Class 12 (FSc)': 16,
        'O-levels': 10,
        'A-Levels': 18,
        'MDCAT': 30
      }
    }

    return topicCounts[subject]?.[grade] || 15 // Default to 15 topics
  }

  // Create curriculum-specific content
  private static async createCurriculumContent(
    userId: string,
    subjects: string[],
    grade: string,
    board?: string
  ): Promise<void> {
    try {
      // Create curriculum content entries for each subject
      const curriculumData = subjects.map(subject => ({
        user_id: userId,
        subject: subject,
        grade: grade,
        board: board || null,
        content_type: 'curriculum',
        topics: this.getTopicsForSubject(subject, grade, board),
        created_at: new Date().toISOString()
      }))

      // Note: This would require a curriculum_content table
      // For now, we'll just log the structure
      console.log('Curriculum content structure created for user:', userId, curriculumData)

    } catch (error) {
      console.error('Error creating curriculum content:', error)
    }
  }

  // Get topics for a specific subject, grade, and board
  private static getTopicsForSubject(subject: string, grade: string, board?: string): string[] {
    // This is a simplified example - in a real application, 
    // you'd have a comprehensive curriculum database
    const topicMaps: { [key: string]: { [key: string]: string[] } } = {
      'Mathematics': {
        'Class 9 (Metric)': [
          'Real Numbers',
          'Polynomials',
          'Linear Equations',
          'Coordinate Geometry',
          'Triangles',
          'Quadrilaterals',
          'Circles',
          'Constructions',
          'Heron\'s Formula',
          'Surface Areas and Volumes',
          'Statistics',
          'Probability'
        ],
        'Class 10 (Metric)': [
          'Real Numbers',
          'Polynomials',
          'Pair of Linear Equations',
          'Quadratic Equations',
          'Arithmetic Progressions',
          'Triangles',
          'Coordinate Geometry',
          'Trigonometry',
          'Circles',
          'Areas Related to Circles',
          'Surface Areas and Volumes',
          'Statistics',
          'Probability'
        ]
      },
      'Physics': {
        'Class 9 (Metric)': [
          'Physical Quantities and Measurement',
          'Kinematics',
          'Dynamics',
          'Turning Effect of Forces',
          'Gravitation',
          'Work and Energy',
          'Properties of Matter',
          'Thermal Properties of Matter',
          'Transfer of Heat'
        ]
      }
    }

    return topicMaps[subject]?.[grade] || [`${subject} Topic 1`, `${subject} Topic 2`, `${subject} Topic 3`]
  }

  // Get user database information
  static async getUserDatabase(userId: string): Promise<UserDatabase | null> {
    try {
      const { data, error } = await supabase
        .from('user_databases')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No database found
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching user database:', error)
      return null
    }
  }

  // Update user database when profile changes
  static async updateUserDatabase(userId: string, profile: UserProfile): Promise<void> {
    try {
      const subjects = this.getSubjectsForGrade(profile.grade, profile.board)
      
      const { error } = await supabase
        .from('user_databases')
        .update({
          grade: profile.grade,
          board: profile.board || null,
          subjects: subjects,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) {
        throw error
      }

      // Update subject progress to match new grade/board
      await this.updateSubjectProgress(userId, subjects, profile.grade)

    } catch (error) {
      console.error('Error updating user database:', error)
      throw error
    }
  }

  // Update subject progress when grade/board changes
  private static async updateSubjectProgress(
    userId: string,
    subjects: string[],
    grade: string
  ): Promise<void> {
    try {
      // Remove subjects that are no longer relevant
      const { error: deleteError } = await supabase
        .from('subject_progress')
        .delete()
        .eq('user_id', userId)
        .not('subject_name', 'in', `(${subjects.map(s => `"${s}"`).join(',')})`)

      if (deleteError) {
        console.error('Error removing old subjects:', deleteError)
      }

      // Add new subjects
      const subjectProgressData = subjects.map(subject => ({
        user_id: userId,
        subject_name: subject,
        progress_percentage: 0,
        completed_topics: 0,
        total_topics: this.getTotalTopicsForSubject(subject, grade),
        last_accessed: new Date().toISOString()
      }))

      const { error: upsertError } = await supabase
        .from('subject_progress')
        .upsert(subjectProgressData, { onConflict: 'user_id,subject_name' })

      if (upsertError) {
        console.error('Error updating subject progress:', upsertError)
      }

    } catch (error) {
      console.error('Error updating subject progress:', error)
    }
  }
}