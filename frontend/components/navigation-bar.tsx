"use client";

import { useState } from "react";
import { Moon, LogOut, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface NavigationBarProps {
  onLogout?: () => void;
}

export function NavigationBar({ onLogout }: NavigationBarProps) {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";
  const privateKey =
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  const truncatedAddress = `${walletAddress.slice(
    0,
    6
  )}...${walletAddress.slice(-4)}`;

  return (
    <>
      {/* Logo */}
      <div className='shrink-0'>
        <span className='text-xl font-bold text-foreground'>HireChain</span>
      </div>

      {/* Right Side Actions */}
      <div className='flex items-center gap-4'>
        {/* Wallet Display */}
        <div className='hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50'>
          <span className='text-xs text-foreground/70'>{truncatedAddress}</span>
        </div>

        {/* Theme Toggle */}
        <Button variant='ghost' size='icon' className='h-9 w-9'>
          <Moon className='h-4 w-4' />
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
          <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuItem
              disabled
              className='flex flex-col items-start py-2'
            >
              <span className='text-xs text-foreground/70'>Wallet Address</span>
              <span className='text-sm font-mono text-foreground'>
                {truncatedAddress}
              </span>
            </DropdownMenuItem>
            <div className='my-1 h-px bg-border' />
            <DropdownMenuItem
              onClick={() => setShowPrivateKey(!showPrivateKey)}
              className='cursor-pointer flex items-center gap-2'
            >
              {showPrivateKey ? (
                <>
                  <EyeOff className='h-4 w-4' />
                  Hide Private Key
                </>
              ) : (
                <>
                  <Eye className='h-4 w-4' />
                  View Private Key
                </>
              )}
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
              onClick={onLogout}
              className='cursor-pointer text-red-600'
            >
              <LogOut className='h-4 w-4 mr-2' />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
