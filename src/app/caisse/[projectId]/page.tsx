"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function CaissePage() {
  const params = useParams();
  const projectId = params?.projectId as string;

  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [stripe, setStripe] = useState("");
  const [paypal, setPaypal] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const login = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/caisse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", projectId, code }),
      });
      const data = await res.json();
      if (data.ok) {
        setUnlocked(true);
        setStripe(data.stripe || "");
        setPaypal(data.paypal || "");
      } else {
        setMessage({ type: "error", text: data.error || "Code invalide" });
      }
    } catch (e: any) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/caisse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", projectId, code, stripe, paypal }),
      });
      const data = await res.json();
      if (data.ok) {
        setMessage({ type: "success", text: "✅ Clés enregistrées ! Votre site utilise maintenant vos comptes." });
      } else {
        setMessage({ type: "error", text: data.error || "Erreur" });
      }
    } catch (e: any) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)", padding: "60px 20px", fontFamily: "system-ui, sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔐</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1px", marginBottom: 12 }}>Votre Caisse Privée</h1>
          <p style={{ opacity: 0.7, fontSize: 15 }}>
            {unlocked 
              ? "Connectez vos comptes Stripe et PayPal pour recevoir vos paiements" 
              : "Entrez le code d'accès reçu lors de la création du site"}
          </p>
        </div>

        {!unlocked && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32 }}>
            <label style={{ display: "block", fontSize: 13, opacity: 0.7, marginBottom: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>
              Code d'accès
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="XXXX-XXXX"
              style={{
                width: "100%",
                padding: "16px 20px",
                fontSize: 20,
                fontFamily: "monospace",
                fontWeight: 800,
                letterSpacing: 4,
                textAlign: "center",
                background: "#0a0a0a",
                border: "2px solid #333",
                borderRadius: 12,
                color: "#fff",
                outline: "none",
                marginBottom: 20,
              }}
            />
            <button
              onClick={login}
              disabled={loading || !code.trim()}
              style={{
                width: "100%",
                padding: 16,
                fontSize: 15,
                fontWeight: 800,
                background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                cursor: loading ? "wait" : "pointer",
                opacity: loading || !code.trim() ? 0.5 : 1,
              }}
            >
              {loading ? "..." : "🔓 Déverrouiller"}
            </button>
          </div>
        )}

        {unlocked && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* STRIPE */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(99,91,255,0.3)", borderRadius: 20, padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#635bff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 20 }}>
                  S
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>Stripe</div>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>Lien de paiement Stripe</div>
                </div>
              </div>
              <input
                type="text"
                value={stripe}
                onChange={(e) => setStripe(e.target.value)}
                placeholder="https://buy.stripe.com/..."
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 13,
                  fontFamily: "monospace",
                  background: "#0a0a0a",
                  border: "1px solid #333",
                  borderRadius: 10,
                  color: "#fff",
                  outline: "none",
                }}
              />
              <p style={{ fontSize: 11, opacity: 0.5, marginTop: 8 }}>
                Créez un lien de paiement sur <a href="https://dashboard.stripe.com/payment-links" target="_blank" style={{ color: "#635bff" }}>Stripe Dashboard</a> et collez-le ici
              </p>
            </div>

            {/* PAYPAL */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,196,57,0.3)", borderRadius: 20, padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#ffc439", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 20, color: "#003087" }}>
                  P
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>PayPal</div>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>Lien PayPal.me</div>
                </div>
              </div>
              <input
                type="text"
                value={paypal}
                onChange={(e) => setPaypal(e.target.value)}
                placeholder="https://paypal.me/votrenom"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 13,
                  fontFamily: "monospace",
                  background: "#0a0a0a",
                  border: "1px solid #333",
                  borderRadius: 10,
                  color: "#fff",
                  outline: "none",
                }}
              />
              <p style={{ fontSize: 11, opacity: 0.5, marginTop: 8 }}>
                Votre lien <a href="https://paypal.me" target="_blank" style={{ color: "#ffc439" }}>paypal.me/votrenom</a>
              </p>
            </div>

            <button
              onClick={save}
              disabled={loading}
              style={{
                width: "100%",
                padding: 18,
                fontSize: 15,
                fontWeight: 800,
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                cursor: loading ? "wait" : "pointer",
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? "..." : "💾 Enregistrer mes clés"}
            </button>

            {message && (
              <div style={{
                padding: 16,
                borderRadius: 12,
                background: message.type === "success" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                border: message.type === "success" ? "1px solid #22c55e" : "1px solid #ef4444",
                color: message.type === "success" ? "#4ade80" : "#f87171",
                fontSize: 14,
                textAlign: "center",
              }}>
                {message.text}
              </div>
            )}

            <div style={{ marginTop: 8, padding: 16, background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.3)", borderRadius: 12, fontSize: 12, opacity: 0.9, lineHeight: 1.6 }}>
              💡 <strong>Comment ça marche :</strong>
              <br />• Tant que vous n'avez pas entré vos clés → les paiements vont chez BARRY
              <br />• Dès que vous entrez vos clés → les paiements viennent chez vous
            </div>
          </div>
        )}
      </div>
    </div>
  );
}