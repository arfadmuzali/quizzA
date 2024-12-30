import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { Github } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

export default function Hero() {
  const t = useTranslations("Home");
  const locale = useLocale();

  return (
    <div
      className={cn(
        "lg:px-28 md:px-14 p-4 max-w-screen-2xl h-[80vh] mx-auto flex flex-col justify-between gap-4 items-center",
        locale === "ar" ? "md:flex-row-reverse" : "md:flex-row"
      )}
    >
      <div
        className={cn(
          "w-full flex flex-col justify-center items-center  gap-4",
          locale === "ar"
            ? "md:justify-end md:items-end "
            : "md:justify-start md:items-start "
        )}
      >
        <Link
          href="#"
          className={cn(
            buttonVariants({
              variant: "outline-secondary",
              size: "sm",
              font: "sm",
            }),
            "font-semibold"
          )}
        >
          <Github /> <span>{t("source")}</span>
        </Link>
        <h1
          className={cn(
            locale === "ar"
              ? "lg:text-[5rem] tracking-wider md:text-end"
              : "lg:text-[4rem] md:text-start",
            " md:text-5xl text-4xl text-center font-bold"
          )}
        >
          {t("title")}
        </h1>
        <p
          className={cn(
            "md:text-lg text-base text-center",
            locale === "ar" ? " tracking-wider md:text-end" : " md:text-start"
          )}
        >
          {t("description")}
        </p>
        <Link
          href={"#quizzes"}
          className={cn(
            buttonVariants({ variant: "default" }),
            "mt-5",
            locale == "ar" && "text-lg"
          )}
        >
          {t("heroCta")}
        </Link>
      </div>

      <div className="relative md:h-[70%] md:w-[70%] w-full h-full">
        <Image
          src={"/image/hero-image.png"}
          alt="hero-image"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
