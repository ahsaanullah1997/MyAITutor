import React from "react";
import { HeroSection } from "../StitchDesign/sections/HeroSection/index.ts";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { CoursesSection } from "../StitchDesign/sections/CoursesSection/index.ts";

export const PricingPage = (): JSX.Element => {
  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      period: "Forever",
      description: "Perfect for getting started with AI-powered learning",
      features: [
        "5 AI tutoring sessions per month",
        "Basic progress tracking",
        "Access to core subjects",
        "Community support",
        "Mobile app access"
      ],
      highlighted: false,
      buttonText: "Get Started Free",
      popular: false
    },
    {
      name: "Pro",
      price: "PKR 799",
      period: "per month",
      description: "Ideal for serious students who want comprehensive support",
      features: [
        "Unlimited AI tutoring sessions",
        "Advanced progress analytics",
        "All subjects & exam prep",
        "Priority support",
        "Personalized study plans",
        "Practice tests & assessments",
        "Performance insights"
      ],
      highlighted: true,
      buttonText: "Start Pro Trial",
      popular: true
    },
    {
      name: "Custom",
      price: "Contact Us",
      period: "for pricing",
      description: "Tailored solutions for educational institutes and organizations",
      features: [
        "Everything in Pro",
        "Bulk student accounts",
        "Institution dashboard",
        "Custom curriculum integration",
        "Dedicated account manager",
        "Teacher training & support",
        "Advanced analytics & reporting",
        "White-label options"
      ],
      highlighted: false,
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  const features = [
    {
      icon: "/vector---0.svg",
      title: "AI-Powered Learning",
      description: "Personalized tutoring that adapts to your learning style"
    },
    {
      icon: "/vector---0-1.svg",
      title: "Comprehensive Coverage",
      description: "All subjects from Metric to A-levels and competitive exams"
    },
    {
      icon: "/vector---0-2.svg",
      title: "24/7 Availability",
      description: "Study anytime, anywhere with round-the-clock support"
    },
    {
      icon: "/vector---0-3.svg",
      title: "Progress Tracking",
      description: "Detailed analytics to monitor your academic growth"
    }
  ];

  const handleButtonClick = (plan: any) => {
    if (plan.name === "Custom") {
      window.location.href = '/contact';
    } else {
      window.location.href = '/signup';
    }
  };

  return (
    <main className="flex flex-col w-full theme-bg-primary min-h-screen">
      <HeroSection />
      
      <section className="flex items-start justify-center px-4 md:px-10 lg:px-40 py-20 w-full theme-bg-primary">
        <div className="flex flex-col max-w-[1200px] w-full">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="[font-family:'Lexend',Helvetica] font-black theme-text-primary text-4xl md:text-5xl lg:text-6xl tracking-[-2.00px] leading-[1.1] mb-6">
              Choose Your Learning Plan
            </h1>
            <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-lg tracking-[0] leading-7 max-w-[600px] mx-auto">
              Select the perfect plan to accelerate your academic success with AI-powered personalized learning.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${
                  plan.highlighted 
                    ? 'bg-gradient-to-br from-[#3f8cbf] to-[#2d6a94] border-[#3f8cbf] scale-105' 
                    : 'theme-bg-secondary theme-border'
                } hover:scale-110 transition-all duration-300 hover:shadow-lg ${
                  plan.highlighted ? 'hover:shadow-[#3f8cbf]/20' : 'hover:shadow-black/10 dark:hover:shadow-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#3f8cbf] text-white px-4 py-1 rounded-full text-sm font-bold [font-family:'Lexend',Helvetica]">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardContent className="p-8 flex flex-col gap-6 h-full">
                  <div className="flex flex-col gap-4">
                    <h3 className={`[font-family:'Lexend',Helvetica] font-bold text-2xl tracking-[0] leading-6 ${
                      plan.highlighted ? 'text-white' : 'theme-text-primary'
                    }`}>
                      {plan.name}
                    </h3>
                    
                    <div className="flex items-baseline gap-2">
                      <span className={`[font-family:'Lexend',Helvetica] font-black ${
                        plan.name === "Custom" ? 'text-2xl' : 'text-4xl'
                      } ${
                        plan.highlighted ? 'text-white' : 'text-[#3f8cbf]'
                      }`}>
                        {plan.price}
                      </span>
                      <span className={`[font-family:'Lexend',Helvetica] font-normal text-sm ${
                        plan.highlighted ? 'text-white/80' : 'theme-text-muted'
                      }`}>
                        {plan.period}
                      </span>
                    </div>
                    
                    <p className={`[font-family:'Lexend',Helvetica] font-normal text-sm leading-6 ${
                      plan.highlighted ? 'text-white/90' : 'theme-text-muted'
                    }`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 flex-1">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          plan.highlighted ? 'bg-white' : 'bg-[#3f8cbf]'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            plan.highlighted ? 'bg-[#3f8cbf]' : 'bg-white'
                          }`} />
                        </div>
                        <p className={`[font-family:'Lexend',Helvetica] font-normal text-sm ${
                          plan.highlighted ? 'text-white/90' : 'theme-text-muted'
                        }`}>
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full h-12 rounded-lg [font-family:'Lexend',Helvetica] font-bold transition-colors ${
                      plan.highlighted 
                        ? 'bg-white text-[#3f8cbf] hover:bg-gray-100' 
                        : 'bg-[#3f8cbf] text-white hover:bg-[#2d6a94]'
                    }`}
                    onClick={() => handleButtonClick(plan)}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="[font-family:'Lexend',Helvetica] font-black theme-text-primary text-3xl md:text-4xl tracking-[-1.00px] leading-[45px] mb-4">
                Why Choose EduGenius?
              </h2>
              <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-base tracking-[0] leading-6 max-w-[600px] mx-auto">
                Experience the future of education with our comprehensive AI-powered learning platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="theme-bg-secondary theme-border hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-white/10">
                  <CardContent className="p-6 flex flex-col gap-4 text-center">
                    <div className="w-8 h-8 mx-auto">
                      <div className={`w-full h-full bg-[url(${feature.icon})] bg-[100%_100%]`} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="[font-family:'Lexend',Helvetica] font-bold theme-text-primary text-lg tracking-[0] leading-6">
                        {feature.title}
                      </h3>
                      <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-sm tracking-[0] leading-5">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="[font-family:'Lexend',Helvetica] font-black theme-text-primary text-3xl md:text-4xl tracking-[-1.00px] leading-[45px] mb-4">
                Frequently Asked Questions
              </h2>
              <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-secondary text-base tracking-[0] leading-6 max-w-[600px] mx-auto">
                Get answers to common questions about our pricing and features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "Can I change my plan anytime?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated."
                },
                {
                  question: "Is there a free trial for paid plans?",
                  answer: "Yes! We offer a 7-day free trial for the Pro plan so you can experience all features before committing."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, debit cards, and popular digital payment methods including JazzCash and Easypaisa."
                },
                {
                  question: "Can I cancel my subscription anytime?",
                  answer: "Absolutely! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
                },
                {
                  question: "Do you offer student discounts?",
                  answer: "Yes, we offer special discounts for students. Contact our support team with your student ID for more information."
                },
                {
                  question: "What's included in the Custom plan?",
                  answer: "Our Custom plan is designed for educational institutes and includes bulk accounts, custom integrations, dedicated support, and white-label options. Contact us for a personalized quote."
                }
              ].map((faq, index) => (
                <Card key={index} className="theme-bg-secondary theme-border">
                  <CardContent className="p-6">
                    <h3 className="[font-family:'Lexend',Helvetica] font-bold theme-text-primary text-lg mb-3">
                      {faq.question}
                    </h3>
                    <p className="[font-family:'Lexend',Helvetica] font-normal theme-text-muted text-sm leading-6">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-br from-[#3f8cbf] to-[#2d6a94] rounded-2xl p-12">
            <h2 className="[font-family:'Lexend',Helvetica] font-black text-white text-3xl md:text-4xl tracking-[-1.00px] leading-[45px] mb-4">
              Ready to Transform Your Learning?
            </h2>
            <p className="[font-family:'Lexend',Helvetica] font-normal text-white/90 text-lg tracking-[0] leading-7 mb-8 max-w-[600px] mx-auto">
              Join thousands of students who have already improved their grades with EduGenius. Start your free trial today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="h-12 px-8 bg-white text-[#3f8cbf] hover:bg-gray-100 rounded-lg [font-family:'Lexend',Helvetica] font-bold transition-colors"
                onClick={() => window.location.href = '/signup'}
              >
                Start Free Trial
              </Button>
              <Button 
                className="h-12 px-8 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-lg [font-family:'Lexend',Helvetica] font-bold transition-colors"
                onClick={() => window.location.href = '/contact'}
              >
                Contact for Custom Plan
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CoursesSection />
    </main>
  );
};