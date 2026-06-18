'use client';

import { useTranslations } from "next-intl";
import {
  Package,
  Factory,
  Users,
  IndianRupee,
  FileText,
  TrendingUp,
  Bot,
  Store,
} from "lucide-react";
import { motion } from "framer-motion";

const featureList = [
  { key: "inventory", icon: Package, color: "bg-blue-50 text-blue-600" },
  { key: "production", icon: Factory, color: "bg-orange-50 text-orange-600" },
  { key: "ledger", icon: Users, color: "bg-green-50 text-green-600" },
  { key: "payments", icon: IndianRupee, color: "bg-purple-50 text-purple-600" },
  { key: "reports", icon: FileText, color: "bg-red-50 text-red-600" },
  { key: "forecasting", icon: TrendingUp, color: "bg-cyan-50 text-cyan-600" },
  { key: "ai", icon: Bot, color: "bg-amber-50 text-amber-600" },
  { key: "multishop", icon: Store, color: "bg-pink-50 text-pink-600" },
];

export function Features({ locale }: { locale: string }) {
  const t = useTranslations("features");

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600">{t("subtitle")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureList.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl bg-[#FFF8F0] border border-[#E85D04]/10 hover:border-[#E85D04]/30 hover:shadow-lg transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-[#1A1A2E] mb-2">
                  {t(`${f.key}.title`)}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t(`${f.key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
