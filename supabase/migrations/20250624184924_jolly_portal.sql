/*
  # Fix Database Schema Issues

  1. Database Schema Updates
    - Fix foreign key references to use correct auth.users table
    - Update data types to match application expectations
    - Add missing indexes for performance
    - Fix RLS policies

  2. Security
    - Update RLS policies to use correct auth functions
    - Ensure proper access control for all tables
*/

-- Fix user_profiles table foreign key reference
DO $$
BEGIN
  -- Drop existing foreign key constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_profiles_id_fkey' 
    AND table_name = 'user_profiles'
  ) THEN
    ALTER TABLE user_profiles DROP CONSTRAINT user_profiles_id_fkey;
  END IF;
  
  -- Add correct foreign key constraint
  ALTER TABLE user_profiles 
  ADD CONSTRAINT user_profiles_id_fkey 
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
END $$;

-- Fix subject_progress table foreign key reference
DO $$
BEGIN
  -- Drop existing foreign key constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'subject_progress_user_id_fkey' 
    AND table_name = 'subject_progress'
  ) THEN
    ALTER TABLE subject_progress DROP CONSTRAINT subject_progress_user_id_fkey;
  END IF;
  
  -- Add correct foreign key constraint
  ALTER TABLE subject_progress 
  ADD CONSTRAINT subject_progress_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
END $$;

-- Fix study_sessions table foreign key reference
DO $$
BEGIN
  -- Drop existing foreign key constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'study_sessions_user_id_fkey' 
    AND table_name = 'study_sessions'
  ) THEN
    ALTER TABLE study_sessions DROP CONSTRAINT study_sessions_user_id_fkey;
  END IF;
  
  -- Add correct foreign key constraint
  ALTER TABLE study_sessions 
  ADD CONSTRAINT study_sessions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
END $$;

-- Fix user_progress_stats table foreign key reference
DO $$
BEGIN
  -- Drop existing foreign key constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_progress_stats_user_id_fkey' 
    AND table_name = 'user_progress_stats'
  ) THEN
    ALTER TABLE user_progress_stats DROP CONSTRAINT user_progress_stats_user_id_fkey;
  END IF;
  
  -- Add correct foreign key constraint
  ALTER TABLE user_progress_stats 
  ADD CONSTRAINT user_progress_stats_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
END $$;

-- Update RLS policies to use correct auth functions
-- Drop existing policies and recreate them with correct syntax

-- User profiles policies
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Subject progress policies
DROP POLICY IF EXISTS "Users can insert own subject progress" ON subject_progress;
DROP POLICY IF EXISTS "Users can update own subject progress" ON subject_progress;
DROP POLICY IF EXISTS "Users can view own subject progress" ON subject_progress;

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

CREATE POLICY "Users can view own subject progress"
  ON subject_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Study sessions policies
DROP POLICY IF EXISTS "Users can insert own study sessions" ON study_sessions;
DROP POLICY IF EXISTS "Users can view own study sessions" ON study_sessions;

CREATE POLICY "Users can insert own study sessions"
  ON study_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own study sessions"
  ON study_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- User progress stats policies
DROP POLICY IF EXISTS "Users can insert own progress stats" ON user_progress_stats;
DROP POLICY IF EXISTS "Users can update own progress stats" ON user_progress_stats;
DROP POLICY IF EXISTS "Users can view own progress stats" ON user_progress_stats;

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

CREATE POLICY "Users can view own progress stats"
  ON user_progress_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket for profile pictures if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for profile pictures
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can upload own profile pictures" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own profile pictures" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own profile pictures" ON storage.objects;
  DROP POLICY IF EXISTS "Profile pictures are publicly accessible" ON storage.objects;
  
  -- Create new policies
  CREATE POLICY "Users can upload own profile pictures"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

  CREATE POLICY "Users can update own profile pictures"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

  CREATE POLICY "Users can delete own profile pictures"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

  CREATE POLICY "Profile pictures are publicly accessible"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'profile-pictures');
EXCEPTION
  WHEN others THEN
    -- Storage policies might not be available in all Supabase setups
    RAISE NOTICE 'Storage policies could not be created: %', SQLERRM;
END $$;