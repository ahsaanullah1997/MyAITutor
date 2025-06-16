import React from "react";
import { HeroSection } from "../StitchDesign/sections/HeroSection/index.ts";
import { FeaturesHeroSection } from "./sections/FeaturesHeroSection/index.ts";
import { FeaturesGridSection } from "./sections/FeaturesGridSection/index.ts";
import { CoursesSection } from "../StitchDesign/sections/CoursesSection/index.ts";

export const FeaturesPage = (): JSX.Element => {
  return (
    <main className="flex flex-col w-full theme-bg-primary min-h-screen">
      <HeroSection />
      <FeaturesHeroSection />
      <FeaturesGridSection />
      <CoursesSection />
    </main>
  );
};