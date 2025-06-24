import React, { useEffect } from "react";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardOverview } from "./sections/DashboardOverview";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import { SubjectGroupService } from "../../services/subjectGroupService";

export const Dashboard = (): JSX.Element => {
  const { user, profile, isNewUser, hasSubjectGroup, loading } = useAuth();

  useEffect(() => {
    // If user is new and hasn't completed profile, redirect to profile completion
    if (!loading && user && (isNewUser || !profile || !profile.grade)) {
      window.location.href = '/complete-profile';
      return;
    }

    // If profile is complete but needs subject group selection and doesn't have it
    if (!loading && user && profile && profile.grade && 
        SubjectGroupService.requiresSubjectGroupSelection(profile.grade) && 
        !hasSubjectGroup) {
      window.location.href = '/subject-group';
      return;
    }
  }, [user, profile, isNewUser, hasSubjectGroup, loading]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardOverview />
      </DashboardLayout>
    </ProtectedRoute>
  );
};