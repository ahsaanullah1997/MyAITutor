import React, { useState, useRef, useEffect } from "react";
import { HeroSection } from "../StitchDesign/sections/HeroSection/index.ts";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useAuth } from "../../contexts/AuthContext";

export const CompleteProfilePage = (): JSX.Element => {
  const { user, updateProfile, isNewUser, markProfileCompleted } = useAuth();
  const [formData, setFormData] = useState({
    grade: '',
    board: '',
    profilePicture: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not a new user or no user
  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    
    // If not a new user, redirect to dashboard
    if (!isNewUser) {
      window.location.href = '/dashboard';
      return;
    }
  }, [user, isNewUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Clear board selection if grade doesn't require it
      if (name === 'grade' && !requiresBoardSelection(value)) {
        newData.board = '';
      }
      
      return newData;
    });
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      setFormData(prev => ({ ...prev, profilePicture: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!formData.grade) {
      setError("Please select your grade/level");
      setLoading(false);
      return;
    }

    // Board validation for grades that require board selection
    if (requiresBoardSelection(formData.grade) && !formData.board) {
      setError("Please select your examination board");
      setLoading(false);
      return;
    }

    try {
      // Update profile with all data including profile picture
      await updateProfile({
        grade: formData.grade,
        board: formData.board,
      }, formData.profilePicture || undefined);
      
      // Redirect to subject group selection for grades that need it
      if (requiresSubjectGroupSelection(formData.grade)) {
        window.location.href = '/subject-group';
      } else {
        // Redirect directly to dashboard for grades that don't need group selection
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Mark profile as completed even if skipped
    markProfileCompleted();
    // Allow users to skip profile completion and go to dashboard
    window.location.href = '/dashboard';
  };

  const grades = [
    "Class 9 (Metric)",
    "Class 10 (Metric)",
    "Class 11 (FSc)",
    "Class 12 (FSc)",
    "O-levels",
    "A-Levels",
    "MDCAT",
    "ECAT"
  ];

  // Board options for Pakistani education system
  const boards = [
    "Federal Board",
    "Punjab Board", 
    "Sindh Board",
    "KPK Board",
    "Baluchistan Board",
    "AJK Board"
  ];

  // Check if selected grade requires board selection
  const requiresBoardSelection = (grade: string) => {
    return [
      "Class 9 (Metric)",
      "Class 10 (Metric)", 
      "Class 11 (FSc)",
      "Class 12 (FSc)"
    ].includes(grade);
  };

  // Check if selected grade requires subject group selection
  const requiresSubjectGroupSelection = (grade: string) => {
    return [
      "Class 9 (Metric)",
      "Class 10 (Metric)", 
      "Class 11 (FSc)",
      "Class 12 (FSc)",
      "O-levels",
      "A-Levels",
      "MDCAT",
      "ECAT"
    ].includes(grade);
  };

  // Show loading if checking user state
  if (!user || !isNewUser) {
    return (
      <div className="flex items-center justify-center min-h-screen theme-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#3f8cbf] border-t-transparent rounded-full animate-spin"></div>
          <p className="theme-text-primary [font-family:'Lexend',Helvetica]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full theme-bg-primary min-h-screen">
      <HeroSection />
      
      <section className="flex items-center justify-center px-4 md:px-6 lg:px-10 py-8 md:py-20 w-full theme-bg-primary min-h-[calc(100vh-80px)]">
        <div className="flex flex-col max-w-[480px] w-full">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="[font-family:'Lexend',Helvetica] font-black theme-text-primary text-2xl sm:text-3xl md:text-4xl tracking-[-1.00px] leading-[1.1] mb-3 md:mb-4">
              Complete Your Profile
            </h1>
            <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-sm md:text-base tracking-[0] leading-6">
              Help us personalize your learning experience by completing your profile
            </p>
          </div>

          {/* Profile Completion Form */}
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

                {/* Profile Picture */}
                <div className="flex flex-col gap-4 items-center">
                  <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden theme-bg-primary theme-border border-2 flex items-center justify-center">
                      {profilePicturePreview ? (
                        <img 
                          src={profilePicturePreview} 
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="theme-text-muted text-2xl md:text-3xl">
                          👤
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-[#3f8cbf] rounded-full flex items-center justify-center text-white hover:bg-[#2d6a94] transition-colors"
                    >
                      📷
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-sm mb-1">
                      Profile Picture (Optional)
                    </p>
                    <p className="[font-family:'Lexend',Helvetica] theme-text-muted text-xs">
                      Click the camera icon to upload a photo
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>

                {/* Grade Selection */}
                <div className="flex flex-col gap-2">
                  <label className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs md:text-sm">
                    Current Grade/Level *
                  </label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 theme-bg-primary theme-border border rounded-lg theme-text-primary focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica] text-sm md:text-base"
                  >
                    <option value="" className="theme-text-muted">Select your grade/level</option>
                    {grades.map((grade) => (
                      <option key={grade} value={grade} className="theme-text-primary theme-bg-primary">
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Board Selection - Only show for Metric and FSc grades */}
                {requiresBoardSelection(formData.grade) && (
                  <div className="flex flex-col gap-2">
                    <label className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs md:text-sm">
                      Examination Board *
                    </label>
                    <select
                      name="board"
                      value={formData.board}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 theme-bg-primary theme-border border rounded-lg theme-text-primary focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica] text-sm md:text-base"
                    >
                      <option value="" className="theme-text-muted">Select your examination board</option>
                      {boards.map((board) => (
                        <option key={board} value={board} className="theme-text-primary theme-bg-primary">
                          {board}
                        </option>
                      ))}
                    </select>
                    <p className="[font-family:'Lexend',Helvetica] theme-text-muted text-xs">
                      This helps us provide content specific to your examination board
                    </p>
                  </div>
                )}

                {/* Next Step Information */}
                {formData.grade && requiresSubjectGroupSelection(formData.grade) && (
                  <div className="p-3 md:p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-blue-400 text-lg">📚</div>
                      <div>
                        <h4 className="[font-family:'Lexend',Helvetica] font-medium text-blue-400 mb-1 text-sm">
                          Next: Subject Group Selection
                        </h4>
                        <p className="[font-family:'Lexend',Helvetica] theme-text-muted text-xs">
                          After completing your profile, you'll choose your subject combination (e.g., Pre-Medical, Pre-Engineering, etc.)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <Button 
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 md:h-12 bg-[#3f8cbf] hover:bg-[#2d6a94] rounded-lg [font-family:'Lexend',Helvetica] font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {formData.profilePicture ? 'Uploading...' : 'Saving Profile...'}
                      </div>
                    ) : (
                      requiresSubjectGroupSelection(formData.grade) ? 'Continue to Subject Selection' : 'Complete Profile'
                    )}
                  </Button>

                  <Button 
                    type="button"
                    onClick={handleSkip}
                    className="w-full h-10 md:h-12 bg-transparent theme-border border theme-text-muted hover:theme-bg-tertiary hover:theme-text-primary rounded-lg [font-family:'Lexend',Helvetica] font-medium transition-colors text-sm md:text-base"
                  >
                    Skip for Now
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="mt-6 md:mt-8 text-center">
            <p className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs md:text-sm mb-3 md:mb-4">
              Why complete your profile?
            </p>
            <div className="grid grid-cols-1 gap-3 md:gap-4">
              <div className="flex items-center gap-3 p-3 theme-bg-secondary rounded-lg theme-border border">
                <div className="w-6 h-6 bg-[#3f8cbf] rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs text-left">
                  Get personalized content based on your curriculum
                </p>
              </div>
              <div className="flex items-center gap-3 p-3 theme-bg-secondary rounded-lg theme-border border">
                <div className="w-6 h-6 bg-[#3f8cbf] rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs text-left">
                  Receive targeted study recommendations
                </p>
              </div>
              <div className="flex items-center gap-3 p-3 theme-bg-secondary rounded-lg theme-border border">
                <div className="w-6 h-6 bg-[#3f8cbf] rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs text-left">
                  Track progress specific to your grade level
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};