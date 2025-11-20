"use client";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useWallet } from "@/app/context/WalletProvider";
import { useStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Stats", href: "#stats" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Join now", href: "#join-now" }
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { connectWallet, disconnectWallet, isLoading, isConnected } =
    useWallet();

  const { authenticatedAccountId } = useStore();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 bg-black border-b border-gray-800/20`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='shrink-0'>
            <Link href='/' className='flex items-center group'>
              <Image
                src='/images/logo.png'
                alt='Logo'
                width={120}
                height={50}
                className='h-10 w-auto invert transition-transform duration-300 group-hover:scale-105'
              />
              <span className='ml-2 text-xl font-bold text-white font-hankenLight'>
                HireChain
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className='relative text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 group'
              >
                {link.name}
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full'></span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className='md:hidden flex items-center'>
            <button
              onClick={toggleMenu}
              className={cn(
                "flex h-8 w-8 flex-col items-center justify-center space-y-1.5 focus:outline-none lg:hidden"
                // isMenuOpen && "absolute",
              )}
              aria-label='Toggle menu'
            >
              <div
                className={cn(
                  "h-0.5 w-[38px] bg-white transition-all duration-300 ease-in-out",
                  {
                    "w-[28px] translate-y-[3.5px] rotate-45": isMenuOpen
                  }
                )}
              />

              <div
                className={cn(
                  "h-0.5 w-[38px] bg-white transition-all duration-300 ease-in-out",
                  {
                    "w-[28px] -translate-y-[4px] -rotate-45": isMenuOpen
                  }
                )}
              />
            </button>
          </div>

          {/* Desktop Action Buttons */}
          <div className='hidden md:flex items-center space-x-4'>
            <div className='hidden sm:flex'>
              {isConnected && authenticatedAccountId && !isLoading ? (
                <Link href='/dashboard'>
                  <Button className='bg-purple-500 text-white rounded-md font-hankenLight cursor-pointer'>
                    Launch App
                  </Button>
                </Link>
              ) : (
                <Button
                  disabled={isLoading}
                  className='bg-purple-500 text-white rounded-md font-hankenLight disabled:opacity-50 cursor-pointer'
                  onClick={connectWallet}
                >
                  {isLoading ? "Connecting Wallet" : "Connect Wallet"}
                </Button>
              )}
            </div>
            <Button variant='ghost' size='icon' className='h-9 w-9 bg-white/10'>
              <Moon className='h-4 w-4 text-[#ccb0e2]' />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-9 w-9 rounded-full bg-muted'
                >
                  <div className='h-5 w-5 rounded-full bg-primary/20' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='font-[HankenGroteskLight]'
              >
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={disconnectWallet}>
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden absolute w-full ${
          isMenuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className='px-4 pt-2 pb-4 space-y-2 bg-black/10 backdrop-blur-lg border-t border-border'>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className='block px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-purple-500 transition-colors'
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className='pt-4 border-t border-border mt-2'>
            {isConnected && authenticatedAccountId && !isLoading ? (
              <Link href='/dashboard' className='w-full'>
                <Button className='w-full bg-purple-600 text-white hover:bg-purple-700/90'>
                  Launch App
                </Button>
              </Link>
            ) : (
              <Button
                disabled={isLoading}
                className='w-full bg-purple-600 text-white hover:bg-purple-700/90 disabled:opacity-50'
                onClick={connectWallet}
              >
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
