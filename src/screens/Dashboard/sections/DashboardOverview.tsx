import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useAuth } from "../../../contexts/AuthContext";
import { AnalyticsCard } from "../components/AnalyticsCard";
import { StudyStreakCard } from "../components/StudyStreakCard";

export const DashboardOverview = (): JSX.Element => {
  const { profile, progressStats, subjectProgress, recordStudySession } = useAuth();

  // Mock function to simulate study session
  const handleQuickStudy = async (subject: string) => {
    try {
      // Record a 15-minute lesson session
      await recordStudySession('lesson', subject, 15);
      alert(`Great! You've completed a 15-minute ${subject} lesson. Your progress has been updated!`);
    } catch (error) {
      console.error('Error recording study session:', error);
    }
  };

  // Mock function to simulate AI tutor session
  const handleAITutorSession = async () => {
    try {
      // Record a 10-minute AI tutor session
      await recordStudySession('ai_tutor', 'General', 10);
      window.location.href = '/dashboard/ai-tutor';
    } catch (error) {
      console.error('Error recording AI session:', error);
      window.location.href = '/dashboard/ai-tutor';
    }
  };

  // Mock function to simulate taking a test
  const handleTakeTest = async (subject: string) => {
    try {
      // Simulate a test with random score between 70-95
      const score = Math.floor(Math.random() * 26) + 70;
      await recordStudySession('test', subject, 30, score);
      alert(`Test completed! You scored ${score}% in ${subject}. Your progress has been updated!`);
    } catch (error) {
      console.error('Error recording test:', error);
    }
  };

  const stats = [
    {
      title: "Study Streak",
      value: `${progressStats?.study_streak_days || 0} days`,
      change: progressStats?.study_streak_days ? `+${progressStats.study_streak_days > 1 ? progressStats.study_streak_days - 1 : 0} from last week` : "Start your streak!",
      positive: true,
      icon: "🔥"
    },
    {
      title: "Completed Lessons",
      value: `${progressStats?.completed_lessons || 0}`,
      change: `+${Math.floor((progressStats?.completed_lessons || 0) / 4)} this week`,
      positive: true,
      icon: "✅"
    },
    {
      title: "Average Score",
      value: `${progressStats?.average_test_score || 0}%`,
      change: progressStats?.average_test_score ? `${progressStats.average_test_score >= 80 ? '+' : ''}${progressStats.average_test_score - 75}% from target` : "Take your first test",
      positive: (progressStats?.average_test_score || 0) >= 75,
      icon: "📊"
    },
    {
      title: "Time Studied",
      value: `${Math.round((progressStats?.weekly_study_time || 0) / 60 * 10) / 10}h`,
      change: "This week",
      positive: true,
      icon: "⏱️"
    }
  ];

  const recentActivities = [
    {
      type: "lesson",
      title: "Completed: Algebra Basics",
      subject: "Mathematics",
      time: "2 hours ago",
      score: "92%"
    },
    {
      type: "test",
      title: "Practice Test: Physics Motion",
      subject: "Physics",
      time: "1 day ago",
      score: "78%"
    },
    {
      type: "ai_session",
      title: "AI Tutor Session: Chemistry",
      subject: "Chemistry",
      time: "2 days ago",
      score: null
    }
  ];

  const upcomingTasks = [
    {
      title: "Complete Chapter 5: Organic Chemistry",
      subject: "Chemistry",
      dueDate: "Tomorrow",
      priority: "high"
    },
    {
      title: "Practice Test: Trigonometry",
      subject: "Mathematics",
      dueDate: "In 3 days",
      priority: "medium"
    },
    {
      title: "Review: Newton's Laws",
      subject: "Physics",
      dueDate: "This week",
      priority: "low"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#3f8cbf] to-[#2d6a94] rounded-xl p-6 text-white">
        <h2 className="[font-family:'Lexend',Helvetica] font-bold text-2xl mb-2">
          Welcome back, {profile?.first_name}! 👋
        </h2>
        <p className="[font-family:'Lexend',Helvetica] text-white/90 mb-4">
          Ready to continue your learning journey? You're doing great in {profile?.grade}!
        </p>
        <Button 
          className="bg-white text-[#3f8cbf] hover:bg-gray-100 [font-family:'Lexend',Helvetica] font-bold"
          onClick={handleAITutorSession}
        >
          Continue Learning
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  stat.positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-2xl mb-1">
                {stat.value}
              </h3>
              <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                {stat.title}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics and Streak Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnalyticsCard type="weekly" />
        <StudyStreakCard />
        <AnalyticsCard type="insights" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Progress */}
        <div className="lg:col-span-2">
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-4">
                Subject Progress
              </h3>
              <div className="space-y-4">
                {subjectProgress.slice(0, 4).map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="[font-family:'Lexend',Helvetica] font-medium text-white">
                        {subject.subject_name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                          {subject.progress_percentage}%
                        </span>
                        <Button
                          onClick={() => handleQuickStudy(subject.subject_name)}
                          className="bg-[#3f8cbf] hover:bg-[#2d6a94] text-white text-xs px-2 py-1 h-6"
                        >
                          Study
                        </Button>
                      </div>
                    </div>
                    <div className="w-full bg-[#0f1419] rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300 bg-[#3f8cbf]"
                        style={{ width: `${subject.progress_percentage}%` }}
                      />
                    </div>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-xs">
                      {subject.completed_topics}/{subject.total_topics} topics completed
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-[#3f8cbf] hover:bg-[#2d6a94] text-white justify-start [font-family:'Lexend',Helvetica]"
                  onClick={handleAITutorSession}
                >
                  🤖 Ask AI Tutor
                </Button>
                <Button 
                  className="w-full bg-transparent border border-[#3d4f5b] text-white hover:bg-[#2a3540] justify-start [font-family:'Lexend',Helvetica]"
                  onClick={() => handleTakeTest('Mathematics')}
                >
                  📝 Take Practice Test
                </Button>
                <Button 
                  className="w-full bg-transparent border border-[#3d4f5b] text-white hover:bg-[#2a3540] justify-start [font-family:'Lexend',Helvetica]"
                  onClick={() => window.location.href = '/dashboard/materials'}
                >
                  📚 Browse Materials
                </Button>
                <Button 
                  className="w-full bg-transparent border border-[#3d4f5b] text-white hover:bg-[#2a3540] justify-start [font-family:'Lexend',Helvetica]"
                  onClick={() => window.location.href = '/dashboard/progress'}
                >
                  📊 View Progress
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Analytics */}
          <AnalyticsCard type="monthly" />
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="bg-[#1e282d] border-[#3d4f5b]">
        <CardContent className="p-6">
          <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-[#0f1419] rounded-lg">
                <div className="w-10 h-10 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">
                    {activity.type === 'lesson' ? '📖' : 
                     activity.type === 'test' ? '📝' : '🤖'}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                    {activity.title}
                  </h4>
                  <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-xs">
                    {activity.subject} • {activity.time}
                  </p>
                </div>
                {activity.score && (
                  <div className="text-right">
                    <span className="[font-family:'Lexend',Helvetica] font-bold text-[#3f8cbf] text-sm">
                      {activity.score}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracking Demo */}
      <Card className="bg-gradient-to-r from-[#10b981] to-[#059669] border-[#10b981]">
        <CardContent className="p-6 text-center">
          <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-2">
            🎯 Enhanced Analytics Active!
          </h3>
          <p className="[font-family:'Lexend',Helvetica] text-white/90 mb-4">
            Your learning patterns, study streaks, and performance insights are now being tracked with advanced analytics. 
            Get personalized recommendations and detailed progress reports!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              className="bg-white text-[#10b981] hover:bg-gray-100 [font-family:'Lexend',Helvetica] font-bold"
              onClick={() => window.location.href = '/dashboard/progress'}
            >
              View Detailed Analytics
            </Button>
            <Button 
              className="bg-transparent border border-white text-white hover:bg-white/10 [font-family:'Lexend',Helvetica] font-bold"
              onClick={() => handleQuickStudy('Mathematics')}
            >
              Try Quick Study Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};