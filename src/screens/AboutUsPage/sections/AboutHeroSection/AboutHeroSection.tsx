import React from "react";

export const AboutHeroSection = (): JSX.Element => {
  return (
    <section className="flex items-start justify-center px-4 md:px-10 lg:px-40 py-20 w-full bg-[#0f1419]">
      <div className="flex flex-col max-w-[960px] w-full">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="[font-family:'Lexend',Helvetica] font-black text-white text-4xl md:text-5xl lg:text-6xl tracking-[-2.00px] leading-[1.1] max-w-[800px]">
            Empowering Pakistani Students Through AI-Driven Education
          </h1>
          <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-lg tracking-[0] leading-7 max-w-[600px]">
            At EduGenius, we're revolutionizing education in Pakistan by combining cutting-edge AI technology with deep understanding of local academic needs.
          </p>
        </div>
      </div>
    </section>
  );
};