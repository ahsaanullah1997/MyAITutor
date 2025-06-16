import React, { useEffect } from "react";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardOverview } from "./sections/DashboardOverview";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";

export const Dashboard = (): JSX.Element => {
  const { user, profile, isNewUser, loading } = useAuth();

  useEffect(() => {
    // If user is new and hasn't completed profile, redirect to profile completion
    if (!loading && user && isNewUser && (!profile || !profile.grade)) {
      window.location.href = '/complete-profile';
    }
  }, [user, profile, isNewUser, loading]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardOverview />
      </DashboardLayout>
    </ProtectedRoute>
  );
};