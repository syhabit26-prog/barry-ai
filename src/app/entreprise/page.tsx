"use client";

import { useState } from "react";
import {
  Building2, Search, Key, Copy, Check,
  MessageSquare, Users, ShoppingCart, GraduationCap, BarChart3, Code2,
} from "lucide-react";

type Endpoint = {
  method: "GET" | "POST";
  path: string;
  desc: string;
  category: string;
};

const ENDPOINTS: Endpoint[] = [
  { method: "POST", path: "/v1/chat", desc: "Envoyer un message au chat IA", category: "Chat" },
  { method: "POST", path: "/v1/agents/accountant", desc: "Agent comptable (TVA, bilans, factures)", category: "Agents" },
  { method: "POST", path: "/v1/agents/finance", desc: "Analyste financier (ratios, prévisions)", category: "Agents" },
  { method: "POST", path: "/v1/agents/marketing", desc: "Directeur marketing (stratégie, pub)", category: "Agents" },
  { method: "POST", path: "/v1/agents/cyber", desc: "Expert cybersécurité (audits, protection)", category: "Agents" },
  { method: "POST", path: "/v1/generate/site", desc: "Générer un site web à partir d'un prompt", category: "Génération" },
  { method: "POST", path: "/v1/generate/store", desc: "Générer une boutique e-commerce", category: "Génération" },
  { method: "POST", path: "/v1/generate/image", desc: "Générer une image IA", category: "Génération" },
  { method: "POST", path: "/v1/coach", desc: "Coach personnel IA", category: "Coach" },
  { method: "GET", path: "/v1/usage", desc: "Statistiques d'utilisation et quota", category: "Compte" },
  { method: "GET", path: "/v1/models", desc: "Liste des modèles IA disponibles", category: "Compte" },
  { method: "POST", path: "/v1/webhooks", desc: "Configurer un webhook pour les événements", category: "Compte" },
];

const CATEGORIES = ["Tout", "Chat", "Agents", "Génération", "Coach", "Compte"];

const USE_CASES = [
  {
    icon: MessageSquare,
    title: "Chatbot client 24/7",
    desc: "Ajoutez un assistant IA directement dans votre site ou application pour répondre aux questions de vos clients à toute heure, sans embaucher.",
    example: "« Où est ma commande ? » → réponse instantanée",
  },
  {
    icon: Users,
    title: "Agents métiers",
    desc: "Comptable, analyste financier, directeur marketing, expert cyber... Intégrez des experts IA directement dans vos outils internes.",
    example: "Votre comptable IA analyse vos factures automatiquement",
  },
  {
    icon: ShoppingCart,
    title: "Génération e-commerce",
    desc: "Créez des boutiques en ligne, des fiches produits, des descriptions optimisées SEO, en quelques secondes via l'API.",
    example: "1 000 fiches produits générées en 5 minutes",
  },
  {
    icon: GraduationCap,
    title: "Formation des équipes",
    desc: "Offrez un coach IA personnalisé à chaque employé : montée en compétences, préparation d'entretiens, gestion de carrière.",
    example: "Chaque collaborateur a son coach dédié",
  },
  {
    icon: BarChart3,
    title: "Analyse & prédictions",
    desc: "Analysez vos données business, générez des rapports automatiques et obtenez des prédictions IA sur vos ventes et tendances.",
    example: "Rapport hebdo généré chaque lundi matin",
  },
  {
    icon: Code2,
    title: "Intégration sur mesure",
    desc: "Ajoutez BARRY AI dans votre CRM, ERP, app mobile ou logiciel interne. Nos SDK JS, Python et PHP rendent l'intégration ultra simple.",
    example: "3 lignes de code et c'est branché",
  },
];

export default function EntreprisePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tout");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredEndpoints = ENDPOINTS.filter((ep) => {
    const matchSearch =
      ep.path.toLowerCase().includes(search.toLowerCase()) ||
      ep.desc.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "Tout" || ep.category === category;
    return matchSearch && matchCategory;
  });

  const generateKey = () => {
    const key =
      "barry_live_" +
      Array.from({ length: 32 }, () =>
        "abcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 36))
      ).join("");
    setApiKey(key);
    setCopied(false);
  };

  const copyKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-[#0a1a12] to-black">
      <div className="px-6 py-16 max-w-6xl mx-auto text-yellow-100">

        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/40 bg-black/60 backdrop-blur mb-6">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-emerald-300">Entreprise · API</span>
          </div>
          <h1 className="text-5xl font-black text-emerald-300 tracking-wider mb-4">
            Intégrez BARRY AI dans vos apps
          </h1>
          <p className="text-emerald-100/70 max-w-2xl mx-auto text-lg">
            Une API puissante pour connecter nos agents IA à vos outils internes, votre CRM, votre ERP ou vos applications client.
          </p>
        </div>

        {/* ═══ CE QUE VOUS POUVEZ FAIRE ═══ */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-emerald-300 mb-3">
              Ce que vous pouvez faire
            </h2>
            <p className="text-emerald-100/60">
              Avec une seule clé API, débloquez toutes les capacités de BARRY AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {USE_CASES.map((uc) => {
              const Icon = uc.icon;
              return (
                <div
                  key={uc.title}
                  className="p-6 rounded-2xl border border-emerald-400/30 bg-black/60 backdrop-blur hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/10 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-emerald-300 font-bold text-lg mb-2">{uc.title}</h3>
                  <p className="text-emerald-100/60 text-sm leading-relaxed mb-3">{uc.desc}</p>
                  <div className="flex items-start gap-2 text-[11px] text-emerald-300/70 italic border-t border-emerald-400/20 pt-3">
                    <span className="text-emerald-400">→</span>
                    {uc.example}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ GÉNÉRATION DE CLÉ API ═══ */}
        <div className="mb-16 p-8 rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-400/10 to-black/60 backdrop-blur">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-emerald-300">Votre clé API</h2>
              <p className="text-emerald-100/60 text-sm">
                Générez une clé pour commencer à utiliser l'API BARRY AI
              </p>
            </div>
          </div>

          {!apiKey ? (
            <button
              onClick={generateKey}
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-bold hover:from-emerald-300 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/30"
            >
              🔑 Générer ma clé API
            </button>
          ) : (
            <div>
              <div className="flex items-center gap-2 bg-black/60 border border-emerald-400/40 rounded-xl px-4 py-3 mb-3">
                <code className="flex-1 text-emerald-200 text-sm font-mono break-all">
                  {apiKey}
                </code>
                <button
                  onClick={copyKey}
                  className="flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-400/10 transition-all flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copier
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-emerald-100/50">
                ⚠️ Conservez cette clé en sécurité. Elle ne sera plus affichée après rechargement.
              </p>
            </div>
          )}
        </div>

        {/* ═══ RECHERCHE D'ENDPOINTS ═══ */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-emerald-300 mb-3">
              Endpoints disponibles
            </h2>
            <p className="text-emerald-100/60">
              {ENDPOINTS.length} endpoints prêts à intégrer dans vos applications
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex items-center gap-2 bg-black/60 border border-emerald-400/40 rounded-2xl px-4 py-3 focus-within:border-emerald-400 focus-within:shadow-lg focus-within:shadow-emerald-500/10 transition-all backdrop-blur">
              <Search className="w-4 h-4 text-emerald-400/70" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un endpoint (/chat, /agents, ...)"
                className="flex-1 bg-transparent text-sm outline-none placeholder-emerald-300/40 text-emerald-50"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-xs text-emerald-400/60 hover:text-emerald-300"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={
                  "text-xs px-3 py-1.5 rounded-full border transition-all " +
                  (category === cat
                    ? "border-emerald-400 bg-emerald-400/15 text-emerald-200"
                    : "border-emerald-400/20 text-emerald-300/70 hover:border-emerald-400/50 hover:bg-emerald-400/5")
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredEndpoints.length === 0 ? (
            <div className="text-center py-12 text-emerald-100/50">
              Aucun endpoint trouvé pour "{search}"
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredEndpoints.map((ep) => (
                <div
                  key={ep.path}
                  className="p-5 rounded-2xl border border-emerald-400/30 bg-black/60 backdrop-blur hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/10 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={
                        "text-[10px] font-bold px-2 py-0.5 rounded " +
                        (ep.method === "GET"
                          ? "bg-sky-400/20 text-sky-300 border border-sky-400/40"
                          : "bg-emerald-400/20 text-emerald-300 border border-emerald-400/40")
                      }
                    >
                      {ep.method}
                    </span>
                    <code className="text-emerald-300 font-mono text-sm">{ep.path}</code>
                  </div>
                  <p className="text-emerald-100/60 text-xs leading-relaxed mb-2">{ep.desc}</p>
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full border border-emerald-400/30 text-emerald-300/80">
                    {ep.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}