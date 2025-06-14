import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { StitchDesign } from "./screens/StitchDesign";
import { FeaturesPage } from "./screens/FeaturesPage/index.ts";
import { AboutUsPage } from "./screens/AboutUsPage/index.ts";
import { ContactPage } from "./screens/ContactPage/index.ts";
import { PricingPage } from "./screens/PricingPage/index.ts";
import { PrivacyPolicyPage } from "./screens/PrivacyPolicyPage/index.ts";
import { TermsOfServicePage } from "./screens/TermsOfServicePage/index.ts";
import { SignUpPage, LoginPage } from "./screens/AuthPage/index.ts";
import { 
  Dashboard, 
  AITutorPage, 
  ProgressPage, 
  StudyMaterialsPage, 
  TestsPage, 
  SettingsPage 
} from "./screens/Dashboard/index.ts";

export const App = (): JSX.Element => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StitchDesign />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/ai-tutor" element={<AITutorPage />} />
          <Route path="/dashboard/progress" element={<ProgressPage />} />
          <Route path="/dashboard/materials" element={<StudyMaterialsPage />} />
          <Route path="/dashboard/tests" element={<TestsPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};