/*
  # Add subject group and subjects columns to user_databases table

  1. Changes
    - Add `subject_group` column (text, nullable) to store the selected subject group
    - Add `subjects` column (text array, default empty) to store the array of subjects
    
  2. Notes
    - Adding to user_databases table which is the correct table based on the schema
    - Columns are nullable to maintain compatibility with existing records
    - Subjects array defaults to empty array
*/

-- Add subject_group column to store the selected group
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_databases' AND column_name = 'subject_group'
  ) THEN
    ALTER TABLE user_databases ADD COLUMN subject_group text;
  END IF;
END $$;

-- Add subjects column to store the array of subjects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_databases' AND column_name = 'subjects'
  ) THEN
    ALTER TABLE user_databases ADD COLUMN subjects text[] DEFAULT '{}';
  END IF;
END $$;