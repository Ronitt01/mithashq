'use client';

import { useTranslations } from "next-intl";
import { AlertTriangle, Wallet, Factory, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

const painCards = [
  { key: "stockouts", icon: AlertTriangle, color: "bg-red-50 text-red-600" },
  { key: "payments", icon: Wallet, color: "bg-amber-50 text-amber-600" },
  { key: "production", icon: Factory, color: "bg-orange-50 text-orange-600" },
  { key: "intelligence", icon: BrainCircuit, color: "bg-blue-50 text-blue-600" },
];

export function Problem({ locale }: { locale: string }) {
  const t = useTranslations("problem");

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {painCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-[#1A1A2E] mb-2">
                  {t(`cards.${card.key}.title`)}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t(`cards.${card.key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
