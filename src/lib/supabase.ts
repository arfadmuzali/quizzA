import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const validateAuth = async (request: NextRequest) => {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return { error: "No authorization header" };
  }

  const token = authHeader.split(" ")[1];
  const { data: user, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { error: "Invalid or expired token" };
  }

  return { user };
};
