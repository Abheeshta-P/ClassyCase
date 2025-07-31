// components/Navbar.tsx (Original file, now simplified)
"use client"; // Keep this on the main Navbar as well, as it holds client-side state/logic

import { MaxWidthWrapper } from "@/components/";
import Link from "next/link";
import { Suspense } from "react"; // Import Suspense
import { Skeleton } from "@/components/ui/skeleton";
import NavbarContent  from "@/components/organisms/NavbarContent" // Import the new component

function Navbar() {
  return (
    <nav className="sticky z-[100] inset-x-0 top-0 p-4 border-b-1 bg-white/75 backdrop-blur-lg transition-all w-full border-gray-200">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold">
            <span className="text-green-600">classy</span>case
          </Link>
          {/* Wrap the content that uses useSearchParams in Suspense */}
          <Suspense
            fallback={
              // This is what will be rendered during server-side rendering
              // and while the client-side component hydrates.
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-28 hidden sm:flex" />
              </div>
            }
          >
            <NavbarContent />
          </Suspense>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default Navbar;
