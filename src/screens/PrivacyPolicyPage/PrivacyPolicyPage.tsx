import React from "react";
import { HeroSection } from "../StitchDesign/sections/HeroSection/index.ts";
import { CoursesSection } from "../StitchDesign/sections/CoursesSection/index.ts";

export const PrivacyPolicyPage = (): JSX.Element => {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Personal Information: When you create an account, we collect information such as your name, email address, phone number, and educational background.",
        "Usage Data: We automatically collect information about how you use our platform, including pages visited, time spent, and features used.",
        "Academic Progress: We track your learning progress, test scores, and performance analytics to provide personalized recommendations.",
        "Device Information: We may collect information about the device you use to access our services, including IP address, browser type, and operating system."
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "Provide and improve our educational services and AI tutoring features",
        "Personalize your learning experience and create customized study plans",
        "Track your academic progress and provide performance insights",
        "Communicate with you about your account, updates, and educational content",
        "Ensure platform security and prevent fraudulent activities",
        "Comply with legal obligations and protect our rights"
      ]
    },
    {
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information to third parties.",
        "We may share information with trusted service providers who help us operate our platform.",
        "We may disclose information if required by law or to protect our rights and safety.",
        "With your consent, we may share progress reports with parents or guardians for students under 18."
      ]
    },
    {
      title: "Data Security",
      content: [
        "We implement industry-standard security measures to protect your information.",
        "All data transmission is encrypted using SSL/TLS protocols.",
        "We regularly update our security practices and conduct security audits.",
        "Access to personal information is restricted to authorized personnel only."
      ]
    },
    {
      title: "Your Rights",
      content: [
        "Access: You can request access to your personal information at any time.",
        "Correction: You can update or correct your personal information through your account settings.",
        "Deletion: You can request deletion of your account and associated data.",
        "Portability: You can request a copy of your data in a portable format.",
        "Opt-out: You can opt-out of marketing communications at any time."
      ]
    },
    {
      title: "Cookies and Tracking",
      content: [
        "We use cookies to enhance your experience and remember your preferences.",
        "Analytics cookies help us understand how users interact with our platform.",
        "You can control cookie settings through your browser preferences.",
        "Some features may not work properly if cookies are disabled."
      ]
    },
    {
      title: "Children's Privacy",
      content: [
        "We take special care to protect the privacy of users under 18 years of age.",
        "For users under 13, we require parental consent before collecting personal information.",
        "Parents can review, modify, or delete their child's information at any time.",
        "We do not knowingly collect unnecessary personal information from children."
      ]
    },
    {
      title: "Changes to This Policy",
      content: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices.",
        "We will notify you of significant changes via email or platform notifications.",
        "Continued use of our services after changes constitutes acceptance of the updated policy.",
        "The effective date of the current policy is displayed at the top of this page."
      ]
    }
  ];

  return (
    <main className="flex flex-col w-full theme-bg-primary min-h-screen">
      <HeroSection />
      
      <section className="flex items-start justify-center px-4 md:px-10 lg:px-40 py-20 w-full theme-bg-primary">
        <div className="flex flex-col max-w-[960px] w-full">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="[font-family:'Lexend',Helvetica] font-black theme-text-primary text-4xl md:text-5xl lg:text-6xl tracking-[-2.00px] leading-[1.1] mb-6">
              Privacy Policy
            </h1>
            <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-lg tracking-[0] leading-7 max-w-[600px] mx-auto mb-4">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="[font-family:'Lexend',Helvetica] font-medium text-[#3f8cbf] text-sm">
              Last updated: January 2024
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-12 p-6 theme-bg-secondary rounded-xl theme-border border">
            <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-base leading-7">
              At EduGenius, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our 
              AI-powered educational platform and services.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="flex flex-col gap-8">
            {sections.map((section, index) => (
              <div key={index} className="flex flex-col gap-4">
                <h2 className="[font-family:'Lexend',Helvetica] font-bold theme-text-primary text-2xl tracking-[-0.5px] leading-8">
                  {index + 1}. {section.title}
                </h2>
                <div className="flex flex-col gap-3">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#3f8cbf] rounded-full mt-2 flex-shrink-0" />
                      <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-base leading-7">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="mt-16 p-8 bg-gradient-to-br from-[#3f8cbf] to-[#2d6a94] rounded-xl">
            <h2 className="[font-family:'Lexend',Helvetica] font-bold text-white text-2xl mb-4">
              Contact Us About Privacy
            </h2>
            <p className="[font-family:'Lexend',Helvetica] font-normal text-white/90 text-base leading-7 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="flex flex-col gap-2">
              <p className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                Email: privacy@edugenius.pk
              </p>
              <p className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                Phone: +92 300 1234567
              </p>
              <p className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                Address: Lahore, Pakistan
              </p>
            </div>
          </div>
        </div>
      </section>

      <CoursesSection />
    </main>
  );
};