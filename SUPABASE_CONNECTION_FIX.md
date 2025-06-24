# 🚨 CRITICAL: Supabase Connection Failed

Your application cannot connect to Supabase. This is **blocking all functionality**. Follow these steps **immediately**:

## 🔥 MOST LIKELY CAUSE: Project Paused or Deleted

### Step 1: Check Your Supabase Project Status (DO THIS FIRST!)

1. **Go to [https://supabase.com](https://supabase.com)** and sign in
2. **Look for your project**: `wunjmzwudxfqdswvadmp`
3. **Check the project status**:
   - ✅ **If ACTIVE**: Continue to Step 2
   - ⚠️ **If PAUSED**: Click "Resume" button to reactivate (MOST COMMON ISSUE)
   - ❌ **If DELETED/NOT FOUND**: You need to create a new project (see Step 1b)

### Step 1b: If Project is Deleted/Missing (Create New Project)
1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Copy the new **Project URL** and **anon key** from Settings → API
3. Update your `.env` file with the new credentials:
   ```
   VITE_SUPABASE_URL=https://your-new-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-new-anon-key
   ```
4. Continue to Step 2

## Step 2: Verify Environment Variables

Check your `.env` file contains:
```
VITE_SUPABASE_URL=https://wunjmzwudxfqdswvadmp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

**Common Issues:**
- Missing `.env` file
- Wrong project URL
- Expired or wrong API key
- Placeholder values still present

## Step 3: Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Run this query to check if tables exist:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('user_profiles', 'subject_progress', 'study_sessions', 'user_progress_stats');
   ```
3. **If no tables found**: Run the migration from `supabase/migrations/` folder
4. **If tables exist**: Continue to Step 4

## Step 4: Configure Authentication

1. Go to **Authentication** → **Settings** in Supabase
2. Under **Site URL**, add: `http://localhost:5173`
3. **Turn OFF** "Enable email confirmations" for development
4. Click **Save**

## Step 5: Test Connection

1. **Restart your dev server**: Stop and run `npm run dev` again
2. **Check browser console** for connection status
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

## Error Messages and Solutions

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Failed to fetch" | Project paused/deleted | Resume or recreate project |
| "Connection timeout" | Network/project issues | Check project status |
| "Database table not found" | Migration not run | Run SQL migration |
| "Auth session missing" | Wrong site URL | Add localhost:5173 to auth settings |
| "Invalid credentials" | Wrong API keys | Update .env with correct keys |

## Emergency Fallback (If Nothing Works)

Create a completely new Supabase project:

1. Go to [https://supabase.com](https://supabase.com)
2. Create new project (choose any name)
3. Copy URL and anon key to `.env`
4. Run all migrations from `supabase/migrations/`
5. Configure authentication settings
6. Restart dev server

## ⚡ Quick Fix Checklist

- [ ] Supabase project is ACTIVE (not paused)
- [ ] `.env` file has correct URL and API key
- [ ] Database tables exist (run migration if needed)
- [ ] Authentication configured with localhost:5173
- [ ] Development server restarted

**90% of connection issues are caused by paused Supabase projects. Check this first!**

## Need Immediate Help?

1. Check browser console for detailed error messages
2. Verify project status at https://supabase.com
3. Ensure `.env` file is properly configured
4. Run database migrations if tables are missing

Once you complete these steps, your connection should be restored!