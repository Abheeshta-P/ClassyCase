import { MaxWidthWrapper,Phone } from "@/components";
import { Icons } from "@/components/atoms/Icons";
import CaseScroller from "@/components/organisms/CaseScroller";
import { Check, Star } from "lucide-react";

export default function Home() {
  return (
      <main className="bg-slate-50 w-full min-h-screen grainy-light">
      <section>
        <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52">
          <div className="col-span-2 px:6 lg:px-0 lg:pb-4">
            <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="absolute w-32 left-0 -top-20 hidden lg:block">
                <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t via-slate-50/5 from-slate-50 h-28' />
                <img src="/images/main.png" alt="Panther as the icon" className="w-full h-full" />
              </div>  
              <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-5xl md:text-6xl lg:text-7xl">Your Image on a <span className="bg-green-600 px-2 text-white">Custom</span> Phone Case</h1>
              <p className="mt-8 text-lg lg:pr-10 max-w-[500px] lg:max-w-[700px] text-center lg:text-left text-balance md:text-wrap">
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

              <div className="mt-12 flex flex-col sm:flex-row items-center  gap-5">
                {/* image user faces */}
                <div className="flex -space-x-4">
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-200" src="/users/user-1.png" alt="user-1 image" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100" src="/users/user-2.png" alt="user-2 image" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100" src="/users/user-3.png" alt="user-3 image" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100" src="/users/user-4.jpg" alt="user-4 image" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100 object-cover" src="/users/user-5.jpg" alt="user-5 image" />
                </div>
                <div className="flex flex-col justify-between items-center sm:items-start">
                  {/* stars */}
                  <div className="flex gap-0.5">
                    <Star className='h-4 w-4 text-green-600 fill-green-600' />
                    <Star className='h-4 w-4 text-green-600 fill-green-600' />
                    <Star className='h-4 w-4 text-green-600 fill-green-600' />
                    <Star className='h-4 w-4 text-green-600 fill-green-600' />
                    <Star className='h-4 w-4 text-green-600 fill-green-600' />
                  </div>
                  <p>
                    <span className='font-semibold'>1.250</span> happy customers
                  </p>
                </div>
              </div>
            </div>
          </div>

           <div className='col-span-full lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit'>
            <div className='relative md:max-w-xl'>
              <img
                src='/images/your-image.png'
                className='absolute w-40 lg:w-52 left-52 -top-20 select-none hidden sm:block lg:hidden xl:block'
              />
              <img
                src='/images/line.png'
                className='absolute w-20 -left-6 -bottom-6 select-none'
              />
              <Phone className='w-64' imgSrc='/testimonials/2.jpg' />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* value proposition section */}
      <section className="bg-slate-100 py-24 grainy-dark">
        <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-32">
          <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6">
            <h2 className="text-center order-1 mt-2 tracking-tight text-balance font-bold !leading-tight text-5xl md:text-6xl text-gray-900">
              What our
              <span className="relative px-3.5">customers <Icons.underline className="hidden sm:block pointer-events-none absolute inset-x-0 -bottom-8 text-green-600"/></span>
              say
            </h2>
            <img src="/images/main.png" alt="classyCase - BlackPanther" className="w-34" />
          </div>
         <div className='mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-y-16'>
            {/* first user review */}
            <div className='flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20'>
              <div className='flex gap-0.5 mb-2'>
                <Star className='h-5 w-5 text-green-600 fill-green-600' />
                <Star className='h-5 w-5 text-green-600 fill-green-600' />
                <Star className='h-5 w-5 text-green-600 fill-green-600' />
                <Star className='h-5 w-5 text-green-600 fill-green-600' />
                <Star className='h-5 w-5 text-green-600 fill-green-600' />
              </div>
              <div className='text-lg leading-8'>
                <p>
                  "The case feels durable and I even got a compliment on the
                  design. Had the case for two and a half months now and{' '}
                  <span className='p-0.5 bg-green-800 text-white'>
                    the image is super clear
                  </span>
                  , on the case I had before, the image started fading into
                  yellow-ish color after a couple weeks. Love it."
                </p>
              </div>
              <div className='flex gap-4 mt-2'>
                <img
                  className='rounded-full h-12 w-12 object-cover'
                  src='/users/user-1.png'
                  alt='user'
                />
                <div className='flex flex-col'>
                  <p className='font-semibold'>Jonathan</p>
                  <div className='flex gap-1.5 items-center text-zinc-600'>
                    <Check className='h-4 w-4 stroke-[3px] text-green-600' />
                    <p className='text-sm'>Verified Purchase</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* second user review */}
            <div className='flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20'>
              <div className='flex gap-0.5 mb-2'>
                <Star className='h-5 w-5 text-green-600 fill-green-600' />
                <Star className='h-5 w-5 text-green-600 fill-green-600' />
                <Star className='h-5 w-5 text-green-600 fill-green-600' />
                <Star className='h-5 w-5 text-green-600 fill-green-600' />
                <Star className='h-5 w-5 text-green-600 fill-green-600' />
              </div>
              <div className='text-lg leading-8'>
                <p>
                  "I usually keep my phone together with my keys in my pocket
                  and that led to some pretty heavy scratchmarks on all of my
                  last phone cases. This one, besides a barely noticeable
                  scratch on the corner,{' '}
                  <span className='p-0.5 bg-green-800 text-white'>
                    looks brand new after about half a year
                  </span>
                  . I dig it."
                </p>
              </div>
              <div className='flex gap-4 mt-2'>
                <img
                  className='rounded-full h-12 w-12 object-cover'
                  src='/users/user-4.jpg'
                  alt='user'
                />
                <div className='flex flex-col'>
                  <p className='font-semibold'>Josh</p>
                  <div className='flex gap-1.5 items-center text-zinc-600'>
                    <Check className='h-4 w-4 stroke-[3px] text-green-600' />
                    <p className='text-sm'>Verified Purchase</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
        
        <div className="pt-16">
          <CaseScroller/>
        </div>
      </section>

     </main>
  );
}
