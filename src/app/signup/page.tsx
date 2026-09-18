"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Phone, Globe, Loader2, ArrowRight, Check } from "lucide-react";
import { signUpUser, COUNTRY_CODES } from "@/lib/auth-helpers";
import { useLang } from "@/lib/i18n/LanguageContext";
import { LANGUAGES, type Lang } from "@/lib/i18n/translations";

export default function SignupPage() {
  const router = useRouter();
  const { t, setLang } = useLang();

  const [form, setForm] = useState({
    email: "",
    password: "",
    countryCode: "SN",
    phone: "",
    language: "fr" as Lang,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === form.countryCode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validations
    if (!form.email.includes("@")) {
      setError(t("auth_error_email"));
      return;
    }
    if (form.password.length < 8) {
      setError(t("auth_error_password"));
      return;
    }
    if (form.phone.length < 6) {
      setError(t("auth_error_phone"));
      return;
    }

    setLoading(true);

    // Construit le numéro complet
    const fullPhone = `${selectedCountry?.dial}${form.phone}`;

    const result = await signUpUser(
      form.email,
      form.password,
      fullPhone,
      form.language
    );

    if (!result.ok) {
      setError(result.error || t("common_error"));
      setLoading(false);
      return;
    }

    // Applique la langue choisie
    setLang(form.language);

    setSuccess(true);
    setLoading(false);

    // Redirige après 1.5 sec
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">
            {t("auth_success")}
          </h1>
          <p className="text-zinc-500">{t("auth_loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-md">

        {/* HEADER */}
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
            {t("auth_signup_title")}
          </h1>
          <p className="text-sm text-zinc-500">{t("auth_signup_subtitle")}</p>
        </div>

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 space-y-5">

          {/* EMAIL */}
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

          {/* PASSWORD */}
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
                minLength={8}
                className="flex-1 bg-transparent text-[14px] outline-none text-zinc-900 placeholder-zinc-400"
              />
            </div>
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-[13px] font-medium text-zinc-700 mb-2">
              {t("auth_phone")}
            </label>
            <div className="flex gap-2">
              {/* Country code */}
              <select
                value={form.countryCode}
                onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
                className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-zinc-900 focus:bg-white transition-all cursor-pointer"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.dial}
                  </option>
                ))}
              </select>

              {/* Phone number */}
              <div className="flex-1 flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 focus-within:border-zinc-900 focus-within:bg-white transition-all">
                <Phone className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })
                  }
                  placeholder="77 000 00 00"
                  required
                  className="flex-1 bg-transparent text-[14px] outline-none text-zinc-900 placeholder-zinc-400"
                />
              </div>
            </div>
          </div>

          {/* LANGUAGE */}
          <div>
            <label className="block text-[13px] font-medium text-zinc-700 mb-2">
              {t("auth_language")}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setForm({ ...form, language: l.code })}
                  className={
                    "flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 transition-all " +
                    (form.language === l.code
                      ? "border-zinc-900 bg-zinc-50"
                      : "border-zinc-100 hover:border-zinc-300")
                  }
                >
                  <span className="text-xl">{l.flag}</span>
                  <span className="text-[10px] font-medium text-zinc-600">
                    {l.code.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-zinc-400 mt-2">{t("auth_language_help")}</p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-700">
              {error}
            </div>
          )}

          {/* SUBMIT */}
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
                {t("auth_signup_button")}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-[13px] text-zinc-500 mt-6">
          {t("auth_have_account")}{" "}
          <Link href="/signin" className="text-zinc-900 font-semibold hover:underline">
            {t("nav_signin")}
          </Link>
        </p>

      </div>
    </div>
  );
}