"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LayoutDashboard, LogOut, Menu } from "lucide-react";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";

export default function AuthMenu() {
  const t = useTranslations("auth");

  const [authState, setAuthState] = useState<User | null>(null);

  const supabase = createClient();
  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      setAuthState(data.user);
    }
    getUser();
  }, []);

  if (!authState) {
    return (
      <Link
        href={"/login"}
        className={cn(buttonVariants({ variant: "default" }))}
      >
        {t("signin")}
      </Link>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded bg-white border shadow ">
        <DropdownMenuLabel className=" line-clamp-1 ">
          {authState?.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={"/dashboard"}>
              <LayoutDashboard />
              <span>{t("dashboard")}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={"/signout"}>
              <LogOut />
              <span>{t("logout")}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
