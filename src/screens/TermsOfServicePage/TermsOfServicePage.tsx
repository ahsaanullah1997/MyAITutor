import React from "react";
import { HeroSection } from "../StitchDesign/sections/HeroSection/index.ts";
import { CoursesSection } from "../StitchDesign/sections/CoursesSection/index.ts";

export const TermsOfServicePage = (): JSX.Element => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: [
        "By accessing and using EduGenius, you accept and agree to be bound by these Terms of Service.",
        "If you do not agree to these terms, you may not use our services.",
        "These terms apply to all users, including students, parents, and educators.",
        "We reserve the right to modify these terms at any time with notice to users."
      ]
    },
    {
      title: "Description of Service",
      content: [
        "EduGenius provides AI-powered educational services including tutoring, progress tracking, and exam preparation.",
        "Our platform covers subjects for Metric, FSc, O-levels, A-levels, and competitive exams like MDCAT and ECAT.",
        "Services are provided through our web platform and mobile applications.",
        "We strive to maintain service availability but cannot guarantee uninterrupted access."
      ]
    },
    {
      title: "User Accounts and Registration",
      content: [
        "You must create an account to access most features of our platform.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You must provide accurate and complete information during registration.",
        "Users under 13 require parental consent to create an account.",
        "You are responsible for all activities that occur under your account."
      ]
    },
    {
      title: "Acceptable Use Policy",
      content: [
        "You may use our services only for lawful educational purposes.",
        "You may not share your account credentials with others.",
        "Prohibited activities include hacking, spamming, or distributing malware.",
        "You may not attempt to reverse engineer or copy our AI algorithms.",
        "Harassment, bullying, or inappropriate behavior towards other users is not tolerated."
      ]
    },
    {
      title: "Payment and Subscription Terms",
      content: [
        "Paid subscriptions are billed monthly or annually as selected.",
        "All fees are non-refundable except as required by law.",
        "We reserve the right to change pricing with 30 days notice.",
        "Subscriptions automatically renew unless cancelled before the renewal date.",
        "Free trial periods may be offered at our discretion."
      ]
    },
    {
      title: "Intellectual Property Rights",
      content: [
        "All content, software, and materials on our platform are owned by EduGenius or our licensors.",
        "You may not copy, distribute, or create derivative works from our content.",
        "User-generated content remains your property but you grant us license to use it.",
        "We respect intellectual property rights and respond to valid DMCA notices.",
        "Our trademarks and logos may not be used without written permission."
      ]
    },
    {
      title: "Privacy and Data Protection",
      content: [
        "Your privacy is important to us and is governed by our Privacy Policy.",
        "We collect and use your information as described in our Privacy Policy.",
        "You consent to our collection and use of your academic progress data.",
        "We implement security measures to protect your personal information.",
        "You have rights regarding your personal data as described in our Privacy Policy."
      ]
    },
    {
      title: "Limitation of Liability",
      content: [
        "Our services are provided 'as is' without warranties of any kind.",
        "We are not liable for any indirect, incidental, or consequential damages.",
        "Our total liability is limited to the amount you paid for our services.",
        "We do not guarantee specific academic outcomes or exam results.",
        "You use our services at your own risk and discretion."
      ]
    },
    {
      title: "Termination",
      content: [
        "You may terminate your account at any time through your account settings.",
        "We may suspend or terminate accounts that violate these terms.",
        "Upon termination, your access to paid features will cease immediately.",
        "We may retain certain information as required by law or for legitimate business purposes.",
        "Termination does not relieve you of any payment obligations."
      ]
    },
    {
      title: "Governing Law and Disputes",
      content: [
        "These terms are governed by the laws of Pakistan.",
        "Any disputes will be resolved through binding arbitration in Lahore, Pakistan.",
        "You waive the right to participate in class action lawsuits.",
        "If any provision is found invalid, the remaining terms remain in effect.",
        "We may seek injunctive relief for violations of intellectual property rights."
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
              Terms of Service
            </h1>
            <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-lg tracking-[0] leading-7 max-w-[600px] mx-auto mb-4">
              Please read these terms carefully before using EduGenius. They govern your use of our platform and services.
            </p>
            <p className="[font-family:'Lexend',Helvetica] font-medium text-[#3f8cbf] text-sm">
              Last updated: January 2024
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-12 p-6 theme-bg-secondary rounded-xl theme-border border">
            <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-base leading-7">
              Welcome to EduGenius! These Terms of Service ("Terms") govern your use of our AI-powered educational platform 
              and services. By using EduGenius, you agree to comply with and be bound by these Terms. Please read them carefully.
            </p>
          </div>

          {/* Terms Sections */}
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
              Questions About These Terms?
            </h2>
            <p className="[font-family:'Lexend',Helvetica] font-normal text-white/90 text-base leading-7 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="flex flex-col gap-2">
              <p className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm">
                Email: legal@edugenius.pk
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