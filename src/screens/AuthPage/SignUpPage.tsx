import React, { useState } from "react";
import { HeroSection } from "../StitchDesign/sections/HeroSection/index.ts";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useAuth } from "../../contexts/AuthContext";

export const SignUpPage = (): JSX.Element => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExistingUserAction, setShowExistingUserAction] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
      setShowExistingUserAction(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowExistingUserAction(false);

    // Enhanced validation
    if (!formData.firstName.trim()) {
      setError("Please enter your first name");
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Please enter your last name");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.password.trim()) {
      setError("Please enter a password");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    setLoading(true);

    try {
      await signUp({
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        grade: '', // Will be set in profile completion
        board: '',
        area: '',
      });
      
      // Redirect to profile completion page
      window.location.href = '/complete-profile';
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred during sign up';
      setError(errorMessage);
      
      // Check if the error is about an existing user
      if (errorMessage.includes('already exists') || errorMessage.includes('already registered') || errorMessage.includes('User already registered')) {
        setShowExistingUserAction(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <main className="flex flex-col w-full theme-bg-primary min-h-screen">
      <HeroSection />
      
      <section className="flex items-center justify-center px-4 md:px-6 lg:px-10 py-8 md:py-20 w-full theme-bg-primary min-h-[calc(100vh-80px)]">
        <div className="flex flex-col max-w-[480px] w-full">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="[font-family:'Lexend',Helvetica] font-black theme-text-primary text-2xl sm:text-3xl md:text-4xl tracking-[-1.00px] leading-[1.1] mb-3 md:mb-4">
              Create Your Account
            </h1>
            <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-sm md:text-base tracking-[0] leading-6">
              Join thousands of students achieving academic excellence with AI-powered learning
            </p>
          </div>

          {/* Sign Up Form */}
          <Card className="theme-bg-secondary theme-border">
            <CardContent className="p-4 md:p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
                {/* Error Message */}
                {error && (
                  <div className="p-3 md:p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-xs md:text-sm [font-family:'Lexend',Helvetica] mb-3">
                      {error}
                    </p>
                    {showExistingUserAction && (
                      <Button
                        type="button"
                        onClick={handleGoToLogin}
                        className="w-full h-8 md:h-10 bg-red-500 hover:bg-red-600 rounded-lg [font-family:'Lexend',Helvetica] font-medium text-white transition-colors text-xs md:text-sm"
                      >
                        Go to Sign In Page
                      </Button>
                    )}
                  </div>
                )}

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs md:text-sm">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 theme-bg-primary theme-border border rounded-lg theme-text-primary placeholder-theme-text-muted focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica] text-sm md:text-base"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs md:text-sm">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 theme-bg-primary theme-border border rounded-lg theme-text-primary placeholder-theme-text-muted focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica] text-sm md:text-base"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs md:text-sm">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 theme-bg-primary theme-border border rounded-lg theme-text-primary placeholder-theme-text-muted focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica] text-sm md:text-base"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs md:text-sm">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 theme-bg-primary theme-border border rounded-lg theme-text-primary placeholder-theme-text-muted focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica] text-sm md:text-base"
                    placeholder="Create a strong password"
                  />
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs md:text-sm">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 theme-bg-primary theme-border border rounded-lg theme-text-primary placeholder-theme-text-muted focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica] text-sm md:text-base"
                    placeholder="Confirm your password"
                  />
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    required
                    className="w-4 h-4 md:w-5 md:h-5 mt-0.5 theme-bg-primary theme-border border rounded focus:border-[#3f8cbf] focus:outline-none"
                  />
                  <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs md:text-sm leading-5 md:leading-6">
                    I agree to the{" "}
                    <a href="/terms" className="text-[#3f8cbf] hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-[#3f8cbf] hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 md:h-12 bg-[#3f8cbf] hover:bg-[#2d6a94] rounded-lg [font-family:'Lexend',Helvetica] font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs md:text-sm">
                    Already have an account?{" "}
                    <a href="/login" className="text-[#3f8cbf] hover:underline font-medium">
                      Sign In
                    </a>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="mt-6 md:mt-8 text-center">
            <p className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs md:text-sm mb-3 md:mb-4">
              Why join MyEduPro?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full" />
                </div>
                <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs text-center">
                  AI-Powered Learning
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full" />
                </div>
                <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs text-center">
                  24/7 Support
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full" />
                </div>
                <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs text-center">
                  Proven Results
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};