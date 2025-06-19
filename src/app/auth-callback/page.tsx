"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import { getAuthStatus } from "./action"; // Server action
import { toast } from "sonner";

function Page() {
  const [status, setStatus] = useState<"loading" | "success" | "fail">(
    "loading"
  );
  const router = useRouter();

  useEffect(() => {
    const storedConfigId = localStorage.getItem("configurationId");
    const storedRedirectPath = localStorage.getItem("postLoginRedirectPath");

    const authenticateAndRedirect = async () => {
      try {
        const result = await getAuthStatus();
        if (result.success) {
          setStatus("success");
          if (storedRedirectPath) {
            toast.success("Login successful");
            localStorage.removeItem("postLoginRedirectPath");
            router.push(storedRedirectPath);
          } else if (storedConfigId) {
            toast.success("Login successful");
            localStorage.removeItem("configurationId");
            router.push(`/configure/preview?id=${storedConfigId}`);
          } else {
            router.push("/");
          }
        } else {
          setStatus("fail");
          toast.error(
            "Login failed. Please try again or check your credentials."
          );
          router.replace("/api/auth/login");
        }
      } catch (err) {
        console.error("Auth error:", err);
        setStatus("fail");
        toast.error(
          "An unexpected error occurred during login. Please try again."
        );
        router.replace("/api/auth/login");
      }
    };
    authenticateAndRedirect();
  }, [router]);

  if (status === "loading") {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Logging you in...</h3>
          <p>You will be redirected automatically.</p>
        </div>
      </div>
    );
  }

  if (status === "fail") {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2 text-red-600">
          <AlertTriangle className="h-8 w-8" />
          <h3 className="font-semibold text-xl">Login failed</h3>
          <p>Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return null;
}

export default Page;
