"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/builder");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fef9c3 100%)", padding: "24px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#fff", borderRadius: 24, boxShadow: "0 20px 60px rgba(251,146,60,0.2)", padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg, #facc15, #f97316)", marginBottom: 16 }}>
            <span style={{ color: "#fff", fontSize: 28, fontWeight: 900 }}>B</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#18181b", margin: 0, marginBottom: 8 }}>Connexion</h1>
          <p style={{ color: "#71717a", fontSize: 14, margin: 0 }}>Content de te revoir 👋</p>
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#18181b", marginBottom: 8 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ton@email.com"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "1px solid #e4e4e7", outline: "none", fontSize: 14, boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#18181b", marginBottom: 8 }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "1px solid #e4e4e7", outline: "none", fontSize: 14, boxSizing: "border-box" }}
            />
          </div>

          {error && (
            <div style={{ padding: 12, borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "14px", borderRadius: 14, background: "linear-gradient(90deg, #facc15, #f97316)", color: "#fff", fontWeight: 800, fontSize: 15, border: "none", cursor: loading ? "wait" : "pointer", opacity: loading ? 0.5 : 1, boxShadow: "0 10px 30px rgba(251,146,60,0.4)" }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 14, color: "#71717a", marginTop: 24 }}>
          Pas de compte ?{" "}
          <Link href="/signup" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}