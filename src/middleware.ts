import createMiddleware from "next-intl/middleware";
import { NextResponse, NextRequest } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

export default async function middleware(request: NextRequest) {
  const pathname = new URL(request.url).pathname;

  // Skip API routes and auth routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password")
  ) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
