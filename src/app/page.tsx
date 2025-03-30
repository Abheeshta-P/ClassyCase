import { MaxWidthWrapper } from "@/components";
import { Check } from "lucide-react";

export default function Home() {
  return (
    <main className="bg-slate-50 w-full min-h-screen">
      <section>
        <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52">
          <div className="col-span-2 px:6 lg:px-0 lg:pb-4">
            <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="absolute w-32 left-0 -top-20 hidden lg:block">
                <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t via-slate-50/5 from-slate-50 h-28' />
                <img src="/images/main.png" alt="Panther as the icon" className="w-full h-full" />
              </div>  
              <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-5xl md:text-6xl lg:text-7xl">Your Image on a <span className="bg-green-600 px-2 text-white">Custom</span> Phone Case</h1>
              <p className="mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap">
                Capture your favorite memories with your own, <span className="font-semibold">one-of-one</span> phone case.
                ClassyCase allows you to protect your memories, not just your phone case.
              </p>

              <ul className="mt-8 space-y-2 text-left font-medium flex flex-col items-start">
                  <li className='flex gap-1.5 items-center justify-center'>
                    <Check className='h-5 w-5 shrink-0 text-green-600' />
                    High-quality, durable material
                  </li>
                   <li className='flex gap-1.5 items-center justify-center'>
                    <Check className='h-5 w-5 shrink-0 text-green-600' />5 year
                    print guarantee
                  </li>
                  <li className='flex gap-1.5 items-center justify-center'>
                    <Check className='h-5 w-5 shrink-0 text-green-600' />
                    Modern iPhone models supported
                  </li>
              </ul>
            </div>
            
          </div>
        </MaxWidthWrapper>
      </section>
    </main>
  );
}
