'use client';

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Mail, Linkedin } from "lucide-react";

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations("footer");

  return (
    <footer className="bg-[#1A1A2E] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#E85D04] flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-lg text-white">MithasHQ</span>
            </div>
            <p className="text-gray-400 text-sm">{t("tagline")}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-3">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}#features`} className="text-gray-400 text-sm hover:text-white transition-colors">
                  {t("links.features")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#pricing`} className="text-gray-400 text-sm hover:text-white transition-colors">
                  {t("links.pricing")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/login?demo=true`} className="text-gray-400 text-sm hover:text-white transition-colors">
                  {t("links.demo")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">{t("links.contact")}</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${t("contact.email")}`} className="hover:text-white transition-colors">
                  {t("contact.email")}
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Linkedin className="w-4 h-4" />
                <a href={`https://${t("contact.linkedin")}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 text-sm">{t("legal.privacy")}</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">{t("legal.terms")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
