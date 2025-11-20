import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <div id='join-now'>
      {/* CTA Section */}
      <section className='wrapper rounded-b-3xl'>
        <div className='max-w-4xl mx-auto px-4 lg:px-8 text-center'>
          <h2 className='text-3xl md:text-5xl lg:text-6xl text-white mb-6 font-shinko'>
            Ready to join the future of work?
          </h2>
          {/* <p className='text-xl text-gray-300/70 mb-4'>
            Join African freelancers and global clients building on Hedera
          </p> */}
          <p className='text-lg text-purple-50 mb-12'>
            Start earning in HBAR today. No intermediaries. No barriers.
          </p>
          <div className='flex flex-row gap-4 justify-center '>
            <Link href='/demo'>
              <Button
                size='lg'
                className='bg-purple-500 text-white hover:bg-purple-600/90'
              >
                Launch App
              </Button>
            </Link>
            <Link href='/demo'>
              <Button
                size='lg'
                variant='outline'
                className='border-purple-500 text-purple-400 hover:bg-purple-500/10'
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
