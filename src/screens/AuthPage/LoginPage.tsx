import React, { useState } from "react";
import { HeroSection } from "../StitchDesign/sections/HeroSection/index.ts";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useAuth } from "../../contexts/AuthContext";

export const LoginPage = (): JSX.Element => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic validation
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await signIn({
        email: formData.email.trim(),
        password: formData.password,
      });
      
      // Redirect to dashboard immediately - don't wait for profile load
      window.location.href = '/dashboard';
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign in');
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col w-full theme-bg-primary min-h-screen">
      <HeroSection />
      
      <section className="flex items-center justify-center px-4 md:px-6 lg:px-10 py-8 md:py-20 w-full theme-bg-primary min-h-[calc(100vh-80px)]">
        <div className="flex flex-col max-w-[420px] w-full">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="[font-family:'Lexend',Helvetica] font-black theme-text-primary text-2xl sm:text-3xl md:text-4xl tracking-[-1.00px] leading-[1.1] mb-3 md:mb-4">
              Welcome Back
            </h1>
            <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-sm md:text-base tracking-[0] leading-6">
              Sign in to continue your learning journey with MyEduPro
            </p>
          </div>

          {/* Login Form */}
          <Card className="theme-bg-secondary theme-border">
            <CardContent className="p-4 md:p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
                {/* Error Message */}
                {error && (
                  <div className="p-3 md:p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-xs md:text-sm [font-family:'Lexend',Helvetica]">
                      {error}
                    </p>
                  </div>
                )}

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs md:text-sm">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    autoComplete="email"
                    className="w-full px-3 md:px-4 py-2 md:py-3 theme-bg-primary theme-border border rounded-lg theme-text-primary placeholder-theme-text-muted focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica] text-sm md:text-base"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs md:text-sm">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    autoComplete="current-password"
                    className="w-full px-3 md:px-4 py-2 md:py-3 theme-bg-primary theme-border border rounded-lg theme-text-primary placeholder-theme-text-muted focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica] text-sm md:text-base"
                    placeholder="Enter your password"
                  />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-3 h-3 md:w-4 md:h-4 theme-bg-primary theme-border border rounded focus:border-[#3f8cbf] focus:outline-none"
                    />
                    <label className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs md:text-sm">
                      Remember me
                    </label>
                  </div>
                  <a 
                    href="/forgot-password" 
                    className="[font-family:'Lexend',Helvetica] font-medium text-[#3f8cbf] text-xs md:text-sm hover:underline"
                  >
                    Forgot password?
                  </a>
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
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs md:text-sm">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-[#3f8cbf] hover:underline font-medium">
                      Create Account
                    </a>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Quick Access */}
          <div className="mt-6 md:mt-8 text-center">
            <p className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs md:text-sm mb-3 md:mb-4">
              Quick Access
            </p>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full" />
                </div>
                <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs text-center">
                  Dashboard
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full" />
                </div>
                <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs text-center">
                  AI Tutor
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full" />
                </div>
                <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs text-center">
                  Progress
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};