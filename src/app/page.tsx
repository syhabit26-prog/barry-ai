"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    const texte = prompt.trim();
    if (!texte) return;
    router.push(`/builder?prompt=${encodeURIComponent(texte)}`);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=1920&q=95')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ═══ OVERLAY TRÈS LÉGER (juste pour la lisibilité) ═══ */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* ═══ CONTENU CENTRAL ═══ */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6">

        {/* TITRE */}
        <h1 className="text-5xl md:text-7xl font-black text-white text-center tracking-tight mb-4 leading-[1.05] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          Créez quelque chose
          <br />
          avec <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">BARRY AI</span>
        </h1>

        {/* SOUS-TITRE */}
        <p className="text-center text-white text-lg mb-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          Donnez vie à une idée, un projet, ou une entreprise.
        </p>

        {/* BARRE DE SAISIE */}
        <div className="relative bg-white rounded-2xl shadow-2xl shadow-black/40 border-2 border-yellow-400 p-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Demandez à BARRY AI de créer..."
            rows={3}
            className="w-full resize-none outline-none bg-transparent text-gray-900 text-base px-3 py-2 placeholder-gray-400"
          />
          <div className="flex items-center justify-between px-2 pt-2">
            <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors px-2 font-semibold">
              <span className="text-lg leading-none">+</span>
              Créer
            </button>
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-yellow-500/30"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ BAS DE PAGE : DEVISE ═══ */}
      <div className="absolute bottom-8 left-0 right-0 text-center px-6">
        <p className="text-yellow-300 text-sm md:text-base font-bold tracking-[0.2em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          Work hard · Consistency · Determination = <span className="text-yellow-400">Success</span>
        </p>
      </div>
    </div>
  );
}