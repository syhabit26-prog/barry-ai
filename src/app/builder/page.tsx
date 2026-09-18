"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send, Sparkles, Code2, RefreshCw, Palette, X, Trash2,
  Download, Rocket, Link2, Check, Globe, Loader2,
} from "lucide-react";
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
  body { margin:0; font-family:system-ui,sans-serif; background:#fafafa; color:#1a1a1a;
         min-height:100vh; display:flex; flex-direction:column;
         align-items:center; justify-content:center; text-align:center; padding:40px; }
  .logo { font-size:56px; font-weight:900; letter-spacing:-2px;
          background:linear-gradient(135deg,#f59e0b,#f97316);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  p { color:#71717a; margin-top:12px; font-size:15px; }
</style>
</head>
<body>
  <div class="logo">BARRY AI</div>
  <p>Décris ce que tu veux créer dans le chat</p>
</body>
</html>`;

const MESSAGE_INITIAL: Message = {
  role: "assistant",
  content: "Bonjour ! Je suis BARRY AI.\n\nDécris ce que tu veux créer :\n\n• Une boutique e-commerce\n• Un site web\n• Un jeu\n• Un portfolio\n• Une application",
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
    setMessages((prev) => [...prev, { role: "assistant", content: "⏳ Génération en cours..." }]);

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
                content: "✅ Site généré et sauvegardé ! Tu peux le publier ou le télécharger.",
              };
              return copie;
            });
          } else {
            setMessages((prev) => {
              const copie = [...prev];
              copie[copie.length - 1] = {
                role: "assistant",
                content: "✅ Site généré ! (Sauvegarde cloud indisponible)",
              };
              return copie;
            });
          }
        } catch {
          setMessages((prev) => {
            const copie = [...prev];
            copie[copie.length - 1] = {
              role: "assistant",
              content: "✅ Site généré ! Tu peux le télécharger.",
            };
            return copie;
          });
        }
      } else {
        setMessages((prev) => {
          const copie = [...prev];
          copie[copie.length - 1] = {
            role: "assistant",
            content: "⚠️ Aucun site détecté. Reformule ta demande.",
          };
          return copie;
        });
      }
    } catch (err: any) {
      setMessages((prev) => {
        const copie = [...prev];
        copie[copie.length - 1] = { role: "assistant", content: "Erreur réseau : " + err.message };
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

  const downloadHtml = () => {
    const siteName = storeName?.trim() || "mon-site";
    const fileName = siteName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "mon-site";

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex bg-[#fafaf9]">

      {/* ═══ SIDEBAR : CHAT ═══ */}
      <aside className="w-[380px] flex flex-col bg-white border-r border-zinc-200/80">

        {/* Header */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-zinc-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-sm shadow-orange-500/30">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-[13px] font-semibold text-zinc-900 leading-tight">
              BARRY Builder
            </h1>
            <p className="text-[11px] text-zinc-400">IA générative</p>
          </div>
          <button
            onClick={handleClear}
            className="w-8 h-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors"
            title="Effacer la conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div
                className={
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed " +
                  (msg.role === "user"
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-800")
                }
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-100">
          <div className="flex items-end gap-2 bg-zinc-50 rounded-2xl border border-zinc-200 focus-within:border-zinc-900 focus-within:bg-white transition-all p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Décris ton projet..."
              disabled={loading}
              rows={1}
              className="flex-1 bg-transparent px-2 py-1.5 text-[13px] outline-none resize-none placeholder-zinc-400 text-zinc-900"
              style={{ maxHeight: "120px" }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 text-white" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2 text-center">
            Entrée pour envoyer · Maj+Entrée pour nouvelle ligne
          </p>
        </div>
      </aside>

      {/* ═══ ZONE PRINCIPALE : APERÇU ═══ */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Toolbar */}
        <header className="h-16 px-6 flex items-center gap-3 border-b border-zinc-200/80 bg-white">

          {/* Indicateur d'aperçu */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[12px] font-medium text-zinc-700">Aperçu en direct</span>
          </div>

          <div className="flex-1" />

          {/* Boutons actions */}
          <div className="flex items-center gap-2">

            {/* Télécharger */}
            <button
              onClick={downloadHtml}
              className="h-9 px-3.5 rounded-lg bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-[12px] font-medium flex items-center gap-2 transition-all"
              title="Télécharger le fichier HTML"
            >
              <Download className="w-3.5 h-3.5" />
              Télécharger
            </button>

            {/* Recharger */}
            <button
              onClick={() => setKey((k) => k + 1)}
              className="w-9 h-9 rounded-lg bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 flex items-center justify-center text-zinc-500 transition-all"
              title="Recharger l'aperçu"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Copier le lien */}
            {currentProject?.published && (
              <button
                onClick={copyPublicUrl}
                className="h-9 px-3.5 rounded-lg bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-[12px] font-medium flex items-center gap-2 transition-all"
                title="Copier l'URL publique"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Copié
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5" />
                    Copier le lien
                  </>
                )}
              </button>
            )}

            {/* Publier */}
            <button
              onClick={handlePublish}
              disabled={publishing || !currentProject}
              className={
                "h-9 px-4 rounded-lg text-[12px] font-semibold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed " +
                (currentProject?.published
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-zinc-900 hover:bg-zinc-800 text-white")
              }
              title={currentProject ? "Publier le site" : "Génère d'abord un site"}
            >
              {publishing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : currentProject?.published ? (
                <Globe className="w-3.5 h-3.5" />
              ) : (
                <Rocket className="w-3.5 h-3.5" />
              )}
              {currentProject?.published ? "Publié" : "Publier"}
            </button>
          </div>
        </header>

        {/* Aperçu */}
        <div className="flex-1 bg-zinc-100 p-6 overflow-hidden">
          <div className="w-full h-full rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden border border-zinc-200/50">
            <iframe
              key={key}
              srcDoc={html}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-modals allow-forms"
              title="Aperçu du site"
            />
          </div>
        </div>
      </main>

      {/* ═══ MODALE : Personnalisation boutique ═══ */}
      {showCustomize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg my-8 p-8 rounded-3xl bg-white shadow-2xl">
            <button
              onClick={() => setShowCustomize(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 mb-4">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-1">
                Personnalise ta boutique
              </h2>
              <p className="text-sm text-zinc-500">
                Crée une boutique unique selon tes goûts
              </p>
            </div>

            <div className="space-y-6">

              <div>
                <label className="block text-[12px] font-semibold text-zinc-700 mb-2">
                  Nom de la boutique
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Ex: SneakerKing, TechStore..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition-all placeholder-zinc-400"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-zinc-700 mb-3">
                  Couleur principale
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c.id)}
                      className={
                        "p-2.5 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 " +
                        (selectedColor === c.id
                          ? "border-zinc-900 bg-zinc-50"
                          : "border-zinc-100 hover:border-zinc-300")
                      }
                    >
                      <div
                        className="w-7 h-7 rounded-full"
                        style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }}
                      />
                      <span className="text-[10px] text-zinc-600">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-zinc-700 mb-3">
                  Ambiance
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMood(m.id)}
                      className={
                        "p-3 rounded-xl border-2 transition-all text-left " +
                        (selectedMood === m.id
                          ? "border-zinc-900 bg-zinc-50"
                          : "border-zinc-100 hover:border-zinc-300")
                      }
                    >
                      <div className="font-semibold text-zinc-900 text-[13px]">{m.name}</div>
                      <div className="text-[11px] text-zinc-500">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCustomize(false)}
                  className="flex-1 py-3 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-[13px] font-medium transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCustomizeSubmit}
                  disabled={!storeName.trim()}
                  className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-[13px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Générer la boutique
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}