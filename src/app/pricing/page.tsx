"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { PLANS, FEATURES, type Feature, type Plan } from "@/lib/plans";

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Feature>("chat");
  const [loading, setLoading] = useState<string | null>(null);

  const plansForTab = PLANS.filter((p) => p.feature === activeTab);

  const subscribe = async (plan: Plan) => {
    if (!user) {
      router.push("/signin");
      return;
    }

    if (!plan.priceId) {
      alert("Ce plan n'est pas encore configuré. Contactez l'administrateur.");
      return;
    }

    setLoading(plan.id);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: plan.priceId,
          planId: plan.id,
          feature: plan.feature,
          tier: plan.tier,
          userId: user.id,
          email: user.email,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur : " + (data.error || "inconnue"));
      }
    } catch (e: any) {
      alert("Erreur : " + e.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fef9c3 100%)", padding: "80px 24px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: "#18181b", margin: 0, marginBottom: 16 }}>
            Tarifs simples et clairs
          </h1>
          <p style={{ fontSize: 18, color: "#52525b", margin: 0 }}>
            Choisis la partie que tu veux booster
          </p>
        </div>

        {/* ═══ ONGLETS ═══ */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
          {(Object.keys(FEATURES) as Feature[]).map((f) => {
            const meta = FEATURES[f];
            const isActive = activeTab === f;
            return (
              <button
                key={f}
                onClick={() => setActiveTab(f)}
                style={{
                  padding: "14px 28px",
                  borderRadius: 16,
                  border: isActive ? "2px solid #f97316" : "2px solid transparent",
                  background: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                  color: isActive ? "#f97316" : "#52525b",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: isActive ? "0 10px 30px rgba(251,146,60,0.3)" : "none",
                  transition: "all 0.3s",
                }}
              >
                <span style={{ fontSize: 20 }}>{meta.icon}</span>
                {meta.label}
              </button>
            );
          })}
        </div>

        <p style={{ textAlign: "center", fontSize: 15, color: "#71717a", marginBottom: 32 }}>
          {FEATURES[activeTab].description}
        </p>

        {/* ═══ PLANS ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {plansForTab.map((plan) => (
            <div
              key={plan.id}
              style={{
                position: "relative",
                background: "#fff",
                borderRadius: 24,
                padding: 32,
                boxShadow: plan.highlight ? "0 20px 60px rgba(251,146,60,0.35)" : "0 10px 30px rgba(0,0,0,0.08)",
                border: plan.highlight ? "2px solid #fb923c" : "1px solid #f4f4f5",
              }}
            >
              {plan.highlight && (
                <div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg, #facc15, #f97316)", color: "#fff", fontSize: 11, fontWeight: 900, padding: "6px 16px", borderRadius: 100, boxShadow: "0 10px 20px rgba(251,146,60,0.4)" }}>
                  POPULAIRE
                </div>
              )}

              <h3 style={{ fontSize: 22, fontWeight: 900, color: "#18181b", margin: 0, marginBottom: 4 }}>{plan.name}</h3>
              <p style={{ fontSize: 13, color: "#f97316", fontWeight: 700, marginBottom: 16 }}>{plan.limitLabel}</p>

              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 44, fontWeight: 900, color: "#18181b" }}>{plan.price}€</span>
                <span style={{ color: "#71717a", fontSize: 15 }}>{plan.period}</span>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: 32 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "#3f3f46", marginBottom: 12 }}>
                    <span style={{ color: "#22c55e", fontWeight: 900, flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => subscribe(plan)}
                disabled={loading === plan.id}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 14,
                  fontWeight: 800,
                  fontSize: 15,
                  border: "none",
                  cursor: loading === plan.id ? "wait" : "pointer",
                  background: plan.highlight ? "linear-gradient(90deg, #facc15, #f97316)" : "#18181b",
                  color: "#fff",
                  opacity: loading === plan.id ? 0.5 : 1,
                  boxShadow: plan.highlight ? "0 10px 30px rgba(251,146,60,0.4)" : "none",
                }}
              >
                {loading === plan.id ? "..." : `Passer à ${plan.name.split(" ")[1]}`}
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", marginTop: 48, color: "#52525b", fontSize: 14 }}>
          <Link href="/" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>
            ← Retour à l'accueil
          </Link>
        </p>
      </div>
    </div>
  );
}