import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

const features = [
  {
    icon: "/vector---0-2.svg",
    title: "AI-Powered Tutoring",
    description: "Get personalized explanations and step-by-step solutions tailored to your learning style and pace.",
    highlight: true
  },
  {
    icon: "/vector---0-1.svg",
    title: "Smart Progress Tracking",
    description: "Monitor your academic progress with detailed analytics and performance insights.",
    highlight: false
  },
  {
    icon: "/vector---0-3.svg",
    title: "Interactive Practice Tests",
    description: "Take unlimited practice tests with instant feedback and detailed explanations.",
    highlight: false
  },
  {
    icon: "/vector---0.svg",
    title: "24/7 Study Support",
    description: "Access help anytime with our round-the-clock AI assistant for all your academic queries.",
    highlight: false
  },
  {
    icon: "/vector---0-2.svg",
    title: "Curriculum Alignment",
    description: "Content perfectly aligned with Pakistani education boards including Metric, FSc, O & A Levels.",
    highlight: false
  },
  {
    icon: "/vector---0-1.svg",
    title: "Exam Preparation",
    description: "Specialized preparation modules for MDCAT, ECAT, and other competitive examinations.",
    highlight: true
  },
  {
    icon: "/vector---0-3.svg",
    title: "Study Planner",
    description: "Create personalized study schedules that adapt to your goals and available time.",
    highlight: false
  },
  {
    icon: "/vector---0.svg",
    title: "Performance Analytics",
    description: "Detailed insights into your strengths and areas for improvement with actionable recommendations.",
    highlight: false
  },
  {
    icon: "/vector---0-2.svg",
    title: "Multi-Device Sync",
    description: "Seamlessly continue your studies across all your devices with cloud synchronization.",
    highlight: false
  }
];

export const FeaturesGridSection = (): JSX.Element => {
  return (
    <section className="flex items-start justify-center px-4 md:px-10 lg:px-40 py-10 w-full bg-[#0f1419]">
      <div className="flex flex-col max-w-[1200px] w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`${
                feature.highlight 
                  ? 'bg-gradient-to-br from-[#3f8cbf] to-[#2d6a94] border-[#3f8cbf]' 
                  : 'bg-[#1e282d] border-[#3d4f5b]'
              } hover:scale-105 transition-all duration-300 hover:shadow-lg ${
                feature.highlight ? 'hover:shadow-[#3f8cbf]/20' : 'hover:shadow-white/10'
              }`}
            >
              <CardContent className="p-6 flex flex-col gap-4 h-full">
                <div className="w-8 h-8">
                  <div
                    className={`w-full h-full bg-[url(${feature.icon})] bg-[100%_100%] ${
                      feature.highlight ? 'filter brightness-0 invert' : ''
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  <h3 className={`[font-family:'Lexend',Helvetica] font-bold text-lg tracking-[0] leading-6 ${
                    feature.highlight ? 'text-white' : 'text-white'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`[font-family:'Lexend',Helvetica] font-normal text-sm tracking-[0] leading-[21px] ${
                    feature.highlight ? 'text-white/90' : 'text-[#9eafbf]'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features Section */}
        <div className="mt-20 flex flex-col items-center gap-10">
          <div className="text-center">
            <h2 className="[font-family:'Lexend',Helvetica] font-black text-white text-3xl md:text-4xl tracking-[-1.00px] leading-[45px] mb-4">
              Why Students Choose EduGenius
            </h2>
            <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-base tracking-[0] leading-6 max-w-[600px]">
              Join thousands of students who have transformed their academic journey with our innovative learning platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[800px]">
            <div className="flex flex-col items-center text-center gap-4 p-6 bg-[#1e282d] rounded-xl border border-[#3d4f5b]">
              <div className="text-4xl font-black text-[#3f8cbf] [font-family:'Lexend',Helvetica]">
                95%
              </div>
              <h3 className="text-white font-bold text-lg [font-family:'Lexend',Helvetica]">
                Success Rate
              </h3>
              <p className="text-[#9eafbf] text-sm [font-family:'Lexend',Helvetica]">
                Students see significant improvement in their grades within the first month
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-4 p-6 bg-[#1e282d] rounded-xl border border-[#3d4f5b]">
              <div className="text-4xl font-black text-[#3f8cbf] [font-family:'Lexend',Helvetica]">
                50K+
              </div>
              <h3 className="text-white font-bold text-lg [font-family:'Lexend',Helvetica]">
                Active Students
              </h3>
              <p className="text-[#9eafbf] text-sm [font-family:'Lexend',Helvetica]">
                Trusted by students across Pakistan for their academic success
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-4 p-6 bg-[#1e282d] rounded-xl border border-[#3d4f5b]">
              <div className="text-4xl font-black text-[#3f8cbf] [font-family:'Lexend',Helvetica]">
                24/7
              </div>
              <h3 className="text-white font-bold text-lg [font-family:'Lexend',Helvetica]">
                AI Support
              </h3>
              <p className="text-[#9eafbf] text-sm [font-family:'Lexend',Helvetica]">
                Round-the-clock assistance for all your academic questions
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-4 p-6 bg-[#1e282d] rounded-xl border border-[#3d4f5b]">
              <div className="text-4xl font-black text-[#3f8cbf] [font-family:'Lexend',Helvetica]">
                100+
              </div>
              <h3 className="text-white font-bold text-lg [font-family:'Lexend',Helvetica]">
                Subjects Covered
              </h3>
              <p className="text-[#9eafbf] text-sm [font-family:'Lexend',Helvetica]">
                Comprehensive coverage across all major academic subjects
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};