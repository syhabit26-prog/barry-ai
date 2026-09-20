"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send, Sparkles, RefreshCw, Trash2, Download, Rocket,
  Link2, Check, Globe, Loader2, Paperclip, Palette, X, Code2, Star, Share2
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  images?: string[];
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
  <p>Décris ce que tu veux créer dans le chat !</p>
</body>
</html>`;

const MSG_INITIAL: Message = {
  role: "assistant",
  content: "Bonjour ! Décris ton projet en une phrase.\n\nExemples :\n• Crée une boutique de bijoux\n• Crée un site pour un restaurant\n• Crée un jeu snake\n\nOu clique sur 📎 pour ajouter des photos.",
};

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
  return "";
}

export default function BuilderPage() {
  const [messages, setMessages] = useState<Message[]>([MSG_INITIAL]);
  const [input, setInput] = useState("");
  const [html, setHtml] = useState(HTML_INITIAL);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [project, setProject] = useState<{ id: string; slug: string; published: boolean } | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pendingImages, setPendingImages] = useState<string[]>([]);

  const [showCustomize, setShowCustomize] = useState(false);
  const [storePrompt, setStorePrompt] = useState("");
  const [storeName, setStoreName] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");
  const [selectedMood, setSelectedMood] = useState("dark-luxury");

  // ═══ CHARGEMENT HISTORIQUE ═══
  useEffect(() => {
    try {
      const saved = localStorage.getItem("barry_builder_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {}
    setMounted(true);
  }, []);

  // ═══ SAUVEGARDE HISTORIQUE ═══
  useEffect(() => {
    if (mounted && messages.length > 0) {
      try {
        localStorage.setItem("barry_builder_history", JSON.stringify(messages.slice(-50)));
      } catch {}
    }
  }, [messages, mounted]);

  // ═══ AUTO SCROLL ═══
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ═══ RESET ═══
  const reset = () => {
    if (!confirm("Effacer la conversation ?")) return;
    localStorage.removeItem("barry_builder_history");
    setMessages([MSG_INITIAL]);
    setProject(null);
    setHtml(HTML_INITIAL);
    setPendingImages([]);
  };

  // ═══ UPLOAD PHOTOS ═══
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const imgs: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (!f.type.startsWith("image/")) continue;
      if (f.size > 5 * 1024 * 1024) {
        alert(`${f.name} trop lourd (max 5 Mo)`);
        continue;
      }
      const b64 = await new Promise<string>((res) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.readAsDataURL(f);
      });
      imgs.push(b64);
    }
    setPendingImages((p) => [...p, ...imgs]);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ═══ ENVOI MESSAGE ═══
  const send = async () => {
    const text = input.trim();
    if ((!text && pendingImages.length === 0) || loading) return;

    // ─── CAS 1 : Photos ajoutées ───
    if (pendingImages.length > 0) {
      setMessages((p) => [...p, { role: "user", content: text || `Ajoute ces ${pendingImages.length} photo(s)`, images: pendingImages }]);
      setInput("");
      setLoading(true);
      setMessages((p) => [...p, { role: "assistant", content: "⏳ Ajout en cours..." }]);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "modify",
            currentHtml: html,
            instruction: text || "ajoute ces photos",
            uploadedImages: pendingImages,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          const newHtml = extractHtml(data.text);
          if (newHtml.length > 100) {
            setHtml(newHtml);
            setKey((k) => k + 1);
          }
        }
        setMessages((p) => {
          const c = [...p];
          c[c.length - 1] = { role: "assistant", content: `✅ ${pendingImages.length} photo(s) ajoutée(s)` };
          return c;
        });
      } catch (err: any) {
        setMessages((p) => {
          const c = [...p];
          c[c.length - 1] = { role: "assistant", content: "❌ Erreur : " + err.message };
          return c;
        });
      } finally {
        setPendingImages([]);
        setLoading(false);
      }
      return;
    }

    // ─── CAS 2 : Détection boutique ───
    const lower = text.toLowerCase();
    const isShop = /boutique|shop|e-?commerce|dropshipping|store|magasin|vendre|bijoux|sneakers|montres|parfums|vêtements|vetements|mode|beauté|beaute|tech/i.test(lower);

    if (isShop) {
      setStorePrompt(text);
      setStoreName("");
      setShowCustomize(true);
      setInput("");
      return;
    }

    // ─── CAS 3 : Site normal ───
    await generateSite(text, null);
  };

  // ═══ GÉNÉRATION SITE ═══
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

      if (isJson) {
        const data = await res.json();
        if (!data.ok) {
          setMessages((prev) => {
            const c = [...prev];
            c[c.length - 1] = { role: "assistant", content: "❌ " + data.error };
            return c;
          });
          setLoading(false);
          return;
        }
        htmlExtrait = extractHtml(data.text);
        if (data.projectId) {
          setProject({ id: data.projectId, slug: data.slug, published: false });
        }
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
          const c = [...prev];
          c[c.length - 1] = { role: "assistant", content: "✅ Site généré ! Regarde l'aperçu." };
          return c;
        });

        // Sauvegarde automatique
        try {
          const saveRes = await fetch("/api/projects/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: customization?.storeName || "Mon site",
              prompt: texte,
              html: htmlExtrait,
              userId: null,
            }),
          });
          const saveData = await saveRes.json();
          if (saveData.ok && saveData.project) {
            setProject({
              id: saveData.project.id,
              slug: saveData.project.slug,
              published: false,
            });
            localStorage.setItem("barry_current_project", saveData.project.id);
          }
        } catch (e) {
          console.warn("Save err:", e);
        }
      } else {
        setMessages((prev) => {
          const c = [...prev];
          c[c.length - 1] = { role: "assistant", content: "⚠️ Aucun site détecté. Reformule." };
          return c;
        });
      }
    } catch (err: any) {
      setMessages((prev) => {
        const c = [...prev];
        c[c.length - 1] = { role: "assistant", content: "❌ Erreur : " + err.message };
        return c;
      });
    } finally {
      setLoading(false);
    }
  };

  // ═══ PERSONNALISATION BOUTIQUE ═══
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

  // ═══ PUBLIER / DÉPUBLIER ═══
  const publish = async () => {
    if (!project || publishing) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/projects/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, published: !project.published }),
      });
      const data = await res.json();
      if (data.ok) {
        setProject({ ...project, published: data.project.published });
        localStorage.setItem("barry_current_project", project.id);
        console.log(data.project.published ? "🚀 Site publié" : "🔒 Site dépublié");
      } else {
        alert("Erreur : " + (data.error || "inconnue"));
      }
    } catch (err: any) {
      alert("Erreur réseau : " + err.message);
    } finally {
      setPublishing(false);
    }
  };

  // ═══ COPIER URL ═══
  const copyUrl = () => {
    if (!project) return;
    const url = window.location.origin + "/s/" + project.slug;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ═══ TÉLÉCHARGER ═══
  const download = () => {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mon-site.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex overflow-hidden gap-3 p-3"
      style={{
        background: "radial-gradient(at 0% 0%, #fde68a 0%, transparent 50%), radial-gradient(at 100% 0%, #fdba74 0%, transparent 50%), radial-gradient(at 50% 100%, #fef3c7 0%, transparent 50%), #fef9f3",
      }}>

      {/* ═══ PANNEAU GAUCHE : CHAT ═══ */}
      <aside className="w-[440px] flex flex-col rounded-3xl bg-white shadow-[0_8px_40px_rgba(251,146,60,0.15)] overflow-hidden">

        <div className="p-5 flex items-center gap-3 flex-shrink-0 border-b border-orange-100">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="font-black tracking-widest text-sm text-zinc-900">BUILDER</h1>
            <p className="text-[10px] text-zinc-500">Barry AI Studio</p>
          </div>
          <button onClick={reset} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-orange-50/30">
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === "user" ? "flex justify-end" : "flex gap-2"}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div className="max-w-[85%]">
                <div className={
                  "rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap " +
                  (msg.role === "user"
                    ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "bg-white text-zinc-800 border border-orange-100 shadow-sm")
                }>
                  {msg.content}
                </div>
                {msg.images && msg.images.length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap justify-end">
                    {msg.images.map((img, idx) => (
                      <img key={idx} src={img} className="w-20 h-20 object-cover rounded-lg border border-orange-200" alt="" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-1 px-12">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {pendingImages.length > 0 && (
          <div className="px-4 py-3 border-t border-orange-100 bg-orange-50">
            <p className="text-[11px] text-zinc-600 mb-2 font-semibold">{pendingImages.length} photo(s) en attente</p>
            <div className="flex gap-2 flex-wrap">
              {pendingImages.map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img} className="w-16 h-16 object-cover rounded-lg border border-orange-200" alt="" />
                  <button
                    onClick={() => setPendingImages((p) => p.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 flex-shrink-0 border-t border-orange-100">
          <div className="flex items-end gap-2 bg-orange-50/50 rounded-2xl p-2 border border-orange-100 focus-within:border-orange-300 focus-within:bg-white transition-all">
            <input type="file" ref={fileRef} accept="image/*" multiple onChange={handleFile} className="hidden" />
            <button onClick={() => fileRef.current?.click()} className="w-8 h-8 rounded-lg hover:bg-orange-100 flex items-center justify-center text-orange-500 transition-colors">
              <Paperclip className="w-4 h-4" />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Décris ton projet..."
              disabled={loading}
              rows={1}
              className="flex-1 bg-transparent px-2 py-1.5 text-[13px] outline-none resize-none text-zinc-900 placeholder-zinc-400"
              style={{ maxHeight: "120px" }}
            />
            <button
              onClick={send}
              disabled={loading || (!input.trim() && pendingImages.length === 0)}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl px-4 py-2 text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/30 transition-all"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Générer
            </button>
          </div>
        </div>
      </aside>

      {/* ═══ PANNEAU DROIT : APERÇU ═══ */}
      <main className="flex-1 flex flex-col rounded-3xl bg-white shadow-[0_8px_40px_rgba(251,146,60,0.15)] overflow-hidden min-w-0">

        <header className="h-12 flex items-center px-5 gap-3 flex-shrink-0 border-b border-orange-100 bg-white">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-300" />
            <div className="w-3 h-3 rounded-full bg-yellow-300" />
            <div className="w-3 h-3 rounded-full bg-green-300" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 ml-2">
            <Code2 className="w-3 h-3" />
            Aperçu en direct
          </div>
          <div className="flex-1" />

          <button
            onClick={download}
            className="h-8 px-3 rounded-lg border border-orange-100 text-[11px] text-zinc-700 hover:bg-orange-50 flex items-center gap-1.5 transition-colors font-medium"
          >
            <Download className="w-3.5 h-3.5" /> Télécharger
          </button>
          <button
            onClick={() => setKey((k) => k + 1)}
            className="w-8 h-8 rounded-lg border border-orange-100 flex items-center justify-center text-zinc-500 hover:bg-orange-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {project?.published && (
            <button
              onClick={copyUrl}
              className="h-8 px-3 rounded-lg border border-orange-100 text-[11px] text-zinc-700 flex items-center gap-1.5 hover:bg-orange-50 transition-colors font-medium"
            >
              {copied ? (
                <><Check className="w-3.5 h-3.5 text-emerald-600" /> Copié</>
              ) : (
                <><Link2 className="w-3.5 h-3.5" /> Copier le lien</>
              )}
            </button>
          )}

          <button
            onClick={publish}
            disabled={publishing || !project}
            className={
              "h-8 px-4 rounded-lg text-[11px] font-bold text-white flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all " +
              (project?.published
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 shadow-lg shadow-orange-500/30")
            }
          >
            {publishing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : project?.published ? (
              <Globe className="w-3.5 h-3.5" />
            ) : (
              <Rocket className="w-3.5 h-3.5" />
            )}
            {publishing ? "..." : project?.published ? "Publié" : "Publier"}
          </button>
        </header>

        <div className="flex-1 bg-white min-h-0">
          <BlobIframe html={html} iframeKey={key} />
        </div>
      </main>

      {/* ═══ MODALE PERSONNALISATION ═══ */}
      {showCustomize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4 overflow-y-auto">
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
                <p className="text-zinc-500 text-sm">
                  Crée une boutique 100% unique selon tes goûts
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-zinc-800 font-bold mb-2">🏷️ Nom de ta boutique</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Ex: SneakerKing, TechStore, Bijoux Chic..."
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
                      <div className="w-8 h-8 rounded-full shadow-md" style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }} />
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
                  className="flex-1 py-3 rounded-2xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-all font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCustomizeSubmit}
                  disabled={!storeName.trim()}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold hover:from-yellow-300 hover:to-orange-400 shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✨ Générer ma boutique
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ⭐ Iframe avec BLOB URL (vidéos + scripts + animations)
function BlobIframe({ html, iframeKey }: { html: string; iframeKey: number }) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    setUrl(blobUrl);
    console.log("🎬 BlobIframe:", html.length, "chars");
    return () => URL.revokeObjectURL(blobUrl);
  }, [html, iframeKey]);

  if (!url) return null;

  return (
    <iframe
      key={iframeKey}
      src={url}
      className="w-full h-full border-0"
      sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
      title="Aperçu"
    />
  );
}