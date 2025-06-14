import React, { useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ProtectedRoute } from "../../../components/ProtectedRoute";

export const AITutorPage = (): JSX.Element => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI tutor. How can I help you with your studies today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickQuestions = [
    "Explain quadratic equations",
    "Help with organic chemistry",
    "Physics motion problems",
    "Biology cell structure"
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: "I understand you're asking about that topic. Let me break it down for you step by step...",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="[font-family:'Lexend',Helvetica] font-bold text-white text-2xl md:text-3xl mb-2">
              AI Tutor 🤖
            </h1>
            <p className="[font-family:'Lexend',Helvetica] text-[#9eafbf] text-base">
              Get instant help with your studies. Ask questions, solve problems, and learn concepts.
            </p>
          </div>

          {/* Chat Interface */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-[#3f8cbf] text-white'
                          : 'bg-[#0f1419] text-white border border-[#3d4f5b]'
                      }`}
                    >
                      <p className="[font-family:'Lexend',Helvetica] text-sm">
                        {message.content}
                      </p>
                      <p className="[font-family:'Lexend',Helvetica] text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="border-t border-[#3d4f5b] p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything about your studies..."
                    className="flex-1 px-4 py-2 bg-[#0f1419] border border-[#3d4f5b] rounded-lg text-white placeholder-[#9eafbf] focus:border-[#3f8cbf] focus:outline-none [font-family:'Lexend',Helvetica]"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-[#3f8cbf] hover:bg-[#2d6a94] text-white px-6 [font-family:'Lexend',Helvetica]"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Questions */}
          <Card className="bg-[#1e282d] border-[#3d4f5b]">
            <CardContent className="p-6">
              <h3 className="[font-family:'Lexend',Helvetica] font-bold text-white text-lg mb-4">
                Quick Questions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    onClick={() => setInputMessage(question)}
                    className="bg-[#0f1419] border border-[#3d4f5b] text-white hover:bg-[#2a3540] justify-start [font-family:'Lexend',Helvetica] text-sm"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};