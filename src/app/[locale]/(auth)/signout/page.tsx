"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignOutPage() {
  const t = useTranslations("auth");
  const router = useRouter();

  const supabase = createClient();

  return (
    <div className="lg:px-28 md:px-24 p-4 max-w-screen-2xl flex justify-center items-center mx-auto h-[70vh]">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await supabase.auth.signOut();
          await supabase.auth.getSession();
          window.location.reload();
          router.push("/");
          toast.success("Sign out successfully");
        }}
        className=" rounded-lg p-5 md:px-10 border shadow-md flex flex-col justify-center items-center"
      >
        <div className="mb-8">
          <h2 className="text-center text-3xl font-semibold">{t("signout")}</h2>
          <p className="text-center">{t("signoutDescription")}</p>
        </div>
        <Button className="px-5">{t("signout")}</Button>
      </form>
    </div>
  );
}
