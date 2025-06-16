import React, { useState } from "react";
import { HeroSection } from "../StitchDesign/sections/HeroSection/index.ts";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CoursesSection } from "../StitchDesign/sections/CoursesSection/index.ts";

export const HelpCenterPage = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'account', name: 'Account & Profile', icon: '👤' },
    { id: 'learning', name: 'Learning & AI Tutor', icon: '🤖' },
    { id: 'billing', name: 'Billing & Subscriptions', icon: '💳' },
    { id: 'technical', name: 'Technical Support', icon: '🔧' },
    { id: 'mobile', name: 'Mobile App', icon: '📱' }
  ];

  const knowledgeBaseArticles = [
    {
      id: 1,
      title: "How to Get Started with MyEduPro",
      category: "getting-started",
      description: "Complete guide to setting up your account and starting your learning journey",
      readTime: "5 min read",
      popular: true
    },
    {
      id: 2,
      title: "Using the AI Tutor Effectively",
      category: "learning",
      description: "Tips and tricks to get the most out of your AI tutoring sessions",
      readTime: "7 min read",
      popular: true
    },
    {
      id: 3,
      title: "Understanding Your Progress Dashboard",
      category: "learning",
      description: "Learn how to interpret your learning analytics and progress reports",
      readTime: "4 min read",
      popular: false
    },
    {
      id: 4,
      title: "Managing Your Subscription",
      category: "billing",
      description: "How to upgrade, downgrade, or cancel your subscription",
      readTime: "3 min read",
      popular: true
    },
    {
      id: 5,
      title: "Customizing Your Profile",
      category: "account",
      description: "Set up your profile for personalized learning recommendations",
      readTime: "3 min read",
      popular: false
    },
    {
      id: 6,
      title: "Troubleshooting Login Issues",
      category: "technical",
      description: "Common solutions for login and authentication problems",
      readTime: "5 min read",
      popular: false
    },
    {
      id: 7,
      title: "Using MyEduPro on Mobile",
      category: "mobile",
      description: "Access your learning materials and AI tutor on your smartphone",
      readTime: "4 min read",
      popular: false
    },
    {
      id: 8,
      title: "Setting Up Study Reminders",
      category: "learning",
      description: "Configure notifications to maintain your study streak",
      readTime: "2 min read",
      popular: false
    }
  ];

  const faqs = [
    {
      id: 1,
      question: "How does the AI tutor work?",
      answer: "Our AI tutor uses advanced natural language processing to understand your questions and provide personalized explanations. It adapts to your learning style and curriculum, offering step-by-step solutions and conceptual explanations tailored to Pakistani education boards.",
      category: "learning"
    },
    {
      id: 2,
      question: "What subjects and grades do you cover?",
      answer: "We cover all major subjects for Metric (Classes 9-10), FSc/FA (Classes 11-12), O-levels, A-levels, and competitive exam preparation including MDCAT and ECAT. Our content is aligned with Pakistani education boards including Federal Board, Punjab Board, Sindh Board, and others.",
      category: "learning"
    },
    {
      id: 3,
      question: "Can I use MyEduPro offline?",
      answer: "While the AI tutor requires an internet connection, you can download study materials and notes for offline access. Your progress is automatically synced when you reconnect to the internet.",
      category: "technical"
    },
    {
      id: 4,
      question: "How much does MyEduPro cost?",
      answer: "We offer a free Basic plan with limited features, and a Pro plan for PKR 799/month with unlimited access. We also provide custom plans for educational institutions. Check our pricing page for detailed information.",
      category: "billing"
    },
    {
      id: 5,
      question: "Is there a free trial available?",
      answer: "Yes! We offer a 7-day free trial of our Pro plan so you can experience all features before committing. No credit card required to start your trial.",
      category: "billing"
    },
    {
      id: 6,
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link. If you don't receive the email, check your spam folder or contact our support team.",
      category: "account"
    },
    {
      id: 7,
      question: "Can parents track their child's progress?",
      answer: "Yes, parents can request access to their child's progress reports and learning analytics. Contact our support team to set up parental access for students under 18.",
      category: "account"
    },
    {
      id: 8,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, JazzCash, Easypaisa, and bank transfers. All payments are processed securely through our encrypted payment gateway.",
      category: "billing"
    },
    {
      id: 9,
      question: "How accurate is the AI tutor?",
      answer: "Our AI tutor has been trained on curriculum-specific content and maintains high accuracy. However, we recommend cross-referencing important information with your textbooks and teachers. We continuously improve the AI based on user feedback.",
      category: "learning"
    },
    {
      id: 10,
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access to Pro features until the end of your current billing period.",
      category: "billing"
    }
  ];

  const quickActions = [
    {
      title: "Contact Support",
      description: "Get personalized help from our team",
      icon: "💬",
      action: () => window.location.href = '/contact'
    },
    {
      title: "Report a Bug",
      description: "Help us improve by reporting issues",
      icon: "🐛",
      action: () => window.location.href = '/contact'
    },
    {
      title: "Feature Request",
      description: "Suggest new features or improvements",
      icon: "💡",
      action: () => window.location.href = '/contact'
    },
    {
      title: "Account Issues",
      description: "Get help with login or account problems",
      icon: "🔐",
      action: () => window.location.href = '/contact'
    }
  ];

  const filteredArticles = knowledgeBaseArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (faqId: number) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <main className="flex flex-col w-full bg-[#0f1419] min-h-screen">
      <HeroSection />
      
      <section className="flex items-start justify-center px-4 md:px-6 lg:px-10 xl:px-40 py-12 md:py-20 w-full bg-[#0f1419]">
        <div className="flex flex-col max-w-[1200px] w-full">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="[font-family:'Lexend',Helvetica] font-black text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[-2.00px] leading-[1.1] mb-4 md:mb-6">
              Help Center 🆘
            </h1>
            <p className="[font-family:'Lexend',Helvetica] font-normal text-[#9eafbf] text-base md:text-lg tracking-[0] leading-6 md:leading-7 max-w-[600px] mx-auto mb-6 md:mb-8">
              Find answers to your questions and get the most out of MyEduPro
            </p>
            
            {/* Search Bar */}
            <div className="max-w-[500px] mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles, FAQs, or topics..."
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-[#1e282d] border border-[#3d4f5b] rounded-xl text-white placeholder-[#9eafbf] focus:border-[#3f8cbf] focus:outline-none transition-colors [font-family:'Lexend',Helvetica] text-sm md:text-base"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-12 md:mb-16">
            <h2 className="[font-family:'Lexend',Helvetica] font-bold text-white text-xl md:text-2xl mb-6 text-center">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {quickActions.map((action, index) => (
                <Card key={index} className="bg-[#1e282d] border-[#3d4f5b] hover:scale-105 transition-all duration-300 cursor-pointer" onClick={action.action}>
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="text-3xl md:text-4xl mb-3 md:mb-4">{action.icon}</div>
                    <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-sm md:text-base mb-2">
                      {action.title}
                    </h3>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-xs md:text-sm">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8 md:mb-12">
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-colors [font-family:'Lexend',Helvetica] font-medium text-xs md:text-sm ${
                    selectedCategory === category.id
                      ? 'bg-[#3f8cbf] text-white'
                      : 'bg-[#1e282d] border border-[#3d4f5b] text-[#9eafbf] hover:bg-[#2a3540] hover:text-white'
                  }`}
                >
                  <span className="text-sm md:text-base">{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Knowledge Base */}
          <div className="mb-12 md:mb-16">
            <h2 className="[font-family:'Lexend',Helvetica] font-bold text-white text-2xl md:text-3xl mb-6 md:mb-8 text-center">
              Knowledge Base 📖
            </h2>
            
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="bg-[#1e282d] border-[#3d4f5b] hover:scale-105 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {categories.find(cat => cat.id === article.category)?.icon}
                          </span>
                          {article.popular && (
                            <span className="bg-[#3f8cbf] text-white px-2 py-1 rounded-full text-xs [font-family:'Lexend',Helvetica] font-medium">
                              Popular
                            </span>
                          )}
                        </div>
                        <span className="text-[#9eafbf] text-xs [font-family:'Lexend',Helvetica]">
                          {article.readTime}
                        </span>
                      </div>
                      
                      <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-base md:text-lg mb-2 md:mb-3">
                        {article.title}
                      </h3>
                      
                      <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-xs md:text-sm leading-5 md:leading-6">
                        {article.description}
                      </p>
                      
                      <div className="mt-4">
                        <Button className="w-full bg-transparent border border-[#3d4f5b] text-[#3f8cbf] hover:bg-[#3f8cbf] hover:text-white [font-family:'Lexend',Helvetica] font-medium text-xs md:text-sm">
                          Read Article
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 md:py-12">
                <div className="text-4xl md:text-6xl mb-4">🔍</div>
                <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg md:text-xl mb-2">
                  No articles found
                </h3>
                <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm md:text-base">
                  Try adjusting your search or category filter
                </p>
              </div>
            )}
          </div>

          {/* FAQs */}
          <div className="mb-12 md:mb-16">
            <h2 className="[font-family:'Lexend',Helvetica] font-bold text-white text-2xl md:text-3xl mb-6 md:mb-8 text-center">
              Frequently Asked Questions ❓
            </h2>
            
            {filteredFaqs.length > 0 ? (
              <div className="space-y-3 md:space-y-4 max-w-[800px] mx-auto">
                {filteredFaqs.map((faq) => (
                  <Card key={faq.id} className="bg-[#1e282d] border-[#3d4f5b]">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full p-4 md:p-6 text-left flex items-center justify-between hover:bg-[#2a3540] transition-colors"
                      >
                        <h3 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm md:text-base pr-4">
                          {faq.question}
                        </h3>
                        <span className="text-[#3f8cbf] text-lg md:text-xl flex-shrink-0">
                          {expandedFaq === faq.id ? '−' : '+'}
                        </span>
                      </button>
                      
                      {expandedFaq === faq.id && (
                        <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-[#3d4f5b]">
                          <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-xs md:text-sm leading-5 md:leading-6 pt-3 md:pt-4">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 md:py-12">
                <div className="text-4xl md:text-6xl mb-4">❓</div>
                <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg md:text-xl mb-2">
                  No FAQs found
                </h3>
                <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm md:text-base">
                  Try adjusting your search or category filter
                </p>
              </div>
            )}
          </div>

          {/* Contact Support CTA */}
          <Card className="bg-gradient-to-r from-[#3f8cbf] to-[#2d6a94] border-[#3f8cbf]">
            <CardContent className="p-6 md:p-8 text-center">
              <h2 className="[font-family:'Lexend',Helvetica] font-bold text-white text-xl md:text-2xl mb-3 md:mb-4">
                Still Need Help? 🤝
              </h2>
              <p className="[font-family:'Lexend',Helvetica] text-white/90 text-sm md:text-base mb-4 md:mb-6 max-w-[500px] mx-auto">
                Can't find what you're looking for? Our support team is here to help you succeed in your learning journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Button 
                  className="bg-white text-[#3f8cbf] hover:bg-gray-100 [font-family:'Lexend',Helvetica] font-bold px-6 md:px-8 py-2 md:py-3"
                  onClick={() => window.location.href = '/contact'}
                >
                  Contact Support
                </Button>
                <Button 
                  className="bg-transparent border border-white text-white hover:bg-white/10 [font-family:'Lexend',Helvetica] font-bold px-6 md:px-8 py-2 md:py-3"
                  onClick={() => window.location.href = '/dashboard/ai-tutor'}
                >
                  Ask AI Tutor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <CoursesSection />
    </main>
  );
};