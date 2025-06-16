import React, { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { useAuth } from "../../../contexts/AuthContext";

export const ProfileInformationPage = (): JSX.Element => {
  const { profile, updateProfile } = useAuth();
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    grade: '',
    board: '',
    area: '',
    profilePicture: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        grade: profile.grade || '',
        board: profile.board || '',
        area: profile.area || '',
      }));
    }
  }, [profile]);

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

  const boards = [
    "Federal Board",
    "Punjab Board", 
    "Sindh Board",
    "Khyber Pakhtunkhwa Board",
    "AJK Mirpur Board",
    "Baluchistan Board"
  ];

  const boardAreas = {
    "Punjab Board": [
      "BISE Lahore",
      "BISE Gujranwala",
      "BISE Faisalabad",
      "BISE Multan",
      "BISE Bahawalpur",
      "BISE Dera Ghazi Khan",
      "BISE Rawalpindi"
    ],
    "Sindh Board": [
      "BISE Karachi",
      "BISE Hyderabad",
      "BISE Sukkur",
      "BISE Larkana",
      "BISE Mirpurkhas"
    ]
  };

  const requiresBoardSelection = (grade: string) => {
    return [
      "Class 9 (Metric)",
      "Class 10 (Metric)", 
      "Class 11 (FSc/FA)",
      "Class 12 (FSc/FA)"
    ].includes(grade);
  };

  const requiresAreaSelection = (board: string) => {
    return ["Punjab Board", "Sindh Board"].includes(board);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      if (name === 'grade' && !requiresBoardSelection(value)) {
        newData.board = '';
        newData.area = '';
      }
      
      if (name === 'board' && !requiresAreaSelection(value)) {
        newData.area = '';
      }
      
      return newData;
    });
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file' });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
        return;
      }
      
      setFormData(prev => ({ ...prev, profilePicture: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (requiresBoardSelection(formData.grade) && !formData.board) {
      setMessage({ type: 'error', text: 'Please select your board for the selected grade.' });
      setLoading(false);
      return;
    }

    if (requiresAreaSelection(formData.board) && !formData.area) {
      setMessage({ type: 'error', text: 'Please select your area for the selected board.' });
      setLoading(false);
      return;
    }

    try {
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        grade: formData.grade,
        board: formData.board,
        area: formData.area,
      }, formData.profilePicture || undefined);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setProfilePicturePreview(null);
      setFormData(prev => ({ ...prev, profilePicture: null }));
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="[font-family:'Lexend',Helvetica] font-bold text-white text-2xl md:text-3xl">
              Profile Information 👤
            </h1>
            <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-base">
              Manage your personal details and profile picture.
            </p>
          </div>

          {/* Profile Information Form */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              {message && (
                <div className={`p-4 rounded-lg mb-6 ${
                  message.type === 'success' 
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}>
                  <p className="[font-family:'Lexend',Helvetica] text-sm">
                    {message.text}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-[#0f1419] border-2 border-[#3d4f5b] flex items-center justify-center">
                      {profilePicturePreview ? (
                        <img 
                          src={profilePicturePreview} 
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : profile?.profile_picture_url ? (
                        <img 
                          src={profile.profile_picture_url} 
                          alt="Current profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-[#9eafbf] text-2xl md:text-3xl">
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
                    <p className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm mb-1">
                      Profile Picture
                    </p>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-xs">
                      Click the camera icon to change your photo
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white placeholder-[#9eafbf] focus:border-[#3f8cbf] focus:outline-none [font-family:'Lexend',Helvetica]"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white placeholder-[#9eafbf] focus:border-[#3f8cbf] focus:outline-none [font-family:'Lexend',Helvetica]"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                    Current Grade/Level
                  </label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white focus:border-[#3f8cbf] focus:outline-none [font-family:'Lexend',Helvetica]"
                  >
                    <option value="">Select your grade/level</option>
                    {grades.map((grade) => (
                      <option key={grade} value={grade} className="text-white bg-[#0f1419]">
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>

                {requiresBoardSelection(formData.grade) && (
                  <div className="space-y-2">
                    <label className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                      Education Board <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="board"
                      value={formData.board}
                      onChange={handleInputChange}
                      required={requiresBoardSelection(formData.grade)}
                      className="w-full px-4 py-3 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white focus:border-[#3f8cbf] focus:outline-none [font-family:'Lexend',Helvetica]"
                    >
                      <option value="">Select your board</option>
                      {boards.map((board) => (
                        <option key={board} value={board} className="text-white bg-[#0f1419]">
                          {board}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {requiresAreaSelection(formData.board) && (
                  <div className="space-y-2">
                    <label className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                      Area/Region <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      required={requiresAreaSelection(formData.board)}
                      className="w-full px-4 py-3 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white focus:border-[#3f8cbf] focus:outline-none [font-family:'Lexend',Helvetica]"
                    >
                      <option value="">Select your area</option>
                      {boardAreas[formData.board as keyof typeof boardAreas]?.map((area) => (
                        <option key={area} value={area} className="text-white bg-[#0f1419]">
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#3f8cbf] hover:bg-[#2d6a94] text-white px-6 py-3 [font-family:'Lexend',Helvetica] font-medium disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {formData.profilePicture ? 'Uploading...' : 'Updating...'}
                    </div>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};