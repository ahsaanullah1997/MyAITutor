# 🚨 IMMEDIATE ACTION REQUIRED: Fix Supabase Connection

Your application cannot connect to Supabase. Follow these steps **in order**:

## Step 1: Check Your Supabase Project Status (CRITICAL)

1. **Go to [https://supabase.com](https://supabase.com)** and sign in
2. **Look for your project**: `wunjmzwudxfqdswvadmp`
3. **Check the project status**:
   - ✅ **If ACTIVE**: Continue to Step 2
   - ⚠️ **If PAUSED**: Click "Resume" button to reactivate
   - ❌ **If DELETED/NOT FOUND**: You need to create a new project (see Step 1b)

### Step 1b: If Project is Deleted/Missing
1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Copy the new **Project URL** and **anon key** from Settings → API
3. Update your `.env` file with the new credentials
4. Continue to Step 2

## Step 2: Verify Database Setup

1. In your Supabase dashboard, go to **SQL Editor**
2. Run this query to check if tables exist:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('user_profiles', 'subject_progress', 'study_sessions', 'user_progress_stats');
   ```
3. **If no tables found**: Run the migration from `supabase/migrations/` folder
4. **If tables exist**: Continue to Step 3

## Step 3: Configure Authentication

1. Go to **Authentication** → **Settings** in Supabase
2. Under **Site URL**, add: `http://localhost:5173`
3. **Turn OFF** "Enable email confirmations" for development
4. Click **Save**

## Step 4: Test Connection

1. **Restart your dev server**: Stop and run `npm run dev` again
2. **Check browser console** for any remaining errors
3. **Try accessing**: `http://localhost:5173/dashboard`

## Quick Diagnostic Commands

Run these in your browser console to diagnose:

```javascript
// Test 1: Check environment variables
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// Test 2: Test basic connectivity
fetch('https://wunjmzwudxfqdswvadmp.supabase.co/rest/v1/')
  .then(r => console.log('Connection OK:', r.status))
  .catch(e => console.log('Connection FAILED:', e.message));
```

## Most Common Causes & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Failed to fetch" | Project paused/deleted | Resume or recreate project |
| "Database table not found" | Migration not run | Run SQL migration |
| "Auth session missing" | Wrong site URL | Add localhost:5173 to auth settings |
| "Invalid credentials" | Wrong API keys | Update .env with correct keys |

## Emergency Fallback

If nothing works, create a completely new Supabase project:

1. Go to [https://supabase.com](https://supabase.com)
2. Create new project
3. Copy URL and anon key to `.env`
4. Run all migrations from `supabase/migrations/`
5. Configure authentication settings
6. Restart dev server

**The most likely issue is that your Supabase project is paused or deleted. Check this first!**