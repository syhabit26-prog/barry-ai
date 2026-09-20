"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { ALL_AGENTS } from "@/lib/allAgents";
import { ArrowRight, Search, X } from "lucide-react";

export default function AgentsPage() {
  const total = ALL_AGENTS.length;
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return ALL_AGENTS;
    return ALL_AGENTS.filter((a) => {
      const haystack = (a.name + " " + a.tagline + " " + (a.category || "") + " " + a.slug).toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[55%] h-[60%] rounded-full opacity-30 blur-[120px]"
          style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }} />
        <div className="absolute -bottom-[20%] -right-[10%] w-[55%] h-[60%] rounded-full opacity-30 blur-[120px]"
          style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }} />
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

        <div className="max-w-3xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Recherche un agent (ex: comptable, dev react, coach sportif...)"
              className="w-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl pl-14 pr-14 py-4 text-base outline-none focus:border-blue-400 focus:shadow-lg transition-all placeholder-gray-400"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {query && (
            <p className="text-center text-sm text-gray-500 mt-3">
              {filtered.length} agent{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((agent, index) => {
            const isBlue = index % 2 === 0;
            const gradient = isBlue ? "from-blue-600 to-blue-500" : "from-red-600 to-red-500";
            const borderColor = isBlue ? "border-blue-300 hover:border-blue-500" : "border-red-300 hover:border-red-500";
            const bgHover = isBlue ? "hover:bg-blue-50" : "hover:bg-red-50";
            const textColor = isBlue ? "text-blue-700" : "text-red-700";
            const shadowColor = isBlue ? "hover:shadow-blue-500/20" : "hover:shadow-red-500/20";

            return (
              <Link key={agent.slug + "-" + index} href={"/agents/" + agent.slug}>
                <div className={"group p-6 rounded-2xl border-2 bg-white/80 backdrop-blur-sm transition-all cursor-pointer h-full shadow-sm hover:shadow-xl hover:scale-[1.02] " + borderColor + " " + bgHover + " " + shadowColor}>
                  <div className="flex items-start gap-4">
                    <div className={"w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg bg-gradient-to-br " + gradient}>
                      <span>{agent.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{agent.name}</h2>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{agent.tagline}</p>
                      <div className={"inline-flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all " + textColor}>
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

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-xl font-bold text-gray-700 mb-2">Aucun agent trouvé</p>
            <button
              onClick={() => setQuery("")}
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