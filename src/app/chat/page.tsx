"use client";

import { useState } from "react";
import { Send, Sparkles, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = { role: "user" | "assistant"; content: string };

function cleanMarkdown(text: string): string {
  return text
    .replace(/\\\*/g, "*")
    .replace(/\\_/g, "_")
    .replace(/\\#/g, "#")
    .replace(/\\`/g, "`")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<p>/gi, "");
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour ! Je suis **BARRY AI** 🧠\n\nJe m'adapte à ta question :\n\n- ⚡ **Questions simples** → réponse rapide\n- 🧠 **Questions complexes** → analyse détaillée\n\nPose-moi n'importe quelle question !",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const texte = input.trim();
    if (!texte || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: texte }]);
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: texte, mode: "chat" }),
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
          copie[copie.length - 1] = { role: "assistant", content: cleanMarkdown(data.text) };
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-stone-100 via-amber-50 to-stone-100">

      {/* HEADER */}
      <div className="border-b border-stone-300 bg-stone-100/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-stone-900 tracking-wide">BARRY AI</h1>
            <p className="text-xs text-stone-600 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Chat intelligent · Auto-adaptatif
            </p>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-6 space-y-5">
        {messages.map((msg, i) => (
          <div key={i} className="flex gap-3 min-w-0">
            <div
              className={
                "w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black shadow-md " +
                (msg.role === "user"
                  ? "bg-stone-800 text-yellow-400"
                  : "bg-gradient-to-br from-yellow-400 to-amber-500 text-white")
              }
            >
              {msg.role === "user" ? "Moi" : "B"}
            </div>

            <div
              className={
                "flex-1 min-w-0 p-4 rounded-2xl text-sm break-words shadow-sm " +
                (msg.role === "user"
                  ? "bg-stone-800 text-yellow-50"
                  : "bg-stone-50 border border-stone-200 text-stone-800")
              }
            >
              {msg.role === "user" ? (
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
              ) : (
                <div
                  className="
                    break-words
                    [&_h1]:text-amber-800 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2
                    [&_h2]:text-amber-800 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:border-b [&_h2]:border-stone-200 [&_h2]:pb-1
                    [&_h3]:text-orange-700 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-1
                    [&_p]:mb-2 [&_p]:leading-relaxed [&_p]:text-stone-700
                    [&_strong]:text-stone-900 [&_strong]:font-bold
                    [&_em]:italic
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ul]:space-y-1
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_ol]:space-y-1
                    [&_li]:leading-relaxed [&_li]:text-stone-700 [&_li]:marker:text-amber-500
                    [&_code]:bg-amber-100 [&_code]:text-amber-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.85em] [&_code]:font-mono
                    [&_pre]:bg-stone-900 [&_pre]:text-yellow-100 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-3 [&_pre]:text-xs
                    [&_a]:text-amber-700 [&_a]:underline
                    [&_blockquote]:border-l-4 [&_blockquote]:border-amber-400 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-3 [&_blockquote]:text-stone-500
                    [&_hr]:border-none [&_hr]:border-t [&_hr]:border-stone-200 [&_hr]:my-4
                    [&_table]:hidden
                  "
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
                  <span className="text-amber-600 italic flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    BARRY réfléchit...
                  </span>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* SAISIE */}
      <div className="sticky bottom-0 border-t border-stone-300 bg-stone-100/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto w-full px-6 py-4">
          <div className="flex gap-2 bg-stone-50 border-2 border-stone-300 rounded-2xl p-2 focus-within:border-amber-500 transition-colors shadow-lg">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Posez votre question..."
              disabled={loading}
              className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm outline-none text-stone-900 placeholder-stone-500 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl px-5 py-2 flex items-center gap-2 text-sm transition-all shadow-lg"
            >
              <Send className="w-4 h-4" />
              Envoyer
            </button>
          </div>
          <p className="text-center text-xs text-stone-500 mt-2">
            BARRY AI choisit automatiquement la meilleure réponse
          </p>
        </div>
      </div>
    </div>
  );
}