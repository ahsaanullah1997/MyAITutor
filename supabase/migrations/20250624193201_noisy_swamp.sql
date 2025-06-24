/*
  # Create User Databases Table

  1. New Tables
    - `user_databases`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `database_name` (text)
      - `grade` (text)
      - `board` (text, nullable)
      - `subjects` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_databases` table
    - Add policy for users to manage their own database records
*/

-- Create user_databases table
CREATE TABLE IF NOT EXISTS user_databases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  database_name text NOT NULL,
  grade text NOT NULL,
  board text,
  subjects text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_databases_user_id ON user_databases(user_id);

-- Enable Row Level Security
ALTER TABLE user_databases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_databases
CREATE POLICY "Users can view own database"
  ON user_databases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own database"
  ON user_databases
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own database"
  ON user_databases
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_user_databases_updated_at
  BEFORE UPDATE ON user_databases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create user database when profile is completed
CREATE OR REPLACE FUNCTION create_user_database_on_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create database if grade is being set for the first time or changed
  IF (OLD.grade IS NULL OR OLD.grade = '') AND NEW.grade IS NOT NULL AND NEW.grade != '' THEN
    -- Insert user database record
    INSERT INTO user_databases (user_id, database_name, grade, board)
    VALUES (
      NEW.id,
      'user_' || replace(NEW.id::text, '-', '_') || '_db',
      NEW.grade,
      NEW.board
    )
    ON CONFLICT (user_id) DO UPDATE SET
      grade = NEW.grade,
      board = NEW.board,
      updated_at = now();
  ELSIF OLD.grade != NEW.grade OR (OLD.board IS DISTINCT FROM NEW.board) THEN
    -- Update existing database record if grade or board changed
    UPDATE user_databases 
    SET 
      grade = NEW.grade,
      board = NEW.board,
      updated_at = now()
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically manage user database
DROP TRIGGER IF EXISTS create_user_database_trigger ON user_profiles;
CREATE TRIGGER create_user_database_trigger
  AFTER UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_database_on_profile_update();