import React from "react";
import { HeroSection } from "../StitchDesign/sections/HeroSection/index.ts";
import { AboutHeroSection } from "./sections/AboutHeroSection/index.ts";
import { MissionSection } from "./sections/MissionSection/index.ts";
import { TeamSection } from "./sections/TeamSection/index.ts";
import { ValuesSection } from "./sections/ValuesSection/index.ts";
import { StorySection } from "./sections/StorySection/index.ts";
import { CoursesSection } from "../StitchDesign/sections/CoursesSection/index.ts";

export const AboutUsPage = (): JSX.Element => {
  return (
    <main className="flex flex-col w-full bg-[#0f1419] min-h-screen">
      <HeroSection />
      <AboutHeroSection />
      <StorySection />
      <MissionSection />
      <ValuesSection />
      <TeamSection />
      <CoursesSection />
    </main>
  );
};