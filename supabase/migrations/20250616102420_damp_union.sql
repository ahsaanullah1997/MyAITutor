/*
  # Create profile pictures storage bucket

  1. Storage Setup
    - Create `profile-pictures` bucket for storing user profile images
    - Set bucket to be publicly accessible for profile picture viewing
    - Configure appropriate file size and type restrictions

  2. Security Policies
    - Allow authenticated users to upload their own profile pictures
    - Allow public read access to profile pictures
    - Restrict file uploads to image types only
    - Set maximum file size limit

  3. Bucket Configuration
    - Enable public access for profile picture viewing
    - Set appropriate MIME type restrictions
    - Configure file size limits (5MB max)
*/

-- Create the profile-pictures bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pictures',
  'profile-pictures', 
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own profile pictures
CREATE POLICY "Users can upload own profile picture"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own profile pictures
CREATE POLICY "Users can update own profile picture"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own profile pictures
CREATE POLICY "Users can delete own profile picture"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to profile pictures
CREATE POLICY "Public can view profile pictures"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');