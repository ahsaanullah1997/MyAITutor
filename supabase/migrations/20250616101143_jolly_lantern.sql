/*
  # Add board and area columns to user_profiles table

  1. Changes
    - Add `board` column (text, nullable) to store education board information
    - Add `area` column (text, nullable) to store regional area information
    - These columns support the Pakistani education system with board-specific content

  2. Notes
    - Columns are nullable to maintain compatibility with existing profiles
    - Users can update these fields through the profile completion or settings pages
    - Board field is used for Metric and FSc grade levels
    - Area field is used for Punjab and Sindh boards specifically
*/

-- Add board column to store education board information
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'board'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN board TEXT;
  END IF;
END $$;

-- Add area column to store regional area information  
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'area'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN area TEXT;
  END IF;
END $$;

-- Add profile_picture_url column for future profile picture functionality
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'profile_picture_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN profile_picture_url TEXT;
  END IF;
END $$;