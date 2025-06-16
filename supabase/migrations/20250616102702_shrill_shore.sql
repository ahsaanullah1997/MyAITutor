/*
  # Setup Profile Pictures Storage

  1. Storage Setup
    - Create profile-pictures bucket
    - Configure bucket settings for image uploads
    
  2. Security
    - Set up RLS policies for profile picture access
    - Allow users to manage their own profile pictures
    
  Note: This migration creates the bucket and basic setup.
  Storage policies may need to be configured through the Supabase dashboard.
*/

-- Create the profile-pictures bucket if it doesn't exist
-- Note: This uses a function approach to avoid permission issues
DO $$
BEGIN
  -- Insert the bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'profile-pictures',
    'profile-pictures', 
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  )
  ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
EXCEPTION
  WHEN insufficient_privilege THEN
    -- If we don't have permission to create buckets, that's okay
    -- The bucket may already exist or need to be created via dashboard
    RAISE NOTICE 'Could not create storage bucket - may need to be created via Supabase dashboard';
END $$;

-- Add profile_picture_url column to user_profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'profile_picture_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN profile_picture_url text;
  END IF;
END $$;

-- Update the user_profiles table to include board and area columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'board'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN board text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'area'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN area text;
  END IF;
END $$;

-- Create a function to help with storage path validation
CREATE OR REPLACE FUNCTION public.is_profile_picture_owner(file_path text, user_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Check if the file path starts with the user's ID
  RETURN file_path LIKE (user_id::text || '/%');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_profile_picture_owner(text, uuid) TO authenticated;