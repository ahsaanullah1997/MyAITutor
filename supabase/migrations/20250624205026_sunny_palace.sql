/*
  # Add subject_group column to user_databases table

  1. Changes
    - Add `subject_group` column to store the selected subject group (e.g., 'pre-medical', 'pre-engineering')
    - This helps track which subject combination the user has chosen

  2. Notes
    - Column is nullable to maintain compatibility with existing records
    - Will be populated when users complete the subject group selection
*/

-- Add subject_group column to user_databases table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_databases' AND column_name = 'subject_group'
  ) THEN
    ALTER TABLE user_databases ADD COLUMN subject_group text;
  END IF;
END $$;