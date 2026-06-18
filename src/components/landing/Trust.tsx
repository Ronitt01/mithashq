'use client';

import { useTranslations } from "next-intl";
import { Shield, Users2, Cloud, Lock } from "lucide-react";
import { motion } from "framer-motion";

const trustCards = [
  { key: "security", icon: Shield, color: "bg-green-50 text-green-600" },
  { key: "access", icon: Users2, color: "bg-blue-50 text-blue-600" },
  { key: "backup", icon: Cloud, color: "bg-purple-50 text-purple-600" },
  { key: "isolation", icon: Lock, color: "bg-orange-50 text-orange-600" },
];

export function Trust({ locale }: { locale: string }) {
  const t = useTranslations("trust");

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4">
            {t("title")}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-gray-100 text-center"
              >
                <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-[#1A1A2E] mb-2">
                  {t(`${card.key}.title`)}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t(`${card.key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
