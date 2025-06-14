import React from "react";
import { HeroSection } from "./sections/HeroSection/index.ts";
import { WhyChooseSection } from "./sections/WhyChooseSection/index.ts";
import { CoursesSection } from "./sections/CoursesSection/index.ts";

export const StitchDesign = (): JSX.Element => {
  return (
    <main className="flex flex-col w-full bg-[#0f1419] min-h-screen">
      <HeroSection />
      <WhyChooseSection />
      <CoursesSection />
    </main>
  );
};