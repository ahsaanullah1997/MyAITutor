import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { AnalyticsService, MonthlyAnalytics, LearningInsights } from "../../../services/analyticsService";
import { useAuth } from "../../../contexts/AuthContext";

export const ProgressPage = (): JSX.Element => {
  const { user, progressStats, subjectProgress } = useAuth();
  const [monthlyAnalytics, setMonthlyAnalytics] = useState<MonthlyAnalytics | null>(null);
  const [learningInsights, setLearningInsights] = useState<LearningInsights | null>(null);
  const [performanceTrends, setPerformanceTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('month');

  useEffect(() => {
    if (!user) return;

    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [monthly, insights, trends] = await Promise.all([
          AnalyticsService.getMonthlyAnalytics(user.id),
          AnalyticsService.getLearningInsights(user.id),
          AnalyticsService.getPerformanceTrends(user.id, selectedTimeframe === 'week' ? 7 : selectedTimeframe === 'month' ? 30 : 90)
        ]);

        setMonthlyAnalytics(monthly);
        setLearningInsights(insights);
        setPerformanceTrends(trends);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [user, selectedTimeframe]);

  const subjects = [
    {
      name: "Mathematics",
      progress: 75,
      color: "#3f8cbf",
      completedTopics: 15,
      totalTopics: 20,
      recentScores: [85, 92, 78, 88, 95]
    },
    {
      name: "Physics",
      progress: 60,
      color: "#10b981",
      completedTopics: 12,
      totalTopics: 20,
      recentScores: [78, 82, 75, 88, 85]
    },
    {
      name: "Chemistry",
      progress: 85,
      color: "#f59e0b",
      completedTopics: 17,
      totalTopics: 20,
      recentScores: [90, 88, 92, 85, 94]
    },
    {
      name: "Biology",
      progress: 45,
      color: "#ef4444",
      completedTopics: 9,
      totalTopics: 20,
      recentScores: [72, 78, 75, 80, 82]
    }
  ];

  const achievements = [
    {
      title: "Study Streak Master",
      description: "Studied for 7 consecutive days",
      icon: "🔥",
      earned: true
    },
    {
      title: "Math Wizard",
      description: "Scored 90+ in 5 math tests",
      icon: "🧮",
      earned: true
    },
    {
      title: "Science Explorer",
      description: "Complete all science subjects",
      icon: "🔬",
      earned: false
    },
    {
      title: "Perfect Score",
      description: "Get 100% in any test",
      icon: "💯",
      earned: false
    }
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-[#3f8cbf] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white [font-family:'Lexend',Helvetica]">Loading analytics...</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="[font-family:'Lexend',Helvetica] font-bold text-white text-2xl md:text-3xl mb-2">
              Your Progress 📈
            </h1>
            <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-base">
              Track your learning journey and celebrate your achievements.
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="flex justify-center gap-2">
            {(['week', 'month', 'all'] as const).map((timeframe) => (
              <Button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-lg [font-family:'Lexend',Helvetica] font-medium text-sm ${
                  selectedTimeframe === timeframe
                    ? 'bg-[#3f8cbf] text-white'
                    : 'bg-[#1e282d] border border-[#3d4f5b] text-[#9eafbf] hover:bg-[#2a3540] hover:text-white'
                }`}
              >
                {timeframe === 'all' ? 'All Time' : timeframe === 'week' ? 'This Week' : 'This Month'}
              </Button>
            ))}
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="bg-[#1e282d] border-[#3d4f5b]">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-[#3f8cbf] mb-2 [font-family:'Lexend',Helvetica]">
                  {subjectProgress.length > 0 ? 
                    Math.round(subjectProgress.reduce((sum, s) => sum + s.progress_percentage, 0) / subjectProgress.length) : 0}%
                </div>
                <p className="[font-family:'Lexend',Helvetica] text-white font-medium">
                  Overall Progress
                </p>
                <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                  Across all subjects
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1e282d] border-[#3d4f5b]">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-[#10b981] mb-2 [font-family:'Lexend',Helvetica]">
                  {subjectProgress.reduce((sum, s) => sum + s.completed_topics, 0)}
                </div>
                <p className="[font-family:'Lexend',Helvetica] text-white font-medium">
                  Topics Completed
                </p>
                <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                  Out of {subjectProgress.reduce((sum, s) => sum + s.total_topics, 0)} total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1e282d] border-[#3d4f5b]">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-[#f59e0b] mb-2 [font-family:'Lexend',Helvetica]">
                  {progressStats?.average_test_score || 0}%
                </div>
                <p className="[font-family:'Lexend',Helvetica] text-white font-medium">
                  Average Score
                </p>
                <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                  Last 30 days
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1e282d] border-[#3d4f5b]">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-[#ef4444] mb-2 [font-family:'Lexend',Helvetica]">
                  {progressStats?.study_streak_days || 0}
                </div>
                <p className="[font-family:'Lexend',Helvetica] text-white font-medium">
                  Study Streak
                </p>
                <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                  Days in a row
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Analytics Section */}
          {monthlyAnalytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Summary */}
              <Card className="bg-[#1e282d] border-[#3d4f5b]">
                <CardContent className="p-6">
                  <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                    Monthly Summary 📊
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-[#0f1419] rounded-lg">
                      <div className="text-2xl font-bold text-[#3f8cbf] mb-1 [font-family:'Lexend',Helvetica]">
                        {Math.round(monthlyAnalytics.totalStudyTime / 60 * 10) / 10}h
                      </div>
                      <p className="text-[#9eafbf] text-xs [font-family:'Lexend',Helvetica]">Study Time</p>
                    </div>
                    
                    <div className="text-center p-4 bg-[#0f1419] rounded-lg">
                      <div className="text-2xl font-bold text-[#10b981] mb-1 [font-family:'Lexend',Helvetica]">
                        {monthlyAnalytics.lessonsCompleted}
                      </div>
                      <p className="text-[#9eafbf] text-xs [font-family:'Lexend',Helvetica]">Lessons</p>
                    </div>
                    
                    <div className="text-center p-4 bg-[#0f1419] rounded-lg">
                      <div className="text-2xl font-bold text-[#f59e0b] mb-1 [font-family:'Lexend',Helvetica]">
                        {monthlyAnalytics.testsCompleted}
                      </div>
                      <p className="text-[#9eafbf] text-xs [font-family:'Lexend',Helvetica]">Tests</p>
                    </div>
                    
                    <div className="text-center p-4 bg-[#0f1419] rounded-lg">
                      <div className="text-2xl font-bold text-[#ef4444] mb-1 [font-family:'Lexend',Helvetica]">
                        {monthlyAnalytics.averageTestScore}%
                      </div>
                      <p className="text-[#9eafbf] text-xs [font-family:'Lexend',Helvetica]">Avg Score</p>
                    </div>
                  </div>

                  {/* Subject Breakdown */}
                  {monthlyAnalytics.subjectBreakdown.length > 0 && (
                    <div>
                      <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm mb-3">
                        Subject Time Distribution
                      </h4>
                      <div className="space-y-2">
                        {monthlyAnalytics.subjectBreakdown.slice(0, 4).map((subject, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                              {subject.subject}
                            </span>
                            <span className="[font-family:'Lexend',Helvetica] text-white text-sm">
                              {Math.round(subject.time / 60 * 10) / 10}h
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Learning Insights */}
              {learningInsights && (
                <Card className="bg-[#1e282d] border-[#3d4f5b]">
                  <CardContent className="p-6">
                    <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                      Learning Insights 🧠
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm mb-2">
                          📅 Best Study Time
                        </h4>
                        <p className="[font-family:'Lexend',Helvetica] text-[#3f8cbf] text-sm">
                          {learningInsights.preferredStudyTime}
                        </p>
                      </div>
                      
                      {learningInsights.strongSubjects.length > 0 && (
                        <div>
                          <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm mb-2">
                            💪 Strong Subjects
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {learningInsights.strongSubjects.map((subject, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs [font-family:'Lexend',Helvetica]"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {learningInsights.weakSubjects.length > 0 && (
                        <div>
                          <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm mb-2">
                            📚 Focus Areas
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {learningInsights.weakSubjects.map((subject, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs [font-family:'Lexend',Helvetica]"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {learningInsights.recommendations.length > 0 && (
                        <div>
                          <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm mb-2">
                            💡 Recommendations
                          </h4>
                          <ul className="space-y-1">
                            {learningInsights.recommendations.slice(0, 3).map((rec, index) => (
                              <li key={index} className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-xs">
                                • {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Subject Progress */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                Subject Progress
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subjectProgress.map((subject, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white">
                        {subject.subject_name}
                      </h4>
                      <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                        {subject.completed_topics}/{subject.total_topics} topics
                      </span>
                    </div>
                    
                    <div className="w-full bg-[#0f1419] rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-300 bg-[#3f8cbf]"
                        style={{ width: `${subject.progress_percentage}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="[font-family:'Lexend',Helvetica] font-bold text-white">
                        {subject.progress_percentage}%
                      </span>
                      <div className="text-xs text-[#9eafbf] [font-family:'Lexend',Helvetica]">
                        Last accessed: {new Date(subject.last_accessed).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                Achievements
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border text-center ${
                      achievement.earned
                        ? 'bg-[#3f8cbf]/10 border-[#3f8cbf]'
                        : 'bg-[#0f1419] border-[#3d4f5b]'
                    }`}
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <h4 className={`[font-family:'Lexend',Helvetica] font-medium mb-1 ${
                      achievement.earned ? 'text-[#3f8cbf]' : 'text-[#9eafbf]'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-xs">
                      {achievement.description}
                    </p>
                    {achievement.earned && (
                      <div className="mt-2">
                        <span className="text-xs bg-[#3f8cbf] text-white px-2 py-1 rounded-full [font-family:'Lexend',Helvetica]">
                          Earned
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Trends */}
          {performanceTrends.length > 0 && (
            <Card className="bg-[#1e282d] border-[#3d4f5b]">
              <CardContent className="p-6">
                <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                  Performance Trends 📊
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-[#0f1419] rounded-lg">
                      <div className="text-xl font-bold text-[#3f8cbf] mb-1 [font-family:'Lexend',Helvetica]">
                        {performanceTrends.length}
                      </div>
                      <p className="text-[#9eafbf] text-xs [font-family:'Lexend',Helvetica]">Active Days</p>
                    </div>
                    
                    <div className="text-center p-4 bg-[#0f1419] rounded-lg">
                      <div className="text-xl font-bold text-[#10b981] mb-1 [font-family:'Lexend',Helvetica]">
                        {Math.round(performanceTrends.reduce((sum, day) => sum + day.studyTime, 0) / 60 * 10) / 10}h
                      </div>
                      <p className="text-[#9eafbf] text-xs [font-family:'Lexend',Helvetica]">Total Time</p>
                    </div>
                    
                    <div className="text-center p-4 bg-[#0f1419] rounded-lg">
                      <div className="text-xl font-bold text-[#f59e0b] mb-1 [font-family:'Lexend',Helvetica]">
                        {Math.round(performanceTrends.reduce((sum, day) => sum + day.sessions, 0) / performanceTrends.length * 10) / 10}
                      </div>
                      <p className="text-[#9eafbf] text-xs [font-family:'Lexend',Helvetica]">Avg Sessions/Day</p>
                    </div>
                  </div>
                  
                  <p className="text-[#9eafbf] text-sm [font-family:'Lexend',Helvetica] text-center">
                    Detailed trend visualization coming soon! 📈
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};