"use client";

import { MaxWidthWrapper } from "@/components/";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { ADMIN_EMAIL } from "@/app/config/config";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function Navbar() {
  const [user, setUser] = useState<KindeUser<Record<string, any>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/get-user");
        if (response.ok) {
          const userData: KindeUser<Record<string, any>> =
            await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleAuthClick = (endPoint: string) => {
    const fullPath = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    if (typeof window !== "undefined") {
      localStorage.setItem("postLoginRedirectPath", fullPath);
    }
    router.push(endPoint);
  };

  // Confirmation dialog
  const handleOpenSignOutConfirm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowSignOutConfirm(true);
  };

  const handleConfirmSignOut = () => {
    localStorage.setItem("postLogoutRedirectHome", "true");
    router.replace("/api/auth/logout");
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <nav className="sticky z-[100] inset-x-0 top-0 p-4 border-b-1 bg-white/75 backdrop-blur-lg transition-all w-full border-gray-200">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold">
            <span className="text-green-600">classy</span>case
          </Link>
          <div className="h-full flex items-center space-x-4">
            {loading ? (
              // Skeleton loading state
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-28" />
              </div>
            ) : user ? (
              // User is logged in
              <>
                {/* Use AlertDialogTrigger here to open the dialog */}
                <AlertDialog
                  open={showSignOutConfirm}
                  onOpenChange={setShowSignOutConfirm}
                >
                  <AlertDialogTrigger asChild>
                    <Link
                      href="/api/auth/logout"
                      onClick={handleOpenSignOutConfirm}
                      className={buttonVariants({
                        size: "sm",
                        variant: "ghost",
                      })}
                    >
                      Sign out
                    </Link>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl font-bold text-gray-950">
                        Confirm Sign Out
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-700 mt-2">
                        Are you sure you want to sign out? All unsaved data will
                        be lost, and you will be redirected to the home page.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex justify-end gap-3 mt-4">
                      <AlertDialogCancel
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "px-4 py-2 rounded-md cursor-pointer"
                        )}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleConfirmSignOut}
                        className={cn(
                          buttonVariants({ variant: "destructive" }),
                          "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md cursor-pointer"
                        )}
                      >
                        Sign Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {isAdmin && (
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    Dashboard ✨
                  </Link>
                )}

                <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

                <Link
                  href="/configure/upload"
                  className={cn(
                    buttonVariants({
                      size: "sm",
                      className: "hidden sm:flex items-center gap-1",
                    }),
                    "hidden sm:flex items-center gap-1"
                  )}
                >
                  Create case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            ) : (
              // User is not logged in
              <>
                <button
                  onClick={() => handleAuthClick("/api/auth/register")}
                  className={cn(
                    "cursor-pointer",
                    buttonVariants({ size: "sm", variant: "ghost" })
                  )}
                >
                  Sign up
                </button>

                <button
                  onClick={() => handleAuthClick("/api/auth/login")}
                  className={cn(
                    "cursor-pointer",
                    buttonVariants({ size: "sm", variant: "ghost" })
                  )}
                >
                  Login
                </button>

                <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

                <Link
                  href="/configure/upload"
                  className={cn(
                    buttonVariants({
                      size: "sm",
                      className: "hidden sm:flex items-center gap-1",
                    }),
                    "hidden sm:flex items-center gap-1"
                  )}
                >
                  Create case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default Navbar;
