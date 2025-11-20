"use client";
import { useState, useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useWallet } from "@/app/context/WalletProvider";
import { useStore } from "@/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface AppNavigationProps {
  children: ReactNode;
}

export function AppNavigation({ children }: AppNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Get wallet state and functions
  const { isConnected, getConnector, disconnectWallet } = useWallet();

  // Get auth state from store
  const { profile, authenticatedAccountId } = useStore();

  // Force light theme
  useEffect(() => {
    // Always set to light theme
    document.documentElement.classList.remove("dark");
    // Remove any existing theme from localStorage
    localStorage.removeItem("theme");
  }, []);

  const walletAddress = authenticatedAccountId || "";
  const isLoggedIn = pathname !== "/login";

  const handleLogout = async () => {
    try {
      await disconnectWallet();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Dynamic navigation items based on profile type
  const getNavigationItems = () => {
    const baseItems = [{ href: "/dashboard", label: "Dashboard" }];

    if (profile?.profileType === "hirer") {
      // Hirer sees: Dashboard, Freelancers, My Gigs, Escrow
      return [
        ...baseItems,
        { href: "/freelancers", label: "Freelancers" },
        { href: "/my-gigs", label: "My Gigs" }
      ];
    } else if (profile?.profileType === "freelancer") {
      // Freelancer sees: Dashboard, Gigs, My Gigs, Escrow
      return [
        ...baseItems,
        { href: "/gigs", label: "Gigs" },
        { href: "/my-gigs", label: "My Gigs" },
        { href: "/invitations", label: "Invitations" }
      ];
    }

    // Default navigation if profile type is not set yet
    return [
      ...baseItems,
      { href: "/gigs", label: "Gigs" },
      { href: "/escrow", label: "Escrow" }
    ];
  };

  const navigationItems = getNavigationItems();

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected || !authenticatedAccountId) {
      router.replace("/");
    }
  }, [isConnected, authenticatedAccountId, router]);

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo */}
            <div className='shrink-0'>
              <Link href='/dashboard' className='flex items-center group'>
                <Image
                  src='/images/logo.png'
                  alt='Logo'
                  width={120}
                  height={50}
                  className='h-10 w-auto transition-transform duration-300 group-hover:scale-105'
                />
                <span className='ml-2 text-xl font-bold font-[HankenGroteskLight] group-hover:text-primary transition-colors duration-300'>
                  HireChain
                </span>
              </Link>
            </div>

            {/* Right Side - Only show when logged in */}
            {isLoggedIn && isConnected && (
              <div className='flex items-center gap-4 ml-auto'>
                {/* Profile Type Badge */}
                {profile?.profileType && (
                  <div className='hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium'>
                    {profile.profileType === "hirer"
                      ? "🏢 Hirer"
                      : "💼 Freelancer"}
                  </div>
                )}

                {/* Wallet Display */}
                <div className='hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg '>
                  {profile?.name || "Loading..."}
                </div>

                {/* Profile Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className='focus:outline-none focus:ring-2 focus:ring-primary rounded-full'>
                      <Avatar className='border border-primary cursor-pointer'>
                        <AvatarImage
                          src={`https://api.dicebear.com/9.x/identicon/svg?seed=${profile?.name}${authenticatedAccountId}`}
                        />
                        <AvatarFallback>
                          {profile?.name?.substring(0, 2)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem className='flex flex-col items-start py-2 focus:bg-muted/50 dark:focus:bg-gray-700/50'>
                      <span className='text-xs text-foreground/70 dark:text-foreground/60'>
                        Wallet Address
                      </span>
                      <span className='text-sm font-mono text-foreground dark:text-foreground/90'>
                        {walletAddress}
                      </span>
                    </DropdownMenuItem>
                    {profile?.profileType && (
                      <>
                        <div className='my-1 h-px bg-border dark:bg-gray-700' />
                        <DropdownMenuItem className='flex flex-col items-start py-2 focus:bg-muted/50 dark:focus:bg-gray-700/50'>
                          <span className='text-xs text-foreground/70 dark:text-foreground/60'>
                            Account Type
                          </span>
                          <span className='text-sm font-medium text-foreground dark:text-foreground/90 capitalize'>
                            {profile.profileType}
                          </span>
                        </DropdownMenuItem>
                      </>
                    )}
                    <div className='my-1 h-px bg-border dark:bg-gray-700' />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className='cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20'
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
      {isLoggedIn && isConnected && (
        <div className='bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-16 z-40 shadow-sm/20'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex gap-2 overflow-x-auto py-3 font-[HankenGroteskLight] font-bold'>
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/")
                      ? item.href.includes("dashboard")
                        ? "bg-indigo-600 text-white shadow-md"
                        : item.href.includes("messages")
                        ? "bg-[#25e5fa] text-white shadow-md"
                        : "bg-indigo-600 text-white shadow-md"
                      : "text-foreground/70 hover:text-foreground hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {children}
      </main>
    </div>
  );
}
