import React, { useState, useEffect } from "react";
import { HeroSection } from "../StitchDesign/sections/HeroSection/index.ts";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useAuth } from "../../contexts/AuthContext";

export const SubjectGroupPage = (): JSX.Element => {
  const { user, profile, updateProfile } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated or profile not complete
  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    
    if (!profile || !profile.grade || !profile.board) {
      window.location.href = '/complete-profile';
      return;
    }
  }, [user, profile]);

  // Subject group definitions
  const getSubjectGroups = () => {
    if (!profile) return [];

    const grade = profile.grade;
    const board = profile.board;

    // Class 9 and 10 Metric (all boards have same structure)
    if (grade === "Class 9 (Metric)" || grade === "Class 10 (Metric)") {
      return [
        {
          id: 'science-biology',
          name: 'Science (Biology)',
          description: 'Focus on biological sciences with core subjects',
          subjects: [
            'English',
            'Urdu', 
            'Islamiat (Compulsory)',
            'Pakistan Studies',
            'Mathematics',
            'Physics',
            'Chemistry',
            'Biology'
          ]
        },
        {
          id: 'science-computer',
          name: 'Science (Computer)',
          description: 'Focus on computer science with core subjects',
          subjects: [
            'English',
            'Urdu',
            'Islamiat (Compulsory)', 
            'Pakistan Studies',
            'Mathematics',
            'Physics',
            'Chemistry',
            'Computer Science'
          ]
        }
      ];
    }

    // Class 11 FSc (all boards have same structure)
    if (grade === "Class 11 (FSc)") {
      return [
        {
          id: 'fsc-pre-medical',
          name: 'FSc (Pre-Medical)',
          description: 'Preparation for medical entrance exams',
          subjects: [
            'English (Compulsory)',
            'Urdu (Compulsory)',
            'Islamiyat (Compulsory)',
            'Physics',
            'Chemistry',
            'Biology'
          ]
        },
        {
          id: 'fsc-pre-engineering',
          name: 'FSc (Pre-Engineering)',
          description: 'Preparation for engineering entrance exams',
          subjects: [
            'English (Compulsory)',
            'Urdu (Compulsory)',
            'Islamiyat (Compulsory)',
            'Physics',
            'Chemistry',
            'Mathematics'
          ]
        },
        {
          id: 'fsc-ics',
          name: 'FSc (ICS)',
          description: 'Information and Computer Sciences',
          subjects: [
            'English (Compulsory)',
            'Urdu (Compulsory)',
            'Islamiyat (Compulsory)',
            'Physics',
            'Computer',
            'Mathematics'
          ]
        }
      ];
    }

    // Class 12 FSc (Pakistan Studies instead of Islamiyat)
    if (grade === "Class 12 (FSc)") {
      return [
        {
          id: 'fsc-pre-medical',
          name: 'FSc (Pre-Medical)',
          description: 'Preparation for medical entrance exams',
          subjects: [
            'English (Compulsory)',
            'Urdu (Compulsory)',
            'Pakistan Studies (Compulsory)',
            'Physics',
            'Chemistry',
            'Biology'
          ]
        },
        {
          id: 'fsc-pre-engineering',
          name: 'FSc (Pre-Engineering)',
          description: 'Preparation for engineering entrance exams',
          subjects: [
            'English (Compulsory)',
            'Urdu (Compulsory)',
            'Pakistan Studies (Compulsory)',
            'Physics',
            'Chemistry',
            'Mathematics'
          ]
        },
        {
          id: 'fsc-ics',
          name: 'FSc (ICS)',
          description: 'Information and Computer Sciences',
          subjects: [
            'English (Compulsory)',
            'Urdu (Compulsory)',
            'Pakistan Studies (Compulsory)',
            'Physics',
            'Computer',
            'Mathematics'
          ]
        }
      ];
    }

    // O-levels and A-levels don't have predefined groups
    if (grade === "O-levels" || grade === "A-Levels") {
      return [
        {
          id: 'cambridge-standard',
          name: 'Cambridge Standard',
          description: 'Standard Cambridge curriculum subjects',
          subjects: grade === "O-levels" ? [
            'English Language',
            'Mathematics',
            'Physics',
            'Chemistry',
            'Biology',
            'Pakistan Studies',
            'Islamiyat',
            'Computer Science'
          ] : [
            'Mathematics',
            'Physics',
            'Chemistry',
            'Biology',
            'Economics',
            'Computer Science',
            'Psychology'
          ]
        }
      ];
    }

    // MDCAT and ECAT have fixed subjects
    if (grade === "MDCAT") {
      return [
        {
          id: 'mdcat-standard',
          name: 'MDCAT Preparation',
          description: 'Medical and Dental College Admission Test preparation',
          subjects: [
            'Biology',
            'Chemistry',
            'Physics',
            'English',
            'Logical Reasoning'
          ]
        }
      ];
    }

    if (grade === "ECAT") {
      return [
        {
          id: 'ecat-standard',
          name: 'ECAT Preparation',
          description: 'Engineering College Admission Test preparation',
          subjects: [
            'Mathematics',
            'Physics',
            'Chemistry',
            'English'
          ]
        }
      ];
    }

    return [];
  };

  const subjectGroups = getSubjectGroups();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGroup) {
      setError("Please select a subject group");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const selectedGroupData = subjectGroups.find(group => group.id === selectedGroup);
      
      if (!selectedGroupData) {
        throw new Error("Invalid group selection");
      }

      // Update profile with selected group and subjects
      await updateProfile({
        ...profile,
        // Store the selected group and subjects in a way that can be used later
        // You might want to add these fields to your UserProfile type
      });

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error: any) {
      setError(error.message || 'An error occurred while saving your selection');
    } finally {
      setLoading(false);
    }
  };

  // Show loading if checking user state
  if (!user || !profile) {
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
        <div className="flex flex-col max-w-[800px] w-full">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="[font-family:'Lexend',Helvetica] font-black theme-text-primary text-2xl sm:text-3xl md:text-4xl tracking-[-1.00px] leading-[1.1] mb-3 md:mb-4">
              Select Your Subject Group
            </h1>
            <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-sm md:text-base tracking-[0] leading-6 mb-2">
              Choose the subject combination that matches your academic goals
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 theme-bg-secondary rounded-full theme-border border">
              <span className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs">
                {profile.grade}
              </span>
              {profile.board && (
                <>
                  <span className="theme-text-muted">•</span>
                  <span className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs">
                    {profile.board}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Subject Group Selection */}
          <Card className="theme-bg-secondary theme-border">
            <CardContent className="p-4 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="p-3 md:p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-xs md:text-sm [font-family:'Lexend',Helvetica]">
                      {error}
                    </p>
                  </div>
                )}

                {/* Group Options */}
                <div className="space-y-4">
                  <h3 className="[font-family:'Lexend',Helvetica] font-bold theme-text-primary text-lg mb-4">
                    Available Subject Groups
                  </h3>
                  
                  {subjectGroups.map((group) => (
                    <div key={group.id} className="relative">
                      <input
                        type="radio"
                        id={group.id}
                        name="subjectGroup"
                        value={group.id}
                        checked={selectedGroup === group.id}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={group.id}
                        className={`block p-4 md:p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedGroup === group.id
                            ? 'border-[#3f8cbf] bg-[#3f8cbf]/10'
                            : 'theme-border hover:border-[#3f8cbf]/50 hover:theme-bg-tertiary'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="[font-family:'Lexend',Helvetica] font-bold theme-text-primary text-base md:text-lg mb-1">
                              {group.name}
                            </h4>
                            <p className="[font-family:'Lexend',Helvetica] theme-text-muted text-xs md:text-sm">
                              {group.description}
                            </p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedGroup === group.id
                              ? 'border-[#3f8cbf] bg-[#3f8cbf]'
                              : 'theme-border'
                          }`}>
                            {selectedGroup === group.id && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                        
                        {/* Subjects List */}
                        <div className="mt-4">
                          <p className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs md:text-sm mb-2">
                            Subjects ({group.subjects.length}):
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {group.subjects.map((subject, index) => (
                              <span
                                key={index}
                                className={`px-2 py-1 rounded-full text-xs [font-family:'Lexend',Helvetica] ${
                                  selectedGroup === group.id
                                    ? 'bg-[#3f8cbf] text-white'
                                    : 'theme-bg-primary theme-text-muted'
                                }`}
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    type="submit"
                    disabled={loading || !selectedGroup}
                    className="flex-1 h-10 md:h-12 bg-[#3f8cbf] hover:bg-[#2d6a94] rounded-lg [font-family:'Lexend',Helvetica] font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving Selection...
                      </div>
                    ) : (
                      'Continue to Dashboard'
                    )}
                  </Button>

                  <Button 
                    type="button"
                    onClick={() => window.location.href = '/complete-profile'}
                    className="sm:w-auto h-10 md:h-12 bg-transparent theme-border border theme-text-muted hover:theme-bg-tertiary hover:theme-text-primary rounded-lg [font-family:'Lexend',Helvetica] font-medium transition-colors text-sm md:text-base"
                  >
                    Back to Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Information Section */}
          <div className="mt-6 md:mt-8 text-center">
            <p className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs md:text-sm mb-3 md:mb-4">
              Why select a subject group?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <div className="flex flex-col items-center gap-2 p-3 theme-bg-secondary rounded-lg theme-border border">
                <div className="w-6 h-6 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs text-center">
                  Personalized curriculum content
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 theme-bg-secondary rounded-lg theme-border border">
                <div className="w-6 h-6 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs text-center">
                  Subject-specific study materials
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 theme-bg-secondary rounded-lg theme-border border">
                <div className="w-6 h-6 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs text-center">
                  Targeted progress tracking
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};