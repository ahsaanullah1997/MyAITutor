/*
  # Create User Databases System

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
    - Enable RLS on user_databases table
    - Add policies for users to manage their own database records

  3. Functions
    - Create function for updating timestamps
    - Create function to manage user database creation
*/

-- Create or replace function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

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

-- Create function to create user database record
CREATE OR REPLACE FUNCTION create_user_database_record(
  p_user_id uuid,
  p_grade text,
  p_board text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  database_id uuid;
  database_name text;
BEGIN
  -- Generate database name
  database_name := 'user_' || replace(p_user_id::text, '-', '_') || '_db';
  
  -- Insert or update user database record
  INSERT INTO user_databases (user_id, database_name, grade, board)
  VALUES (p_user_id, database_name, p_grade, p_board)
  ON CONFLICT (user_id) DO UPDATE SET
    grade = p_grade,
    board = p_board,
    updated_at = now()
  RETURNING id INTO database_id;
  
  RETURN database_id;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION create_user_database_record(uuid, text, text) TO authenticated;