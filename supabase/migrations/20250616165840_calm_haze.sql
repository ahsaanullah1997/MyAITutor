/*
  # Add Progress Tracking Variables

  1. New Tables
    - `user_progress_stats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `study_streak_days` (integer, default 0)
      - `total_study_time_minutes` (integer, default 0)
      - `completed_lessons` (integer, default 0)
      - `total_tests_taken` (integer, default 0)
      - `average_test_score` (decimal, default 0)
      - `ai_sessions_count` (integer, default 0)
      - `weekly_study_time` (integer, default 0)
      - `monthly_study_time` (integer, default 0)
      - `last_study_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `subject_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `subject_name` (text)
      - `progress_percentage` (integer, default 0)
      - `completed_topics` (integer, default 0)
      - `total_topics` (integer, default 20)
      - `last_accessed` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `study_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `session_type` (text) -- 'lesson', 'test', 'ai_tutor', 'materials'
      - `subject` (text)
      - `duration_minutes` (integer)
      - `score` (integer) -- for tests, null for other types
      - `session_date` (date)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all new tables
    - Add policies for users to manage their own progress data