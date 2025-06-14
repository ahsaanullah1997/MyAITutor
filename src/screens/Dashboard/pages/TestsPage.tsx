import React, { useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ProtectedRoute } from "../../../components/ProtectedRoute";

export const TestsPage = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState('available');

  const availableTests = [
    {
      id: 1,
      title: "Algebra Fundamentals",
      subject: "Mathematics",
      questions: 25,
      duration: 45,
      difficulty: "Medium",
      attempts: 0,
      bestScore: null
    },
    {
      id: 2,
      title: "Newton's Laws Quiz",
      subject: "Physics",
      questions: 15,
      duration: 30,
      difficulty: "Easy",
      attempts: 2,
      bestScore: 85
    },
    {
      id: 3,
      title: "Organic Chemistry Test",
      subject: "Chemistry",
      questions: 30,
      duration: 60,
      difficulty: "Hard",
      attempts: 1,
      bestScore: 78
    },
    {
      id: 4,
      title: "Cell Biology Assessment",
      subject: "Biology",
      questions: 20,
      duration: 40,
      difficulty: "Medium",
      attempts: 0,
      bestScore: null
    }
  ];

  const completedTests = [
    {
      id: 1,
      title: "Trigonometry Basics",
      subject: "Mathematics",
      score: 92,
      totalQuestions: 20,
      correctAnswers: 18,
      completedAt: "2024-01-15",
      duration: 35
    },
    {
      id: 2,
      title: "Thermodynamics Quiz",
      subject: "Physics",
      score: 78,
      totalQuestions: 15,
      correctAnswers: 12,
      completedAt: "2024-01-14",
      duration: 28
    },
    {
      id: 3,
      title: "Periodic Table Test",
      subject: "Chemistry",
      score: 88,
      totalQuestions: 25,
      correctAnswers: 22,
      completedAt: "2024-01-13",
      duration: 42
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'Hard': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="[font-family:'Lexend',Helvetica] font-bold text-white text-2xl md:text-3xl mb-2">
              Tests & Quizzes 📝
            </h1>
            <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-base">
              Test your knowledge and track your progress with our comprehensive assessments.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="bg-[#1e282d] border-[#3d4f5b]">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#3f8cbf] mb-1 [font-family:'Lexend',Helvetica]">
                  12
                </div>
                <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                  Tests Completed
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1e282d] border-[#3d4f5b]">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#10b981] mb-1 [font-family:'Lexend',Helvetica]">
                  84%
                </div>
                <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                  Average Score
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1e282d] border-[#3d4f5b]">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#f59e0b] mb-1 [font-family:'Lexend',Helvetica]">
                  8
                </div>
                <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                  Available Tests
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1e282d] border-[#3d4f5b]">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#ef4444] mb-1 [font-family:'Lexend',Helvetica]">
                  3
                </div>
                <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                  This Week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <div className="flex gap-4 mb-6">
                <Button
                  onClick={() => setActiveTab('available')}
                  className={`${
                    activeTab === 'available'
                      ? 'bg-[#3f8cbf] text-white'
                      : 'bg-[#0f1419] border border-[#3d4f5b] text-[#9eafbf] hover:bg-[#2a3540] hover:text-white'
                  } [font-family:'Lexend',Helvetica] font-medium`}
                >
                  Available Tests
                </Button>
                <Button
                  onClick={() => setActiveTab('completed')}
                  className={`${
                    activeTab === 'completed'
                      ? 'bg-[#3f8cbf] text-white'
                      : 'bg-[#0f1419] border border-[#3d4f5b] text-[#9eafbf] hover:bg-[#2a3540] hover:text-white'
                  } [font-family:'Lexend',Helvetica] font-medium`}
                >
                  Completed Tests
                </Button>
              </div>

              {/* Available Tests */}
              {activeTab === 'available' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableTests.map((test) => (
                    <Card key={test.id} className="bg-[#0f1419] border-[#3d4f5b]">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg">
                            {test.title}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(test.difficulty)} [font-family:'Lexend',Helvetica]`}>
                            {test.difficulty}
                          </span>
                        </div>

                        <p className="[font-family:'Lexend',Helvetica] text-[#3f8cbf] font-medium text-sm mb-4">
                          {test.subject}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                              Questions:
                            </span>
                            <span className="[font-family:'Lexend',Helvetica] text-white text-sm">
                              {test.questions}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                              Duration:
                            </span>
                            <span className="[font-family:'Lexend',Helvetica] text-white text-sm">
                              {test.duration} min
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                              Attempts:
                            </span>
                            <span className="[font-family:'Lexend',Helvetica] text-white text-sm">
                              {test.attempts}
                            </span>
                          </div>
                          {test.bestScore && (
                            <div className="flex justify-between">
                              <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                                Best Score:
                              </span>
                              <span className={`[font-family:'Lexend',Helvetica] text-sm font-bold ${getScoreColor(test.bestScore)}`}>
                                {test.bestScore}%
                              </span>
                            </div>
                          )}
                        </div>

                        <Button className="w-full bg-[#3f8cbf] hover:bg-[#2d6a94] text-white [font-family:'Lexend',Helvetica] font-medium">
                          {test.attempts > 0 ? 'Retake Test' : 'Start Test'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Completed Tests */}
              {activeTab === 'completed' && (
                <div className="space-y-4">
                  {completedTests.map((test) => (
                    <Card key={test.id} className="bg-[#0f1419] border-[#3d4f5b]">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-1">
                              {test.title}
                            </h4>
                            <p className="[font-family:'Lexend',Helvetica] text-[#3f8cbf] font-medium text-sm mb-2">
                              {test.subject}
                            </p>
                            <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                              Completed on {test.completedAt} • {test.duration} minutes
                            </p>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className={`text-2xl font-bold mb-1 [font-family:'Lexend',Helvetica] ${getScoreColor(test.score)}`}>
                                {test.score}%
                              </div>
                              <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-xs">
                                {test.correctAnswers}/{test.totalQuestions} correct
                              </p>
                            </div>

                            <Button className="bg-[#0f1419] border border-[#3d4f5b] text-white hover:bg-[#2a3540] [font-family:'Lexend',Helvetica] font-medium">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Practice Recommendations */}
          <Card className="bg-gradient-to-r from-[#3f8cbf] to-[#2d6a94] border-[#3f8cbf]">
            <CardContent className="p-6 text-center">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-2">
                Ready for More Practice?
              </h3>
              <p className="[font-family:'Lexend',Helvetica] text-white/90 mb-4">
                Based on your performance, we recommend focusing on these areas for improvement.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="bg-white text-[#3f8cbf] hover:bg-gray-100 [font-family:'Lexend',Helvetica] font-bold">
                  Generate Custom Test
                </Button>
                <Button className="bg-transparent border border-white text-white hover:bg-white/10 [font-family:'Lexend',Helvetica] font-bold">
                  Practice Weak Areas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};