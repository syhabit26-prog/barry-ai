"use client";

import Link from "next/link";
import { useState, useMemo, useRef } from "react";
import { ALL_AGENTS } from "@/lib/allAgents";
import { ArrowRight, Search, X, ImagePlus, Loader2, Sparkles } from "lucide-react";

export default function AgentsPage() {
  const total = ALL_AGENTS.length;
  const [query, setQuery] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [recommended, setRecommended] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return ALL_AGENTS;
    return ALL_AGENTS.filter((a) => {
      const haystack = (
        a.name + " " + a.tagline + " " + (a.category || "") + " " + a.slug
      ).toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  const recommendedAgents = useMemo(() => {
    if (recommended.length === 0) return [];
    return recommended
      .map((slug) => ALL_AGENTS.find((a) => a.slug === slug))
      .filter((a): a is NonNullable<typeof a> => Boolean(a));
  }, [recommended]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      setPhoto(dataUrl);
      setAnalyzing(true);
      setRecommended([]);
      setKeywords([]);

      try {
        const res = await fetch("/api/agents/analyze-photo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: dataUrl }),
        });
        const data = await res.json();
        if (data.ok) {
          setRecommended(data.agentSlugs || []);
          setKeywords(data.keywords || []);
        } else {
          console.error("Analyse échouée:", data.error);
        }
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setPhoto(null);
    setRecommended([]);
    setKeywords([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-[20%] -left-[10%] w-[55%] h-[60%] rounded-full opacity-30 blur-[120px]"
          style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
        />
        <div
          className="absolute -bottom-[20%] -right-[10%] w-[55%] h-[60%] rounded-full opacity-30 blur-[120px]"
          style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-4">
            Ton équipe d'
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-red-500 bg-clip-text text-transparent">
              experts
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            <strong>{total} experts IA</strong> spécialisés, disponibles 24/7 pour t'aider.
          </p>
        </div>

        {/* BARRE DE RECHERCHE + PHOTO */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Recherche un agent (ex: comptable, dev react, coach sportif...)"
              className="w-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl pl-14 pr-32 py-4 text-base outline-none focus:border-blue-400 focus:shadow-lg transition-all placeholder-gray-400"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-2 text-gray-400 hover:text-gray-700 transition-colors rounded-xl hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={analyzing}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-xl hover:bg-blue-50 disabled:opacity-50"
                title="Ajoute une photo → l'IA te recommande un agent"
              >
                <ImagePlus className="w-5 h-5" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="hidden"
              />
            </div>
          </div>

          {/* APERÇU PHOTO */}
          {photo && (
            <div className="mt-3 flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-3">
              <img
                src={photo}
                alt="Besoin"
                className="w-16 h-16 rounded-xl object-cover border border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">
                  {analyzing ? "Analyse en cours..." : "Photo analysée"}
                </p>
                <p className="text-xs text-gray-500">
                  {analyzing
                    ? "Recherche des agents correspondants..."
                    : keywords.length > 0
                    ? "Mots-clés : " + keywords.join(", ")
                    : "Aucun agent trouvé pour cette photo"}
                </p>
              </div>
              <button
                onClick={clearPhoto}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {query && (
            <p className="text-center text-sm text-gray-500 mt-3">
              {filtered.length} agent{filtered.length > 1 ? "s" : ""} trouvé
              {filtered.length > 1 ? "s" : ""} pour « <strong>{query}</strong> »
            </p>
          )}
        </div>

        {/* ANALYSE EN COURS */}
        {analyzing && (
          <div className="max-w-3xl mx-auto mb-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 flex items-center gap-4">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900">Analyse IA de la photo...</p>
              <p className="text-sm text-gray-500">
                Groq Vision détecte ton besoin et cherche les meilleurs agents.
              </p>
            </div>
          </div>
        )}

        {/* AGENTS RECOMMANDÉS */}
        {!analyzing && recommendedAgents.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-black text-gray-900">
                {recommendedAgents.length} agent{recommendedAgents.length > 1 ? "s" : ""} recommandé
                {recommendedAgents.length > 1 ? "s" : ""} pour toi
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendedAgents.map((agent) => (
                <Link key={"rec-" + agent.slug} href={"/agents/" + agent.slug}>
                  <div className="group p-6 rounded-2xl border-2 border-blue-400 bg-blue-50/70 backdrop-blur-sm transition-all cursor-pointer h-full shadow-md hover:shadow-xl hover:scale-[1.02]">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg bg-gradient-to-br from-blue-600 to-blue-500">
                        <span>{agent.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                          {agent.name}
                        </h2>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {agent.tagline}
                        </p>
                        <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 group-hover:gap-3 transition-all">
                          Discuter avec cet agent
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="border-t-2 border-gray-200 my-10" />
          </div>
        )}

        {/* TOUS LES AGENTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((agent, index) => {
            const isBlue = index % 2 === 0;
            const gradient = isBlue
              ? "from-blue-600 to-blue-500"
              : "from-red-600 to-red-500";
            const borderColor = isBlue
              ? "border-blue-300 hover:border-blue-500"
              : "border-red-300 hover:border-red-500";
            const bgHover = isBlue ? "hover:bg-blue-50" : "hover:bg-red-50";
            const textColor = isBlue ? "text-blue-700" : "text-red-700";
            const shadowColor = isBlue
              ? "hover:shadow-blue-500/20"
              : "hover:shadow-red-500/20";

            return (
              <Link key={agent.slug + "-" + index} href={"/agents/" + agent.slug}>
                <div
                  className={
                    "group p-6 rounded-2xl border-2 bg-white/80 backdrop-blur-sm transition-all cursor-pointer h-full shadow-sm hover:shadow-xl hover:scale-[1.02] " +
                    borderColor + " " + bgHover + " " + shadowColor
                  }
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={
                        "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg bg-gradient-to-br " +
                        gradient
                      }
                    >
                      <span>{agent.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {agent.name}
                      </h2>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {agent.tagline}
                      </p>
                      <div
                        className={
                          "inline-flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all " +
                          textColor
                        }
                      >
                        Discuter avec cet agent
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && !analyzing && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-xl font-bold text-gray-700 mb-2">
              Aucun agent trouvé
            </p>
            <p className="text-gray-500 mb-6">
              Essaie avec un autre mot-clé
            </p>
            <button
              onClick={() => {
                setQuery("");
                clearPhoto();
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-red-500 text-white font-bold hover:shadow-lg transition-all"
            >
              Voir tous les agents
            </button>
          </div>
        )}

                <p className="text-center text-xs text-gray-500 mt-16">
          BARRY AI · {total} agents · Créé par Mouhamed Barry
        </p>
      </div>
    </div>
  );
}