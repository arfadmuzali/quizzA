"use client";

import { Locale, usePathname } from "@/i18n/routing";
import Logo from "../ui/Logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { LanguagesIcon } from "lucide-react";
import { Select, SelectGroup, SelectItem, SelectTrigger } from "../ui/select";
import { SelectContent } from "@radix-ui/react-select";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import useIsScroll from "@/hooks/useIsScroll";
import AuthMenu from "./AuthMenu";

export default function NavBar({ locale = "en" }: { locale?: Locale }) {
  const router = useRouter();

  const isScroll = useIsScroll();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const t = useTranslations("NavBar");

  function onSelectChange(value: string) {
    const nextLocale = value as Locale;

    startTransition(() => {
      const segments = pathname.split("/").filter(Boolean);
      segments[0] = nextLocale;

      const newPathname = `/${segments.join("/")}`;

      router.replace(newPathname + pathname);
    });
  }

  return (
    <nav
      className={cn(
        "w-full transition-all duration-300 bg-white sticky top-0 z-50",
        isScroll ? "border-b shadow-sm" : "border-b-transparent"
      )}
    >
      <div
        className={cn(
          "max-w-screen-2xl mx-auto lg:px-28 md:px-14 p-4  flex items-center justify-between",
          locale === "ar" && "flex-row-reverse"
        )}
      >
        <Link href={"/"}>
          <Logo />
        </Link>
        <div
          className={cn(
            "flex justify-end items-center gap-4",
            locale === "ar" && "flex-row-reverse"
          )}
        >
          <div>
            <Select onValueChange={onSelectChange} value={locale}>
              <SelectTrigger
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "p-0 border-0 w-fit"
                )}
              >
                <p className="px-1">
                  <LanguagesIcon className=" !w-full !h-full px-2" />
                </p>
              </SelectTrigger>
              <SelectContent
                asChild
                side="top"
                className="border rounded-md min-w-[100px] bg-white mt-2"
              >
                <SelectGroup>
                  <SelectItem disabled={isPending} className="" value="en">
                    English
                  </SelectItem>
                  <SelectItem disabled={isPending} className="" value="ar">
                    العربية
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* <Link
            href={"/bb"}
            className={cn(buttonVariants({ variant: "outline-primary" }))}
          >
            {t("login")}
          </Link> */}
          <AuthMenu />
        </div>
      </div>
    </nav>
  );
}
