'use client';

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export function Navbar({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: `/${locale}#features`, label: t("features") },
    { href: `/${locale}#pricing`, label: t("pricing") },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E85D04] flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-lg text-[#1A1A2E]">MithasHQ</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-[#E85D04] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
            <Link
              href={`/${locale}/login`}
              className="text-sm font-medium text-gray-600 hover:text-[#E85D04] transition-colors"
            >
              {t("login")}
            </Link>
            <Link
              href={`/${locale}/register`}
              className="px-4 py-2 rounded-lg bg-[#E85D04] text-white text-sm font-semibold hover:bg-[#D00000] transition-colors"
            >
              {t("register")}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-gray-600 hover:text-[#E85D04]"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100">
            <Link
              href={`/${locale}/login`}
              className="block text-sm font-medium text-gray-600 py-2"
            >
              {t("login")}
            </Link>
            <Link
              href={`/${locale}/register`}
              className="block px-4 py-2 rounded-lg bg-[#E85D04] text-white text-sm font-semibold text-center mt-2"
            >
              {t("register")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
