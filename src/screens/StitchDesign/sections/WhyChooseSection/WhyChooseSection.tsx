import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

// Feature data for "Why Choose EduGenius?" section
const features = [
  {
    icon: "/vector---0-2.svg",
    title: "Comprehensive Curriculum",
    description:
      "Covers Metric, FSc, O-levels, A-levels, and competitive exams like MDCAT and ECAT.",
  },
  {
    icon: "/vector---0-1.svg",
    title: "Adaptive Learning",
    description: "AI-powered tutoring adapts to your learning pace and style.",
  },
  {
    icon: "/vector---0-3.svg",
    title: "Flexible Study Schedules",
    description: "Study anytime, anywhere with our flexible platform.",
  },
];

// Course data for "Our Courses" section
const courses = [
  {
    image: "..//depth-8--frame-0.png",
    title: "Metric & FSc",
    description:
      "Build a strong foundation with our comprehensive Metric and FSc courses.",
  },
  {
    image: "..//depth-8--frame-0-1.png",
    title: "O & A Levels",
    description:
      "Achieve top grades with our tailored O and A Levels programs.",
  },
  {
    image: "..//depth-8--frame-0-2.png",
    title: "Competitive Exams",
    description:
      "Prepare effectively for MDCAT, ECAT, and other competitive exams.",
  },
];

export const WhyChooseSection = (): JSX.Element => {
  return (
    <section className="flex items-start justify-center px-4 md:px-6 lg:px-10 xl:px-40 py-5 w-full">
      <div className="flex flex-col max-w-[960px] w-full">
        {/* Hero Banner */}
        <div className="w-full mb-6 md:mb-10">
          <div className="p-2 md:p-4">
            <div className="h-[300px] sm:h-[400px] md:h-[480px] rounded-xl overflow-hidden relative [background:linear-gradient(90deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.4)_100%),url(..//depth-6--frame-0.png)_50%_50%_/_cover]">
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                <div className="max-w-[896px] flex flex-col gap-2 text-center">
                  <h1 className="[font-family:'Lexend',Helvetica] font-black text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[-2.00px] leading-[1.2]">
                    Your Personalized AI Tutor for Academic Success
                  </h1>
                  <p className="[font-family:'Lexend',Helvetica] font-normal text-white text-sm sm:text-base tracking-[0] leading-6 max-w-[600px] mx-auto">
                    EduGenius offers AI-powered tutoring tailored for Pakistani
                    students, covering Metric, FSc, O-levels, A-levels, and
                    competitive exam preparation like MDCAT and ECAT.
                  </p>
                </div>
              </div>
              <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2">
                <Button className="h-10 md:h-12 px-4 md:px-5 bg-[#3f8cbf] rounded-3xl [font-family:'Lexend',Helvetica] font-bold text-sm md:text-base">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose EduGenius? Section */}
        <div className="flex flex-col items-start gap-6 md:gap-10 px-2 md:px-4 py-6 md:py-10 w-full">
          <div className="gap-4 flex flex-col items-start w-full">
            <div className="max-w-[720px]">
              <h2 className="[font-family:'Lexend',Helvetica] font-black text-white text-2xl sm:text-3xl md:text-4xl tracking-[-1.00px] leading-[1.2] md:leading-[45px]">
                Why Choose EduGenius?
              </h2>
            </div>
            <div className="max-w-[720px]">
              <p className="[font-family:'Lexend',Helvetica] font-normal text-white text-sm md:text-base tracking-[0] leading-6">
                EduGenius provides a unique learning experience tailored to the
                needs of Pakistani students.
              </p>
            </div>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 w-full">
              {features.map((feature, index) => (
                <Card key={index} className="bg-[#1e282d] border-[#3d4f5b] hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4 md:p-6 flex flex-col gap-3">
                    <div className="w-6 h-6">
                      <div
                        className={`w-full h-full bg-[url(${feature.icon})] bg-[100%_100%]`}
                      />
                    </div>
                    <div className="flex flex-col gap-1 md:gap-2">
                      <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-sm md:text-base tracking-[0] leading-5">
                        {feature.title}
                      </h3>
                      <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-xs md:text-sm tracking-[0] leading-[18px] md:leading-[21px]">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Our Courses Section */}
        <div className="flex flex-col items-start gap-6 md:gap-10 px-2 md:px-4 py-6 md:py-10 w-full">
          <div className="gap-4 flex flex-col items-start w-full">
            <div className="max-w-[720px]">
              <h2 className="[font-family:'Lexend',Helvetica] font-black text-white text-2xl sm:text-3xl md:text-4xl tracking-[-1.00px] leading-[1.2] md:leading-[45px]">
                Our Courses
              </h2>
            </div>
            <div className="max-w-[720px]">
              <p className="[font-family:'Lexend',Helvetica] font-normal text-white text-sm md:text-base tracking-[0] leading-6">
                Explore our wide range of courses designed to help you excel in
                your studies.
              </p>
            </div>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 w-full">
              {courses.map((course, index) => (
                <div key={index} className="flex flex-col gap-3 pb-3 hover:scale-105 transition-all duration-300">
                  <div
                    className="h-[140px] sm:h-[160px] md:h-[169px] rounded-xl w-full"
                    style={{
                      background: `url(${course.image}) 50% 50% / cover`,
                    }}
                  />
                  <div className="flex flex-col px-1">
                    <h3 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm md:text-base tracking-[0] leading-6">
                      {course.title}
                    </h3>
                    <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-xs md:text-sm tracking-[0] leading-[18px] md:leading-[21px]">
                      {course.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="w-full px-4 md:px-10 py-12 md:py-20 flex flex-col items-center gap-6 md:gap-8">
          <div className="flex flex-col items-center gap-2 text-center w-full">
            <h2 className="[font-family:'Lexend',Helvetica] font-black text-white text-2xl sm:text-3xl md:text-4xl tracking-[-1.00px] leading-[1.2] md:leading-[45px] max-w-[720px]">
              Ready to Boost Your Academic Performance?
            </h2>
            <p className="[font-family:'Lexend',Helvetica] font-normal text-white text-sm md:text-base tracking-[0] leading-6 max-w-[500px]">
              Join EduGenius today and experience the future of learning.
            </p>
          </div>
          <Button className="h-10 md:h-12 px-4 md:px-5 bg-[#3f8cbf] rounded-3xl [font-family:'Lexend',Helvetica] font-bold text-sm md:text-base">
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};