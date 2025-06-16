import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface AuthRedirectProps {
  children: React.ReactNode
}

export const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { user, profile, loading } = useAuth()

  useEffect(() => {
    // Only redirect if user is authenticated and we're on a public page
    if (!loading && user) {
      const currentPath = window.location.pathname
      const publicPaths = ['/', '/features', '/about', '/contact', '/pricing', '/privacy', '/terms', '/login', '/signup']
      
      // If user is on a public page, redirect to dashboard or profile completion
      if (publicPaths.includes(currentPath)) {
        // Check if user has completed their profile
        if (!profile || !profile.grade) {
          // User hasn't completed profile, redirect to profile completion
          window.location.href = '/complete-profile'
        } else {
          // User has completed profile, redirect to dashboard
          window.location.href = '/dashboard'
        }
      }
    }
  }, [user, profile, loading])

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f1419]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#3f8cbf] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white [font-family:'Lexend',Helvetica]">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}