import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { SubjectGroupService } from '../services/subjectGroupService'

interface AuthRedirectProps {
  children: React.ReactNode
}

export const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const { user, profile, loading, isNewUser, hasSubjectGroup } = useAuth()

  useEffect(() => {
    // Only redirect if user is authenticated and we're not loading
    if (!loading && user) {
      const currentPath = window.location.pathname
      const authPages = ['/login', '/signup']
      const profilePages = ['/complete-profile', '/subject-group']
      const dashboardPages = ['/dashboard']
      
      // If user is on auth pages, redirect based on profile completion status
      if (authPages.includes(currentPath)) {
        if (isNewUser || !profile || !profile.grade) {
          // New user or incomplete profile - go to profile completion
          window.location.href = '/complete-profile'
        } else if (profile.grade && SubjectGroupService.requiresSubjectGroupSelection(profile.grade) && !hasSubjectGroup) {
          // Profile complete but needs subject group selection
          window.location.href = '/subject-group'
        } else {
          // Everything complete - go to dashboard
          window.location.href = '/dashboard'
        }
        return
      }

      // If user is on dashboard but hasn't completed required steps, redirect appropriately
      if (dashboardPages.some(page => currentPath.startsWith(page))) {
        if (isNewUser || !profile || !profile.grade) {
          // Incomplete profile - redirect to profile completion
          window.location.href = '/complete-profile'
        } else if (profile.grade && SubjectGroupService.requiresSubjectGroupSelection(profile.grade) && !hasSubjectGroup) {
          // Profile complete but needs subject group selection
          window.location.href = '/subject-group'
        }
        // If everything is complete, stay on dashboard
        return
      }

      // If user is on profile completion page but already has complete profile
      if (currentPath === '/complete-profile' && profile && profile.grade && !isNewUser) {
        if (SubjectGroupService.requiresSubjectGroupSelection(profile.grade) && !hasSubjectGroup) {
          // Profile complete but needs subject group selection
          window.location.href = '/subject-group'
        } else {
          // Everything complete - go to dashboard
          window.location.href = '/dashboard'
        }
        return
      }

      // If user is on subject group page but doesn't need it or already has it
      if (currentPath === '/subject-group') {
        if (!profile || !profile.grade) {
          // No profile - go to profile completion
          window.location.href = '/complete-profile'
        } else if (!SubjectGroupService.requiresSubjectGroupSelection(profile.grade) || hasSubjectGroup) {
          // Doesn't need subject group or already has it - go to dashboard
          window.location.href = '/dashboard'
        }
        // If needs subject group and doesn't have it, stay on subject group page
        return
      }
    }
  }, [user, profile, loading, isNewUser, hasSubjectGroup])

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