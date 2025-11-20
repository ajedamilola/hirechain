import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { useWallet } from "@/app/context/WalletProvider";
import { useMediaQuery } from "react-responsive";
import { cn } from "@/lib/utils";

export default function Hero() {
  const { connectWallet } = useWallet();

  const isMobile = useMediaQuery({ query: "(max-width: 370px)" });

  return (
    <div>
      {/* Hero Section */}
      <section className='relative min-h-[700px] flex items-center justify-center bg-black lg:py-36 py-20'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <div className='inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm'>
            <Zap className='w-4 h-4 text-purple-400' />
            <span className='text-sm font-medium text-purple-300'>
              Powered by Hedera Network
            </span>
          </div>

          <h1
            className={cn(
              "md:text-5xl text-4xl lg:text-7xl font-bold font-shinko text-white mb-6 text-balance",
              {
                "text-3xl": isMobile
              }
            )}
          >
            Empowering African Talent. Connecting Global Opportunities.
          </h1>

          <p className='text-xl sm:text-2xl text-gray-300/60 mb-8 text-balance'>
            A Web3-native freelancer platform built on Hedera where African
            professionals get paid in HBAR—instantly, transparently, without
            intermediaries.
          </p>
          {/* <p className='text-lg text-purple-400 mb-12 text-balance'>
            Lower fees. Faster payments. No geographic barriers. Trustless
            experience.
          </p> */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              size='lg'
              className='bg-purple-500 text-white font-hankenLight hover:bg-purple-600 cursor-pointer'
              onClick={() => {
                connectWallet();
              }}
            >
              Start as a Freelancer
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
            <Button
              size='lg'
              // variant='outline'
              className='border-purple-500 text-purple-50 hover:bg-purple-500/10 font-hankenLight cursor-pointer'
              onClick={() => {
                connectWallet();
              }}
            >
              Hire African Talent
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
