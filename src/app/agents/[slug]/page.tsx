"use client";

import { useState, use } from "react";
import { Send, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAgent } from "@/lib/agents";

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

export default function AgentChatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const agent = getAgent(slug);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Agent introuvable</h1>
          <Link href="/agents" className="text-blue-600 underline">
            Retour aux agents
          </Link>
        </div>
      </div>
    );
  }

  const isBlue = agent.color.startsWith("#3b");
  const gradient = isBlue
    ? "from-blue-600 to-blue-500"
    : "from-red-600 to-red-500";
  const borderColor = isBlue ? "border-blue-200" : "border-red-200";
  const textColor = isBlue ? "text-blue-700" : "text-red-700";

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
        body: JSON.stringify({
          prompt: texte,
          mode: "custom",
          customSystemPrompt: agent.systemPrompt,
        }),
      });

      if (!res.body) throw new Error("Pas de reponse");

      // ⚡ STREAMING : lecture du flux
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let texteComplet = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        texteComplet += decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const copie = [...prev];
          copie[copie.length - 1] = {
            role: "assistant",
            content: cleanMarkdown(texteComplet),
          };
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
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 overflow-hidden">

      {/* BLOBS DÉCORATIFS */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-[20%] -left-[10%] w-[55%] h-[60%] rounded-full opacity-20 blur-[120px]"
          style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
        />
        <div
          className="absolute -bottom-[20%] -right-[10%] w-[55%] h-[60%] rounded-full opacity-20 blur-[120px]"
          style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
        />
      </div>

      {/* CONTENU */}
      <div className="relative z-10 min-h-screen flex flex-col max-w-4xl mx-auto w-full px-6 py-6">

        {/* RETOUR */}
        <Link
          href="/agents"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 w-fit transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tous les agents
        </Link>

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
          <div
            className={
              "w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 shadow-lg bg-gradient-to-br " +
              gradient
            }
          >
            {agent.emoji}
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {agent.name}
            </h1>
            <p className="text-gray-600 text-sm mt-1">{agent.tagline}</p>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 space-y-4 mb-6">
          {messages.length === 0 && (
            <div className={
              "p-6 rounded-2xl border-2 border-dashed bg-white/50 text-center " + borderColor
            }>
              <Sparkles className={"w-8 h-8 mx-auto mb-3 " + textColor} />
              <p className="text-gray-600 text-sm">
                Pose ta première question à l'agent <strong>{agent.name}</strong>.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className="flex gap-3 min-w-0">
              <div
                className={
                  "w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black shadow-md " +
                  (msg.role === "user"
                    ? "bg-gray-900 text-yellow-400"
                    : "bg-gradient-to-br text-white " + gradient)
                }
              >
                {msg.role === "user" ? "Moi" : agent.emoji}
              </div>

              <div
                className={
                  "flex-1 min-w-0 p-4 rounded-2xl text-sm break-words shadow-sm border-2 " +
                  (msg.role === "user"
                    ? "bg-gray-900 text-yellow-50 border-gray-900"
                    : "bg-white text-gray-800 " + borderColor)
                }
              >
                {msg.role === "user" ? (
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                ) : (
                  <div
                    className="
                      break-words
                      [&_h1]:text-blue-800 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2
                      [&_h2]:text-blue-800 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:border-b [&_h2]:border-gray-200 [&_h2]:pb-1
                      [&_h3]:text-red-700 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-1
                      [&_p]:mb-2 [&_p]:leading-relaxed [&_p]:text-gray-700
                      [&_strong]:text-gray-900 [&_strong]:font-bold
                      [&_em]:italic
                      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3
                      [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3
                      [&_li]:leading-relaxed [&_li]:text-gray-700 [&_li]:marker:text-blue-500
                      [&_code]:bg-blue-100 [&_code]:text-blue-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.85em]
                      [&_pre]:bg-gray-900 [&_pre]:text-yellow-100 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-3 [&_pre]:text-xs
                      [&_a]:text-blue-700 [&_a]:underline
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
                    <span className="text-blue-600 italic flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      {agent.name} réfléchit...
                    </span>
                  )}
              </div>
            </div>
          ))}
        </div>

        {/* SAISIE */}
        <div className="sticky bottom-4 p-4 rounded-2xl border-2 border-gray-200 bg-white/90 backdrop-blur-md shadow-lg">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={"Pose ta question au " + agent.name + "..."}
              disabled={loading}
              className="flex-1 min-w-0 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2 text-sm outline-none text-gray-900 placeholder-gray-400 disabled:opacity-50 focus:border-blue-500 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className={
                "disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl px-5 py-2 flex items-center gap-2 text-sm transition-all shadow-lg bg-gradient-to-r " +
                gradient
              }
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