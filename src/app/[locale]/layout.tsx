import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ReactNode } from "react";
import BaseLayout from "@/components/layouts/BaseLayout";
import { Locale, routing } from "@/i18n/routing";
import NavBar from "@/components/layouts/NavBar";
import Footer from "@/components/layouts/Footer";
import { Toaster } from "@/components/ui/sonner";
import QueryLayout from "@/components/layouts/QueryLayout";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <BaseLayout locale={locale}>
      <QueryLayout>
        <NavBar locale={locale as Locale} />
        {children}
        <Footer />
      </QueryLayout>

      <Toaster richColors />
    </BaseLayout>
  );
}
