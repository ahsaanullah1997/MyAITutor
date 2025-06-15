# Supabase Setup Instructions

Your application is experiencing connection errors to Supabase. This indicates either a configuration issue or that your Supabase project needs to be set up properly. Follow these steps:

## Current Issue
The app is showing "Failed to fetch" and "Unable to connect to the database" errors. This typically means:
1. Your Supabase project URL is incorrect or inaccessible
2. The database tables haven't been created yet
3. There's a network connectivity issue
4. Your Supabase project may be paused or deleted

## Step 1: Verify Your Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Check if your project `tcxvzebkuvjgiasvxepx` still exists and is active
3. If the project doesn't exist or is paused, you'll need to create a new one

## Step 2: Create a New Supabase Project (if needed)

If your project doesn't exist:
1. Click "New Project" 
2. Choose your organization
3. Enter a project name (e.g., "my-learning-app")
4. Enter a database password (save this somewhere safe)
5. Choose a region close to your users
6. Click "Create new project"

## Step 3: Get Your Project Credentials

1. Once your project is ready, go to your project dashboard
2. Click on "Settings" in the left sidebar
3. Click on "API" under Settings
4. Copy these two values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public key** (a long string starting with `eyJ...`)

## Step 4: Update Your Environment Variables

Update your `.env` file with your actual Supabase credentials:

```env
# Replace with your actual Supabase project credentials
VITE_SUPABASE_URL=https://your-new-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-actual-key
```

## Step 5: Set Up Authentication

1. In your Supabase dashboard, go to "Authentication" in the left sidebar
2. Click on "Settings" under Authentication
3. Make sure "Enable email confirmations" is turned OFF for development
4. Under "Site URL", add your local development URL: `http://localhost:5173`

## Step 6: Create Database Tables

Your app needs a `user_profiles` table:

1. Go to "SQL Editor" in the left sidebar
2. Click "New query"
3. Copy and paste the entire contents of `supabase/migrations/20250614110210_small_river.sql`
4. Click "Run" to execute the migration

## Step 7: Test the Connection

1. After updating the `.env` file, restart your development server:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```
2. Check the browser console for connection test results
3. The app should now connect successfully

## Troubleshooting

### If you still see connection errors:

1. **Check your internet connection** - Make sure you can access supabase.com
2. **Verify project status** - Ensure your Supabase project is active (not paused)
3. **Check the URL format** - Make sure it starts with `https://` and ends with `.supabase.co`
4. **Verify the API key** - Make sure you copied the "anon public" key, not the service role key
5. **Clear browser cache** - Sometimes old cached data can cause issues

### Common Error Messages:

- **"Failed to fetch"** - Usually means the project URL is wrong or the project doesn't exist
- **"relation 'user_profiles' does not exist"** - The database migration hasn't been run
- **"Connection timeout"** - Network issue or project is not responding

### Still having issues?

1. Try creating a completely new Supabase project
2. Make sure there are no spaces around the `=` in your `.env` file
3. Ensure your `.env` file is in the root directory of your project
4. Check that the environment variables start with `VITE_`

Once you've completed these steps, your authentication and database should work properly!