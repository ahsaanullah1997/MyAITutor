import { supabase } from './supabase';

export interface SupabaseHealthCheck {
  isConnected: boolean;
  projectStatus: 'active' | 'paused' | 'error' | 'unknown';
  tablesExist: boolean;
  authConfigured: boolean;
  error?: string;
}

export async function checkSupabaseHealth(): Promise<SupabaseHealthCheck> {
  const result: SupabaseHealthCheck = {
    isConnected: false,
    projectStatus: 'unknown',
    tablesExist: false,
    authConfigured: false,
  };

  try {
    // Test basic connection
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
    
    if (error) {
      result.error = error.message;
      
      // Check for specific error types
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        result.projectStatus = 'paused';
        result.error = '🚨 Project appears to be PAUSED. Go to https://supabase.com and resume your project.';
      } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
        result.projectStatus = 'active';
        result.isConnected = true;
        result.tablesExist = false;
        result.error = '📋 Database tables missing. Run the migration in Supabase SQL Editor.';
      } else {
        result.error = `Database error: ${error.message}`;
      }
    } else {
      result.isConnected = true;
      result.projectStatus = 'active';
      result.tablesExist = true;
    }

    // Test auth configuration
    try {
      const { data: authData, error: authError } = await supabase.auth.getSession();
      result.authConfigured = !authError;
    } catch (authErr) {
      result.authConfigured = false;
    }

  } catch (err) {
    result.error = err instanceof Error ? err.message : 'Unknown connection error';
    
    if (result.error.includes('Failed to fetch')) {
      result.projectStatus = 'paused';
      result.error = '🚨 Cannot reach Supabase. Project may be PAUSED or DELETED. Check https://supabase.com';
    }
  }

  return result;
}

export function getHealthStatusMessage(health: SupabaseHealthCheck): string {
  if (!health.isConnected) {
    if (health.projectStatus === 'paused') {
      return '🚨 URGENT: Your Supabase project is PAUSED. Go to https://supabase.com and click "Resume" on your project.';
    }
    return '❌ Cannot connect to Supabase. Check your project status at https://supabase.com';
  }

  if (!health.tablesExist) {
    return '📋 Database tables missing. Run the migration in your Supabase SQL Editor.';
  }

  if (!health.authConfigured) {
    return '🔐 Authentication not configured. Add http://localhost:5173 to your Supabase auth settings.';
  }

  return '✅ Supabase connection healthy';
}