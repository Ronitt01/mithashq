import { locales, defaultLocale } from "@/i18n/config";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();
  const messages = (await import(`../messages/${locale}.json`)).default;
  return { messages, locale: locale as string };
});
