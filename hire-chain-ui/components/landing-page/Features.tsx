import { Zap, Shield, Globe, Lock, Coins, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Features() {
  const features = [
    {
      icon: TrendingDown,
      title: "Lower Fees",
      description:
        "Keep more of what you earn with minimal platform fees powered by Hedera's low-cost transactions"
    },
    {
      icon: Zap,
      title: "Faster Payments",
      description:
        "Receive HBAR payments instantly after work delivery—no waiting days for bank transfers"
    },
    {
      icon: Globe,
      title: "No Geographic Barriers",
      description:
        "African freelancers access global clients, and clients worldwide discover skilled African professionals"
    },
    {
      icon: Lock,
      title: "Trustless & Transparent",
      description:
        "Smart contract escrow ensures secure payments and transparent work history on-chain"
    },
    {
      icon: Coins,
      title: "Direct HBAR Payments",
      description:
        "Get paid directly in HBAR cryptocurrency without intermediaries or currency conversion fees"
    },
    {
      icon: Shield,
      title: "On-Chain Reputation",
      description:
        "Build your verified professional reputation with immutable work history on Hedera blockchain"
    }
  ];
  return (
    <div id='features'>
      <section className='wrapper bg-black'>
        <div className='max-w-7xl mx-auto px-1 md:px-8 pt-5'>
          <h2 className='text-[28px] lg:text-4xl font-bold text-white text-center mb-4 font-shinko'>
            Why HireChain?
          </h2>

          <p className='text-lg lg:text-xl text-gray-300/60 text-center mb-12 max-w-3xl mx-auto px-3'>
            Built on Hedera to empower African talent with Web3 technology
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-black'>
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className='hover:shadow-lg transition-shadow bg-black border-purple-500/20 hover:border-purple-500/40'
                >
                  <CardContent className='pt-6'>
                    <Icon className='h-8 w-8 text-purple-500 mb-4' />
                    <h3 className='text-lg font-shinko text-white mb-2'>
                      {feature.title}
                    </h3>
                    <p className='text-white/70 '>{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
