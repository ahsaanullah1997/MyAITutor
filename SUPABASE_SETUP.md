# 🚨 URGENT: Supabase Setup Required

Your application is currently unable to connect to Supabase. The project `wunjmzwudxfqdswvadmp` appears to be inactive or deleted.

## Quick Fix Steps

### Step 1: Create or Access Your Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Either:
   - **If you have an existing project**: Select it from your dashboard
   - **If you need a new project**: Click "New Project" and create one

### Step 2: Get Your Credentials
1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIs...`)

### Step 3: Update Your .env File
Replace the placeholder values in your `.env` file:

```env
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-anon-key
```

### Step 4: Configure Authentication
1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add: `http://localhost:5173`
3. Turn OFF "Enable email confirmations" for development

### Step 5: Set Up Database Tables
1. Go to **SQL Editor** in your Supabase dashboard
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

-- Create policy for users to manage their own profiles
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

-- Create policy for progress stats
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
  progress_percentage numeric DEFAULT 0,
  completed_topics integer DEFAULT 0,
  total_topics integer DEFAULT 0,
  last_accessed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, subject_name)
);

-- Enable RLS
ALTER TABLE subject_progress ENABLE ROW LEVEL SECURITY;

-- Create policy for subject progress
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
  score numeric,
  session_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for study sessions
CREATE POLICY "Users can manage own study sessions"
  ON study_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### Step 6: Restart Your App
After updating the `.env` file:
1. Stop your development server (Ctrl+C)
2. Start it again: `npm run dev`

## ⚠️ Important Notes

- **Never commit real credentials to version control**
- The `.env` file should be in your `.gitignore`
- Use your **anon public key**, not the service role key
- Make sure your Supabase project is not paused

## Troubleshooting

### Still getting "Failed to fetch"?
- Double-check your project URL format
- Ensure your Supabase project is active (not paused)
- Verify you're using the correct anon key
- Check your internet connection

### Database errors?
- Make sure you've run the SQL commands above
- Check that RLS policies are properly set up
- Verify your project has the required tables

### Need help?
1. Check the browser console for detailed error messages
2. Verify your Supabase project status in the dashboard
3. Ensure all environment variables are correctly formatted

Once you complete these steps, your authentication and database should work properly!