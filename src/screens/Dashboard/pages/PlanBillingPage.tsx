import React from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ProtectedRoute } from "../../../components/ProtectedRoute";

export const PlanBillingPage = (): JSX.Element => {
  const currentSubscription = {
    plan: 'Basic',
    status: 'Active',
    nextBilling: '2024-02-15',
    price: 'Free'
  };

  const billingDetails = {
    paymentMethod: 'Not set',
    billingAddress: 'Not provided',
    invoiceEmail: 'user@example.com',
    taxId: 'Not provided'
  };

  const subscriptionPlans = [
    {
      name: "Basic",
      price: "Free",
      period: "Forever",
      features: [
        "5 AI tutoring sessions per month",
        "Basic progress tracking",
        "Access to core subjects",
        "Community support"
      ],
      current: true,
      popular: false
    },
    {
      name: "Pro",
      price: "PKR 799",
      period: "per month",
      features: [
        "Unlimited AI tutoring sessions",
        "Advanced progress analytics",
        "All subjects & exam prep",
        "Priority support",
        "Personalized study plans",
        "Practice tests & assessments"
      ],
      current: false,
      popular: true
    },
    {
      name: "Custom",
      price: "Contact Us",
      period: "for pricing",
      features: [
        "Everything in Pro",
        "Bulk student accounts",
        "Institution dashboard",
        "Custom curriculum integration",
        "Dedicated account manager",
        "Teacher training & support",
        "Advanced analytics & reporting"
      ],
      current: false,
      popular: false
    }
  ];

  const handleUpgrade = (planName: string) => {
    if (planName === "Custom") {
      window.location.href = '/contact';
    } else {
      alert(`Upgrading to ${planName} plan. This would redirect to payment processing.`);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="[font-family:'Lexend',Helvetica] font-bold text-white text-2xl md:text-3xl">
              Plan & Billing 💳
            </h1>
            <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-base">
              Manage your subscription and billing information.
            </p>
          </div>

          {/* Current Subscription */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                Current Subscription
              </h3>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#0f1419] rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="[font-family:'Lexend',Helvetica] font-bold text-white text-xl">
                      {currentSubscription.plan} Plan
                    </h4>
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs [font-family:'Lexend',Helvetica] font-medium">
                      {currentSubscription.status}
                    </span>
                  </div>
                  <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm mb-1">
                    Current Price: <span className="text-[#3f8cbf] font-medium">{currentSubscription.price}</span>
                  </p>
                  {currentSubscription.plan !== 'Basic' && (
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                      Next billing: {currentSubscription.nextBilling}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    className="bg-[#3f8cbf] hover:bg-[#2d6a94] text-white [font-family:'Lexend',Helvetica] font-medium"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    View All Plans
                  </Button>
                  {currentSubscription.plan !== 'Basic' && (
                    <Button className="bg-transparent border border-[#3d4f5b] text-white hover:bg-[#2a3540] [font-family:'Lexend',Helvetica] font-medium">
                      Manage Billing
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Details */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                Billing Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#0f1419] rounded-lg">
                  <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm mb-2">
                    Payment Method
                  </h4>
                  <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                    {billingDetails.paymentMethod}
                  </p>
                  <Button className="mt-2 bg-transparent border border-[#3d4f5b] text-[#3f8cbf] hover:bg-[#3f8cbf] hover:text-white [font-family:'Lexend',Helvetica] font-medium text-xs px-3 py-1">
                    Add Payment Method
                  </Button>
                </div>
                
                <div className="p-4 bg-[#0f1419] rounded-lg">
                  <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm mb-2">
                    Billing Address
                  </h4>
                  <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                    {billingDetails.billingAddress}
                  </p>
                  <Button className="mt-2 bg-transparent border border-[#3d4f5b] text-[#3f8cbf] hover:bg-[#3f8cbf] hover:text-white [font-family:'Lexend',Helvetica] font-medium text-xs px-3 py-1">
                    Update Address
                  </Button>
                </div>
                
                <div className="p-4 bg-[#0f1419] rounded-lg">
                  <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm mb-2">
                    Invoice Email
                  </h4>
                  <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                    {billingDetails.invoiceEmail}
                  </p>
                  <Button className="mt-2 bg-transparent border border-[#3d4f5b] text-[#3f8cbf] hover:bg-[#3f8cbf] hover:text-white [font-family:'Lexend',Helvetica] font-medium text-xs px-3 py-1">
                    Change Email
                  </Button>
                </div>
                
                <div className="p-4 bg-[#0f1419] rounded-lg">
                  <h4 className="[font-family:'Lexend',Helvetica] font-medium text-white text-sm mb-2">
                    Tax ID
                  </h4>
                  <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                    {billingDetails.taxId}
                  </p>
                  <Button className="mt-2 bg-transparent border border-[#3d4f5b] text-[#3f8cbf] hover:bg-[#3f8cbf] hover:text-white [font-family:'Lexend',Helvetica] font-medium text-xs px-3 py-1">
                    Add Tax ID
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Options */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-6">
                Upgrade Your Plan
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan, index) => (
                  <div
                    key={index}
                    className={`relative p-6 rounded-lg border ${
                      plan.current
                        ? 'bg-[#3f8cbf]/10 border-[#3f8cbf]'
                        : 'bg-[#0f1419] border-[#3d4f5b]'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-[#3f8cbf] text-white px-3 py-1 rounded-full text-xs font-bold [font-family:'Lexend',Helvetica]">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    {plan.current && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold [font-family:'Lexend',Helvetica]">
                          Current Plan
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-4">
                      <h4 className={`[font-family:'Lexend',Helvetica] font-bold text-xl mb-2 ${
                        plan.current ? 'text-[#3f8cbf]' : 'text-white'
                      }`}>
                        {plan.name}
                      </h4>
                      <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className={`[font-family:'Lexend',Helvetica] font-black ${
                          plan.name === "Custom" ? 'text-xl' : 'text-2xl'
                        } ${
                          plan.current ? 'text-[#3f8cbf]' : 'text-white'
                        }`}>
                          {plan.price}
                        </span>
                        <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            plan.current ? 'bg-[#3f8cbf]' : 'bg-[#3f8cbf]'
                          }`}>
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                          <span className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleUpgrade(plan.name)}
                      disabled={plan.current}
                      className={`w-full [font-family:'Lexend',Helvetica] font-medium ${
                        plan.current
                          ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                          : plan.popular
                          ? 'bg-[#3f8cbf] hover:bg-[#2d6a94] text-white'
                          : 'bg-transparent border border-[#3d4f5b] text-white hover:bg-[#2a3540]'
                      }`}
                    >
                      {plan.current ? 'Current Plan' : 
                       plan.name === "Custom" ? 'Contact Sales' : `Upgrade to ${plan.name}`}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-blue-400 text-xl">💡</div>
                  <div>
                    <h4 className="[font-family:'Lexend',Helvetica] font-medium text-blue-400 mb-1">
                      Need help choosing?
                    </h4>
                    <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-sm">
                      Contact our support team for personalized recommendations based on your learning goals.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};