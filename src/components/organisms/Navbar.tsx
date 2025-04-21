import { Button, MaxWidthWrapper } from "@/components/";
function Navbar() {
  return (
    <nav className='sticky z-[100] inset-x-0 top-0 p-4 border-b-1 bg-white/75 backdrop-blur-lg transition-all w-full border-gray-200'>
      <MaxWidthWrapper>
        <div className="flex items-center justify-between">
           <div>
              <a href="#" className="text-lg font-semibold"><span className='text-green-600'>classy</span>case</a>
            </div>
            <div className="flex gap-8 items-center">
              <div className="flex gap-12 text-sm">
                <a href="#">Signup</a>
                <a href="#">Login</a>
              </div>
            <div className="flex items-center gap-3">
               <div className='h-8 w-[2px] bg-zinc-200 hidden sm:block' />
                <Button/>
              </div>
          </div>
        </div>
     </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar;