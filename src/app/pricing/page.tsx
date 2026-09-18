"use client";

import { useState } from "react";
import {
  MessageSquare, Users, Building2, Plug, Crown,
  Check, Loader2, ArrowRight,
} from "lucide-react";
import {
  CHAT_PLANS, AGENTS_PLANS, BUILDING_PLANS,
  CONNECTORS_PLANS, ENTERPRISE_PLAN,
  type Plan, type Duration,
} from "@/lib/plans";
import { useLang } from "@/lib/i18n/LanguageContext";

const SERVICES = [
  { key: "chat", icon: MessageSquare, name: "Chat AI", plans: CHAT_PLANS, accent: "#f59e0b" },
  { key: "agents", icon: Users, name: "Agents IA", plans: AGENTS_PLANS, accent: "#3b82f6" },
  { key: "building", icon: Building2, name: "Building", plans: BUILDING_PLANS, accent: "#f97316" },
  { key: "connectors", icon: Plug, name: "Connecteurs", plans: CONNECTORS_PLANS, accent: "#ec4899" },
];

const DURATIONS: { id: Duration; label: string }[] = [
  { id: "monthly", label: "Mensuel" },
  { id: "6months", label: "6 mois" },
  { id: "yearly", label: "1 an" },
];

export default function PricingPage() {
  const { t } = useLang();
  const [duration, setDuration] = useState<Duration>("monthly");
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: Plan) => {
    setLoading(plan.id);
    try {
      const res = await fetch("/api/stripe/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      });
      const data = await res.json();
      if (data.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur : " + (data.error || "inconnue"));
      }
    } catch (err: any) {
      alert("Erreur réseau : " + err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">

      {/* HERO */}
      <section className="pt-16 pb-12 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 bg-white mb-6">
            <Crown className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-xs text-zinc-700 font-medium">Tarifs</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-4">
            Choisis ton plan
          </h1>
          <p className="text-lg text-zinc-500 max-w-xl mx-auto">
            4 services indépendants. Paie seulement ce que tu utilises.
          </p>
        </div>
      </section>

      {/* DURATION SELECTOR */}
      <section className="pb-12 px-6">
        <div className="max-w-md mx-auto flex gap-2 p-1 bg-zinc-100 rounded-2xl">
          {DURATIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDuration(d.id)}
              className={
                "flex-1 py-2.5 px-4 rounded-xl text-[13px] font-semibold transition-all " +
                (duration === d.id
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700")
              }
            >
              {d.label}
            </button>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      {SERVICES.map((service) => {
        const Icon = service.icon;
        const plans = service.plans.filter((p) => p.duration === duration);
        if (plans.length === 0) return null;

        return (
          <section key={service.key} className="pb-16 px-6">
            <div className="max-w-6xl mx-auto">

              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: service.accent + "20", color: service.accent }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                  {service.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => {
                  const isPopular = plan.tier === "advanced";
                  const isLoading = loading === plan.id;
                  const priceLabel = plan.duration === "monthly" ? "mois" : plan.duration === "6months" ? "6 mois" : "an";

                  return (
                    <div
                      key={plan.id}
                      className={
                        "relative p-6 rounded-2xl border-2 transition-all bg-white " +
                        (isPopular
                          ? "border-zinc-900 shadow-lg"
                          : "border-zinc-100 hover:border-zinc-300")
                      }
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-zinc-900 text-white text-[10px] font-bold tracking-wider">
                          POPULAIRE
                        </div>
                      )}

                      <div className="mb-4">
                        <p className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                          {plan.tier}
                        </p>
                        <h3 className="text-xl font-bold text-zinc-900 mt-1">
                          {plan.label.replace(/ \(.*\)/, "")}
                        </h3>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-zinc-900">
                            {plan.price}€
                          </span>
                          <span className="text-sm text-zinc-400">/{priceLabel}</span>
                        </div>
                      </div>

                      <ul className="space-y-2.5 mb-6 min-h-[120px]">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-[13px] text-zinc-600">
                            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleSubscribe(plan)}
                        disabled={isLoading}
                        className={
                          "w-full py-3 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 " +
                          (isPopular
                            ? "bg-zinc-900 text-white hover:bg-zinc-800"
                            : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50")
                        }
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Chargement...
                          </>
                        ) : (
                          <>
                            Choisir ce plan
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* ENTERPRISE */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white overflow-hidden">

            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-yellow-500 blur-[120px]" />
              <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-orange-500 blur-[120px]" />
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-400/40 bg-yellow-400/10 mb-4">
                  <Crown className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">
                    Enterprise
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
                  Pour les grandes entreprises
                </h2>

                <p className="text-zinc-300 mb-6 leading-relaxed">
                  Tout BARRY AI, illimité, avec support prioritaire et SLA garanti.
                </p>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-black text-yellow-400">10 000$</span>
                  <span className="text-zinc-400">/an</span>
                </div>

                <button
                  onClick={() => handleSubscribe(ENTERPRISE_PLAN)}
                  disabled={loading === ENTERPRISE_PLAN.id}
                  className="px-8 py-4 rounded-2xl bg-yellow-400 text-black font-bold text-[14px] hover:bg-yellow-300 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading === ENTERPRISE_PLAN.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    <>
                      Contacter le support
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-3">
                {ENTERPRISE_PLAN.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-[14px]">
                    <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-yellow-400" />
                    </div>
                    <span className="text-zinc-100">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}