import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n/config";

// Next.js 16 renamed the `middleware` file convention to `proxy`.
// next-intl handles locale detection, the `as-needed` prefix, and rewriting
// `/login` -> `/[locale]/login` internally. Auth pages live under `[locale]`,
// so they MUST pass through here — skipping them (the previous bug) made them 404.
export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

export const config = {
  // Run on everything except API routes, Next internals, and files with an extension.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
