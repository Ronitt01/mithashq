'use client';

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const steps = ["1", "2", "3"];

export function HowItWorks({ locale }: { locale: string }) {
  const t = useTranslations("howItWorks");

  return (
    <section className="py-20 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600">{t("subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[#E85D04] flex items-center justify-center text-white font-bold text-xl mb-6">
                  {step}
                </div>
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">
                  {t(`steps.${step}.title`)}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t(`steps.${step}.description`)}
                </p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#E85D04]/30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
