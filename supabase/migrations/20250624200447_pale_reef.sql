/*
  # Create user management tables

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `first_name` (text, required)
      - `last_name` (text, required)
      - `grade` (text, required)
      - `board` (text, optional)
      - `area` (text, optional)
      - `profile_picture_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_progress_stats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `study_streak_days` (integer, default 0)
      - `total_study_time_minutes` (integer, default 0)
      - `completed_lessons` (integer, default 0)
      - `total_tests_taken` (integer, default 0)
      - `average_test_score` (numeric, default 0)
      - `ai_sessions_count` (integer, default 0)
      - `weekly_study_time` (integer, default 0)
      - `monthly_study_time` (integer, default 0)
      - `last_study_date` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `subject_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `subject_name` (text, required)
      - `progress_percentage` (numeric, default 0)
      - `completed_topics` (integer, default 0)
      - `total_topics` (integer, default 0)
      - `last_accessed` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `study_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `session_type` (text, check constraint)
      - `subject` (text, required)
      - `duration_minutes` (integer, required)
      - `score` (numeric, optional)
      - `session_date` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Create storage bucket and policies for profile pictures

  3. Functions
    - Create trigger function for updating timestamps
    - Add triggers to automatically update `updated_at` columns
*/

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  grade text NOT NULL,
  board text DEFAULT '',
  area text DEFAULT '',
  profile_picture_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own profiles
CREATE POLICY "Users can manage own profile"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create user_progress_stats table
CREATE TABLE IF NOT EXISTS user_progress_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  study_streak_days integer DEFAULT 0,
  total_study_time_minutes integer DEFAULT 0,
  completed_lessons integer DEFAULT 0,
  total_tests_taken integer DEFAULT 0,
  average_test_score numeric DEFAULT 0,
  ai_sessions_count integer DEFAULT 0,
  weekly_study_time integer DEFAULT 0,
  monthly_study_time integer DEFAULT 0,
  last_study_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_progress_stats ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own progress
CREATE POLICY "Users can manage own progress"
  ON user_progress_stats
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_progress_stats_updated_at
  BEFORE UPDATE ON user_progress_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create subject_progress table
CREATE TABLE IF NOT EXISTS subject_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_name text NOT NULL,
  progress_percentage numeric DEFAULT 0,
  completed_topics integer DEFAULT 0,
  total_topics integer DEFAULT 0,
  last_accessed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, subject_name)
);

-- Enable RLS
ALTER TABLE subject_progress ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own subject progress
CREATE POLICY "Users can manage own subject progress"
  ON subject_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_subject_progress_updated_at
  BEFORE UPDATE ON subject_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type text NOT NULL CHECK (session_type IN ('lesson', 'test', 'ai_tutor', 'materials')),
  subject text NOT NULL,
  duration_minutes integer NOT NULL,
  score numeric,
  session_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own study sessions
CREATE POLICY "Users can manage own study sessions"
  ON study_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for profile picture uploads
CREATE POLICY "Users can upload own profile pictures"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy for profile picture updates
CREATE POLICY "Users can update own profile pictures"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy for profile picture deletion
CREATE POLICY "Users can delete own profile pictures"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy for public profile picture access
CREATE POLICY "Profile pictures are publicly accessible"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'profile-pictures');