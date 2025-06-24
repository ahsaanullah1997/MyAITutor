import React from "react";

export const StorySection = (): JSX.Element => {
  return (
    <section className="flex items-start justify-center px-4 md:px-6 lg:px-10 xl:px-40 py-12 md:py-16 w-full theme-bg-primary">
      <div className="flex flex-col max-w-[960px] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="flex flex-col gap-4 md:gap-6 order-2 lg:order-1">
            <h2 className="[font-family:'Lexend',Helvetica] font-black theme-text-primary text-2xl sm:text-3xl md:text-4xl tracking-[-1.00px] leading-[1.2] md:leading-[45px]">
              Our Story
            </h2>
            <div className="flex flex-col gap-3 md:gap-4">
              <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-sm md:text-base tracking-[0] leading-6">
                EduGenius was born from a simple observation: Pakistani students needed personalized, accessible, and high-quality educational support that understood their unique academic journey.
              </p>
              <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-sm md:text-base tracking-[0] leading-6">
                Founded by educators and technologists who experienced the challenges of the Pakistani education system firsthand, we set out to create an AI-powered platform that could provide every student with a personal tutor available 24/7.
              </p>
              <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-sm md:text-base tracking-[0] leading-6">
                Today, we're proud to serve thousands of students across Pakistan, helping them achieve their academic goals and unlock their full potential.
              </p>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="h-[300px] md:h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-[#3f8cbf] to-[#2d6a94] flex items-center justify-center">
              <div className="text-center p-6 md:p-8">
                <div className="text-4xl md:text-6xl font-black text-white mb-3 md:mb-4 [font-family:'Lexend',Helvetica]">
                  2020
                </div>
                <p className="text-white text-base md:text-lg [font-family:'Lexend',Helvetica]">
                  Founded with a vision to transform education in Pakistan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};