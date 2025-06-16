import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthRedirect } from "./components/AuthRedirect";
import { StitchDesign } from "./screens/StitchDesign";
import { FeaturesPage } from "./screens/FeaturesPage/index.ts";
import { AboutUsPage } from "./screens/AboutUsPage/index.ts";
import { ContactPage } from "./screens/ContactPage/index.ts";
import { PricingPage } from "./screens/PricingPage/index.ts";
import { PrivacyPolicyPage } from "./screens/PrivacyPolicyPage/index.ts";
import { TermsOfServicePage } from "./screens/TermsOfServicePage/index.ts";
import { HelpCenterPage } from "./screens/HelpCenterPage/index.ts";
import { SignUpPage, LoginPage, CompleteProfilePage } from "./screens/AuthPage/index.ts";
import { 
  Dashboard, 
  AITutorPage, 
  ProgressPage, 
  StudyMaterialsPage, 
  TestsPage, 
  SettingsPage,
  ProfileInformationPage,
  PlanBillingPage,
  NotificationsPage,
  AccountActionsPage
} from "./screens/Dashboard/index.ts";

export const App = (): JSX.Element => {
  return (
    <AuthProvider>
      <Router>
        <AuthRedirect>
          <Routes>
            <Route path="/" element={<StitchDesign />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/complete-profile" element={<CompleteProfilePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/ai-tutor" element={<AITutorPage />} />
            <Route path="/dashboard/progress" element={<ProgressPage />} />
            <Route path="/dashboard/materials" element={<StudyMaterialsPage />} />
            <Route path="/dashboard/tests" element={<TestsPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="/dashboard/settings/profile" element={<ProfileInformationPage />} />
            <Route path="/dashboard/settings/billing" element={<PlanBillingPage />} />
            <Route path="/dashboard/settings/notifications" element={<NotificationsPage />} />
            <Route path="/dashboard/settings/account" element={<AccountActionsPage />} />
          </Routes>
        </AuthRedirect>
      </Router>
    </AuthProvider>
  );
};