"use client";

import { useQuery } from "@tanstack/react-query";
import { getPaymentStatus } from "./action";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import PhonePreview from "@/components/atoms/PhonePreview";
import { formatPrice } from "@/lib/utils";
import { Loading } from "../Loading";

const ThankYou = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const router = useRouter(); // Initialize useRouter

  const { data, isLoading, isError, error } = useQuery({
    // Add isError and error
    queryKey: ["get-payment-status"],
    queryFn: async () => await getPaymentStatus({ orderId }),
    retry: true,
    retryDelay: 500,
  });

  // 1. Handle initial loading state
  if (isLoading || data === undefined) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Loading your order...</h3>
          <p>This won't take long.</p>
        </div>
      </div>
    );
  }

  // 2. Handle specific error types from the server action
  if (data && "success" in data && !data.success) {
    if (data.error === "NOT_LOGGED_IN") {
      // Redirect to login page/home
      router.push("/api/auth/login");
      return <Loading message="Need to login, redirecting!" />;
    }

    if (data.error === "ORDER_NOT_FOUND") {
      // Show an error message to the user
      return (
        <div className="w-full mt-24 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <h3 className="font-semibold text-xl text-red-500">
              Order not found.
            </h3>
            <p>
              The order you are looking for does not exist or you don't have
              permission to view it.
            </p>
          </div>
        </div>
      );
    }
    // Fallback for any other unhandled server-side errors
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <h3 className="font-semibold text-xl text-red-500">
            An unexpected error occurred.
          </h3>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  // 3. Handle the case where the order is found but not paid yet
  if (data && "success" in data && data.success && data.data === false) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Verifying your payment...</h3>
          <p>This might take a moment.</p>
        </div>
      </div>
    );
  }

  // 4. Handle general query errors (e.g., network issues, unhandled server errors that throw)
  if (isError) {
    console.error("Query error:", error);
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <h3 className="font-semibold text-xl text-red-500">
            Error loading order.
          </h3>
          <p>
            There was a problem fetching your order details. Please refresh the
            page or try again later.
          </p>
        </div>
      </div>
    );
  }

  // 'data' is { success: true, data: FullOrder }
  const { configuration, billingAddress, shippingAddress, amount } = data.data;
  const { color } = configuration;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <p className="text-base font-medium text-primary">Thank you!</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Your case is on the way!
          </h1>
          <p className="mt-2 text-base text-zinc-500">
            We've received your order and are now processing it.
          </p>

          <div className="mt-12 text-sm font-medium">
            <p className="text-zinc-900">Order number</p>
            <p className="mt-2 text-zinc-500">{orderId}</p>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200">
          <div className="mt-10 flex flex-auto flex-col">
            <h4 className="font-semibold text-zinc-900">
              You made a great choice!
            </h4>
            <p className="mt-2 text-sm text-zinc-600">
              We at ClassyCase believe that a phone case doesn't only need to
              look good, but also last you for the years to come. We offer a
              5-year print guarantee: If you case isn't of the highest quality,
              we'll replace it for free.
            </p>
          </div>
        </div>

        <div className="flex space-x-6 overflow-hidden mt-4 rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
          {configuration.croppedImageURL && color && (
            <PhonePreview
              croppedImageUrl={configuration.croppedImageURL}
              color={color}
            />
          )}
        </div>

        <div>
          <div className="grid grid-cols-2 gap-x-6 py-10 text-sm">
            <div>
              <p className="font-medium text-gray-900">Shipping address</p>
              <div className="mt-2 text-zinc-700">
                <address className="not-italic">
                  <span className="block">{shippingAddress?.name}</span>
                  <span className="block">{shippingAddress?.street}</span>
                  <span className="block">
                    {shippingAddress?.postalCode} {shippingAddress?.city}
                  </span>
                </address>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900">Billing address</p>
              <div className="mt-2 text-zinc-700">
                <address className="not-italic">
                  <span className="block">{billingAddress?.name}</span>
                  <span className="block">{billingAddress?.street}</span>
                  <span className="block">
                    {billingAddress?.postalCode} {billingAddress?.city}
                  </span>
                </address>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 border-t border-zinc-200 py-10 text-sm">
            <div>
              <p className="font-medium text-zinc-900">Payment status</p>
              <p className="mt-2 text-zinc-700">Paid</p>
            </div>

            <div>
              <p className="font-medium text-zinc-900">Shipping Method</p>
              <p className="mt-2 text-zinc-700">
                DHL, takes up to 3 working days
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 border-t border-zinc-200 pt-10 text-sm">
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Subtotal</p>
            <p className="text-zinc-700">{formatPrice(amount)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Shipping</p>
            <p className="text-zinc-700">{formatPrice(0)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Total</p>
            <p className="text-green-700 font-semibold">
              {formatPrice(amount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
