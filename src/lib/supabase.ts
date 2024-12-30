import { NextRequest } from "next/server";
import { createClient } from "./supabase/server";

export const validateAuth = async (request: NextRequest) => {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return { error: "No authorization header" };
  }

  const supabase = await createClient();

  const token = authHeader.split(" ")[1];
  const { data: user, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { error: "Invalid or expired token" };
  }

  return { user };
};
