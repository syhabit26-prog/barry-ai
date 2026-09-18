"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Code2, RefreshCw, Palette, X, Trash2 } from "lucide-react";
import { loadChat, saveChat, clearChat, PAGE_KEYS, type ChatMessage } from "@/lib/chatHistory";

type Message = ChatMessage;

function extractHtml(text: string): string {
  if (!text) return "";
  let match = text.match(/```html\s*\n([\s\S]*?)```/i);
  if (match) return match[1].trim();
  match = text.match(/```\s*\n([\s\S]*?)```/);
  if (match) return match[1].trim();
  match = text.match(/```html\s*\n([\s\S]*)$/i);
  if (match) return match[1].trim();
  match = text.match(/```\s*\n([\s\S]*)$/);
  if (match) return match[1].trim();
  let idx = text.indexOf("<!DOCTYPE");
  if (idx !== -1) return text.slice(idx).trim();
  idx = text.indexOf("<html");
  if (idx !== -1) return text.slice(idx).trim();
  idx = text.indexOf("<body");
  if (idx !== -1) return "<!DOCTYPE html>\n<html>\n<head><meta charset=\"utf-8\"></head>\n" + text.slice(idx).trim();
  return "";
}

const HTML_INITIAL = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>BARRY AI</title>
<style>
  body { margin:0; font-family:sans-serif; background:#fff; color:#1a1a1a;
         min-height:100vh; display:flex; flex-direction:column;
         align-items:center; justify-content:center; text-align:center; padding:40px; }
  h1 { font-size:48px; margin:0; color:#f59e0b; }
  p { color:#52525b; margin-top:16px; }
</style>
</head>
<body>
  <h1>BARRY AI</h1>
  <p>Decris ce que tu veux creer dans le chat !</p>
</body>
</html>`;

const MESSAGE_INITIAL: Message = {
  role: "assistant",
  content: "Bonjour ! Decris ce que tu veux creer.\n\nExemples :\n• Cree une boutique de sneakers\n• Cree un jeu snake\n• Cree un portfolio\n• Cree un site pour une banque",
};

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
  const [messages, setMessages] = useState<Message[]>([MESSAGE_INITIAL]);
  const [input, setInput] = useState("");
  const [html, setHtml] = useState(HTML_INITIAL);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [currentProject, setCurrentProject] = useState<{ id: string; slug: string; published: boolean } | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  const [showCustomize, setShowCustomize] = useState(false);
  const [storePrompt, setStorePrompt] = useState("");
  const [storeName, setStoreName] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");
  const [selectedMood, setSelectedMood] = useState("dark-luxury");

  useEffect(() => {
    const saved = loadChat(PAGE_KEYS.BUILDER);
    if (saved.length > 0) setMessages(saved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && messages.length > 0) {
      saveChat(PAGE_KEYS.BUILDER, messages);
    }
  }, [messages, mounted]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleClear = () => {
    if (confirm("Effacer toute la conversation ?")) {
      clearChat(PAGE_KEYS.BUILDER);
      setMessages([MESSAGE_INITIAL]);
      setCurrentProject(null);
    }
  };

  const handleSend = async () => {
    const texte = input.trim();
    if (!texte || loading) return;

    const isShop = /boutique|shop|e-?commerce|dropshipping|store|magasin|vendre/i.test(texte);

    if (isShop) {
      setStorePrompt(texte);
      setStoreName("");
      setShowCustomize(true);
      setInput("");
      return;
    }

    await generateSite(texte, null);
  };

  const generateSite = async (texte: string, customization: any) => {
    setMessages((prev) => [...prev, { role: "user", content: texte }]);
    setLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "⏳ Generation en cours..." }]);

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

      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");

      let htmlExtrait = "";
      let styleUsed: string | null = null;
      let keywordUsed: string | null = null;

      if (isJson) {
        const data = await res.json();
        if (!data.ok) {
          setMessages((prev) => {
            const copie = [...prev];
            copie[copie.length - 1] = { role: "assistant", content: "Erreur : " + data.error };
            return copie;
          });
          return;
        }
        styleUsed = data.style || null;
        keywordUsed = data.keyword || null;
        htmlExtrait = extractHtml(data.text);
      } else {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        if (reader) {
          let done = false;
          while (!done) {
            const { value, done: d } = await reader.read();
            done = d;
            if (value) fullText += decoder.decode(value, { stream: true });
          }
        }
        htmlExtrait = extractHtml(fullText);
      }

      htmlExtrait = htmlExtrait.trim();

      if (htmlExtrait && htmlExtrait.length > 50) {
        setHtml(htmlExtrait);
        setKey((k) => k + 1);

        setMessages((prev) => {
          const copie = [...prev];
          copie[copie.length - 1] = { role: "assistant", content: "✅ Site genere ! Regarde l'apercu." };
          return copie;
        });

        try {
          const saveRes = await fetch("/api/projects/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: customization?.storeName || "Mon site",
              prompt: texte,
              html: htmlExtrait,
              style: styleUsed,
              category: keywordUsed,
              userId: null,
            }),
          });
          const saveData = await saveRes.json();
          if (saveData.ok) {
            setCurrentProject({
              id: saveData.project.id,
              slug: saveData.project.slug,
              published: false,
            });
            setMessages((prev) => {
              const copie = [...prev];
              copie[copie.length - 1] = {
                role: "assistant",
                content: "✅ Site genere et sauvegarde ! Tu peux le publier.",
              };
              return copie;
            });
          } else {
            setMessages((prev) => {
              const copie = [...prev];
              copie[copie.length - 1] = {
                role: "assistant",
                content: "⚠️ Site genere mais sauvegarde echouee : " + saveData.error,
              };
              return copie;
            });
          }
        } catch (saveErr: any) {
          setMessages((prev) => {
            const copie = [...prev];
            copie[copie.length - 1] = {
              role: "assistant",
              content: "⚠️ Site genere mais erreur sauvegarde : " + (saveErr?.message || String(saveErr)),
            };
            return copie;
          });
        }
      } else {
        setMessages((prev) => {
          const copie = [...prev];
          copie[copie.length - 1] = {
            role: "assistant",
            content: "⚠️ Aucun site detecte. Reformule ta demande.",
          };
          return copie;
        });
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

  const handlePublish = async () => {
    if (!currentProject || publishing) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/projects/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: currentProject.id,
          published: !currentProject.published,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setCurrentProject({ ...currentProject, published: data.project.published });
      } else {
        alert("Erreur : " + data.error);
      }
    } catch (err: any) {
      alert("Erreur réseau : " + err.message);
    } finally {
      setPublishing(false);
    }
  };

  const copyPublicUrl = () => {
    if (!currentProject) return;
    const url = window.location.origin + "/s/" + currentProject.slug;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="h-screen flex overflow-hidden gap-3 p-3"
      style={{
        background:
          "radial-gradient(at 0% 0%, #fde68a 0%, transparent 50%), radial-gradient(at 100% 0%, #fdba74 0%, transparent 50%), radial-gradient(at 50% 100%, #fef3c7 0%, transparent 50%), #fef9f3",
      }}
    >
      {/* PANNEAU GAUCHE */}
      <div className="w-2/5 flex flex-col rounded-3xl bg-white shadow-[0_8px_40px_rgba(251,146,60,0.15)] overflow-hidden">
        <div className="p-5 flex items-center gap-3 flex-shrink-0 border-b border-orange-100">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="font-black tracking-widest text-sm text-zinc-900">BUILDER</h1>
            <p className="text-[10px] text-zinc-500">Barry AI Studio</p>
          </div>
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-all"
            title="Effacer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-orange-50/30">
          {messages.map((msg, i) => (
            <div key={i} className="flex gap-2">
              <div className={
                "w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black " +
                (msg.role === "user"
                  ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "bg-orange-100 text-orange-600")
              }>
                {msg.role === "user" ? "M" : "B"}
              </div>
              <div className={
                "flex-1 p-3 rounded-2xl text-xs leading-relaxed " +
                (msg.role === "user"
                  ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "bg-white border border-orange-100 text-zinc-700 shadow-sm")
              }>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        <div className="p-4 flex-shrink-0 border-t border-orange-100">
          <div className="flex gap-2 bg-orange-50/50 rounded-2xl p-2 border border-orange-100 focus-within:border-orange-300 focus-within:bg-white transition-all">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Decris ce que tu veux creer..."
              disabled={loading}
              className="flex-1 bg-transparent px-3 py-2 text-xs outline-none placeholder-zinc-400 text-zinc-900"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 disabled:opacity-50 text-white font-bold rounded-xl px-4 py-2 text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/30 transition-all"
            >
              <Send className="w-3 h-3" />
              Generer
            </button>
          </div>
        </div>
      </div>

      {/* PANNEAU DROIT */}
      <div className="w-3/5 flex flex-col rounded-3xl bg-white shadow-[0_8px_40px_rgba(251,146,60,0.15)] overflow-hidden">
        <div className="h-12 flex items-center px-5 gap-3 flex-shrink-0 border-b border-orange-100 bg-white">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-300" />
            <div className="w-3 h-3 rounded-full bg-yellow-300" />
            <div className="w-3 h-3 rounded-full bg-green-300" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 ml-2">
            <Code2 className="w-3 h-3" />
            Apercu en direct
          </div>

          {currentProject ? (
            <div className="ml-auto flex items-center gap-2">
              {currentProject.published && (
                <button
                  onClick={copyPublicUrl}
                  className="flex items-center gap-1 text-xs text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition-all font-medium"
                >
                  {copied ? "✅ Copié !" : "🔗 Copier le lien"}
                </button>
              )}
              <button
                onClick={handlePublish}
                disabled={publishing}
                className={
                  "flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl transition-all font-bold " +
                  (currentProject.published
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-300 hover:to-orange-400")
                }
              >
                {publishing ? "⏳..." : currentProject.published ? "🌐 Publié" : "🚀 Publier"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setKey((k) => k + 1)}
              className="ml-auto flex items-center gap-1 text-xs text-orange-500 hover:bg-orange-50 px-3 py-1.5 rounded-xl transition-all font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              Recharger
            </button>
          )}
        </div>

        <div className="flex-1 bg-white">
          <iframe
            key={key}
            srcDoc={html}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-modals allow-forms"
            title="Apercu"
          />
        </div>
      </div>

      {/* MODALE */}
      {showCustomize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 p-8 rounded-3xl bg-white shadow-[0_20px_80px_rgba(251,146,60,0.25)] overflow-hidden">
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-yellow-200 via-orange-200 to-amber-100 blur-[110px] opacity-60" />
            <button
              onClick={() => setShowCustomize(false)}
              className="absolute top-5 right-5 z-10 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl p-1.5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 mb-4 shadow-xl shadow-orange-500/30">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black mb-2 text-zinc-900">
                  Personnalise ta <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">boutique</span>
                </h2>
                <p className="text-zinc-500 text-sm">Cree une boutique 100% unique</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-zinc-800 font-bold mb-2">🏷️ Nom de ta boutique</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Ex: SneakerKing, TechStore..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-zinc-900 outline-none focus:border-orange-300 focus:bg-white focus:shadow-md focus:shadow-orange-500/10 transition-all placeholder-zinc-400"
                  autoFocus
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-zinc-800 font-bold mb-3">🎨 Couleur principale</label>
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c.id)}
                      className={
                        "p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 " +
                        (selectedColor === c.id
                          ? "border-orange-300 bg-orange-50/70 scale-105 shadow-md shadow-orange-500/15"
                          : "border-zinc-100 hover:border-orange-200 bg-white")
                      }
                    >
                      <div
                        className="w-8 h-8 rounded-full shadow-md"
                        style={{ background: "linear-gradient(135deg, " + c.primary + ", " + c.secondary + ")" }}
                      />
                      <span className="text-[10px] text-zinc-600 text-center">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm text-zinc-800 font-bold mb-3">✨ Ambiance</label>
                <div className="grid grid-cols-2 gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMood(m.id)}
                      className={
                        "p-4 rounded-2xl border-2 transition-all text-left " +
                        (selectedMood === m.id
                          ? "border-orange-300 bg-orange-50/70 shadow-md shadow-orange-500/10"
                          : "border-zinc-100 hover:border-orange-200 bg-white")
                      }
                    >
                      <div className="font-bold text-zinc-900 text-sm mb-1">{m.name}</div>
                      <div className="text-[11px] text-zinc-500">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCustomize(false)}
                  className="flex-1 py-3 rounded-2xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCustomizeSubmit}
                  disabled={!storeName.trim()}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold hover:from-yellow-300 hover:to-orange-400 shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✨ Generer ma boutique
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}