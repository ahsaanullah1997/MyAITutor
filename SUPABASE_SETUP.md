# Supabase Setup Instructions

Your application is currently using placeholder Supabase credentials, which is causing authentication errors. Follow these steps to set up Supabase properly:

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account or sign in if you already have one
3. Click "New Project" 
4. Choose your organization
5. Enter a project name (e.g., "my-learning-app")
6. Enter a database password (save this somewhere safe)
7. Choose a region close to your users
8. Click "Create new project"

## Step 2: Get Your Project Credentials

1. Once your project is created, go to your project dashboard
2. Click on "Settings" in the left sidebar
3. Click on "API" under Settings
4. You'll see two important values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public key** (a long string starting with `eyJ...`)

## Step 3: Update Your Environment Variables

Replace the placeholder values in your `.env` file with your actual Supabase credentials:

```env
# Replace these with your actual Supabase project credentials
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Set Up Authentication

1. In your Supabase dashboard, go to "Authentication" in the left sidebar
2. Click on "Settings" under Authentication
3. Make sure "Enable email confirmations" is turned OFF for development (you can enable it later)
4. Under "Site URL", add your local development URL: `http://localhost:5173`

## Step 5: Create Database Tables

Your app needs a `user_profiles` table. In your Supabase dashboard:

1. Go to "SQL Editor" in the left sidebar
2. Click "New query"
3. Run the migration that's already in your project at `supabase/migrations/20250614110210_small_river.sql`

## Step 6: Restart Your Development Server

After updating the `.env` file:
1. Stop your development server (Ctrl+C)
2. Restart it with `npm run dev`

## Troubleshooting

- Make sure there are no spaces around the `=` in your `.env` file
- Make sure your `.env` file is in the root directory of your project
- The environment variables must start with `VITE_` to be accessible in the browser
- If you're still having issues, check the browser console for more detailed error messages

Once you've completed these steps, your authentication should work properly!