import React, { useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ProtectedRoute } from "../../../components/ProtectedRoute";

export const NotificationsPage = (): JSX.Element => {
  const [formData, setFormData] = useState({
    notifications: true,
    emailUpdates: true,
    studyReminders: true,
    progressReports: false,
    examAlerts: true,
    marketingEmails: false,
    smsNotifications: false,
    pushNotifications: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Notification preferences updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update notification preferences' });
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
              Notifications 🔔
            </h1>
            <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-base">
              Configure your notification preferences and communication settings.
            </p>
          </div>

          {/* Notification Settings */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
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

                {/* Push Notifications */}
                <div>
                  <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-4">
                    Push Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white">
                          Enable Push Notifications
                        </h4>
                        <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                          Receive notifications about your progress and reminders
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        name="pushNotifications"
                        checked={formData.pushNotifications}
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

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white">
                          Exam Alerts
                        </h4>
                        <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                          Important notifications about upcoming exams and deadlines
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        name="examAlerts"
                        checked={formData.examAlerts}
                        onChange={handleInputChange}
                        className="w-5 h-5 bg-[#0f1419] border border-[#3d4f5b] rounded focus:border-[#3f8cbf] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Notifications */}
                <div>
                  <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-4">
                    Email Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white">
                          Weekly Progress Reports
                        </h4>
                        <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                          Get weekly summaries of your learning progress and achievements
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
                          Monthly Progress Reports
                        </h4>
                        <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                          Detailed monthly analysis of your academic performance
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        name="progressReports"
                        checked={formData.progressReports}
                        onChange={handleInputChange}
                        className="w-5 h-5 bg-[#0f1419] border border-[#3d4f5b] rounded focus:border-[#3f8cbf] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white">
                          Marketing Emails
                        </h4>
                        <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                          Receive updates about new features, tips, and promotional offers
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        name="marketingEmails"
                        checked={formData.marketingEmails}
                        onChange={handleInputChange}
                        className="w-5 h-5 bg-[#0f1419] border border-[#3d4f5b] rounded focus:border-[#3f8cbf] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SMS Notifications */}
                <div>
                  <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-4">
                    SMS Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white">
                          SMS Alerts
                        </h4>
                        <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                          Receive important notifications via SMS (charges may apply)
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        name="smsNotifications"
                        checked={formData.smsNotifications}
                        onChange={handleInputChange}
                        className="w-5 h-5 bg-[#0f1419] border border-[#3d4f5b] rounded focus:border-[#3f8cbf] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#3f8cbf] hover:bg-[#2d6a94] text-white px-6 py-3 [font-family:'Lexend',Helvetica] font-medium disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </div>
                  ) : (
                    'Save Preferences'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notification Schedule */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                Notification Schedule
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white">
                    Study Reminder Times
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#0f1419] rounded-lg">
                      <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                        Morning Reminder
                      </span>
                      <span className="[font-family:'Lexend',Helvetica] text-white text-sm">
                        9:00 AM
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#0f1419] rounded-lg">
                      <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                        Evening Reminder
                      </span>
                      <span className="[font-family:'Lexend',Helvetica] text-white text-sm">
                        7:00 PM
                      </span>
                    </div>
                  </div>
                  <Button className="bg-transparent border border-[#3d4f5b] text-[#3f8cbf] hover:bg-[#3f8cbf] hover:text-white [font-family:'Lexend',Helvetica] font-medium text-sm">
                    Customize Times
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white">
                    Quiet Hours
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#0f1419] rounded-lg">
                      <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                        Do Not Disturb
                      </span>
                      <span className="[font-family:'Lexend',Helvetica] text-white text-sm">
                        10:00 PM - 8:00 AM
                      </span>
                    </div>
                  </div>
                  <Button className="bg-transparent border border-[#3d4f5b] text-[#3f8cbf] hover:bg-[#3f8cbf] hover:text-white [font-family:'Lexend',Helvetica] font-medium text-sm">
                    Set Quiet Hours
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