import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Mail, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function EmailVerification() {
  const t = await getTranslations("auth");
  return (
    <div className="h-[70vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Icon */}
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Mail className="h-6 w-6 text-orange-600" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900">
              {t("verificationTitle")}
            </h1>

            {/* Message */}
            <p className="text-gray-500 max-w-sm">
              {t("verificationDescription")}
            </p>

            {/* Divider */}
            <div className="w-full border-t border-gray-200" />

            {/* Sign in Button */}
            <Link
              className={cn(buttonVariants({ variant: "secondary" }))}
              href={"/login"}
            >
              {t("signin")}

              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
