import React, { useState } from "react";
import { HeroSection } from "../StitchDesign/sections/HeroSection/index.ts";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const SignUpPage = (): JSX.Element => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: '',
    agreeToTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Sign up form submitted:', formData);
  };

  const grades = [
    "Class 9 (Metric)",
    "Class 10 (Metric)",
    "Class 11 (FSc/FA)",
    "Class 12 (FSc/FA)",
    "O-Level",
    "A-Level",
    "MDCAT Preparation",
    "ECAT Preparation"
  ];

  return (
    <main className="flex flex-col w-full bg-[#0f1419] min-h-screen">
      <HeroSection />
      
      <section className="flex items-center justify-center px-4 md:px-10 py-20 w-full bg-[#0f1419] min-h-[calc(100vh-80px)]">
        <div className="flex flex-col max-w-[480px] w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="[font-family:'Lexend',Helvetica] font-black text-white text-3xl md:text-4xl tracking-[-1.00px] leading-[1.1] mb-4">
              Create Your Account
            </h1>
            <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-base tracking-[0] leading-6">
              Join thousands of students achieving academic excellence with AI-powered learning
            </p>
          </div>

          {/* Sign Up Form */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white placeholder-[#9eafbf] focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica]"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white placeholder-[#9eafbf] focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica]"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white placeholder-[#9eafbf] focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica]"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Grade Selection */}
                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                    Current Grade/Level *
                  </label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica]"
                  >
                    <option value="" className="text-[#9eafbf]">Select your grade/level</option>
                    {grades.map((grade) => (
                      <option key={grade} value={grade} className="text-white bg-[#0f1419]">
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white placeholder-[#9eafbf] focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica]"
                    placeholder="Create a strong password"
                  />
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white placeholder-[#9eafbf] focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica]"
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
                    className="w-5 h-5 mt-0.5 bg-[#0f1419] border border-[#3d4f5b] rounded focus:border-[#3f8cbf] focus:outline-none"
                  />
                  <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-sm leading-6">
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
                  className="w-full h-12 bg-[#3f8cbf] hover:bg-[#2d6a94] rounded-lg [font-family:'Lexend',Helvetica] font-bold text-white transition-colors"
                >
                  Create Account
                </Button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-sm">
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
          <div className="mt-8 text-center">
            <p className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm mb-4">
              Why join EduGenius?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
                <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-xs text-center">
                  AI-Powered Learning
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
                <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-xs text-center">
                  24/7 Support
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
                <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-xs text-center">
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