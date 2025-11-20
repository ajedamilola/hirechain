"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Logo from "@/components/assets/logo/Logo.png";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hi! I'm your HireChain AI Assistant. I can help you find gigs, post jobs, or answer questions about the platform. What would you like to do?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedActions = [
    {
      icon: "🔍",
      label: "Find gigs for me",
      prompt: "Help me find gigs that match my skills"
    },
    { icon: "📝", label: "Post a job", prompt: "I want to post a new job" },
    {
      icon: "💡",
      label: "Get recommendations",
      prompt: "What gigs would you recommend for me?"
    },
    { icon: "❓", label: "How it works", prompt: "How does HireChain work?" }
  ];

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: { [key: string]: string } = {
        find: "I found 5 gigs that match your profile! They include React development, UI design, and API integration projects. Would you like me to show you the details?",
        post: "Great! I can help you post a job. Tell me about the project - what skills do you need, what's your budget, and when do you need it completed?",
        recommend:
          "Based on your profile, I recommend these gigs: 1) React Dashboard ($2,500), 2) Mobile App Design ($1,800), 3) API Integration ($1,200). Interested in any of these?",
        how: "HireChain is a decentralized freelancing platform on Hedera. You can post jobs, find gigs, get matched with AI, and receive instant payments in HBAR. No intermediaries, no fees!"
      };

      let response =
        "I'm here to help! Could you be more specific about what you'd like to do?";

      if (
        text.toLowerCase().includes("find") ||
        text.toLowerCase().includes("gig")
      ) {
        response = responses.find;
      } else if (
        text.toLowerCase().includes("post") ||
        text.toLowerCase().includes("job")
      ) {
        response = responses.post;
      } else if (text.toLowerCase().includes("recommend")) {
        response = responses.recommend;
      } else if (text.toLowerCase().includes("how")) {
        response = responses.how;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className='rounded-full h-14 w-14 bg-[#f100c3] hover:bg-[#f100c3]/80 font-[HankenGroteskLight] transition-all duration-300 hover:scale-105'
        size='icon'
      >
        <Sparkles className='h-6 w-6' />
      </Button>
    );
  }

  return (
    <Card className='fixed bottom-6 right-6 w-[380px] shadow-2xl border font-[HankenGroteskLight] border-white/20 bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden transition-all duration-300 animate-fade-in-up max-h-[480px] flex flex-col'>
      <CardHeader className='flex flex-row items-center justify-between p-3 bg-[#c100c3] relative'>
        <div className='flex items-center gap-2'>
          <div className='relative'>
            <Image
              src={Logo}
              alt='Logo'
              width={28}
              height={28}
              className='h-8 w-8 invert'
            />
            <div className='absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-400 border border-white'></div>
          </div>
          <div className='ml-1'>
            <CardTitle className='text-[16px] font-medium text-white'>
              HireChain AI
            </CardTitle>
            <p className='text-[11px] text-white/90 font-[HankenGroteskLight] leading-none'>
              Online
            </p>
          </div>
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setIsOpen(false)}
          className='h-8 w-8 text-white/90 hover:bg-white/20 rounded-full transition-colors -mr-1'
        >
          <X className='h-3.5 w-3.5' />
        </Button>
      </CardHeader>

      <CardContent className='p-0 flex flex-col h-[calc(100%-52px)]'>
        {/* Messages */}
        <div className='flex-1 overflow-y-auto space-y-2 p-4 font-[HankenGroteskLight] bg-white/50 scrollbar-thin scrollbar-thumb-[#f100c3]/30 scrollbar-track-transparent'>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-xl font-[HankenGroteskLight] text-sm ${
                  message.type === "user"
                    ? "bg-[#f100c3] text-white rounded-br-none ml-auto"
                    : "bg-white/90 text-[#2b0a30] rounded-bl-none border border-white/30"
                } transition-all duration-200`}
                style={{
                  boxShadow:
                    message.type === "assistant"
                      ? "0 2px 8px rgba(195, 0, 150, 0.08)"
                      : "0 2px 10px rgba(195, 0, 150, 0.15)"
                }}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className='flex justify-start'>
              <div className='bg-muted text-foreground font-[HankenGroteskLight] px-4 py-2 rounded-lg rounded-bl-none text-sm'>
                <div className='flex gap-1'>
                  <div className='h-2 w-2 bg-foreground/50 rounded-full animate-bounce' />
                  <div
                    className='h-2 w-2 bg-foreground/50 rounded-full animate-bounce'
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className='h-2 w-2 bg-foreground/50 rounded-full animate-bounce'
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Actions (show when no messages beyond initial) */}
        {messages.length === 1 && (
          <div className='mb-4 space-y-3 px-2'>
            <p className='text-xs text-[#2b0a30]/70 font-[HankenGroteskLight] text-center'>
              How can I help you today?
            </p>
            <div className='grid grid-cols-2 gap-3'>
              {suggestedActions.map((action, index) => (
                <button
                  key={action.label}
                  onClick={() => handleSendMessage(action.prompt)}
                  className='text-left p-3 font-[HankenGroteskLight] rounded-xl bg-white border border-[#f0e5f0] hover:border-indigo-600/30 hover:bg-gradient-to-br from-white to-[#fff5fc] transition-all duration-300 text-xs group overflow-hidden relative'
                  style={{
                    animation: `fadeInUp 0.3s ease-out ${
                      index * 0.05
                    }s forwards`,
                    opacity: 0,
                    transform: "translateY(10px)"
                  }}
                >
                  <div className='absolute inset-0 bg-gradient-to-br from-[#c1009a]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                  <div className='relative z-10'>
                    <div className='text-lg mb-1.5 group-hover:scale-110 transition-transform duration-300 text-indigo-600'>
                      {action.icon}
                    </div>
                    <div className='font-medium text-[#2b0a30] group-hover:text-indigo-600 transition-colors duration-300'>
                      {action.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input - Fixed to bottom */}
        <div className='sticky bottom-0 bg-gradient-to-t from-white to-[#fdf2ff] border-t border-white/30 px-3 pb-3 pt-2'>
          <div className='relative'>
            <Input
              placeholder='Ask me anything about jobs, gigs, or payments...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className='w-full text-sm pr-12 h-11 border-2 border-[#f0e5f0] focus-visible:ring-2 focus-visible:ring-indigo-600/30 focus-visible:border-indigo-600 transition-all duration-200 rounded-xl shadow-sm bg-white/90 backdrop-blur-sm'
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage()}
              size='icon'
              className={`absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                input.trim()
                  ? "bg-[#f100c3] hover:bg-[#d100a8] text-white shadow-md"
                  : "bg-[#f100c3] text-[#ffff] cursor-not-allowed"
              }`}
              disabled={isLoading || !input.trim()}
            >
              <Send
                className={`h-4 w-4 transition-transform ${
                  input.trim() ? "scale-100" : "scale-90"
                }`}
              />
            </Button>
          </div>
          <p className='text-[11px] text-center text-[#2b0a30]/50 mt-1.5 font-[HankenGroteskLight]'>
            Powered by HireChain AI • {new Date().toLocaleDateString()}
          </p>
        </div>

        <style jsx global>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: fadeInUp 0.3s ease-out forwards;
          }

          .scrollbar-thin::-webkit-scrollbar {
            width: 4px;
          }

          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }

          .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: rgba(193, 0, 154, 0.2);
            border-radius: 4px;
          }

          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background-color: rgba(193, 0, 154, 0.3);
          }
        `}</style>
      </CardContent>
    </Card>
  );
}
