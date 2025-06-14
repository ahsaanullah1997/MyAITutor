import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

const teamMember = {
  name: "Minhaaj Ul Islam",
  role: "Founder & CEO",
  description: "Visionary leader with expertise in educational technology and AI-powered learning solutions. Passionate about transforming education in Pakistan.",
  image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
};

export const TeamSection = (): JSX.Element => {
  return (
    <section className="flex items-start justify-center px-4 md:px-10 lg:px-40 py-16 w-full bg-[#0f1419]">
      <div className="flex flex-col max-w-[1200px] w-full">
        <div className="text-center mb-12">
          <h2 className="[font-family:'Lexend',Helvetica] font-black text-white text-3xl md:text-4xl tracking-[-1.00px] leading-[45px] mb-4">
            Meet Our Founder
          </h2>
          <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-base tracking-[0] leading-6 max-w-[600px] mx-auto">
            Leading the mission to transform education in Pakistan through innovative AI-powered learning solutions.
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <Card className="bg-[#1e282d] border-[#3d4f5b] hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 max-w-[400px]">
            <CardContent className="p-8 flex flex-col gap-6 text-center">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden">
                <img 
                  src={teamMember.image} 
                  alt={teamMember.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-xl tracking-[0] leading-6">
                  {teamMember.name}
                </h3>
                <p className="[font-family:'Lexend',Helvetica] font-medium text-[#3f8cbf] text-base tracking-[0] leading-5">
                  {teamMember.role}
                </p>
                <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-base tracking-[0] leading-6">
                  {teamMember.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-black text-[#3f8cbf] mb-2 [font-family:'Lexend',Helvetica]">
              50K+
            </div>
            <p className="text-[#9eafbf] text-sm [font-family:'Lexend',Helvetica]">
              Students Served
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-[#3f8cbf] mb-2 [font-family:'Lexend',Helvetica]">
              95%
            </div>
            <p className="text-[#9eafbf] text-sm [font-family:'Lexend',Helvetica]">
              Success Rate
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-[#3f8cbf] mb-2 [font-family:'Lexend',Helvetica]">
              24/7
            </div>
            <p className="text-[#9eafbf] text-sm [font-family:'Lexend',Helvetica]">
              AI Support
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-[#3f8cbf] mb-2 [font-family:'Lexend',Helvetica]">
              100+
            </div>
            <p className="text-[#9eafbf] text-sm [font-family:'Lexend',Helvetica]">
              Subjects Covered
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};