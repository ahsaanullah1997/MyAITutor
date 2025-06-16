import React from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent } from "../../../components/ui/card";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { useAuth } from "../../../contexts/AuthContext";

export const SettingsPage = (): JSX.Element => {
  const { profile } = useAuth();

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

          {/* Profile Information Section - Read Only */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                Profile Information
              </h3>
              
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
                  <div className="text-center">
                    <p className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                      {profile?.grade || 'Grade not set'}
                    </p>
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
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};