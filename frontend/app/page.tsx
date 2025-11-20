"use client";
import { ReactLenis } from "lenis/react";
import Hero from "@/components/landing-page/Hero";
import Features from "@/components/landing-page/Features";
import SocialProof from "@/components/landing-page/SocialProof";
import CTA from "@/components/landing-page/cta";
import Footer from "@/components/landing-page/Footer";
import Header from "@/components/landing-page/Header";

export default function Home() {
  return (
    <ReactLenis root>
      <div className='bg-black'>
        <Header />
        <Hero />
        <Features />
        <SocialProof />
        <CTA />
        <Footer />
      </div>
    </ReactLenis>
  );
}
