"use client"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 text-balance">
          Earn without intermediaries
        </h1>
        <p className="text-xl text-foreground/70 mb-12 text-balance">Global freelance work, instant HBAR payments</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Post a Job
          </Button>
          <Button size="lg" variant="outline">
            Browse Gigs
          </Button>
        </div>
      </div>
    </section>
  )
}
