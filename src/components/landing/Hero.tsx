'use client';

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Play, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Hero({ locale }: { locale: string }) {
  const t = useTranslations("hero");

  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#FFF8F0] via-[#FFF0E0] to-[#FFF8F0]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-[#FAA307]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-[#E85D04]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E85D04]/10 text-[#E85D04] text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {t("badge")}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1A1A2E] leading-tight mb-6">
              {t("headline")}
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
              {t("subheadline")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}/register`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#E85D04] text-white font-semibold text-base hover:bg-[#D00000] transition-all shadow-lg shadow-[#E85D04]/25 hover:shadow-xl hover:shadow-[#E85D04]/30 hover:-translate-y-0.5"
              >
                {t("ctaPrimary")}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href={`/${locale}/login?demo=true`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border-2 border-[#E85D04] text-[#E85D04] font-semibold text-base hover:bg-[#E85D04] hover:text-white transition-all"
              >
                <Sparkles className="w-5 h-5" />
                {t("ctaDemo")}
              </Link>
            </div>
          </motion.div>

          {/* Right: Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Mock header */}
              <div className="bg-[#1A1A2E] px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-4 text-gray-400 text-sm">mithashq.com/dashboard</span>
              </div>
              {/* Mock content */}
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Revenue</div>
                  <div className="text-2xl font-bold text-[#1A1A2E]">₹1,24,500</div>
                  <div className="text-sm text-green-600 mt-1">+12% vs last week</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Outstanding</div>
                  <div className="text-2xl font-bold text-[#D00000]">₹45,200</div>
                  <div className="text-sm text-gray-500 mt-1">8 customers</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Inventory</div>
                  <div className="text-2xl font-bold text-[#1A1A2E]">127 items</div>
                  <div className="text-sm text-amber-600 mt-1">3 low stock</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Production</div>
                  <div className="text-2xl font-bold text-[#1A1A2E]">85%</div>
                  <div className="text-sm text-green-600 mt-1">Efficiency</div>
                </div>
                {/* Chart area */}
                <div className="col-span-2 bg-gray-50 rounded-xl p-4 h-32 flex items-end gap-2">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md bg-[#E85D04]/80"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-gray-100 p-3 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1A1A2E]">Payment Received</div>
                  <div className="text-xs text-gray-500">₹15,000 from Hotel Raj</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
