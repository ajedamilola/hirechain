"use client";

import { useState } from "react";
import { DashboardOverview } from "./dashboard-overview";
import { GigDetailPage } from "./gigs/gig-detail-page";
import { Moon, LogOut } from "lucide-react";
import { GigListingWithAI } from "./gigs/gig-listing-with-ai";
import { LoginPage } from "./registration-page";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { FreelancersBrowsing } from "./freelancers/freelancers-browsing"; // Import FreelancersBrowsing component

interface SelectedGig {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  matchScore?: number;
}

export function DemoShowcase() {
  const [currentView, setCurrentView] = useState<
    "login" | "dashboard" | "gigs" | "gig-detail" | "freelancers"
  >("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedGig, setSelectedGig] = useState<SelectedGig | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const privateKey =
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";
  const truncatedAddress = `${walletAddress.slice(
    0,
    6
  )}...${walletAddress.slice(-4)}`;

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView("login");
    setSelectedGig(null);
  };

  const handleGigSelect = (gig: SelectedGig) => {
    setSelectedGig(gig);
    setCurrentView("gig-detail");
  };

  const handleCloseGigDetail = () => {
    setSelectedGig(null);
    setCurrentView("gigs");
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Right Side - Only show when logged in */}
            {isLoggedIn && (
              <div className='flex items-center gap-4 ml-auto'>
                {/* Wallet Display */}
                <div className='hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50'>
                  <span className='text-xs text-foreground/70'>
                    {truncatedAddress}
                  </span>
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className='p-2 rounded-lg hover:bg-muted transition-colors'
                >
                  <Moon className='h-4 w-4' />
                </button>

                {/* Profile Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className='h-9 w-9 rounded-full bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center'>
                      <div className='h-5 w-5 rounded-full bg-primary/20' />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-56'>
                    <DropdownMenuItem className='flex flex-col items-start py-2'>
                      <span className='text-xs text-foreground/70'>
                        Wallet Address
                      </span>
                      <span className='text-sm font-mono text-foreground'>
                        {truncatedAddress}
                      </span>
                    </DropdownMenuItem>
                    <div className='my-1 h-px bg-border' />
                    <DropdownMenuItem
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className='cursor-pointer'
                    >
                      {showPrivateKey ? "Hide Private Key" : "View Private Key"}
                    </DropdownMenuItem>
                    {showPrivateKey && (
                      <DropdownMenuItem
                        disabled
                        className='flex flex-col items-start py-2'
                      >
                        <span className='text-xs text-foreground/70 mb-1'>
                          Private Key
                        </span>
                        <span className='text-xs font-mono text-foreground break-all bg-muted/50 p-2 rounded w-full'>
                          {privateKey}
                        </span>
                      </DropdownMenuItem>
                    )}
                    <div className='my-1 h-px bg-border' />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className='cursor-pointer text-red-600'
                    >
                      <LogOut className='h-4 w-4 mr-2' />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Only show when logged in */}
      {isLoggedIn && (
        <div className='bg-muted/50 border-b border-border sticky top-16 z-40'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex gap-2 overflow-x-auto py-3'>
              {[
                { id: "dashboard", label: "Dashboard" },
                { id: "gigs", label: "Gigs" },
                { id: "freelancers", label: "Freelancers" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id as any);
                    setSelectedGig(null);
                  }}
                  className={`px-3 py-1 rounded text-sm whitespace-nowrap transition-colors ${
                    currentView === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {currentView === "login" && !isLoggedIn && (
          <LoginPage onLogin={handleLogin} />
        )}

        {currentView === "dashboard" && isLoggedIn && <DashboardOverview />}

        {currentView === "gigs" && isLoggedIn && (
          <GigListingWithAI onGigSelect={handleGigSelect} />
        )}

        {currentView === "gig-detail" && isLoggedIn && selectedGig && (
          <div className='space-y-4'>
            <button
              onClick={handleCloseGigDetail}
              className='text-foreground/70 hover:text-foreground flex items-center gap-2 text-sm'
            >
              ← Back to Gigs
            </button>
            <GigDetailPage gigData={selectedGig} />
          </div>
        )}

        {currentView === "freelancers" && isLoggedIn && <FreelancersBrowsing />}
      </main>
    </div>
  );
}
