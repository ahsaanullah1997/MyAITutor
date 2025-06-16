import React, { useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { useAuth } from "../../../contexts/AuthContext";

export const AccountActionsPage = (): JSX.Element => {
  const { signOut } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChangePassword = () => {
    // In a real app, this would open a password change modal or redirect
    alert('Password change functionality would be implemented here');
  };

  const handleExportData = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage({ type: 'success', text: 'Your data export has been prepared and will be sent to your email shortly.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export data. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would call the delete account API
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Account deletion would be processed here. User would be signed out and redirected.');
      await signOut();
      window.location.href = '/';
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete account. Please contact support.' });
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="[font-family:'Lexend',Helvetica] font-bold text-white text-2xl md:text-3xl">
              Account Actions ⚙️
            </h1>
            <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-base">
              Manage your account security and data.
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              <p className="[font-family:'Lexend',Helvetica] text-sm">
                {message.text}
              </p>
            </div>
          )}

          {/* Security Actions */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                Security Settings
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
                  <Button 
                    onClick={handleChangePassword}
                    className="bg-[#3f8cbf] hover:bg-[#2d6a94] text-white [font-family:'Lexend',Helvetica] font-medium"
                  >
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0f1419] rounded-lg">
                  <div>
                    <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white">
                      Two-Factor Authentication
                    </h4>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button className="bg-transparent border border-[#3d4f5b] text-white hover:bg-[#2a3540] [font-family:'Lexend',Helvetica] font-medium">
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0f1419] rounded-lg">
                  <div>
                    <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white">
                      Login Sessions
                    </h4>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                      View and manage your active login sessions
                    </p>
                  </div>
                  <Button className="bg-transparent border border-[#3d4f5b] text-white hover:bg-[#2a3540] [font-family:'Lexend',Helvetica] font-medium">
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                Data Management
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#0f1419] rounded-lg">
                  <div>
                    <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white">
                      Export Data
                    </h4>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                      Download your learning progress and data
                    </p>
                  </div>
                  <Button 
                    onClick={handleExportData}
                    disabled={loading}
                    className="bg-transparent border border-[#3d4f5b] text-white hover:bg-[#2a3540] [font-family:'Lexend',Helvetica] font-medium disabled:opacity-50"
                  >
                    {loading ? 'Exporting...' : 'Export'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0f1419] rounded-lg">
                  <div>
                    <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white">
                      Data Privacy
                    </h4>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                      Review how your data is used and stored
                    </p>
                  </div>
                  <Button 
                    onClick={() => window.location.href = '/privacy'}
                    className="bg-transparent border border-[#3d4f5b] text-white hover:bg-[#2a3540] [font-family:'Lexend',Helvetica] font-medium"
                  >
                    View Policy
                  </Button>
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
                      Sign Out
                    </h4>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                      Sign out of your account on this device
                    </p>
                  </div>
                  <Button 
                    onClick={handleSignOut}
                    className="bg-transparent border border-[#3d4f5b] text-white hover:bg-[#2a3540] [font-family:'Lexend',Helvetica] font-medium"
                  >
                    Sign Out
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
                    {showDeleteConfirm && (
                      <p className="[font-family:'Lexend',Helvetica] text-red-400 text-xs mt-2 font-medium">
                        ⚠️ This action cannot be undone. Click again to confirm.
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {showDeleteConfirm && (
                      <Button 
                        onClick={() => setShowDeleteConfirm(false)}
                        className="bg-transparent border border-[#3d4f5b] text-white hover:bg-[#2a3540] [font-family:'Lexend',Helvetica] font-medium"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button 
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className={`${
                        showDeleteConfirm 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-red-500 hover:bg-red-600'
                      } text-white [font-family:'Lexend',Helvetica] font-medium disabled:opacity-50`}
                    >
                      {loading ? 'Deleting...' : showDeleteConfirm ? 'Confirm Delete' : 'Delete'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                Need Help?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#0f1419] rounded-lg text-center">
                  <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white mb-2">
                    Contact Support
                  </h4>
                  <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm mb-4">
                    Get help with your account or technical issues
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/contact'}
                    className="bg-[#3f8cbf] hover:bg-[#2d6a94] text-white [font-family:'Lexend',Helvetica] font-medium"
                  >
                    Contact Us
                  </Button>
                </div>

                <div className="p-4 bg-[#0f1419] rounded-lg text-center">
                  <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white mb-2">
                    Help Center
                  </h4>
                  <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm mb-4">
                    Browse our knowledge base and FAQs
                  </p>
                  <Button className="bg-transparent border border-[#3d4f5b] text-white hover:bg-[#2a3540] [font-family:'Lexend',Helvetica] font-medium">
                    Visit Help Center
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