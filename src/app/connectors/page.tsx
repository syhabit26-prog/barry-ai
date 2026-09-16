"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Plug, LogIn, X } from "lucide-react";

type Status = "available" | "setup" | "restricted";

type Connector = {
  name: string;
  emoji: string;
  desc: string;
  color: string;
  status: Status;
  provider?: string;
};

const CONNECTORS: Connector[] = [
  { name: "Gmail", emoji: "📧", desc: "Envoi et lecture d'emails", color: "#ea4335", status: "available", provider: "google" },
  { name: "YouTube", emoji: "📹", desc: "Videos et chaines", color: "#ff0000", status: "available", provider: "google" },
  { name: "X (Twitter)", emoji: "🐦", desc: "Posts et analytics", color: "#000000", status: "available", provider: "twitter" },
  { name: "TikTok", emoji: "🎵", desc: "Videos courtes et tendances", color: "#000000", status: "available", provider: "tiktok" },
  { name: "Shopify", emoji: "🛒", desc: "Produits et commandes", color: "#96bf48", status: "available" },
  { name: "PayPal", emoji: "💳", desc: "Paiements et abonnements", color: "#00457C", status: "available" },
  { name: "Stripe", emoji: "💰", desc: "Cartes bancaires et abonnements", color: "#635bff", status: "available" },
  { name: "CJ Dropshipping", emoji: "📦", desc: "Produits et expedition", color: "#ff6b00", status: "available" },
  { name: "Facebook", emoji: "📘", desc: "Pages et publications", color: "#1877f2", status: "setup" },
  { name: "Instagram", emoji: "📸", desc: "Posts et stories", color: "#e1306c", status: "setup" },
  { name: "Messenger", emoji: "💬", desc: "Messages automatises", color: "#0084ff", status: "setup" },
  { name: "WhatsApp", emoji: "💚", desc: "Business API (payant)", color: "#25d366", status: "restricted" },
  { name: "LinkedIn", emoji: "💼", desc: "Partages professionnels", color: "#0a66c2", status: "setup" },
];

const STATUS_INFO: Record<Status, { label: string; className: string }> = {
  available: { label: "Disponible", className: "text-green-400 border-green-400/40 bg-green-400/10" },
  setup: { label: "Configuration requise", className: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10" },
  restricted: { label: "Acces restreint", className: "text-red-400 border-red-400/40 bg-red-400/10" },
};

export default function ConnectorsPage() {
  const [shopifyModal, setShopifyModal] = useState(false);
  const [shopName, setShopName] = useState("ohk0r1-kb.myshopify.com");

  const handleConnect = async (connector: Connector) => {
    // SHOPIFY
    if (connector.name === "Shopify") {
      setShopifyModal(true);
      return;
    }

    // PAYPAL
    if (connector.name === "PayPal") {
      try {
        const res = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: "10.00", currency: "EUR" }),
        });
        const orderData = await res.json();
        const approvalLink = orderData.links?.find(
          (link: any) => link.rel === "approve"
        )?.href;
        if (approvalLink) {
          window.location.href = approvalLink;
        } else {
          alert("❌ Erreur PayPal : " + (orderData.error || "inconnue"));
        }
      } catch (err: any) {
        alert("❌ Erreur PayPal : " + err.message);
      }
      return;
    }

    // STRIPE
    if (connector.name === "Stripe") {
      try {
        const res = await fetch("/api/stripe/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 1, currency: "eur" }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert("❌ Erreur Stripe : " + (data.error || "inconnue"));
        }
      } catch (err: any) {
        alert("❌ Erreur Stripe : " + err.message);
      }
      return;
    }

    // CJ DROPSHIPPING
    if (connector.name === "CJ Dropshipping") {
      try {
        const res = await fetch("/api/cj");
        const data = await res.json();
        if (data.ok) {
          alert("✅ CJ Dropshipping est bien connecte !");
        } else {
          alert("❌ Erreur CJ : " + data.error);
        }
      } catch (err: any) {
        alert("❌ Erreur CJ : " + err.message);
      }
      return;
    }

    // OAUTH (Google, Twitter)
    if (connector.provider) {
      await signIn(connector.provider, { callbackUrl: "/connectors" });
      return;
    }

    // Autres
    alert(`🔧 ${connector.name} necessite une configuration supplementaire.`);
  };

  const handleShopifySubmit = () => {
    const shop = shopName.trim();
    if (!shop) return;
    setShopifyModal(false);
    window.location.href = `/api/shopify/install?shop=${shop}`;
  };

  return (
    <div className="min-h-screen px-6 py-16 max-w-6xl mx-auto text-yellow-100">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-400/40 bg-black/60 mb-6">
          <Plug className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-xs text-yellow-300">Connecteurs</span>
        </div>
        <h1 className="text-5xl font-black text-yellow-300 tracking-wider mb-4">
          Connecte tes outils
        </h1>
        <p className="text-yellow-100/70 max-w-2xl mx-auto">
          Integre tes services preferes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CONNECTORS.map((c) => {
          const info = STATUS_INFO[c.status];
          const isAvailable = c.status === "available";

          return (
            <button
              key={c.name}
              onClick={() => handleConnect(c)}
              className={
                "group text-left p-6 rounded-2xl border bg-black/60 backdrop-blur-md transition-all " +
                (isAvailable
                  ? "border-yellow-400/40 hover:border-yellow-400/80 cursor-pointer"
                  : "border-yellow-400/10 opacity-70 cursor-not-allowed")
              }
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: c.color + "33", border: "1px solid " + c.color + "66" }}
                >
                  {c.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-yellow-300 text-lg">{c.name}</h3>
                    {isAvailable && (
                      <LogIn className="w-3.5 h-3.5 text-yellow-500/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <p className="text-yellow-100/60 text-sm leading-relaxed mb-2">{c.desc}</p>
                  <div className={"inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded border " + info.className}>
                    {info.label}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {shopifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-8 rounded-2xl border border-yellow-400/40 bg-black relative">
            <button
              onClick={() => setShopifyModal(false)}
              className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🛒</span>
              <h2 className="text-2xl font-bold text-yellow-300">Connecter Shopify</h2>
            </div>

            <label className="block text-sm text-yellow-300 font-bold mb-2">
              Nom de ta boutique
            </label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleShopifySubmit()}
              placeholder="ma-boutique.myshopify.com"
              className="w-full bg-black/60 border border-yellow-400/40 rounded-xl px-4 py-3 text-yellow-100 outline-none focus:border-yellow-400 mb-4"
              autoFocus
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShopifyModal(false)}
                className="flex-1 py-3 rounded-xl border border-yellow-400/40 text-yellow-300 hover:bg-yellow-400/10 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleShopifySubmit}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold hover:from-yellow-300 transition-all"
              >
                Continuer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}