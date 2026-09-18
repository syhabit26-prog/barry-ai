"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Compass, Sparkles, Target, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { loadChat, saveChat, clearChat, PAGE_KEYS, type ChatMessage } from "@/lib/chatHistory";

type Message = ChatMessage;

const QUESTIONS = [
  "🎯 Je veux changer de carrière",
  "💼 Aide-moi à préparer un entretien",
  "📚 Comment apprendre le développement web ?",
  "🚀 Je veux lancer mon business",
  "💰 Comment mieux gérer mon argent ?",
  "💪 Je manque de motivation",
];

const MESSAGE_INITIAL: Message = {
  role: "assistant",
  content:
    "Bonjour ! Je suis BARRY AI Coach 🧭\n\nJe suis là pour t'accompagner jusqu'à ta réussite :\n\n🎯 **Carrière** — trouver un job, préparer un entretien\n📚 **Apprentissage** — te former, évoluer\n🚀 **Entrepreneuriat** — créer ton business\n💰 **Finance perso** — budget, épargne\n💪 **Motivation** — retrouver l'élan\n\n**Quel est ton objectif principal en ce moment ?**",
};

export default function GuidePage() {
  const [messages, setMessages] = useState<Message[]>([MESSAGE_INITIAL]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Charger l'historique
  useEffect(() => {
    const saved = loadChat(PAGE_KEYS.COACH);
    if (saved.length > 0) setMessages(saved);
    setMounted(true);
  }, []);

  // Sauvegarder à chaque changement
  useEffect(() => {
    if (mounted && messages.length > 0) {
      saveChat(PAGE_KEYS.COACH, messages);
    }
  }, [messages, mounted]);

  // Scroll auto
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleClear = () => {
    if (confirm("Effacer toute la conversation ?")) {
      clearChat(PAGE_KEYS.COACH);
      setMessages([MESSAGE_INITIAL]);
    }
  };

  const handleSend = async (customText?: string) => {
    const texte = customText || input.trim();
    if (!texte || loading) return;

    const nouveauxMessages: Message[] = [
      ...messages,
      { role: "user", content: texte },
    ];

    setMessages(nouveauxMessages);
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "chat",
          messages: nouveauxMessages,
          customSystemPrompt: `Tu es BARRY AI Coach, un coach personnel d'excellence qui accompagne les gens vers la réussite.

TA MISSION :
Aider chaque personne à atteindre ses objectifs personnels et professionnels, pas à pas.

TES DOMAINES :
- 💼 Carrière : trouver un job, changer de voie, préparer entretiens, négocier salaire
- 🎯 Objectifs : définir des objectifs SMART, créer un plan d'action
- 📚 Apprentissage : plans d'étude, ressources, méthodes
- 🚀 Entrepreneuriat : lancer un business, valider une idée
- 💪 Motivation : coaching mental, habitudes, discipline
- 💰 Finance personnelle : budget, épargne, sortie de dettes
- 🎨 Développement personnel : confiance, communication, productivité

TON STYLE :
1. EMPATHIE : Reconnais ce que la personne vit
2. CLARTÉ : Pose des questions précises
3. PLAN CONCRET : Étapes numérotées (pas des conseils vagues)
4. MESURABLE : Objectifs datés
5. MOTIVATION : Termine par un encouragement

FORMAT :
- Commence par "**Je comprends.**" ou "**Bonne question !**"
- Utilise des titres ## et ###
- Listes à puces et numérotées
- **Gras** pour les points clés
- Termine par un **Plan d'action** en 3 étapes
- Ajoute une phrase de motivation`,
        }),
      });

      if (!res.body) throw new Error("Pas de reponse");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let texteComplet = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        texteComplet += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copie = [...prev];
          copie[copie.length - 1] = { role: "assistant", content: texteComplet };
          return copie;
        });
      }
    } catch (err: any) {
      setMessages((prev) => {
        const copie = [...prev];
        copie[copie.length - 1] = {
          role: "assistant",
          content: "Erreur : " + err.message,
        };
        return copie;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1e] text-blue-50">

      {/* HEADER */}
      <div className="border-b border-cyan-400/20 bg-[#0a0f1e]/95 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-black text-cyan-300 tracking-wide">BARRY AI Coach</h1>
            <p className="text-xs text-blue-300/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Coach personnel · Mémoire persistante
            </p>
          </div>
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs text-blue-300/60 hover:text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-xl transition-all"
            title="Effacer la conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Effacer
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-6 space-y-5 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className="flex gap-3 min-w-0">
            <div
              className={
                "w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black shadow-md " +
                (msg.role === "user"
                  ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-cyan-500/30"
                  : "bg-blue-950 text-cyan-300 border border-cyan-400/40")
              }
            >
              {msg.role === "user" ? "Moi" : "🧭"}
            </div>

            <div
              className={
                "flex-1 min-w-0 p-4 rounded-2xl text-sm break-words " +
                (msg.role === "user"
                  ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-md shadow-cyan-500/20"
                  : "bg-blue-950/50 border border-cyan-400/20 text-blue-50")
              }
            >
              {msg.role === "user" ? (
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
              ) : (
                <div
                  className="break-words
                    [&_h1]:text-cyan-300 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2
                    [&_h2]:text-cyan-300 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2
                    [&_h3]:text-cyan-400 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-1
                    [&_p]:mb-2 [&_p]:break-words [&_p]:leading-relaxed
                    [&_strong]:text-cyan-300 [&_strong]:font-bold
                    [&_em]:italic
                    [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-3 [&_ul]:space-y-1
                    [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-3 [&_ol]:space-y-1
                    [&_li]:mb-1 [&_li]:leading-relaxed [&_li]:marker:text-cyan-400
                    [&_code]:bg-cyan-400/15 [&_code]:text-cyan-200 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs
                    [&_pre]:bg-[#060a14] [&_pre]:border [&_pre]:border-cyan-400/20 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-3
                    [&_table]:hidden
                    [&_a]:text-cyan-400 [&_a]:underline"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}

              {loading &&
                i === messages.length - 1 &&
                msg.role === "assistant" &&
                !msg.content && (
                  <span className="text-cyan-400/70 italic flex items-center gap-2">
                    <Target className="w-3 h-3 animate-pulse" />
                    Ton coach reflechit...
                  </span>
                )}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />

        {messages.length <= 1 && (
          <div className="mt-4">
            <p className="text-xs text-cyan-400/60 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              Sujets sur lesquels je peux t'aider
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="text-left text-xs p-3 rounded-lg border border-cyan-400/30 text-cyan-200 bg-blue-950/40 hover:bg-cyan-400/10 hover:border-cyan-400/60 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SAISIE */}
      <div className="sticky bottom-0 border-t border-cyan-400/20 bg-[#0a0f1e]/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto w-full px-6 py-4">
          <div className="flex gap-2 bg-blue-950/50 border-2 border-cyan-400/30 rounded-2xl p-2 focus-within:border-cyan-400 transition-all">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Parle-moi de ton objectif, ta situation..."
              disabled={loading}
              className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm outline-none text-blue-50 placeholder-cyan-400/40 disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-40 text-white font-bold rounded-xl px-5 py-2 flex items-center gap-2 text-sm shadow-lg shadow-cyan-500/30 transition-all"
            >
              <Send className="w-4 h-4" />
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}