"use client"

import { useState } from "react"
import { Copy, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const walletAddress = "0x1234567890abcdef1234567890abcdef12345678"
  const balance = 5250.5

  if (!isConnected) {
    return (
      <Button onClick={() => setIsConnected(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
        Connect Wallet
      </Button>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-foreground/70 mb-1">Wallet Address</p>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">{walletAddress}</code>
              <button className="text-foreground/70 hover:text-foreground">
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs text-foreground/70 mb-1">Balance</p>
            <p className="font-semibold text-foreground">{balance} HBAR</p>
          </div>

          <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsConnected(false)}>
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
