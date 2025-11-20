// "use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { WalletProvider } from "@/app/context/WalletProvider";
import { AppNavigation } from "@/components/app-navigation";
import "./globals.css";
import { Toaster } from "sonner";
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "HireChain Decentralize Freelancing",
  description: "Decentralized freelancing powered by Hedera",
  generator: "HireChain"
};


export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning className='scroll-smooth'>
      <body className={`antialiased font-hankenLight`}>
        <WalletProvider>{children}</WalletProvider>
        <Toaster richColors />
        <Analytics />
      </body>
    </html>
  );
}
