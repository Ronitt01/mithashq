import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Showcase } from "@/components/landing/Showcase";
import { Trust } from "@/components/landing/Trust";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-[100dvh]">
      <Navbar locale={locale} />
      <Hero locale={locale} />
      <Problem locale={locale} />
      <HowItWorks locale={locale} />
      <Features locale={locale} />
      <Showcase locale={locale} />
      <Trust locale={locale} />
      <Pricing locale={locale} />
      <FAQ locale={locale} />
      <FinalCTA locale={locale} />
      <Footer locale={locale} />
    </div>
  );
}
