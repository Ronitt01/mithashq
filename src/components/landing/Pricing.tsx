'use client';

import { useTranslations } from "next-intl";
import { Check, Zap } from "lucide-react";
import { motion } from "framer-motion";

const plans = ["free", "growth", "enterprise"] as const;

export function Pricing({ locale }: { locale: string }) {
  const t = useTranslations("pricing");

  return (
    <section id="pricing" className="py-20 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600">{t("subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => {
            const features = t(`plans.${plan}.features` as any) as unknown as string[];
            const isPopular = plan === "growth";
            return (
              <motion.div
                key={plan}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative rounded-2xl p-8 ${
                  isPopular
                    ? "bg-[#1A1A2E] text-white border-2 border-[#FAA307]"
                    : "bg-white border border-gray-100"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAA307] text-[#1A1A2E] text-xs font-bold">
                      <Zap className="w-3 h-3" />
                      {t("plans.growth.badge")}
                    </div>
                  </div>
                )}
                <h3 className={`text-lg font-semibold mb-2 ${isPopular ? "text-white" : "text-[#1A1A2E]"}`}>
                  {t(`plans.${plan}.name` as any)}
                </h3>
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${isPopular ? "text-white" : "text-[#1A1A2E]"}`}>
                    {t(`plans.${plan}.price` as any)}
                  </span>
                  {t(`plans.${plan}.period` as any) && (
                    <span className={`text-sm ml-1 ${isPopular ? "text-gray-300" : "text-gray-500"}`}>
                      / {t(`plans.${plan}.period` as any)}
                    </span>
                  )}
                </div>
                <p className={`text-sm mb-6 ${isPopular ? "text-gray-300" : "text-gray-600"}`}>
                  {t(`plans.${plan}.description` as any)}
                </p>
                <ul className="space-y-3 mb-8">
                  {Array.isArray(features) && features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isPopular ? "text-[#FAA307]" : "text-[#E85D04]"}`} />
                      <span className={`text-sm ${isPopular ? "text-gray-300" : "text-gray-600"}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`/${locale}/register`}
                  className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    isPopular
                      ? "bg-[#E85D04] text-white hover:bg-[#D00000]"
                      : "bg-gray-100 text-[#1A1A2E] hover:bg-gray-200"
                  }`}
                >
                  {t(`plans.${plan}.cta` as any)}
                </a>
              </motion.div>
            );
          })}
        </div>
        <p className="text-center text-sm text-gray-500 mt-8">{t("note")}</p>
      </div>
    </section>
  );
}
