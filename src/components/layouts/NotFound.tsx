import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export default function NotFound({ className }: { className?: string }) {
  const t = useTranslations("NotFound");
  return (
    <div
      className={cn(
        "min-h-screen w-full flex items-center justify-center",
        className
      )}
    >
      <div className="max-w-md w-full p-6 text-center">
        <div className="w-full flex justify-center mb-8">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-orange-400/20 animate-pulse" />
            <AlertCircle className="h-24 w-24 text-orange-500" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-blue-900 mb-3">404</h1>
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">
          {t("title")}
        </h2>

        <p className="text-blue-600 mb-8">{t("description")}</p>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors duration-200"
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
