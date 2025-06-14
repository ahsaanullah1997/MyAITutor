import React from "react";

export const CoursesSection = (): JSX.Element => {
  // Navigation links data for the footer
  const navigationLinks = [
    { title: "Home", href: "/" },
    { title: "Features", href: "/features" },
    { title: "Pricing", href: "/pricing" },
    { title: "About Us", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

  // Legal links for the footer
  const legalLinks = [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="flex justify-center w-full bg-[#0f1419] border-t border-[#1e282d]">
      <div className="flex flex-col max-w-[960px] w-full">
        <div className="flex flex-col items-center gap-6 md:gap-8 px-4 md:px-5 py-8 md:py-10 w-full">
          {/* Main Navigation */}
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 w-full">
            {navigationLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                className="font-normal text-[#9eafbf] text-sm md:text-base text-center leading-5 md:leading-6 [font-family:'Lexend',Helvetica] tracking-[0] hover:text-white transition-colors"
              >
                {link.title}
              </a>
            ))}
          </nav>

          {/* Legal Links */}
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            {legalLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                className="font-normal text-[#9eafbf] text-xs md:text-sm text-center leading-4 md:leading-5 [font-family:'Lexend',Helvetica] tracking-[0] hover:text-white transition-colors"
              >
                {link.title}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <div className="flex items-center w-full justify-center">
            <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-xs md:text-base text-center tracking-[0] leading-5 md:leading-6">
              © 2024 MyEduPro. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};