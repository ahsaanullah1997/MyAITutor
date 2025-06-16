import React, { useState, useRef } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { useAuth } from "../../../contexts/AuthContext";

export const SettingsPage = (): JSX.Element => {
  const { profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    grade: profile?.grade || '',
    board: profile?.board || '',
    area: profile?.area || '',
    profilePicture: null as File | null,
    notifications: true,
    emailUpdates: true,
    studyReminders: true,
    darkMode: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Mock current subscription - in real app this would come from user data
  const currentSubscription = {
    plan: 'Basic',
    status: 'Active',
    nextBilling: '2024-02-15',
    price: 'Free'
  };

  const subscriptionPlans = [
    {
      name: "Basic",
      price: "Free",
      period: "Forever",
      features: [
        "5 AI tutoring sessions per month",
        "Basic progress tracking",
        "Access to core subjects",
        "Community support"
      ],
      current: true,
      popular: false
    },
    {
      name: "Pro",
      price: "PKR 799",
      period: "per month",
      features: [
        "Unlimited AI tutoring sessions",
        "Advanced progress analytics",
        "All subjects & exam prep",
        "Priority support",
        "Personalized study plans",
        "Practice tests & assessments"
      ],
      current: false,
      popular: true
    },
    {
      name: "Custom",
      price: "Contact Us",
      period: "for pricing",
      features: [
        "Everything in Pro",
        "Bulk student accounts",
        "Institution dashboard",
        "Custom curriculum integration",
        "Dedicated account manager",
        "Teacher training & support",
        "Advanced analytics & reporting"
      ],
      current: false,
      popular: false
    }
  ];

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

  // Board options for Pakistani education system
  const boards = [
    "Federal Board",
    "Punjab Board", 
    "Sindh Board",
    "Khyber Pakhtunkhwa Board",
    "AJK Mirpur Board",
    "Baluchistan Board"
  ];

  // Area options for specific boards
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

  // Check if selected grade requires board selection
  const requiresBoardSelection = (grade: string) => {
    return [
      "Class 9 (Metric)",
      "Class 10 (Metric)", 
      "Class 11 (FSc/FA)",
      "Class 12 (FSc/FA)"
    ].includes(grade);
  };

  // Check if selected board requires area selection
  const requiresAreaSelection = (board: string) => {
    return ["Punjab Board", "Sindh Board"].includes(board);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      };
      
      // Clear board and area selection if grade doesn't require it
      if (name === 'grade' && !requiresBoardSelection(value)) {
        newData.board = '';
        newData.area = '';
      }
      
      // Clear area selection if board doesn't require it
      if (name === 'board' && !requiresAreaSelection(value)) {
        newData.area = '';
      }
      
      return newData;
    });
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file' });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
        return;
      }
      
      setFormData(prev => ({ ...prev, profilePicture: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setMessage(null);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validation
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
      setIsEditing(false);
      setProfilePicturePreview(null); // Clear preview after successful upload
      setFormData(prev => ({ ...prev, profilePicture: null })); // Clear file from form
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (planName: string) => {
    if (planName === "Custom") {
      window.location.href = '/contact';
    } else {
      // In a real app, this would integrate with a payment processor
      alert(`Upgrading to ${planName} plan. This would redirect to payment processing.`);
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

          {/* Current Subscription */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                Current Subscription
              </h3>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#0f1419] rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="[font-family:'Lexend',Helvetica] font-bold text-white text-xl">
                      {currentSubscription.plan} Plan
                    </h4>
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs [font-family:'Lexend',Helvetica] font-medium">
                      {currentSubscription.status}
                    </span>
                  </div>
                  <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm mb-1">
                    Current Price: <span className="text-[#3f8cbf] font-medium">{currentSubscription.price}</span>
                  </p>
                  {currentSubscription.plan !== 'Basic' && (
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                      Next billing: {currentSubscription.nextBilling}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    className="bg-[#3f8cbf] hover:bg-[#2d6a94] text-white [font-family:'Lexend',Helvetica] font-medium"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    View All Plans
                  </Button>
                  {currentSubscription.plan !== 'Basic' && (
                    <Button className="bg-transparent border border-[#3d4f5b] text-white hover:bg-[#2a3540] [font-family:'Lexend',Helvetica] font-medium">
                      Manage Billing
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Options */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                Upgrade Your Plan
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan, index) => (
                  <div
                    key={index}
                    className={`relative p-6 rounded-lg border ${
                      plan.current
                        ? 'bg-[#3f8cbf]/10 border-[#3f8cbf]'
                        : 'bg-[#0f1419] border-[#3d4f5b]'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-[#3f8cbf] text-white px-3 py-1 rounded-full text-xs font-bold [font-family:'Lexend',Helvetica]">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    {plan.current && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold [font-family:'Lexend',Helvetica]">
                          Current Plan
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-4">
                      <h4 className={`[font-family:'Lexend',Helvetica] font-bold text-xl mb-2 ${
                        plan.current ? 'text-[#3f8cbf]' : 'text-white'
                      }`}>
                        {plan.name}
                      </h4>
                      <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className={`[font-family:'Lexend',Helvetica] font-black ${
                          plan.name === "Custom" ? 'text-xl' : 'text-2xl'
                        } ${
                          plan.current ? 'text-[#3f8cbf]' : 'text-white'
                        }`}>
                          {plan.price}
                        </span>
                        <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            plan.current ? 'bg-[#3f8cbf]' : 'bg-[#3f8cbf]'
                          }`}>
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                          <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleUpgrade(plan.name)}
                      disabled={plan.current}
                      className={`w-full [font-family:'Lexend',Helvetica] font-medium ${
                        plan.current
                          ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                          : plan.popular
                          ? 'bg-[#3f8cbf] hover:bg-[#2d6a94] text-white'
                          : 'bg-transparent border border-[#3d4f5b] text-white hover:bg-[#2a3540]'
                      }`}
                    >
                      {plan.current ? 'Current Plan' : 
                       plan.name === "Custom" ? 'Contact Sales' : `Upgrade to ${plan.name}`}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-blue-400 text-xl">💡</div>
                  <div>
                    <h4 className="[font-family:'Lexend',Helvetica] font-medium text-blue-400 mb-1">
                      Need help choosing?
                    </h4>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                      Contact our support team for personalized recommendations based on your learning goals.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg">
                  Profile Information
                </h3>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-transparent border border-[#3d4f5b] text-[#3f8cbf] hover:bg-[#3f8cbf] hover:text-white [font-family:'Lexend',Helvetica] font-medium text-sm px-4 py-2"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
              
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

              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
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

                  {/* Board Selection - Only show for Metric and FSc grades */}
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
                      <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-xs">
                        Select the education board you're studying under for curriculum-specific content.
                      </p>
                    </div>
                  )}

                  {/* Area Selection - Only show for Punjab and Sindh boards */}
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
                      <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-xs">
                        Select your specific area for region-specific exam patterns and content.
                      </p>
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
              ) : (
                <div className="space-y-6">
                  {/* Profile Picture Display */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-[#0f1419] border-2 border-[#3d4f5b] flex items-center justify-center">
                      {profile?.profile_picture_url ? (
                        <img 
                          src={profile.profile_picture_url} 
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-[#9eafbf] text-2xl md:text-3xl">
                          👤
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                        First Name
                      </label>
                      <div className="w-full px-4 py-3 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white [font-family:'Lexend',Helvetica]">
                        {profile?.first_name || 'Not set'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                        Last Name
                      </label>
                      <div className="w-full px-4 py-3 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white [font-family:'Lexend',Helvetica]">
                        {profile?.last_name || 'Not set'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                      Current Grade/Level
                    </label>
                    <div className="w-full px-4 py-3 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white [font-family:'Lexend',Helvetica]">
                      {profile?.grade || 'Not set'}
                    </div>
                  </div>

                  {profile?.board && (
                    <div className="space-y-2">
                      <label className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                        Education Board
                      </label>
                      <div className="w-full px-4 py-3 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white [font-family:'Lexend',Helvetica]">
                        {profile.board}
                      </div>
                    </div>
                  )}

                  {profile?.area && (
                    <div className="space-y-2">
                      <label className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                        Area/Region
                      </label>
                      <div className="w-full px-4 py-3 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white [font-family:'Lexend',Helvetica]">
                        {profile.area}
                      </div>
                    </div>
                  )}
                </div>
              )}
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