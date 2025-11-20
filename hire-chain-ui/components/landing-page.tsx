"use client"

import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Footer from "./LandingPage/Footer"

export function HowItWorks() {
  return (
    <div className="bg-black">

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl  text-center mb-16 font-[shinko] text-white">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Post a Job or Offer Services",
                description: "Create a gig listing with your requirements or browse available opportunities",
              },
              {
                step: 2,
                title: "AI Matches You with Perfect Fit",
                description: "Our intelligent matching algorithm finds the best freelancer or client for you",
              },
              {
                step: 3,
                title: "Get Paid in HBAR Instantly",
                description: "Complete work and receive payment immediately with no withdrawal delays",
              },
            ].map((item) => (
              <div key={item.step} className="text-center text-white bg-gray-300/10 backdrop-blur-lg border-2 border-gray-300 p-14 rounded-2xl">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#f100c3] text-primary-foreground mb-4">
                  <span className="font-bold text-lg font-[HankenGroteskMedium] text-white">{item.step}</span>
                </div>
                <h3 className="text-xl md:text-3xl font-[HankenGroteskMedium] text-white mb-2">{item.title}</h3>
                <p className="text-[#A3A3B0] font-[HankenGroteskLight]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}