"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Plug, LogIn, X } from "lucide-react";

type Status = "available" | "setup" | "restricted";

type Connector = {
  name: string;
  slug: string;
  desc: string;
  status: Status;
  provider?: string;
};

const CONNECTORS: Connector[] = [
  { name: "Gmail", slug: "gmail", desc: "Envoi et lecture d'emails", status: "available", provider: "google" },
  { name: "YouTube", slug: "youtube", desc: "Videos et chaines", status: "available", provider: "google" },
  { name: "X (Twitter)", slug: "x", desc: "Posts et analytics", status: "available", provider: "twitter" },
  { name: "TikTok", slug: "tiktok", desc: "Videos courtes et tendances", status: "available", provider: "tiktok" },
  { name: "Shopify", slug: "shopify", desc: "Produits et commandes", status: "available" },
  { name: "PayPal", slug: "paypal", desc: "Paiements et abonnements", status: "available" },
  { name: "Stripe", slug: "stripe", desc: "Cartes bancaires et abonnements", status: "available" },
  { name: "CJ Dropshipping", slug: "cjdropshipping", desc: "Produits et expedition", status: "available" },
  { name: "Facebook", slug: "facebook", desc: "Pages et publications", status: "setup" },
  { name: "Instagram", slug: "instagram", desc: "Posts et stories", status: "setup" },
  { name: "Messenger", slug: "messenger", desc: "Messages automatises", status: "setup" },
  { name: "WhatsApp", slug: "whatsapp", desc: "Business API (payant)", status: "restricted" },
  { name: "LinkedIn", slug: "linkedin", desc: "Partages professionnels", status: "setup" },
];

export default function ConnectorsPage() {
  const [shopifyModal, setShopifyModal] = useState(false);
  const [shopName, setShopName] = useState("ohk0r1-kb.myshopify.com");

  const handleConnect = async (connector: Connector) => {
    if (connector.name === "Shopify") {
      setShopifyModal(true);
      return;
    }

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

    // ⭐ CJ DROPSHIPPING — Redirige vers la page /cj
    if (connector.name === "CJ Dropshipping") {
      window.location.href = "/cj";
      return;
    }

    if (connector.provider) {
      await signIn(connector.provider, { callbackUrl: "/connectors" });
      return;
    }

    alert(`🔧 ${connector.name} necessite une configuration supplementaire.`);
  };

  const handleShopifySubmit = () => {
    const shop = shopName.trim();
    if (!shop) return;
    setShopifyModal(false);
    window.location.href = `/api/shopify/install?shop=${shop}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-950 via-[#1a0a14] to-black">
      <div className="px-6 py-16 max-w-6xl mx-auto text-yellow-100">

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-400/40 bg-black/60 backdrop-blur mb-6">
            <Plug className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-xs text-pink-300">Connecteurs</span>
          </div>
          <h1 className="text-5xl font-black text-pink-300 tracking-wider mb-4">
            Connecte tes outils
          </h1>
          <p className="text-pink-100/70 max-w-2xl mx-auto">
            Integre tes services preferes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONNECTORS.map((c) => {
            const isAvailable = c.status === "available";

            return (
              <button
                key={c.name}
                onClick={() => handleConnect(c)}
                className={
                  "group text-left p-6 rounded-2xl border bg-black/60 backdrop-blur-md transition-all " +
                  (isAvailable
                    ? "border-pink-400/40 hover:border-pink-400/80 cursor-pointer hover:shadow-lg hover:shadow-pink-500/20"
                    : "border-pink-400/10 opacity-70 cursor-not-allowed")
                }
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-white p-2.5 shadow-md overflow-hidden">
                    {c.slug === "cjdropshipping" ? (
                      <svg viewBox="0 0 24 24" className="w-full h-full">
                        <circle cx="12" cy="12" r="11" fill="#ff6b00" />
                        <text
                          x="12"
                          y="16"
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="900"
                          fill="white"
                          fontFamily="Arial, sans-serif"
                        >
                          CJ
                        </text>
                      </svg>
                    ) : c.slug === "linkedin" ? (
                      <svg viewBox="0 0 24 24" className="w-full h-full">
                        <rect width="24" height="24" rx="3" fill="#0a66c2" />
                        <path
                          fill="white"
                          d="M6.94 8.5H4.56V19h2.38V8.5zM5.75 7.44a1.38 1.38 0 100-2.76 1.38 1.38 0 000 2.76zM19.44 19h-2.38v-5.11c0-1.22-.02-2.79-1.7-2.79-1.7 0-1.96 1.33-1.96 2.7V19h-2.38V8.5h2.28v1.43h.03c.32-.6 1.1-1.24 2.26-1.24 2.42 0 2.87 1.59 2.87 3.66V19z"
                        />
                      </svg>
                    ) : (
                      <img
                        src={`https://cdn.simpleicons.org/${c.slug}`}
                        alt={c.name}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-pink-300 text-lg">{c.name}</h3>
                      {isAvailable && (
                        <LogIn className="w-3.5 h-3.5 text-pink-500/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <p className="text-pink-100/60 text-sm leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {shopifyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md p-8 rounded-2xl border border-pink-400/40 bg-black relative">
              <button
                onClick={() => setShopifyModal(false)}
                className="absolute top-4 right-4 text-pink-400 hover:text-pink-300"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white p-2 shadow-md">
                  <img
                    src="https://cdn.simpleicons.org/shopify"
                    alt="Shopify"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold text-pink-300">Connecter Shopify</h2>
              </div>

              <label className="block text-sm text-pink-300 font-bold mb-2">
                Nom de ta boutique
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleShopifySubmit()}
                placeholder="ma-boutique.myshopify.com"
                className="w-full bg-black/60 border border-pink-400/40 rounded-xl px-4 py-3 text-pink-100 outline-none focus:border-pink-400 mb-4"
                autoFocus
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setShopifyModal(false)}
                  className="flex-1 py-3 rounded-xl border border-pink-400/40 text-pink-300 hover:bg-pink-400/10 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleShopifySubmit}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-400 to-pink-600 text-white font-bold hover:from-pink-300 transition-all shadow-lg shadow-pink-500/30"
                >
                  Continuer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}