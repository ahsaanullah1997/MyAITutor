import React, { useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { useAuth } from "../../../contexts/AuthContext";

export const SettingsPage = (): JSX.Element => {
  const { profile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    grade: profile?.grade || '',
    notifications: true,
    emailUpdates: true,
    studyReminders: true,
    darkMode: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        grade: formData.grade,
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
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
          <div className="text-center">
            <h1 className="[font-family:'Lexend',Helvetica] font-bold text-white text-2xl md:text-3xl mb-2">
              Settings ⚙️
            </h1>
            <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-base">
              Manage your account settings and preferences.
            </p>
          </div>

          {/* Profile Settings */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                Profile Information
              </h3>
              
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

              <form onSubmit={handleProfileUpdate} className="space-y-6">
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

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#3f8cbf] hover:bg-[#2d6a94] text-white px-6 py-3 [font-family:'Lexend',Helvetica] font-medium disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                Notification Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white">
                      Push Notifications
                    </h4>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                      Receive notifications about your progress and reminders
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={formData.notifications}
                    onChange={handleInputChange}
                    className="w-5 h-5 bg-[#0f1419] border border-[#3d4f5b] rounded focus:border-[#3f8cbf] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white">
                      Email Updates
                    </h4>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                      Get weekly progress reports and study tips via email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="emailUpdates"
                    checked={formData.emailUpdates}
                    onChange={handleInputChange}
                    className="w-5 h-5 bg-[#0f1419] border border-[#3d4f5b] rounded focus:border-[#3f8cbf] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white">
                      Study Reminders
                    </h4>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                      Daily reminders to maintain your study streak
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="studyReminders"
                    checked={formData.studyReminders}
                    onChange={handleInputChange}
                    className="w-5 h-5 bg-[#0f1419] border border-[#3d4f5b] rounded focus:border-[#3f8cbf] focus:outline-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                Account Actions
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#0f1419] rounded-lg">
                  <div>
                    <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white">
                      Change Password
                    </h4>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                      Update your account password for security
                    </p>
                  </div>
                  <Button className="bg-[#3f8cbf] hover:bg-[#2d6a94] text-white [font-family:'Lexend',Helvetica] font-medium">
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0f1419] rounded-lg">
                  <div>
                    <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white">
                      Export Data
                    </h4>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                      Download your learning progress and data
                    </p>
                  </div>
                  <Button className="bg-transparent border border-[#3d4f5b] text-white hover:bg-[#2a3540] [font-family:'Lexend',Helvetica] font-medium">
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div>
                    <h4 className="[font-family:'Lexend',Helvetica] font-medium text-red-400">
                      Delete Account
                    </h4>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button className="bg-red-500 hover:bg-red-600 text-white [font-family:'Lexend',Helvetica] font-medium">
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};