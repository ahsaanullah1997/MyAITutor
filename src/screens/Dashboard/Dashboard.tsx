import React from "react";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardOverview } from "./sections/DashboardOverview";
import { ProtectedRoute } from "../../components/ProtectedRoute";

export const Dashboard = (): JSX.Element => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardOverview />
      </DashboardLayout>
    </ProtectedRoute>
  );
};