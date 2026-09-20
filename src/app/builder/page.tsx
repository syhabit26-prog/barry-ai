"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send, Sparkles, RefreshCw, X, Trash2,
  Download, Rocket, Link2, Check, Globe, Loader2,
  Paperclip, Image as ImageIcon,
} from "lucide-react";
import { loadChat, saveChat, clearChat, PAGE_KEYS, type ChatMessage } from "@/lib/chatHistory";

type Message = ChatMessage & { images?: string[] };

type ProjectState = {
  type: "site" | "boutique" | "jeu" | "app" | "portfolio" | null;
  name: string;
  description: string;
  color: string;
  mood: string;
  ready: boolean;
};

const COLORS = ["rouge","bleu","vert","jaune","violet","orange","rose","noir","blanc","cyan"];
const MOODS = ["sombre","moderne","élégant","minimaliste","vibrant","vintage","luxe","rétro"];

function extractHtml(text: string): string {
  if (!text) return "";
  let cleaned = text.trim();

  // Retire ```html ... ```
  const match = cleaned.match(/```html\s*\n([\s\S]*?)```/i);
  if (match) return match[1].trim();

  const match2 = cleaned.match(/```\s*\n([\s\S]*?)```/);
  if (match2) return match2[1].trim();

  // Sinon cherche <!DOCTYPE ou <html
  const i1 = cleaned.indexOf("<!DOCTYPE");
  const i2 = cleaned.indexOf("<html");
  if (i1 !== -1) return cleaned.slice(i1).trim();
  if (i2 !== -1) return cleaned.slice(i2).trim();

  return cleaned;
}

const HTML_INITIAL = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>BARRY AI</title>
<style>
  body { margin:0; font-family:Inter,system-ui,sans-serif; background:#0a0a0a; color:#fff;
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
  content: "Bonjour ! Décris ton projet.\n\nExemple : \"crée un site pour un restaurant italien nommé Trattoria Roma, rouge et vibrant\"\n\n💡 Tu peux aussi ajouter des photos depuis ton PC avec 📎",
};

export default function BuilderPage() {
  const [messages, setMessages] = useState<Message[]>([MESSAGE_INITIAL]);
  const [input, setInput] = useState("");
  const [html, setHtml] = useState(HTML_INITIAL);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentProject, setCurrentProject] = useState<{ id: string; slug: string; published: boolean } | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  const [projectState, setProjectState] = useState<ProjectState>({
    type: null, name: "", description: "", color: "", mood: "", ready: false,
  });

  const [pendingImages, setPendingImages] = useState<string[]>([]);

  useEffect(() => {
    const saved = loadChat(PAGE_KEYS.BUILDER);
    if (saved.length > 0) setMessages(saved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && messages.length > 0) {
      saveChat(PAGE_KEYS.BUILDER, messages.map((m) => ({ role: m.role, content: m.content })));
    }
  }, [messages, mounted]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClear = () => {
    if (confirm("Effacer toute la conversation ?")) {
      clearChat(PAGE_KEYS.BUILDER);
      setMessages([MESSAGE_INITIAL]);
      setCurrentProject(null);
      setPendingImages([]);
      setProjectState({ type: null, name: "", description: "", color: "", mood: "", ready: false });
    }
  };

  // ═══ UPLOAD D'IMAGES ═══
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith("image/")) {
        alert(`"${file.name}" n'est pas une image`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`"${file.name}" est trop lourd (max 5 MB)`);
        continue;
      }

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      newImages.push(base64);
    }

    setPendingImages((prev) => [...prev, ...newImages]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setPendingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const extractInfo = (text: string) => {
    const lower = text.toLowerCase();

    let type: ProjectState["type"] = null;
    if (/boutique|shop|e-?commerce|dropshipping|vendre|magasin/.test(lower)) type = "boutique";
    else if (/jeu|game|snake|pong|tetris|arcade/.test(lower)) type = "jeu";
    else if (/app|application|calculatrice|todo|outil/.test(lower)) type = "app";
    else if (/portfolio|photographe|designer/.test(lower)) type = "portfolio";
    else if (/site|page|vitrine|landing|web/.test(lower)) type = "site";

    let color = "";
    for (const c of COLORS) {
      if (lower.includes(c)) { color = c; break; }
    }

    let mood = "";
    for (const m of MOODS) {
      if (lower.includes(m)) { mood = m; break; }
    }

    let name = "";
    const nameMatch = text.match(/(?:nommé|nommée|appelé|appelée|qui s'appelle|pour|de)\s+([A-ZÀ-Ý][a-zA-ZÀ-ÿ0-9\s'-]{2,30})/);
    if (nameMatch) name = nameMatch[1].trim();

    if (!name) {
      const cleaned = text
        .replace(/cree|creer|moi|un|une|des|de|du|d|la|le|les|site|web|page|jeu|game|app|application|boutique|pour|avec|sur|fais|faire|genere|générer|je|veux|souhaite|nommé|appelé|qui|s'appelle/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
      const words = cleaned.split(" ").filter((w) => w.length > 2 && !COLORS.includes(w.toLowerCase()) && !MOODS.includes(w.toLowerCase()));
      if (words.length > 0) {
        name = words.slice(0, 3).join(" ");
        name = name.charAt(0).toUpperCase() + name.slice(1);
      }
    }

    return { type, color, mood, name };
  };

  const handleSend = async () => {
    const texte = input.trim();
    if (!texte && pendingImages.length === 0) return;
    if (loading) return;

    // ═══════════════════════════════════════════════════════════
    // CAS 1 : UPLOAD D'IMAGES
    // ═══════════════════════════════════════════════════════════
    if (pendingImages.length > 0) {
      const userMsg: Message = {
        role: "user",
        content: texte || `Ajoute ces ${pendingImages.length} photo(s) au site`,
        images: pendingImages,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);
      setMessages((prev) => [...prev, { role: "assistant", content: "Ajout des photos..." }]);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "modify",
            currentHtml: html,
            instruction: texte || "ajoute ces photos",
            uploadedImages: pendingImages,
          }),
        });

        const data = await res.json();

        if (!data.ok) {
          setMessages((prev) => {
            const copie = [...prev];
            copie[copie.length - 1] = { role: "assistant", content: "Erreur : " + data.error };
            return copie;
          });
          setLoading(false);
          return;
        }

        const newHtml = extractHtml(data.text);
        const isValidHtml = newHtml.includes("<html") && newHtml.includes("<body");

        if (newHtml && newHtml.length > 100 && isValidHtml) {
          setHtml(newHtml);
          setKey((k) => k + 1);
          setMessages((prev) => {
            const copie = [...prev];
            copie[copie.length - 1] = { role: "assistant", content: `✅ ${pendingImages.length} photo(s) ajoutée(s) !` };
            return copie;
          });
        } else {
          setMessages((prev) => {
            const copie = [...prev];
            copie[copie.length - 1] = { role: "assistant", content: "❌ Erreur d'ajout. Réessaie." };
            return copie;
          });
        }
      } catch (err: any) {
        setMessages((prev) => {
          const copie = [...prev];
          copie[copie.length - 1] = { role: "assistant", content: "Erreur : " + err.message };
          return copie;
        });
      } finally {
        setPendingImages([]);
        setLoading(false);
      }
      return;
    }

    // ═══════════════════════════════════════════════════════════
    // CAS 2 : TEXTE (création OU modification)
    // ═══════════════════════════════════════════════════════════
    const userMsg: Message = { role: "user", content: texte };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Détection : c'est une modification ?
    const isModification = /ajoute|ajouter|change|changer|modifie|modifier|enlève|enlever|remplace|remplacer|mets|mettre|améliore|améliorer|corrige|corriger|retire|retirer|photo|image|3d|modèle|couleur|titre|texte|bouton|section/i.test(texte);

    // Si un site existe déjà ET c'est une modification → MODIFY
    if (html && html.length > 200 && isModification && !projectState.ready) {
      setLoading(true);
      setMessages((prev) => [...prev, { role: "assistant", content: "Modification en cours..." }]);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "modify",
            currentHtml: html,
            instruction: texte,
          }),
        });

        const data = await res.json();

        if (!data.ok) {
          setMessages((prev) => {
            const copie = [...prev];
            copie[copie.length - 1] = { role: "assistant", content: "Erreur : " + data.error };
            return copie;
          });
          setLoading(false);
          return;
        }

        const newHtml = extractHtml(data.text);
        const isValidHtml = newHtml.includes("<html") && newHtml.includes("<body");

        if (newHtml && newHtml.length > 100 && isValidHtml) {
          setHtml(newHtml);
          setKey((k) => k + 1);
          setMessages((prev) => {
            const copie = [...prev];
            copie[copie.length - 1] = { role: "assistant", content: "✅ Modification appliquée !" };
            return copie;
          });
        } else {
          console.warn("HTML invalide reçu:", newHtml.slice(0, 200));
          setMessages((prev) => {
            const copie = [...prev];
            copie[copie.length - 1] = { role: "assistant", content: "❌ L'IA n'a pas renvoyé de HTML valide." };
            return copie;
          });
        }
      } catch (err: any) {
        setMessages((prev) => {
          const copie = [...prev];
          copie[copie.length - 1] = { role: "assistant", content: "Erreur : " + err.message };
          return copie;
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    // ═══════════════════════════════════════════════════════════
    // CAS 3 : CRÉATION NORMALE
    // ═══════════════════════════════════════════════════════════
    const info = extractInfo(texte);
    const newState: ProjectState = {
      type: info.type || projectState.type,
      name: info.name || projectState.name,
      description: projectState.description ? projectState.description + " — " + texte : texte,
      color: info.color || projectState.color,
      mood: info.mood || projectState.mood,
      ready: false,
    };

    setProjectState(newState);

    if (newState.type && newState.name && newState.color && newState.mood) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Parfait ! Je génère ${newState.name}...` },
      ]);
      await generateFinalSite(newState);
      return;
    }

    let question = "";
    if (!newState.type) question = "C'est quoi le type ? (site, boutique, jeu, app, portfolio)";
    else if (!newState.name) question = "Quel nom ?";
    else if (!newState.color) question = "Quelle couleur ? (rouge, bleu, vert, jaune, violet, orange, rose, noir)";
    else if (!newState.mood) question = "Quelle ambiance ? (sombre, moderne, élégant, minimaliste, vibrant, vintage)";

    setMessages((prev) => [...prev, { role: "assistant", content: question }]);
  };

  const generateFinalSite = async (state: ProjectState) => {
    setLoading(true);
    let cleanName = state.name.trim();
    if (cleanName.length > 30) cleanName = cleanName.slice(0, 30).trim();

    let prompt = `Crée `;
    if (state.type === "boutique") prompt += `une boutique e-commerce nommée "${cleanName}". `;
    else if (state.type === "jeu") prompt += `un jeu de type "${cleanName}". `;
    else if (state.type === "app") prompt += `une application : "${cleanName}". `;
    else if (state.type === "portfolio") prompt += `un portfolio pour "${cleanName}". `;
    else prompt += `un site web nommé "${cleanName}". `;

    if (state.color) prompt += `Couleur principale : ${state.color}. `;
    if (state.mood) prompt += `Ambiance : ${state.mood}. `;
    if (state.description) prompt += `Contexte : ${state.description}.`;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          provider: "groq",
          mode: state.type === "boutique" ? "dropshipping" : undefined,
          customization: state.type === "boutique" ? {
            storeName: cleanName,
            color: { primary: state.color, secondary: state.color },
            mood: { id: state.mood, name: state.mood },
          } : {
            name: cleanName,
            color: state.color,
            mood: state.mood,
          },
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        setMessages((prev) => {
          const copie = [...prev];
          copie[copie.length - 1] = { role: "assistant", content: "Erreur : " + data.error };
          return copie;
        });
        setLoading(false);
        return;
      }

      if (data.jobId) {
        const jobId = data.jobId;
        let attempts = 0;
        const maxAttempts = 150;

        const interval = setInterval(async () => {
          attempts++;
          if (attempts > maxAttempts) {
            clearInterval(interval);
            setMessages((prev) => {
              const copie = [...prev];
              copie[copie.length - 1] = { role: "assistant", content: "Timeout." };
              return copie;
            });
            setLoading(false);
            return;
          }

          try {
            const jobRes = await fetch(`/api/jobs/${jobId}`);
            const jobData = await jobRes.json();
            if (!jobData.ok) { clearInterval(interval); setLoading(false); return; }

            const job = jobData.job;

            setMessages((prev) => {
              const copie = [...prev];
              copie[copie.length - 1] = { role: "assistant", content: `Génération... ${job.progress}%` };
              return copie;
            });

            if (job.status === "done") {
              clearInterval(interval);
              const htmlExtrait = extractHtml(job.result?.html || "");
              setHtml(htmlExtrait);
              setKey((k) => k + 1);
              if (job.result?.projectId) {
                setCurrentProject({ id: job.result.projectId, slug: job.result.slug, published: false });
              }
              setMessages((prev) => {
                const copie = [...prev];
                copie[copie.length - 1] = { role: "assistant", content: `C'est prêt ! ${state.name} est généré.` };
                return copie;
              });
              setLoading(false);
            } else if (job.status === "error") {
              clearInterval(interval);
              setMessages((prev) => {
                const copie = [...prev];
                copie[copie.length - 1] = { role: "assistant", content: "Erreur : " + (job.error || "inconnue") };
                return copie;
              });
              setLoading(false);
            }
          } catch {
            clearInterval(interval);
            setLoading(false);
          }
        }, 2000);
        return;
      }

      const htmlExtrait = extractHtml(data.text);
      if (htmlExtrait && htmlExtrait.length > 50) {
        setHtml(htmlExtrait);
        setKey((k) => k + 1);
        if (data.projectId) {
          setCurrentProject({ id: data.projectId, slug: data.slug, published: false });
        }
        setMessages((prev) => {
          const copie = [...prev];
          copie[copie.length - 1] = { role: "assistant", content: `${state.name} est généré !` };
          return copie;
        });
      }
      setLoading(false);
    } catch (err: any) {
      setMessages((prev) => {
        const copie = [...prev];
        copie[copie.length - 1] = { role: "assistant", content: "Erreur réseau : " + err.message };
        return copie;
      });
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!currentProject || publishing) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/projects/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: currentProject.id, published: !currentProject.published }),
      });
      const data = await res.json();
      if (data.ok) setCurrentProject({ ...currentProject, published: data.project.published });
      else alert("Erreur : " + data.error);
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
    const siteName = projectState.name?.trim() || "mon-site";
    const fileName = siteName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50) || "mon-site";

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
    <div className="h-screen flex bg-white">
      <aside className="w-[420px] flex flex-col bg-white border-r border-zinc-200/80">
        <div className="h-14 px-5 flex items-center gap-3 border-b border-zinc-200/80">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-[14px] font-semibold text-zinc-900 tracking-tight">Builder</h1>
          </div>
          <button onClick={handleClear} className="w-8 h-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i}>
              {msg.role === "user" ? (
                <div className="px-5 py-4 flex justify-end">
                  <div className="max-w-[85%]">
                    <div className="bg-zinc-100 rounded-3xl px-5 py-2.5 text-[15px] leading-[1.7] text-zinc-900 whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                    {msg.images && msg.images.length > 0 && (
                      <div className="mt-2 flex gap-2 justify-end flex-wrap">
                        {msg.images.map((img, idx) => (
                          <img key={idx} src={img} alt="" className="w-20 h-20 object-cover rounded-xl border border-zinc-200" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="px-5 py-4 flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] leading-[1.75] text-zinc-800 whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                    {loading && i === messages.length - 1 && msg.role === "assistant" && !msg.content && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {pendingImages.length > 0 && (
          <div className="px-4 py-3 border-t border-zinc-200/80 bg-zinc-50">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[11px] font-medium text-zinc-600">
                {pendingImages.length} photo(s) prête(s)
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {pendingImages.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt="" className="w-16 h-16 object-cover rounded-xl border border-zinc-200" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-zinc-200/80">
          <div className="flex items-end gap-2 bg-white rounded-3xl border border-zinc-200 shadow-[0_2px_15px_rgba(0,0,0,0.04)] focus-within:border-zinc-400 transition-all p-1.5">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-9 h-9 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-800 transition-colors flex-shrink-0"
              title="Ajouter des photos"
              disabled={loading}
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={pendingImages.length > 0 ? "Ajoute un message (optionnel)..." : "Décris ton projet..."}
              disabled={loading}
              rows={1}
              className="flex-1 bg-transparent px-3 py-2 text-[15px] outline-none resize-none placeholder-zinc-400 text-zinc-900 leading-[1.6]"
              style={{ maxHeight: "120px" }}
            />
            <button
              onClick={handleSend}
              disabled={loading || (!input.trim() && pendingImages.length === 0)}
              className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 px-5 flex items-center gap-2 border-b border-zinc-200/80 bg-white overflow-x-auto">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[13px] font-medium text-zinc-700">Aperçu</span>
          </div>
          <div className="flex-1 min-w-2" />
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={downloadHtml} className="h-8 px-3 rounded-lg bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-[12px] font-medium flex items-center gap-1.5 transition-all whitespace-nowrap">
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Télécharger</span>
            </button>
            <button onClick={() => setKey((k) => k + 1)} className="w-8 h-8 rounded-lg bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 flex items-center justify-center text-zinc-500 transition-all flex-shrink-0">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            {currentProject?.published && (
              <button onClick={copyPublicUrl} className="h-8 px-3 rounded-lg bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-[12px] font-medium flex items-center gap-1.5 transition-all whitespace-nowrap">
                {copied ? <><Check className="w-3.5 h-3.5 text-emerald-600" />Copié</> : <><Link2 className="w-3.5 h-3.5" />Lien</>}
              </button>
            )}
            <button
              onClick={handlePublish}
              disabled={publishing || !currentProject}
              className={
                "h-8 px-4 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap " +
                (currentProject?.published ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-zinc-900 hover:bg-zinc-800 text-white")
              }
            >
              {publishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : currentProject?.published ? <Globe className="w-3.5 h-3.5" /> : <Rocket className="w-3.5 h-3.5" />}
              {currentProject?.published ? "Publié" : "Publier"}
            </button>
          </div>
        </header>

        <div className="flex-1 bg-zinc-50 p-5 overflow-hidden">
          <div className="w-full h-full rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-zinc-200/60">
            <iframe
              key={key}
              srcDoc={html}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups allow-popups-to-escape-sandbox"
              title="Aperçu"
            />
          </div>
        </div>
      </main>
    </div>
  );
}