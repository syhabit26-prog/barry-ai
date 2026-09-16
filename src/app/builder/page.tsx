"use client";

import { useState } from "react";
import { Send, Sparkles, Code2, RefreshCw, Palette, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const HTML_INITIAL = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>BARRY AI</title>
<style>
  body { margin:0; font-family:sans-serif; background:#09090b; color:white;
         min-height:100vh; display:flex; flex-direction:column;
         align-items:center; justify-content:center; text-align:center; padding:40px; }
  h1 { color:#facc15; font-size:48px; margin:0; }
  p { color:#a1a1aa; margin-top:16px; }
</style>
</head>
<body>
  <h1>BARRY AI</h1>
  <p>Decris ce que tu veux creer dans le chat !</p>
</body>
</html>`;

// ═══ STYLES DISPONIBLES ═══
const COLORS = [
  { id: "yellow", name: "Jaune Doré", primary: "#facc15", secondary: "#f59e0b" },
  { id: "purple", name: "Violet", primary: "#a855f7", secondary: "#7c3aed" },
  { id: "blue", name: "Bleu", primary: "#3b82f6", secondary: "#2563eb" },
  { id: "green", name: "Vert", primary: "#22c55e", secondary: "#16a34a" },
  { id: "pink", name: "Rose", primary: "#ec4899", secondary: "#db2777" },
  { id: "red", name: "Rouge", primary: "#ef4444", secondary: "#dc2626" },
  { id: "orange", name: "Orange", primary: "#f97316", secondary: "#ea580c" },
  { id: "cyan", name: "Cyan", primary: "#06b6d4", secondary: "#0891b2" },
];

const MOODS = [
  { id: "dark-luxury", name: "Luxe sombre", desc: "Élégant et premium" },
  { id: "light-minimal", name: "Minimaliste clair", desc: "Simple et épuré" },
  { id: "vibrant", name: "Vibrant", desc: "Couleurs vives" },
  { id: "vintage", name: "Vintage", desc: "Rétro et chaleureux" },
];

export default function BuilderPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Bonjour ! Decris ce que tu veux creer.\n\nExemples :\n• Cree une boutique de sneakers\n• Cree un jeu snake\n• Cree un portfolio" }
  ]);
  const [input, setInput] = useState("");
  const [html, setHtml] = useState(HTML_INITIAL);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);

  // ═══ MODALE DE PERSONNALISATION ═══
  const [showCustomize, setShowCustomize] = useState(false);
  const [storePrompt, setStorePrompt] = useState("");
  const [storeName, setStoreName] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");
  const [selectedMood, setSelectedMood] = useState("dark-luxury");

  const handleSend = async () => {
    const texte = input.trim();
    if (!texte || loading) return;

    // Detecte si c'est une boutique
    const isShop = /boutique|shop|e-?commerce|dropshipping|store|magasin|vendre/i.test(texte);

    if (isShop) {
      // Ouvre la modale de personnalisation
      setStorePrompt(texte);
      setStoreName("");
      setShowCustomize(true);
      setInput("");
      return;
    }

    // Sinon, comportement normal
    await generateSite(texte, null);
  };

  const generateSite = async (texte: string, customization: any) => {
    setMessages((prev) => [...prev, { role: "user", content: texte }]);
    setLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "..." }]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: texte,
          provider: "groq",
          mode: customization ? "dropshipping" : undefined,
          customization,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        setMessages((prev) => {
          const copie = [...prev];
          copie[copie.length - 1] = { role: "assistant", content: "Erreur : " + data.error };
          return copie;
        });
      } else {
        setMessages((prev) => {
          const copie = [...prev];
          copie[copie.length - 1] = { role: "assistant", content: "✅ Site genere ! Regarde l'apercu." };
          return copie;
        });

        let htmlExtrait = "";
        const match = data.text.match(/```(?:html)?\s*\n?([\s\S]*?)```/);

        if (match) htmlExtrait = match[1];
        else {
          const idx = data.text.indexOf("<!DOCTYPE");
          if (idx === -1) {
            const idx2 = data.text.indexOf("<html");
            if (idx2 !== -1) htmlExtrait = data.text.slice(idx2);
          } else {
            htmlExtrait = data.text.slice(idx);
          }
        }

        htmlExtrait = htmlExtrait.trim();
        if (htmlExtrait) {
          setHtml(htmlExtrait);
          setKey((k) => k + 1);
        }
      }
    } catch (err: any) {
      setMessages((prev) => {
        const copie = [...prev];
        copie[copie.length - 1] = { role: "assistant", content: "Erreur reseau : " + err.message };
        return copie;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomizeSubmit = () => {
    if (!storeName.trim()) return;

    const customization = {
      storeName: storeName.trim(),
      color: COLORS.find((c) => c.id === selectedColor),
      mood: MOODS.find((m) => m.id === selectedMood),
    };

    setShowCustomize(false);
    generateSite(storePrompt, customization);
  };

  return (
    <div className="h-screen flex text-yellow-300 bg-black overflow-hidden">

      {/* PANNEAU GAUCHE : CHAT */}
      <div className="w-2/5 flex flex-col border-r border-yellow-400/30">

        <div className="p-4 border-b border-yellow-400/30 flex items-center gap-2 flex-shrink-0">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <h1 className="font-black tracking-widest text-base">BUILDER</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className="flex gap-2">
              <div className={"w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black " + (msg.role === "user" ? "bg-yellow-400 text-black" : "bg-black border border-yellow-400/60 text-yellow-300")}>
                {msg.role === "user" ? "M" : "B"}
              </div>
              <div className={"flex-1 p-3 rounded-lg text-xs leading-relaxed " + (msg.role === "user" ? "bg-yellow-400/95 text-black" : "bg-black/70 border border-yellow-400/30 text-yellow-100")}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-yellow-400/30 flex-shrink-0">
          <div className="flex gap-2 bg-black/60 border border-yellow-400/40 rounded-lg p-2 focus-within:border-yellow-400">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Decris ce que tu veux creer..."
              disabled={loading}
              className="flex-1 bg-transparent px-2 py-1 text-xs outline-none placeholder-yellow-500/50 text-yellow-100"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 disabled:opacity-50 text-black font-bold rounded-md px-3 py-1.5 text-xs flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              Generer
            </button>
          </div>
        </div>
      </div>

      {/* PANNEAU DROIT : APERCU */}
      <div className="w-3/5 flex flex-col">
        <div className="h-10 border-b border-yellow-400/30 flex items-center px-4 gap-3 bg-black/60 flex-shrink-0">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-yellow-500/80 ml-2">
            <Code2 className="w-3 h-3" />
            Apercu en direct
          </div>
          <button
            onClick={() => setKey((k) => k + 1)}
            className="ml-auto flex items-center gap-1 text-xs text-yellow-400 hover:bg-yellow-400/10 px-2 py-1 rounded"
          >
            <RefreshCw className="w-3 h-3" />
            Recharger
          </button>
        </div>
        <div className="flex-1 bg-white">
          <iframe
            key={key}
            srcDoc={html}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
            title="Apercu"
          />
        </div>
      </div>

      {/* ═══ MODALE PERSONNALISATION ═══ */}
      {showCustomize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl my-8 p-8 rounded-2xl border-2 border-yellow-400/50 bg-gradient-to-br from-black to-yellow-950/20 relative">

            <button
              onClick={() => setShowCustomize(false)}
              className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300"
            >
              <X className="w-5 h-5" />
            </button>

            {/* HEADER */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 mb-3">
                <Palette className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-3xl font-black text-yellow-300 mb-2">
                Personnalise ta boutique
              </h2>
              <p className="text-yellow-100/70 text-sm">
                Cree une boutique 100% unique selon tes gouts
              </p>
            </div>

            {/* NOM */}
            <div className="mb-6">
              <label className="block text-sm text-yellow-300 font-bold mb-2">
                🏷️ Nom de ta boutique
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Ex: SneakerKing, TechStore, Bijoux Chic..."
                className="w-full bg-black/60 border border-yellow-400/40 rounded-xl px-4 py-3 text-yellow-100 outline-none focus:border-yellow-400"
                autoFocus
              />
            </div>

            {/* COULEURS */}
            <div className="mb-6">
              <label className="block text-sm text-yellow-300 font-bold mb-3">
                🎨 Couleur principale
              </label>
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    className={
                      "p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 " +
                      (selectedColor === c.id
                        ? "border-white scale-105"
                        : "border-transparent hover:border-white/30")
                    }
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ background: "linear-gradient(135deg, " + c.primary + ", " + c.secondary + ")" }}
                    />
                    <span className="text-[10px] text-yellow-300 text-center">
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* AMBIANCE */}
            <div className="mb-8">
              <label className="block text-sm text-yellow-300 font-bold mb-3">
                ✨ Ambiance
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMood(m.id)}
                    className={
                      "p-4 rounded-xl border-2 transition-all text-left " +
                      (selectedMood === m.id
                        ? "border-yellow-400 bg-yellow-400/10"
                        : "border-yellow-400/20 hover:border-yellow-400/50")
                    }
                  >
                    <div className="font-bold text-yellow-300 text-sm mb-1">
                      {m.name}
                    </div>
                    <div className="text-[11px] text-yellow-100/60">
                      {m.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCustomize(false)}
                className="flex-1 py-3 rounded-xl border border-yellow-400/40 text-yellow-300 hover:bg-yellow-400/10 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleCustomizeSubmit}
                disabled={!storeName.trim()}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold hover:from-yellow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✨ Generer ma boutique
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}