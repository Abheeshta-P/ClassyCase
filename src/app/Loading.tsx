import { Loader2 } from "lucide-react";
import Image from "next/image";

export function Loading() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="relative w-28 h-28 sm:w-40 sm:h-40 md:w-52 md:h-52">
        <Image
          src="/images/brand-logo.png"
          alt="Classy Case Logo"
          fill
          className="object-contain animate-pulse"
          priority
        />
      </div>

      <div className="mt-6 flex flex-col items-center gap-2 text-zinc-600">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-sm sm:text-base tracking-wide">
          Loading your experience...
        </p>
      </div>
    </div>
  );
}