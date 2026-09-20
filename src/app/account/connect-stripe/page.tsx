"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, AlertCircle, Euro } from "lucide-react";

export default function ConnectStripePage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [userId] = useState("demo-user-1"); // ⭐ À remplacer par ton auth
  const [email] = useState("demo@barry.ai");

  useEffect(() => {
    fetch(`/api/stripe/connect/status?userId=${userId}`)
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {});
  }, [userId]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/connect/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Erreur : " + (data.error || "inconnue"));
    } catch (e: any) {
      alert("Erreur réseau : " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
            <Euro className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-zinc-900 mb-2">Reçois tes paiements</h1>
          <p className="text-zinc-500 text-sm">
            Connecte ton compte Stripe pour recevoir <strong className="text-orange-500">98%</strong> de chaque vente.
            <br />BARRY AI garde seulement 2% de commission.
          </p>
        </div>

        {status?.charges_enabled ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="font-bold text-emerald-700">Compte connecté ✅</p>
            <p className="text-sm text-emerald-600 mt-1">
              Tu reçois tes paiements automatiquement.
            </p>
          </div>
        ) : status?.details_submitted && !status?.charges_enabled ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <p className="font-bold text-amber-700">Vérification en cours</p>
            <p className="text-sm text-amber-600 mt-1 mb-4">
              Stripe vérifie tes informations. Ça peut prendre quelques minutes.
            </p>
            <button
              onClick={handleConnect}
              className="px-6 py-2 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600"
            >
              Compléter les infos
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Redirection...
              </>
            ) : (
              <>🚀 Connecter Stripe</>
            )}
          </button>
        )}

        <div className="mt-6 pt-6 border-t border-zinc-100 space-y-2 text-xs text-zinc-500">
          <p>✅ Paiement direct sur ton compte bancaire</p>
          <p>✅ BARRY AI prend seulement 2% de chaque vente</p>
          <p>✅ Configuration sécurisée par Stripe</p>
        </div>
      </div>
    </div>
  );
}