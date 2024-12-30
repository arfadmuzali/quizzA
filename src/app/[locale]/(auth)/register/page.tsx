"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";

export default function LoginPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    email: z.string().email({
      message: t("errorEmail"),
    }),
    password: z.string().min(6, {
      message: t("errorPassword"),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/register", {
        email: values.email,
        password: values.password,
      });
      router.push("/login");

      toast.success("Register success");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error?.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="lg:px-28 md:px-24 p-4 max-w-screen-2xl flex justify-center items-center mx-auto h-[70vh]">
      <div className=" rounded-lg p-5 md:px-10 border shadow-md min-w-full md:min-w-[40%]">
        <div className="mb-8">
          <h2 className="text-center text-3xl font-semibold">{t("signup")}</h2>
          <p className="text-center">{t("signupDescription")}</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(locale == "ar" && "text-end")}>
                    {t("email")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="m@example.com"
                      {...field}
                      type="email"
                      className={cn(locale == "ar" && "text-end")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(locale == "ar" && "text-end")}>
                    {t("password")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={cn(locale == "ar" && "text-end")}
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading ? <LoadingSpinner /> : t("signin")}
            </Button>
            <div className="text-center text-sm text-opacity-75">
              <span>{t("signupBottomText")}</span>
              <Link
                href="/login"
                className="text-orange-500 hover:underline mx-2"
              >
                {t("signin")}{" "}
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
