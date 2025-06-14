import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

const values = [
  {
    icon: "/vector---0.svg",
    title: "Student-Centric",
    description: "Every decision we make is guided by what's best for our students' learning and growth."
  },
  {
    icon: "/vector---0-1.svg",
    title: "Innovation",
    description: "We continuously push the boundaries of educational technology to create better learning experiences."
  },
  {
    icon: "/vector---0-2.svg",
    title: "Accessibility",
    description: "Quality education should be available to every student, regardless of their background or location."
  },
  {
    icon: "/vector---0-3.svg",
    title: "Excellence",
    description: "We strive for excellence in everything we do, from our technology to our customer support."
  },
  {
    icon: "/vector---0.svg",
    title: "Cultural Understanding",
    description: "We deeply understand the Pakistani education system and cultural context of our students."
  },
  {
    icon: "/vector---0-1.svg",
    title: "Continuous Learning",
    description: "We believe in lifelong learning and constantly evolve based on student feedback and needs."
  }
];

export const ValuesSection = (): JSX.Element => {
  return (
    <section className="flex items-start justify-center px-4 md:px-10 lg:px-40 py-16 w-full bg-[#0f1419]">
      <div className="flex flex-col max-w-[1200px] w-full">
        <div className="text-center mb-12">
          <h2 className="[font-family:'Lexend',Helvetica] font-black text-white text-3xl md:text-4xl tracking-[-1.00px] leading-[45px] mb-4">
            Our Core Values
          </h2>
          <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-base tracking-[0] leading-6 max-w-[600px] mx-auto">
            These values guide everything we do and shape how we serve our students and community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="bg-[#1e282d] border-[#3d4f5b] hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-white/10">
              <CardContent className="p-6 flex flex-col gap-4 h-full">
                <div className="w-8 h-8">
                  <div className={`w-full h-full bg-[url(${value.icon})] bg-[100%_100%]`} />
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg tracking-[0] leading-6">
                    {value.title}
                  </h3>
                  <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-sm tracking-[0] leading-[21px]">
                    {value.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};