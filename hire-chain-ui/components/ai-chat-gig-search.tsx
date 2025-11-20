"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Send, Sparkles } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIGigSearchProps {
  mode: "search" | "post"
  onClose: () => void
}

export function AIGigSearch({ mode, onClose }: AIGigSearchProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        mode === "search"
          ? "Hi! I'm here to help you find the perfect gig. Tell me about your skills and what kind of work you're looking for."
          : "Hi! I'm here to help you create a job posting. Tell me about the project you need help with.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          mode === "search"
            ? "Based on your skills, I found 5 gigs that match perfectly. Would you like me to show you the top matches or refine the search?"
            : "Great! I'll help you create a job posting. Let me gather some details about your project requirements.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <CardHeader className="border-b border-border flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>{mode === "search" ? "Find Your Perfect Gig" : "Create a Job Posting"}</CardTitle>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground px-4 py-2 rounded-lg">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-foreground/50 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-foreground/50 animate-bounce delay-100" />
                  <div className="h-2 w-2 rounded-full bg-foreground/50 animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Input */}
        <div className="border-t border-border p-4 space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder={mode === "search" ? "Describe the gig you're looking for..." : "Describe your project..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              {mode === "search" ? "Show matches" : "Quick template"}
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              {mode === "search" ? "Filter by budget" : "Add requirements"}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  )
}
