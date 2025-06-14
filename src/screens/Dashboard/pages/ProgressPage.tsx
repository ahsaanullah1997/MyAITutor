import React from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent } from "../../../components/ui/card";
import { ProtectedRoute } from "../../../components/ProtectedRoute";

export const ProgressPage = (): JSX.Element => {
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

          {/* Overall Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-[#1e282d] border-[#3d4f5b]">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-[#3f8cbf] mb-2 [font-family:'Lexend',Helvetica]">
                  66%
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
                  53
                </div>
                <p className="[font-family:'Lexend',Helvetica] text-white font-medium">
                  Topics Completed
                </p>
                <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                  Out of 80 total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1e282d] border-[#3d4f5b]">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-[#f59e0b] mb-2 [font-family:'Lexend',Helvetica]">
                  84%
                </div>
                <p className="[font-family:'Lexend',Helvetica] text-white font-medium">
                  Average Score
                </p>
                <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                  Last 30 days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Subject Progress */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                Subject Progress
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subjects.map((subject, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white">
                        {subject.name}
                      </h4>
                      <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                        {subject.completedTopics}/{subject.totalTopics} topics
                      </span>
                    </div>
                    
                    <div className="w-full bg-[#0f1419] rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${subject.progress}%`,
                          backgroundColor: subject.color
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="[font-family:'Lexend',Helvetica] font-bold text-white">
                        {subject.progress}%
                      </span>
                      <div className="flex gap-1">
                        {subject.recentScores.map((score, scoreIndex) => (
                          <div
                            key={scoreIndex}
                            className="w-2 h-8 bg-[#0f1419] rounded-sm relative overflow-hidden"
                          >
                            <div
                              className="absolute bottom-0 w-full rounded-sm"
                              style={{
                                height: `${score}%`,
                                backgroundColor: subject.color
                              }}
                            />
                          </div>
                        ))}
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
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};