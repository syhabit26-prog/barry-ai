"use client";

import { useState } from "react";
import { Send, Compass, Sparkles, Target } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = { role: "user" | "assistant"; content: string };

const QUESTIONS = [
  "🎯 Je veux changer de carrière",
  "💼 Aide-moi à préparer un entretien",
  "📚 Comment apprendre le développement web ?",
  "🚀 Je veux lancer mon business",
  "💰 Comment mieux gérer mon argent ?",
  "💪 Je manque de motivation",
];

export default function GuidePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour ! Je suis BARRY AI Coach 🧭\n\nJe suis là pour t'accompagner jusqu'à ta réussite :\n\n🎯 **Carrière** — trouver un job, préparer un entretien\n📚 **Apprentissage** — te former, évoluer\n🚀 **Entrepreneuriat** — créer ton business\n💰 **Finance perso** — budget, épargne\n💪 **Motivation** — retrouver l'élan\n\n**Quel est ton objectif principal en ce moment ?**",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (customText?: string) => {
    const texte = customText || input.trim();
    if (!texte || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: texte }]);
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: texte,
          provider: "groq",
          mode: "custom",
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
- Ajoute une phrase de motivation

RÈGLES :
- Réponds dans la langue de l'utilisateur
- Sois concret, jamais vague
- Ne juge jamais
- Si médical/juridique → redirige vers un professionnel
- Encourage toujours l'action`,
        }),
      });

      const data = await res.json();

      setMessages((prev) => {
        const copie = [...prev];
        copie[copie.length - 1] = {
          role: "assistant",
          content: data.ok ? data.text : "Erreur : " + data.error,
        };
        return copie;
      });
    } catch (err: any) {
      setMessages((prev) => {
        const copie = [...prev];
        copie[copie.length - 1] = {
          role: "assistant",
          content: "Erreur reseau : " + err.message,
        };
        return copie;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Fond bleu sombre avec halos */}
      <div className="fixed inset-0 -z-10 bg-[#0a0f1e]">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] rounded-full bg-blue-600/20 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[70%] rounded-full bg-cyan-500/15 blur-[150px]" />
        <div className="absolute top-[40%] left-[40%] w-[40%] h-[50%] rounded-full bg-sky-500/10 blur-[130px]" />
      </div>

      <div className="min-h-screen flex flex-col max-w-4xl mx-auto w-full px-6 py-8">

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/40 bg-blue-950/60 backdrop-blur mb-4">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-cyan-300">Coach Personnel</span>
          </div>
          <h1 className="text-3xl font-black tracking-wider bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-400 bg-clip-text text-transparent">
            BARRY AI Coach
          </h1>
          <p className="text-blue-200/60 text-sm mt-1">
            Ton accompagnateur vers la réussite personnelle et professionnelle
          </p>
        </div>

        <div className="flex-1 space-y-4 mb-6">
          {messages.map((msg, i) => (
            <div key={i} className="flex gap-3 min-w-0">
              <div
                className={
                  "w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black " +
                  (msg.role === "user"
                    ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                    : "bg-blue-950/80 text-cyan-300 border border-cyan-400/50 backdrop-blur")
                }
              >
                {msg.role === "user" ? "Moi" : "🧭"}
              </div>

              <div
                className={
                  "flex-1 min-w-0 p-4 rounded-2xl text-sm leading-relaxed break-words " +
                  (msg.role === "user"
                    ? "bg-gradient-to-br from-cyan-400/95 to-blue-500/95 text-white font-medium whitespace-pre-wrap shadow-lg shadow-cyan-500/20"
                    : "bg-blue-950/60 border border-cyan-400/30 text-blue-50 backdrop-blur")
                }
              >
                {msg.role === "user" ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
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
                    [&_table]:w-full [&_table]:my-4 [&_table]:border-collapse [&_table]:text-sm
                    [&_thead]:bg-cyan-400/10
                    [&_th]:border [&_th]:border-cyan-400/40 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-cyan-300 [&_th]:font-bold
                    [&_td]:border [&_td]:border-cyan-400/20 [&_td]:px-3 [&_td]:py-2 [&_td]:text-blue-100/90 [&_td]:align-top
                    [&_tr]:hover:bg-cyan-400/5
                    [&_blockquote]:border-l-4 [&_blockquote]:border-cyan-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3 [&_blockquote]:text-blue-100/80
                    [&_a]:text-cyan-400 [&_a]:underline
                    [&_hr]:border-cyan-400/20 [&_hr]:my-4"
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
        </div>

        {messages.length <= 1 && (
          <div className="mb-4">
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
                  className="text-left text-xs p-3 rounded-lg border border-cyan-400/30 text-cyan-200 bg-blue-950/40 backdrop-blur hover:bg-cyan-400/10 hover:border-cyan-400/60 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="sticky bottom-4 p-4 rounded-2xl border border-cyan-400/30 bg-blue-950/70 backdrop-blur-md shadow-lg shadow-cyan-500/10">
          <div className="flex gap-2 bg-[#060a14]/80 border border-cyan-400/40 rounded-xl p-2 focus-within:border-cyan-400 focus-within:shadow-md focus-within:shadow-cyan-500/20 transition-all">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Parle-moi de ton objectif, ta situation..."
              disabled={loading}
              className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm outline-none placeholder-cyan-400/50 text-blue-50 disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 text-white font-bold rounded-lg px-5 py-2 flex items-center gap-2 text-sm flex-shrink-0 shadow-lg shadow-cyan-500/30 transition-all"
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