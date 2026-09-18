"use client";

import { useState } from "react";
import {
  Zap, Search, Key, Copy, Check,
  MessageSquare, Users, ShoppingCart, GraduationCap, BarChart3, Code2,
  Sparkles, Shield, Rocket, Globe,
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

const STATS = [
  { icon: Zap, label: "Latence moyenne", value: "< 500ms" },
  { icon: Shield, label: "Uptime garanti", value: "99.9%" },
  { icon: Rocket, label: "Requêtes/mois", value: "10M+" },
  { icon: Globe, label: "Régions", value: "5 continents" },
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-[#0a1a12] to-black relative overflow-hidden">

      {/* Halos décoratifs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-500/20 blur-[150px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-teal-500/15 blur-[150px]" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-green-500/15 blur-[140px]" />
      </div>

      <div className="relative z-10 px-6 py-16 max-w-6xl mx-auto text-yellow-100">

        {/* ═══ HEADER ═══ */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-green-500 mb-6 shadow-2xl shadow-emerald-500/40">
            <Zap className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-green-300 bg-clip-text text-transparent">
              Intégrez BARRY AI
            </span>
            <br />
            <span className="text-emerald-100/90">dans vos applications</span>
          </h1>

          <p className="text-emerald-100/70 max-w-2xl mx-auto text-lg leading-relaxed">
            Une API puissante pour connecter nos agents IA à vos outils internes, votre CRM, votre ERP ou vos applications client.
          </p>
        </div>

        {/* ═══ STATS ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="p-5 rounded-2xl border border-emerald-400/30 bg-black/40 backdrop-blur text-center hover:border-emerald-400/60 transition-all"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 mb-3 shadow-lg shadow-emerald-500/30">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-black bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mb-1">
                  {s.value}
                </div>
                <div className="text-[11px] text-emerald-200/60 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══ CE QUE VOUS POUVEZ FAIRE ═══ */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-3 bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
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
                  className="group p-6 rounded-2xl border border-emerald-400/30 bg-black/60 backdrop-blur hover:border-emerald-400/70 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4 group-hover:scale-110 transition-transform">
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
        <div className="mb-16 p-8 md:p-10 rounded-3xl border border-emerald-400/40 bg-gradient-to-br from-emerald-400/10 via-teal-500/5 to-black/60 backdrop-blur relative overflow-hidden">
          <div className="pointer-events-none absolute -top-40 -right-40 w-[400px] h-[400px] rounded-full bg-emerald-500/20 blur-[100px]" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                <Key className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  Votre clé API
                </h2>
                <p className="text-emerald-100/60 text-sm">
                  Générez une clé pour commencer à utiliser l'API BARRY AI
                </p>
              </div>
            </div>

            {!apiKey ? (
              <button
                onClick={generateKey}
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-green-500 text-white font-bold hover:scale-[1.02] transition-all shadow-lg shadow-emerald-500/40 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Générer ma clé API
              </button>
            ) : (
              <div>
                <div className="flex items-center gap-2 bg-black/60 border-2 border-emerald-400/50 rounded-2xl px-4 py-4 mb-3 focus-within:border-emerald-400 transition-all">
                  <code className="flex-1 text-emerald-200 text-sm font-mono break-all">
                    {apiKey}
                  </code>
                  <button
                    onClick={copyKey}
                    className="flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white px-3 py-2 rounded-lg bg-emerald-400/10 hover:bg-emerald-400/20 transition-all flex-shrink-0 font-bold"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copier
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-emerald-100/50 flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  Conservez cette clé en sécurité. Elle ne sera plus affichée après rechargement.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ═══ RECHERCHE D'ENDPOINTS ═══ */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black mb-3 bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Endpoints disponibles
            </h2>
            <p className="text-emerald-100/60">
              {ENDPOINTS.length} endpoints prêts à intégrer dans vos applications
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex items-center gap-2 bg-black/60 border-2 border-emerald-400/40 rounded-2xl px-4 py-3 focus-within:border-emerald-400 focus-within:shadow-lg focus-within:shadow-emerald-500/20 transition-all backdrop-blur">
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
                  "text-xs px-4 py-2 rounded-full border-2 transition-all font-semibold " +
                  (category === cat
                    ? "border-emerald-400 bg-emerald-400/20 text-emerald-200 shadow-lg shadow-emerald-500/20"
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
                  className="p-5 rounded-2xl border border-emerald-400/30 bg-black/60 backdrop-blur hover:border-emerald-400/70 hover:shadow-lg hover:shadow-emerald-500/20 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={
                        "text-[10px] font-bold px-2.5 py-1 rounded-md " +
                        (ep.method === "GET"
                          ? "bg-sky-400/20 text-sky-300 border border-sky-400/40"
                          : "bg-emerald-400/20 text-emerald-300 border border-emerald-400/40")
                      }
                    >
                      {ep.method}
                    </span>
                    <code className="text-emerald-300 font-mono text-sm group-hover:text-emerald-200 transition-colors">
                      {ep.path}
                    </code>
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