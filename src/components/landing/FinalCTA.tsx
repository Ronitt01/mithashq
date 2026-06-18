'use client';

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function FinalCTA({ locale }: { locale: string }) {
  const t = useTranslations("finalCta");

  return (
    <section className="py-20 bg-[#1A1A2E]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/register`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#E85D04] text-white font-semibold text-base hover:bg-[#D00000] transition-all shadow-lg shadow-[#E85D04]/25"
            >
              {t("cta")}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href={`/${locale}/login?demo=true`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 text-white font-semibold text-base hover:bg-white/20 transition-all border border-white/20"
            >
              <Sparkles className="w-5 h-5" />
              Try Demo Mode
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-6">{t("note")}</p>
        </motion.div>
      </div>
    </section>
  );
}
