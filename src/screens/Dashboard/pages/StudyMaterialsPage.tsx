import React, { useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ProtectedRoute } from "../../../components/ProtectedRoute";

export const StudyMaterialsPage = (): JSX.Element => {
  const [selectedSubject, setSelectedSubject] = useState('all');

  const subjects = ['all', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];

  const materials = [
    {
      id: 1,
      title: "Quadratic Equations - Complete Guide",
      subject: "Mathematics",
      type: "PDF",
      size: "2.5 MB",
      downloadCount: 1250,
      rating: 4.8,
      description: "Comprehensive guide covering all aspects of quadratic equations with examples and practice problems."
    },
    {
      id: 2,
      title: "Newton's Laws of Motion",
      subject: "Physics",
      type: "Video",
      size: "45 min",
      downloadCount: 890,
      rating: 4.9,
      description: "Interactive video explaining Newton's three laws with real-world applications and demonstrations."
    },
    {
      id: 3,
      title: "Organic Chemistry Reactions",
      subject: "Chemistry",
      type: "PDF",
      size: "3.2 MB",
      downloadCount: 675,
      rating: 4.7,
      description: "Detailed notes on organic chemistry reactions with mechanisms and practice questions."
    },
    {
      id: 4,
      title: "Cell Structure and Function",
      subject: "Biology",
      type: "Interactive",
      size: "Web App",
      downloadCount: 1100,
      rating: 4.6,
      description: "Interactive 3D models of cell structures with detailed explanations and quizzes."
    },
    {
      id: 5,
      title: "Calculus Fundamentals",
      subject: "Mathematics",
      type: "PDF",
      size: "4.1 MB",
      downloadCount: 980,
      rating: 4.8,
      description: "Introduction to calculus concepts including limits, derivatives, and integrals."
    },
    {
      id: 6,
      title: "Thermodynamics Principles",
      subject: "Physics",
      type: "Video",
      size: "38 min",
      downloadCount: 720,
      rating: 4.5,
      description: "Comprehensive overview of thermodynamics laws and their applications."
    }
  ];

  const filteredMaterials = selectedSubject === 'all' 
    ? materials 
    : materials.filter(material => material.subject === selectedSubject);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF': return '📄';
      case 'Video': return '🎥';
      case 'Interactive': return '🎮';
      default: return '📚';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PDF': return 'bg-red-500/20 text-red-400';
      case 'Video': return 'bg-blue-500/20 text-blue-400';
      case 'Interactive': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="[font-family:'Lexend',Helvetica] font-bold text-white text-2xl md:text-3xl mb-2">
              Study Materials 📚
            </h1>
            <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-base">
              Access comprehensive study materials, notes, and resources for all subjects.
            </p>
          </div>

          {/* Subject Filter */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-4">
                Filter by Subject
              </h3>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <Button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`${
                      selectedSubject === subject
                        ? 'bg-[#3f8cbf] text-white'
                        : 'bg-[#0f1419] border border-[#3d4f5b] text-[#9eafbf] hover:bg-[#2a3540] hover:text-white'
                    } [font-family:'Lexend',Helvetica] font-medium`}
                  >
                    {subject === 'all' ? 'All Subjects' : subject}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <Card key={material.id} className="bg-[#1e282d] border-[#3d4f5b] hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getTypeIcon(material.type)}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(material.type)} [font-family:'Lexend',Helvetica]`}>
                        {material.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                        {material.rating}
                      </span>
                    </div>
                  </div>

                  <h4 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-2">
                    {material.title}
                  </h4>

                  <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm mb-4 line-clamp-3">
                    {material.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="[font-family:'Lexend',Helvetica] text-[#3f8cbf] font-medium text-sm">
                      {material.subject}
                    </span>
                    <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                      {material.size}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-xs">
                      {material.downloadCount} downloads
                    </span>
                    <Button className="bg-[#3f8cbf] hover:bg-[#2d6a94] text-white px-4 py-2 [font-family:'Lexend',Helvetica] font-medium text-sm">
                      {material.type === 'Video' ? 'Watch' : 
                       material.type === 'Interactive' ? 'Open' : 'Download'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Upload Section */}
          <Card className="bg-gradient-to-r from-[#3f8cbf] to-[#2d6a94] border-[#3f8cbf]">
            <CardContent className="p-6 text-center">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-2">
                Need More Materials?
              </h3>
              <p className="[font-family:'Lexend',Helvetica] text-white/90 mb-4">
                Upload your own study materials or request specific topics from our AI tutor.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="bg-white text-[#3f8cbf] hover:bg-gray-100 [font-family:'Lexend',Helvetica] font-bold">
                  Upload Materials
                </Button>
                <Button className="bg-transparent border border-white text-white hover:bg-white/10 [font-family:'Lexend',Helvetica] font-bold">
                  Request Topic
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};