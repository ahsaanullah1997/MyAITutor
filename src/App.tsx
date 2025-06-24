import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthRedirect } from './components/AuthRedirect';
import { SupabaseHealthCheck } from './components/SupabaseHealthCheck';

// Import screens
import { StitchDesign } from './screens/StitchDesign';
import { AboutUsPage } from './screens/AboutUsPage';
import { FeaturesPage } from './screens/FeaturesPage';
import { PricingPage } from './screens/PricingPage';
import { ContactPage } from './screens/ContactPage';
import { HelpCenterPage } from './screens/HelpCenterPage';
import { PrivacyPolicyPage } from './screens/PrivacyPolicyPage';
import { TermsOfServicePage } from './screens/TermsOfServicePage';

// Import auth screens
import { LoginPage } from './screens/AuthPage/LoginPage';
import { SignUpPage } from './screens/AuthPage/SignUpPage';
import { CompleteProfilePage } from './screens/AuthPage/CompleteProfilePage';

// Import dashboard
import { Dashboard } from './screens/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <SupabaseHealthCheck />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<StitchDesign />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />

            {/* Auth routes */}
            <Route 
              path="/login" 
              element={
                <AuthRedirect>
                  <LoginPage />
                </AuthRedirect>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <AuthRedirect>
                  <SignUpPage />
                </AuthRedirect>
              } 
            />
            <Route 
              path="/complete-profile" 
              element={
                <ProtectedRoute>
                  <CompleteProfilePage />
                </ProtectedRoute>
              } 
            />

            {/* Protected dashboard routes */}
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;