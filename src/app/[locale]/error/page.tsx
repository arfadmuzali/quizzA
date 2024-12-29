"use client";

import { AlertCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Error({}: // error,
// reset,
{
  // error: Error & { digest?: string };
  // reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 space-y-6 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-400/20 rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-tr-full" />

          <div className="relative">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="bg-orange-100 rounded-full p-3">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            {/* Error Message */}
            <div className="mt-4 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Something went wrong!
              </h1>
              <p className="mt-2 text-gray-600">
                We apologize for the inconvenience. Please try again or return
                to the homepage.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              {/* <Button
                onClick={reset}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Try again
              </Button> */}
              <Link
                href={"/"}
                // onClick={() => (window.location.href = "/")}

                className={cn(buttonVariants({ variant: "secondary" }))}
              >
                Go home
              </Link>
            </div>

            {/* Error Details */}
            {/* {process.env.NODE_ENV === "development" && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 font-mono">
                  {error?.message}
                </p>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
