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
*/

-- Create user_progress_stats table
CREATE TABLE IF NOT EXISTS user_progress_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  study_streak_days integer DEFAULT 0,
  total_study_time_minutes integer DEFAULT 0,
  completed_lessons integer DEFAULT 0,
  total_tests_taken integer DEFAULT 0,
  average_test_score decimal(5,2) DEFAULT 0.00,
  ai_sessions_count integer DEFAULT 0,
  weekly_study_time integer DEFAULT 0,
  monthly_study_time integer DEFAULT 0,
  last_study_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create subject_progress table
CREATE TABLE IF NOT EXISTS subject_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  subject_name text NOT NULL,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_topics integer DEFAULT 0,
  total_topics integer DEFAULT 20,
  last_accessed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, subject_name)
);

-- Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_type text NOT NULL CHECK (session_type IN ('lesson', 'test', 'ai_tutor', 'materials')),
  subject text NOT NULL,
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  score integer CHECK (score >= 0 AND score <= 100),
  session_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE user_progress_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_progress_stats
CREATE POLICY "Users can view own progress stats"
  ON user_progress_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress stats"
  ON user_progress_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress stats"
  ON user_progress_stats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for subject_progress
CREATE POLICY "Users can view own subject progress"
  ON subject_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subject progress"
  ON subject_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subject progress"
  ON subject_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for study_sessions
CREATE POLICY "Users can view own study sessions"
  ON study_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study sessions"
  ON study_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_user_progress_stats_updated_at
  BEFORE UPDATE ON user_progress_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subject_progress_updated_at
  BEFORE UPDATE ON subject_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to initialize user progress when profile is created
CREATE OR REPLACE FUNCTION initialize_user_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert initial progress stats (all zeros)
  INSERT INTO user_progress_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Insert initial subject progress for common subjects
  INSERT INTO subject_progress (user_id, subject_name, total_topics)
  VALUES 
    (NEW.id, 'Mathematics', 20),
    (NEW.id, 'Physics', 20),
    (NEW.id, 'Chemistry', 20),
    (NEW.id, 'Biology', 20)
  ON CONFLICT (user_id, subject_name) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically initialize progress when user profile is created
DROP TRIGGER IF EXISTS initialize_user_progress_trigger ON user_profiles;
CREATE TRIGGER initialize_user_progress_trigger
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_progress();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_stats_user_id ON user_progress_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_subject_progress_user_id ON subject_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_subject_progress_subject ON subject_progress(user_id, subject_name);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON study_sessions(user_id, session_date);