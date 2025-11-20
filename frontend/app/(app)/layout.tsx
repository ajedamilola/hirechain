"use client";
import { AppNavigation } from "@/components/app-navigation";
import { Toaster } from "sonner";
import { WalletProvider } from "../context/WalletProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppNavigation>
      <WalletProvider>
        {children}
        <Toaster richColors />
      </WalletProvider>
    </AppNavigation>
  );
}
