import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useAuth } from "../../../contexts/AuthContext";

export const DashboardOverview = (): JSX.Element => {
  const { profile } = useAuth();

  const stats = [
    {
      title: "Study Streak",
      value: "7 days",
      change: "+2 from last week",
      positive: true,
      icon: "🔥"
    },
    {
      title: "Completed Lessons",
      value: "24",
      change: "+6 this week",
      positive: true,
      icon: "✅"
    },
    {
      title: "Average Score",
      value: "85%",
      change: "+5% improvement",
      positive: true,
      icon: "📊"
    },
    {
      title: "Time Studied",
      value: "12.5h",
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

  const subjects = [
    {
      name: "Mathematics",
      progress: 75,
      color: "#3f8cbf",
      nextTopic: "Calculus Basics"
    },
    {
      name: "Physics",
      progress: 60,
      color: "#10b981",
      nextTopic: "Thermodynamics"
    },
    {
      name: "Chemistry",
      progress: 85,
      color: "#f59e0b",
      nextTopic: "Organic Reactions"
    },
    {
      name: "Biology",
      progress: 45,
      color: "#ef4444",
      nextTopic: "Cell Division"
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
        <Button className="bg-white text-[#3f8cbf] hover:bg-gray-100 [font-family:'Lexend',Helvetica] font-bold">
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
                {subjects.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="[font-family:'Lexend',Helvetica] font-medium text-white">
                        {subject.name}
                      </span>
                      <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                        {subject.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-[#0f1419] rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${subject.progress}%`,
                          backgroundColor: subject.color
                        }}
                      />
                    </div>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-xs">
                      Next: {subject.nextTopic}
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
                <Button className="w-full bg-[#3f8cbf] hover:bg-[#2d6a94] text-white justify-start [font-family:'Lexend',Helvetica]">
                  🤖 Ask AI Tutor
                </Button>
                <Button className="w-full bg-transparent border border-[#3d4f5b] text-white hover:bg-[#2a3540] justify-start [font-family:'Lexend',Helvetica]">
                  📝 Take Practice Test
                </Button>
                <Button className="w-full bg-transparent border border-[#3d4f5b] text-white hover:bg-[#2a3540] justify-start [font-family:'Lexend',Helvetica]">
                  📚 Browse Materials
                </Button>
                <Button className="w-full bg-transparent border border-[#3d4f5b] text-white hover:bg-[#2a3540] justify-start [font-family:'Lexend',Helvetica]">
                  📊 View Progress
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-4">
                Upcoming Tasks
              </h3>
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="p-3 bg-[#0f1419] rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                        {task.title}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-xs">
                      {task.subject} • {task.dueDate}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
    </div>
  );
};