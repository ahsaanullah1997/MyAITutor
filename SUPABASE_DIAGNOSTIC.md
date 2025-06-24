# 🔧 Supabase Connection Diagnostic & Fix

## Current Status: CONNECTION FAILED ❌

Your application cannot connect to Supabase. Follow these steps in order:

## Step 1: Check Supabase Project Status (CRITICAL)

1. **Go to [https://supabase.com](https://supabase.com)** and sign in
2. **Look for your project**: `wunjmzwudxfqdswvadmp`
3. **Check project status**:
   - ✅ **ACTIVE**: Project is running (continue to Step 2)
   - ⚠️ **PAUSED**: Click "Resume" button (MOST COMMON ISSUE)
   - ❌ **DELETED/NOT FOUND**: Create new project (see Step 1b)

### Step 1b: If Project is Missing/Deleted
1. Create new project at [https://supabase.com](https://supabase.com)
2. Copy **Project URL** and **anon key** from Settings → API
3. Update `.env` file with new credentials
4. Continue to Step 2

## Step 2: Verify Environment Variables

Check your `.env` file contains valid credentials:

```env
VITE_SUPABASE_URL=https://wunjmzwudxfqdswvadmp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

**If you created a new project, update these values!**

## Step 3: Test Connection

Run this in your browser console to test connectivity:

```javascript
// Test basic connection
fetch('https://wunjmzwudxfqdswvadmp.supabase.co/rest/v1/')
  .then(r => console.log('✅ Connection OK:', r.status))
  .catch(e => console.log('❌ Connection FAILED:', e.message));

// Check environment variables
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

## Step 4: Run Database Migration

1. Go to **SQL Editor** in Supabase dashboard
2. Run this query to check if tables exist:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'subject_progress', 'study_sessions', 'user_progress_stats');
```

3. **If no tables found**: Run the migration from `supabase/migrations/` folder
4. **If tables exist**: Continue to Step 5

## Step 5: Configure Authentication

1. Go to **Authentication** → **Settings** in Supabase
2. Under **Site URL**, add: `http://localhost:5173`
3. **Turn OFF** "Enable email confirmations"
4. Click **Save**

## Step 6: Restart Development Server

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

## Quick Diagnostic Checklist

- [ ] Supabase project is ACTIVE (not paused/deleted)
- [ ] `.env` has correct URL and API key
- [ ] Database tables exist
- [ ] Authentication configured with localhost:5173
- [ ] Development server restarted

## Common Error Solutions

| Error | Cause | Fix |
|-------|-------|-----|
| "Failed to fetch" | Project paused/deleted | Resume or recreate project |
| "Cannot connect to Supabase database" | Wrong credentials | Update .env file |
| "Database table not found" | Missing migration | Run SQL migration |
| "Auth session missing" | Wrong site URL | Add localhost:5173 to auth |

## Emergency Reset (If Nothing Works)

1. Create completely new Supabase project
2. Copy new URL and anon key to `.env`
3. Run all migrations from `supabase/migrations/`
4. Configure authentication settings
5. Restart dev server

**90% of issues are caused by paused projects. Check this first!**