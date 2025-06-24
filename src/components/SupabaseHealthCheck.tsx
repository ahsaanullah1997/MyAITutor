import React, { useEffect, useState } from 'react';
import { checkSupabaseHealth, getHealthStatusMessage, type SupabaseHealthCheck } from '../lib/supabase-health';

export function SupabaseHealthCheck() {
  const [health, setHealth] = useState<SupabaseHealthCheck | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const runHealthCheck = async () => {
      setIsChecking(true);
      try {
        const result = await checkSupabaseHealth();
        setHealth(result);
      } catch (error) {
        setHealth({
          isConnected: false,
          projectStatus: 'error',
          tablesExist: false,
          authConfigured: false,
          error: error instanceof Error ? error.message : 'Health check failed'
        });
      } finally {
        setIsChecking(false);
      }
    };

    runHealthCheck();
  }, []);

  if (isChecking) {
    return (
      <div className="fixed top-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-4 max-w-md z-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-800 font-medium">Checking Supabase connection...</span>
        </div>
      </div>
    );
  }

  if (!health || health.isConnected) {
    return null; // Don't show anything if connection is healthy
  }

  const statusMessage = getHealthStatusMessage(health);
  const isUrgent = health.projectStatus === 'paused' || !health.isConnected;

  return (
    <div className={`fixed top-4 right-4 border rounded-lg p-4 max-w-md z-50 ${
      isUrgent 
        ? 'bg-red-50 border-red-300' 
        : 'bg-yellow-50 border-yellow-300'
    }`}>
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <span className="text-2xl">{isUrgent ? '🚨' : '⚠️'}</span>
          <div className="flex-1">
            <h3 className={`font-bold ${isUrgent ? 'text-red-800' : 'text-yellow-800'}`}>
              Supabase Connection Issue
            </h3>
            <p className={`text-sm mt-1 ${isUrgent ? 'text-red-700' : 'text-yellow-700'}`}>
              {statusMessage}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs space-y-1">
            <div className={`flex items-center space-x-2 ${health.isConnected ? 'text-green-600' : 'text-red-600'}`}>
              <span>{health.isConnected ? '✅' : '❌'}</span>
              <span>Connection: {health.isConnected ? 'OK' : 'Failed'}</span>
            </div>
            <div className={`flex items-center space-x-2 ${health.projectStatus === 'active' ? 'text-green-600' : 'text-red-600'}`}>
              <span>{health.projectStatus === 'active' ? '✅' : '❌'}</span>
              <span>Project: {health.projectStatus}</span>
            </div>
            <div className={`flex items-center space-x-2 ${health.tablesExist ? 'text-green-600' : 'text-yellow-600'}`}>
              <span>{health.tablesExist ? '✅' : '⚠️'}</span>
              <span>Tables: {health.tablesExist ? 'OK' : 'Missing'}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              <strong>Quick Fix:</strong> Go to{' '}
              <a 
                href="https://supabase.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                supabase.com
              </a>
              {health.projectStatus === 'paused' && ' and resume your project'}
            </p>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className={`w-full px-3 py-2 text-sm font-medium rounded-md ${
            isUrgent
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-yellow-600 text-white hover:bg-yellow-700'
          }`}
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
}