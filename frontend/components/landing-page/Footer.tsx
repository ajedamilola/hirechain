import Link from "next/link";
import { Twitter, Github } from "lucide-react";
import { FaXTwitter, FaGithub } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className='bg-black wrapper'>
      <div className='max-w-7xl mx-auto px-2 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          <div>
            <p className='font-bold text-white mb-4 font-shinko'>HireChain</p>
            <p className='text-sm text-white'>
              Decentralized freelancing on Hedera
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 gap-8'>
            <div>
              <p className='font-semibold font-shinko text-white mb-4'>
                Product
              </p>
              <ul className='space-y-2 text-sm text-gray-300/70'>
                <li>
                  <Link
                    href='#features'
                    className='hover:text-white transition-colors'
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href='#how-it-works'
                    className='hover:text-white transition-colors'
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className='font-semibold font-shinko text-white mb-4'>
                Resources
              </p>
              <ul className='space-y-2 text-sm text-gray-300/70'>
                <li>
                  <Link
                    href='/demo'
                    className='hover:text-white transition-colors'
                  >
                    Components
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white transition-colors'>
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className='font-semibold font-[shinko] text-white mb-4'>
                Connect
              </p>
              <div className='flex gap-4'>
                <a
                  href='#'
                  className='text-gray-300/70 hover:text-whhite transition-colors'
                >
                  <FaXTwitter className='h-5 w-5' />
                </a>
                <a
                  href='#'
                  className='text-gray-300/70 hover:text-white transition-colors'
                >
                  <FaGithub className='h-5 w-5' />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className='border-t-[0.1px] border-border pt-8 text-gray-300/70 text-sm flex flex-col sm:flex-row justify-between items-center'>
          <p>&copy; 2025 HireChain. All rights reserved.</p>
          <div className='flex gap-6 mt-4 sm:mt-0'>
            <Link href='#' className='hover:text-white transition-colors'>
              Privacy
            </Link>
            <a href='#' className='hover:text-white transition-colors'>
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
