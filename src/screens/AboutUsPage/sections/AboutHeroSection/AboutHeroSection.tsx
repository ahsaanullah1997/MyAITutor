import React from "react";

export const AboutHeroSection = (): JSX.Element => {
  return (
    <section className="flex items-start justify-center px-4 md:px-6 lg:px-10 xl:px-40 py-12 md:py-20 w-full theme-bg-primary">
      <div className="flex flex-col max-w-[960px] w-full">
        <div className="flex flex-col items-center gap-4 md:gap-6 text-center">
          <h1 className="[font-family:'Lexend',Helvetica] font-black theme-text-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-[-2.00px] leading-[1.1] max-w-[800px]">
            Empowering Pakistani Students Through AI-Driven Education
          </h1>
          <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-base md:text-lg tracking-[0] leading-6 md:leading-7 max-w-[600px]">
            At EduGenius, we're revolutionizing education in Pakistan by combining cutting-edge AI technology with deep understanding of local academic needs.
          </p>
        </div>
      </div>
    </section>
  );
};