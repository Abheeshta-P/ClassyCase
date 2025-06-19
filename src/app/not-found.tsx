import Image from "next/image";
import Link from "next/link";

function NotFound() {
  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="relative mx-auto w-32 h-32 mb-2">
          <Image
            src={"/images/brand-logo.png"}
            alt="classy case logo"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="font-bold text-6xl sm:text-8xl">404</h1>
        <h3 className="font-semibold text-xl">Page Not Found</h3>
        <p>
          <Link href="/" className="text-lg font-semibold">
            <span className="text-green-600">classy</span>case
          </Link>{" "}
          on the wrong way.
        </p>
      </div>
    </div>
  );
}

export default NotFound;