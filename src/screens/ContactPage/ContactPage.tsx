import React, { useState } from "react";
import { HeroSection } from "../StitchDesign/sections/HeroSection/index.ts";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { CoursesSection } from "../StitchDesign/sections/CoursesSection/index.ts";

export const ContactPage = (): JSX.Element => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: "/vector---0.svg",
      title: "Email Us",
      description: "Get in touch via email",
      contact: "support@edugenius.pk"
    },
    {
      icon: "/vector---0-1.svg",
      title: "Call Us",
      description: "Speak with our team",
      contact: "+92 300 1234567"
    },
    {
      icon: "/vector---0-2.svg",
      title: "Visit Us",
      description: "Come to our office",
      contact: "Lahore, Pakistan"
    },
    {
      icon: "/vector---0-3.svg",
      title: "Support Hours",
      description: "We're here to help",
      contact: "24/7 Available"
    }
  ];

  return (
    <main className="flex flex-col w-full theme-bg-primary min-h-screen">
      <HeroSection />
      
      <section className="flex items-start justify-center px-4 md:px-6 lg:px-10 xl:px-40 py-12 md:py-20 w-full theme-bg-primary">
        <div className="flex flex-col max-w-[1200px] w-full">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="[font-family:'Lexend',Helvetica] font-black theme-text-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-[-2.00px] leading-[1.1] mb-4 md:mb-6">
              Get in Touch
            </h1>
            <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-base md:text-lg tracking-[0] leading-6 md:leading-7 max-w-[600px] mx-auto">
              Have questions about EduGenius? We're here to help you succeed in your academic journey.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="theme-bg-secondary theme-border hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-white/10">
                <CardContent className="p-4 md:p-6 flex flex-col gap-3 md:gap-4 text-center">
                  <div className="w-6 h-6 md:w-8 md:h-8 mx-auto">
                    <div className={`w-full h-full bg-[url(${info.icon})] bg-[100%_100%]`} />
                  </div>
                  <div className="flex flex-col gap-1 md:gap-2">
                    <h3 className="[font-family:'Lexend',Helvetica] font-bold theme-text-primary text-base md:text-lg tracking-[0] leading-6">
                      {info.title}
                    </h3>
                    <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs md:text-sm tracking-[0] leading-5">
                      {info.description}
                    </p>
                    <p className="[font-family:'Lexend',Helvetica] font-medium text-[#3f8cbf] text-xs md:text-sm tracking-[0] leading-5">
                      {info.contact}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="flex flex-col gap-4 md:gap-6 order-2 lg:order-1">
              <h2 className="[font-family:'Lexend',Helvetica] font-black theme-text-primary text-2xl sm:text-3xl md:text-4xl tracking-[-1.00px] leading-[1.2] md:leading-[45px]">
                Send us a Message
              </h2>
              <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-sm md:text-base tracking-[0] leading-6">
                Fill out the form below and we'll get back to you as soon as possible. Our team is dedicated to helping you achieve your academic goals.
              </p>
              <div className="flex flex-col gap-3 md:gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />
                  </div>
                  <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs md:text-sm">
                    Quick response within 24 hours
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />
                  </div>
                  <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs md:text-sm">
                    Personalized support for your needs
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-[#3f8cbf] rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />
                  </div>
                  <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs md:text-sm">
                    Expert guidance from our team
                  </p>
                </div>
              </div>
            </div>

            <Card className="theme-bg-secondary theme-border order-1 lg:order-2">
              <CardContent className="p-4 md:p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs md:text-sm">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 theme-bg-primary theme-border border rounded-lg theme-text-primary placeholder-theme-text-muted focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica] text-sm md:text-base"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs md:text-sm">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 theme-bg-primary theme-border border rounded-lg theme-text-primary placeholder-theme-text-muted focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica] text-sm md:text-base"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs md:text-sm">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 theme-bg-primary theme-border border rounded-lg theme-text-primary placeholder-theme-text-muted focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica] text-sm md:text-base"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="[font-family:'Lexend',Helvetica] font-medium theme-text-primary text-xs md:text-sm">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 md:px-4 py-2 md:py-3 theme-bg-primary theme-border border rounded-lg theme-text-primary placeholder-theme-text-muted focus:border-[#3f8cbf] focus:outline-none transition-colors resize-none [font-family:'Lexend',Helvetica] text-sm md:text-base"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full h-10 md:h-12 bg-[#3f8cbf] hover:bg-[#2d6a94] rounded-lg [font-family:'Lexend',Helvetica] font-bold text-white transition-colors text-sm md:text-base"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 md:mt-20">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="[font-family:'Lexend',Helvetica] font-black theme-text-primary text-2xl sm:text-3xl md:text-4xl tracking-[-1.00px] leading-[1.2] md:leading-[45px] mb-4">
                Frequently Asked Questions
              </h2>
              <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-sm md:text-base tracking-[0] leading-6 max-w-[600px] mx-auto">
                Find quick answers to common questions about EduGenius.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[
                {
                  question: "How does EduGenius work?",
                  answer: "EduGenius uses AI-powered tutoring to provide personalized learning experiences tailored to your academic needs and learning style."
                },
                {
                  question: "What subjects do you cover?",
                  answer: "We cover all major subjects for Metric, FSc, O-levels, A-levels, and competitive exam preparation including MDCAT and ECAT."
                },
                {
                  question: "Is there a free trial available?",
                  answer: "Yes! We offer a 7-day free trial so you can experience the power of AI-driven learning before committing to a plan."
                },
                {
                  question: "How can I get technical support?",
                  answer: "Our support team is available 24/7 through email, chat, or phone. You can also access our comprehensive help center."
                }
              ].map((faq, index) => (
                <Card key={index} className="theme-bg-secondary theme-border hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="[font-family:'Lexend',Helvetica] font-bold theme-text-primary text-base md:text-lg mb-2 md:mb-3">
                      {faq.question}
                    </h3>
                    <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-xs md:text-sm leading-5 md:leading-6">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CoursesSection />
    </main>
  );
};