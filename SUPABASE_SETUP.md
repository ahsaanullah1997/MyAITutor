# 🚨 URGENT: Supabase Setup Required

Your application is currently unable to connect to Supabase. Follow these steps to resolve the connection issues.

## Quick Fix Steps

### Step 1: Check Your Supabase Project Status
1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Check if your project `wunjmzwudxfqdswvadmp` is active
3. If the project is **paused**, click "Resume" to reactivate it
4. If the project is **deleted** or doesn't exist, create a new project

### Step 2: Verify Your Credentials
1. In your Supabase project dashboard, go to **Settings** → **API**
2. Verify these values match your `.env` file:
   - **Project URL**: Should be `https://wunjmzwudxfqdswvadmp.supabase.co`
   - **anon public key**: Should start with `eyJhbGciOiJIUzI1NiIs...`

### Step 3: Run Database Migration
The database schema needs to be updated to fix foreign key references. Run this SQL in your Supabase SQL Editor:

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query and paste the contents of `supabase/migrations/fix_database_schema.sql`
3. Click "Run" to execute the migration

### Step 4: Configure Authentication
1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add: `http://localhost:5173`
3. Turn OFF "Enable email confirmations" for development
4. Save the settings

### Step 5: Test the Connection
1. Restart your development server: `npm run dev`
2. Try to access the dashboard at `http://localhost:5173/dashboard`
3. Check the browser console for any remaining errors

## Common Issues and Solutions

### "Failed to fetch" Error
- **Cause**: Supabase project is paused, deleted, or network issues
- **Solution**: Check project status on Supabase dashboard, ensure project is active

### "Database table not found" Error
- **Cause**: Database migration hasn't been run
- **Solution**: Run the SQL migration in `supabase/migrations/fix_database_schema.sql`

### "Auth session missing" Error
- **Cause**: Authentication not properly configured
- **Solution**: Check authentication settings and site URL configuration

### Foreign Key Constraint Errors
- **Cause**: Database schema references wrong tables
- **Solution**: The migration fixes foreign key references to use `auth.users` instead of `user_profiles`

## Database Schema Overview

After running the migration, your database will have:

1. **user_profiles** - User profile information
2. **user_progress_stats** - Overall progress statistics
3. **subject_progress** - Progress per subject
4. **study_sessions** - Individual study session records

All tables have proper Row Level Security (RLS) policies that ensure users can only access their own data.

## Important Notes

- **Never use your `service_role` key in frontend code** - only use the `anon` public key
- The anon key is safe to use in frontend code as it has limited permissions
- Make sure your Supabase project is not paused (check the dashboard)
- If you create a new project, update the `.env` file with new credentials

## Need Help?

1. Check the browser console for detailed error messages
2. Verify your Supabase project status in the dashboard
3. Ensure all environment variables are correctly formatted
4. Make sure the database migration has been run successfully

Once you complete these steps, your authentication and database should work properly!