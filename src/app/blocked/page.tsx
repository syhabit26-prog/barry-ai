"use client";

import Link from "next/link";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n/LanguageContext";

export default function BlockedPage() {
  const { t } = useLang();

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md text-center">

        <div className="inline-flex w-20 h-20 rounded-full bg-red-100 items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-zinc-900 mb-3 tracking-tight">
          {t("blocked_title")}
        </h1>

        <p className="text-zinc-600 mb-8 leading-relaxed">
          {t("blocked_message")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-all"
          >
            <Mail className="w-4 h-4" />
            {t("blocked_contact")}
          </Link>

          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-zinc-200 hover:bg-white text-zinc-700 font-medium text-[14px] flex items-center justify-center gap-2 transition-all"
          >
            {t("nav_home")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}