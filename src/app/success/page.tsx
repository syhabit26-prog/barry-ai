"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fef9c3 100%)", padding: "24px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 500, textAlign: "center", background: "#fff", borderRadius: 24, padding: 48, boxShadow: "0 20px 60px rgba(251,146,60,0.2)" }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#18181b", margin: 0, marginBottom: 12 }}>Bienvenue dans Pro !</h1>
        <p style={{ color: "#52525b", fontSize: 16, marginBottom: 32 }}>
          Ton abonnement est activé. Tu as maintenant accès à toutes les fonctionnalités de BARRY AI.
        </p>
        <Link
          href="/builder"
          style={{ display: "inline-block", padding: "14px 32px", borderRadius: 14, background: "linear-gradient(90deg, #facc15, #f97316)", color: "#fff", fontWeight: 800, fontSize: 15, textDecoration: "none", boxShadow: "0 10px 30px rgba(251,146,60,0.4)" }}
        >
          Aller au Builder →
        </Link>
      </div>
    </div>
  );
}