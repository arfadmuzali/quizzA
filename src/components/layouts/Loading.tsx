import { LoadingSpinner } from "../ui/loadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center bg-orange-50">
      <div className="relative">
        {/* Blur effect circles */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-orange-300 blur-3xl opacity-30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-orange-400 blur-2xl opacity-20" />
        </div>

        {/* Content container */}
        <div className="relative flex flex-col items-center gap-4 p-8 rounded-lg backdrop-blur-sm">
          <LoadingSpinner className="h-16 w-16 text-orange-500" />
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold text-blue-900">Loading</h2>
            <p className="text-blue-600">
              Please wait while we prepare your content...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
