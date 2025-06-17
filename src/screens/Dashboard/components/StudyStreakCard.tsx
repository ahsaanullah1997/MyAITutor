import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { AnalyticsService } from "../../../services/analyticsService";
import { useAuth } from "../../../contexts/AuthContext";

interface StreakInfo {
  currentStreak: number;
  lastStudyDate: string | null;
  streakStatus: 'active' | 'at_risk' | 'broken';
  daysUntilRisk: number;
}

export const StudyStreakCard: React.FC = () => {
  const { user, recordStudySession } = useAuth();
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadStreakInfo = async () => {
      try {
        const info = await AnalyticsService.getStudyStreakInfo(user.id);
        setStreakInfo(info);
      } catch (error) {
        console.error('Error loading streak info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStreakInfo();
  }, [user]);

  const handleQuickStudy = async () => {
    if (!user) return;
    
    try {
      await recordStudySession('lesson', 'Quick Review', 10);
      // Reload streak info
      const info = await AnalyticsService.getStudyStreakInfo(user.id);
      setStreakInfo(info);
    } catch (error) {
      console.error('Error recording quick study:', error);
    }
  };

  if (loading) {
    return (
      <Card className="bg-[#1e282d] border-[#3d4f5b]">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-24">
            <div className="w-4 h-4 border-2 border-[#3f8cbf] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!streakInfo) return null;

  const getStreakColor = () => {
    switch (streakInfo.streakStatus) {
      case 'active': return 'text-green-400';
      case 'at_risk': return 'text-yellow-400';
      case 'broken': return 'text-red-400';
      default: return 'text-[#9eafbf]';
    }
  };

  const getStreakIcon = () => {
    switch (streakInfo.streakStatus) {
      case 'active': return '🔥';
      case 'at_risk': return '⚠️';
      case 'broken': return '💔';
      default: return '📅';
    }
  };

  const getStreakMessage = () => {
    switch (streakInfo.streakStatus) {
      case 'active': 
        return streakInfo.currentStreak > 0 
          ? `${streakInfo.currentStreak} day streak! Keep it up!`
          : 'Start your study streak today!';
      case 'at_risk': 
        return 'Your streak is at risk! Study today to keep it alive.';
      case 'broken': 
        return 'Time to start a new streak! Every expert was once a beginner.';
      default: 
        return 'Track your daily study progress';
    }
  };

  return (
    <Card className={`border-2 transition-all duration-300 ${
      streakInfo.streakStatus === 'active' && streakInfo.currentStreak > 0
        ? 'bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30'
        : streakInfo.streakStatus === 'at_risk'
        ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
        : 'bg-[#1e282d] border-[#3d4f5b]'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg">
            Study Streak {getStreakIcon()}
          </h3>
          {streakInfo.currentStreak > 0 && (
            <div className="text-right">
              <div className={`text-2xl font-black [font-family:'Lexend',Helvetica] ${getStreakColor()}`}>
                {streakInfo.currentStreak}
              </div>
              <p className="text-[#9eafbf] text-xs [font-family:'Lexend',Helvetica]">
                days
              </p>
            </div>
          )}
        </div>

        <p className={`[font-family:'Lexend',Helvetica] text-sm mb-4 ${getStreakColor()}`}>
          {getStreakMessage()}
        </p>

        {streakInfo.lastStudyDate && (
          <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-xs mb-4">
            Last study: {new Date(streakInfo.lastStudyDate).toLocaleDateString()}
          </p>
        )}

        {/* Streak milestones */}
        <div className="mb-4">
          <div className="flex justify-between text-xs [font-family:'Lexend',Helvetica] text-[#9eafbf] mb-2">
            <span>0</span>
            <span>7</span>
            <span>30</span>
            <span>100</span>
          </div>
          <div className="w-full bg-[#0f1419] rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
              style={{ 
                width: `${Math.min((streakInfo.currentStreak / 100) * 100, 100)}%` 
              }}
            />
          </div>
          <div className="flex justify-between text-xs [font-family:'Lexend',Helvetica] text-[#9eafbf] mt-1">
            <span>Start</span>
            <span>Week</span>
            <span>Month</span>
            <span>Master</span>
          </div>
        </div>

        {(streakInfo.streakStatus === 'at_risk' || streakInfo.streakStatus === 'broken') && (
          <Button
            onClick={handleQuickStudy}
            className="w-full bg-[#3f8cbf] hover:bg-[#2d6a94] text-white [font-family:'Lexend',Helvetica] font-medium text-sm"
          >
            {streakInfo.streakStatus === 'at_risk' ? 'Save My Streak!' : 'Start New Streak'}
          </Button>
        )}

        {streakInfo.currentStreak > 0 && (
          <div className="mt-4 text-center">
            <p className="text-[#9eafbf] text-xs [font-family:'Lexend',Helvetica]">
              {streakInfo.currentStreak >= 7 && '🏆 Week Warrior! '}
              {streakInfo.currentStreak >= 30 && '🔥 Month Master! '}
              {streakInfo.currentStreak >= 100 && '👑 Streak Legend! '}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};