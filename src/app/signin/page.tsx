"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { signInUser } from "@/lib/auth-helpers";
import { useLang } from "@/lib/i18n/LanguageContext";

export default function SigninPage() {
  const router = useRouter();
  const { t } = useLang();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signInUser(form.email, form.password);

    if (!result.ok) {
      setError(result.error || t("common_error"));
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 items-center justify-center shadow-lg shadow-orange-500/30 mb-4">
            <span
              className="text-white font-black text-2xl leading-none"
              style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
            >
              B
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-1">
            {t("auth_signin_title")}
          </h1>
          <p className="text-sm text-zinc-500">{t("auth_signin_subtitle")}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 space-y-5"
        >

          <div>
            <label className="block text-[13px] font-medium text-zinc-700 mb-2">
              {t("auth_email")}
            </label>
            <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 focus-within:border-zinc-900 focus-within:bg-white transition-all">
              <Mail className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={t("auth_email_placeholder")}
                required
                className="flex-1 bg-transparent text-[14px] outline-none text-zinc-900 placeholder-zinc-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-zinc-700 mb-2">
              {t("auth_password")}
            </label>
            <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 focus-within:border-zinc-900 focus-within:bg-white transition-all">
              <Lock className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={t("auth_password_placeholder")}
                required
                className="flex-1 bg-transparent text-[14px] outline-none text-zinc-900 placeholder-zinc-400"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("auth_loading")}
              </>
            ) : (
              <>
                {t("auth_signin_button")}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        <p className="text-center text-[13px] text-zinc-500 mt-6">
          {t("auth_no_account")}{" "}
          <Link href="/signup" className="text-zinc-900 font-semibold hover:underline">
            {t("nav_signup")}
          </Link>
        </p>

      </div>
    </div>
  );
}