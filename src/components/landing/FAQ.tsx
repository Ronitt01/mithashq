'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqKeys = ["data", "mobile", "multishop", "ai", "cancel", "trial"];

export function FAQ({ locale }: { locale: string }) {
  const t = useTranslations("faq");
  const [open, setOpen] = useState<string | null>("data");

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4">
            {t("title")}
          </h2>
        </div>
        <div className="space-y-4">
          {faqKeys.map((key) => {
            const isOpen = open === key;
            return (
              <div
                key={key}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : key)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-[#1A1A2E]">
                    {t(`items.${key}.question` as any)}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">
                      {t(`items.${key}.answer` as any)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
