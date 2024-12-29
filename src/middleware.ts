import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

// Buat middleware next-intl
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Jalankan middleware Supabase terlebih dahulu
  const supabaseResponse = await updateSession(request);

  // Jalankan middleware Next-intl
  const intlResponse = intlMiddleware(request);

  // Salin cookie dari Supabase ke dalam respons Next-intl
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  // Kembalikan respons Next-intl yang telah diperbarui
  return intlResponse;
}

export const config = {
  matcher: [
    "/", // Root path
    "/(ar|en)/:path*", // Locale-specific paths
    "/((?!_next|_vercel|.*\\..*).*)", // Umum
  ],
};
