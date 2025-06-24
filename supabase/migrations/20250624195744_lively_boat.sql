/*
  # Add subject group fields to user_profiles table

  1. Changes
    - Add `subject_group` column to store the selected subject group (e.g., 'science-biology', 'fsc-pre-medical')
    - Add `subjects` column to store the array of subjects for the selected group
    
  2. Notes
    - These fields are optional to maintain compatibility with existing profiles
    - Will be populated when users complete the subject group selection
*/

-- Add subject_group column to store the selected group
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'subject_group'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN subject_group text;
  END IF;
END $$;

-- Add subjects column to store the array of subjects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'subjects'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN subjects text[] DEFAULT '{}';
  END IF;
END $$;