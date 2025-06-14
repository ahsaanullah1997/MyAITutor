import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

export const MissionSection = (): JSX.Element => {
  return (
    <section className="flex items-start justify-center px-4 md:px-10 lg:px-40 py-16 w-full bg-[#0f1419]">
      <div className="flex flex-col max-w-[960px] w-full">
        <div className="text-center mb-12">
          <h2 className="[font-family:'Lexend',Helvetica] font-black text-white text-3xl md:text-4xl tracking-[-1.00px] leading-[45px] mb-4">
            Our Mission & Vision
          </h2>
          <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-base tracking-[0] leading-6 max-w-[600px] mx-auto">
            We're committed to democratizing quality education and making academic excellence accessible to every Pakistani student.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-[#3f8cbf] to-[#2d6a94] border-[#3f8cbf]">
            <CardContent className="p-8 flex flex-col gap-4 h-full">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-[url(/vector---0-2.svg)] bg-[100%_100%]" />
              </div>
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-xl tracking-[0] leading-6">
                Our Mission
              </h3>
              <p className="[font-family:'Lexend',Helvetica] font-normal text-white/90 text-base tracking-[0] leading-6">
                To provide every Pakistani student with personalized, AI-powered educational support that adapts to their learning style, pace, and academic goals, ensuring no student is left behind in their educational journey.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-8 flex flex-col gap-4 h-full">
              <div className="w-12 h-12 bg-[#3f8cbf] rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-[url(/vector---0-1.svg)] bg-[100%_100%] filter brightness-0 invert" />
              </div>
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-xl tracking-[0] leading-6">
                Our Vision
              </h3>
              <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-base tracking-[0] leading-6">
                To become Pakistan's leading educational technology platform, transforming how students learn and achieve academic success while preparing them for a rapidly evolving global landscape.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};