# 🚨 URGENT: Fix Supabase Connection

Your Supabase project `wunjmzwudxfqdswvadmp` is not responding. Here's how to fix it:

## Step 1: Check Your Project Status

1. **Go to [https://supabase.com](https://supabase.com)** and sign in
2. **Look for project ID**: `wunjmzwudxfqdswvadmp`
3. **Check if it exists and is active**

## Step 2: If Project is Missing/Deleted

If you can't find the project, it was likely deleted. Create a new one:

1. Click **"New Project"** in Supabase dashboard
2. Choose any name and region
3. Wait for project to be created
4. Go to **Settings** → **API**
5. Copy the **Project URL** and **anon public key**

## Step 3: Update Your .env File

Replace the values in your `.env` file with the correct ones:

```env
VITE_SUPABASE_URL=https://your-new-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...your-real-anon-key
```

## Step 4: Set Up Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Run this SQL to create the required tables:

```sql
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

-- Create policies
CREATE POLICY "Users can manage own profile"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

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

-- Create policies
CREATE POLICY "Users can manage own progress"
  ON user_progress_stats
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create subject_progress table
CREATE TABLE IF NOT EXISTS subject_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_name text NOT NULL,
  progress_percentage integer DEFAULT 0,
  completed_topics integer DEFAULT 0,
  total_topics integer DEFAULT 0,
  last_accessed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, subject_name)
);

-- Enable RLS
ALTER TABLE subject_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own subject progress"
  ON subject_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type text NOT NULL CHECK (session_type IN ('lesson', 'test', 'ai_tutor', 'materials')),
  subject text NOT NULL,
  duration_minutes integer NOT NULL,
  score integer,
  session_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own study sessions"
  ON study_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

## Step 5: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Under **Site URL**, add: `http://localhost:5173`
3. Turn OFF "Enable email confirmations"
4. Click **Save**

## Step 6: Restart Development Server

```bash
npm run dev
```

## Quick Test

After completing the steps above, open your browser console and run:

```javascript
fetch(import.meta.env.VITE_SUPABASE_URL + '/rest/v1/')
  .then(r => console.log('✅ Connection OK:', r.status))
  .catch(e => console.log('❌ Still failing:', e.message));
```

If you still get errors, the project URL or API key is incorrect.