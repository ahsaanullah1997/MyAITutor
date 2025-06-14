import React from 'react'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { user, loading } = useAuth()

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

  if (!user) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-[#0f1419]">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold [font-family:'Lexend',Helvetica] mb-4">
            Access Restricted
          </h2>
          <p className="text-[#9eafbf] [font-family:'Lexend',Helvetica] mb-6">
            Please sign in to access this page.
          </p>
          <a 
            href="/login" 
            className="inline-block px-6 py-3 bg-[#3f8cbf] text-white rounded-lg [font-family:'Lexend',Helvetica] font-bold hover:bg-[#2d6a94] transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}