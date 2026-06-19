import { locales, defaultLocale, type Locale } from "@/i18n/config";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` resolves to the `[locale]` segment matched by middleware.
  // It can be undefined/invalid (catch-all routes), so fall back to the default.
  const requested = await requestLocale;
  const locale = locales.includes(requested as Locale)
    ? (requested as Locale)
    : defaultLocale;

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return { locale, messages };
});
