import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { AnalyticsService, WeeklyAnalytics, MonthlyAnalytics, LearningInsights } from "../../../services/analyticsService";
import { useAuth } from "../../../contexts/AuthContext";

interface AnalyticsCardProps {
  type: 'weekly' | 'monthly' | 'insights';
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ type }) => {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<WeeklyAnalytics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyAnalytics | null>(null);
  const [insightsData, setInsightsData] = useState<LearningInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadAnalytics = async () => {
      setLoading(true);
      try {
        switch (type) {
          case 'weekly':
            const weekly = await AnalyticsService.getWeeklyAnalytics(user.id);
            setWeeklyData(weekly);
            break;
          case 'monthly':
            const monthly = await AnalyticsService.getMonthlyAnalytics(user.id);
            setMonthlyData(monthly);
            break;
          case 'insights':
            const insights = await AnalyticsService.getLearningInsights(user.id);
            setInsightsData(insights);
            break;
        }
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [user, type]);

  if (loading) {
    return (
      <Card className="bg-[#1e282d] border-[#3d4f5b]">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-[#3f8cbf] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'weekly' && weeklyData) {
    return (
      <Card className="bg-[#1e282d] border-[#3d4f5b]">
        <CardContent className="p-6">
          <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-4">
            This Week's Progress 📊
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">Study Time</span>
              <span className="[font-family:'Lexend',Helvetica] font-bold text-white">
                {Math.round(weeklyData.totalStudyTime / 60 * 10) / 10}h
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">Sessions</span>
              <span className="[font-family:'Lexend',Helvetica] font-bold text-white">
                {weeklyData.sessionsCompleted}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">Avg. Session</span>
              <span className="[font-family:'Lexend',Helvetica] font-bold text-white">
                {weeklyData.averageSessionLength} min
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">Top Subject</span>
              <span className="[font-family:'Lexend',Helvetica] font-bold text-[#3f8cbf]">
                {weeklyData.mostStudiedSubject}
              </span>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">Weekly Goal</span>
                <span className="[font-family:'Lexend',Helvetica] font-bold text-white">
                  {Math.round(weeklyData.weeklyGoalProgress)}%
                </span>
              </div>
              <div className="w-full bg-[#0f1419] rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-[#3f8cbf] transition-all duration-300"
                  style={{ width: `${Math.min(weeklyData.weeklyGoalProgress, 100)}%` }}
                />
              </div>
            </div>
            
            {weeklyData.streakDays > 0 && (
              <div className="mt-4 p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  <span className="[font-family:'Lexend',Helvetica] font-bold text-orange-400">
                    {weeklyData.streakDays} day streak!
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'monthly' && monthlyData) {
    return (
      <Card className="bg-[#1e282d] border-[#3d4f5b]">
        <CardContent className="p-6">
          <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-4">
            Monthly Summary 📈
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-[#0f1419] rounded-lg">
                <div className="text-2xl font-bold text-[#3f8cbf] [font-family:'Lexend',Helvetica]">
                  {Math.round(monthlyData.totalStudyTime / 60 * 10) / 10}h
                </div>
                <p className="text-[#9eafbf] text-xs [font-family:'Lexend',Helvetica]">Study Time</p>
              </div>
              
              <div className="text-center p-3 bg-[#0f1419] rounded-lg">
                <div className="text-2xl font-bold text-[#10b981] [font-family:'Lexend',Helvetica]">
                  {monthlyData.lessonsCompleted}
                </div>
                <p className="text-[#9eafbf] text-xs [font-family:'Lexend',Helvetica]">Lessons</p>
              </div>
              
              <div className="text-center p-3 bg-[#0f1419] rounded-lg">
                <div className="text-2xl font-bold text-[#f59e0b] [font-family:'Lexend',Helvetica]">
                  {monthlyData.testsCompleted}
                </div>
                <p className="text-[#9eafbf] text-xs [font-family:'Lexend',Helvetica]">Tests</p>
              </div>
              
              <div className="text-center p-3 bg-[#0f1419] rounded-lg">
                <div className="text-2xl font-bold text-[#ef4444] [font-family:'Lexend',Helvetica]">
                  {monthlyData.averageTestScore}%
                </div>
                <p className="text-[#9eafbf] text-xs [font-family:'Lexend',Helvetica]">Avg Score</p>
              </div>
            </div>
            
            {monthlyData.achievements.length > 0 && (
              <div className="mt-4">
                <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm mb-2">
                  🏆 Achievements
                </h4>
                <div className="flex flex-wrap gap-2">
                  {monthlyData.achievements.map((achievement, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-[#3f8cbf]/20 text-[#3f8cbf] rounded-full text-xs [font-family:'Lexend',Helvetica]"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {monthlyData.improvementAreas.length > 0 && (
              <div className="mt-4">
                <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm mb-2">
                  📚 Focus Areas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {monthlyData.improvementAreas.slice(0, 3).map((area, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs [font-family:'Lexend',Helvetica]"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'insights' && insightsData) {
    return (
      <Card className="bg-[#1e282d] border-[#3d4f5b]">
        <CardContent className="p-6">
          <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-4">
            Learning Insights 🧠
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm mb-2">
                📅 Best Study Time
              </h4>
              <p className="[font-family:'Lexend',Helvetica] text-[#3f8cbf] text-sm">
                {insightsData.preferredStudyTime}
              </p>
            </div>
            
            {insightsData.strongSubjects.length > 0 && (
              <div>
                <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm mb-2">
                  💪 Strong Subjects
                </h4>
                <div className="flex flex-wrap gap-2">
                  {insightsData.strongSubjects.slice(0, 3).map((subject, index) => (
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
            
            {insightsData.studyPatterns.length > 0 && (
              <div>
                <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm mb-2">
                  📊 Study Patterns
                </h4>
                <ul className="space-y-1">
                  {insightsData.studyPatterns.slice(0, 2).map((pattern, index) => (
                    <li key={index} className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-xs">
                      • {pattern}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {insightsData.recommendations.length > 0 && (
              <div>
                <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm mb-2">
                  💡 Recommendations
                </h4>
                <ul className="space-y-1">
                  {insightsData.recommendations.slice(0, 2).map((rec, index) => (
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
    );
  }

  return null;
};