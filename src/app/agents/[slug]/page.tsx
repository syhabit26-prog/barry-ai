"use client";

import { useState, use } from "react";
import { Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAgent } from "@/lib/agents";

type Message = { role: "user" | "assistant"; content: string };

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
      <div className="min-h-screen flex items-center justify-center text-yellow-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Agent introuvable</h1>
          <Link href="/agents" className="text-yellow-400 underline">
            Retour aux agents
          </Link>
        </div>
      </div>
    );
  }

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
          provider: "groq",
          mode: "custom",
          customSystemPrompt: agent.systemPrompt,
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
        copie[copie.length - 1] = { role: "assistant", content: "Erreur reseau : " + err.message };
        return copie;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto w-full px-6 py-8">
      <Link href="/agents" className="inline-flex items-center gap-2 text-yellow-400 text-sm mb-6 hover:underline w-fit">
        <ArrowLeft className="w-4 h-4" />
        Tous les agents
      </Link>

      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-yellow-400/20">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
          style={{ background: agent.color + "33", border: "1px solid " + agent.color + "88" }}
        >
          {agent.emoji}
        </div>
        <div>
          <h1 className="text-3xl font-black text-yellow-300 tracking-wider">{agent.name}</h1>
          <p className="text-yellow-100/60 text-sm mt-1">{agent.tagline}</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 mb-6">
        {messages.length === 0 && (
          <div className="p-6 rounded-2xl border border-yellow-400/20 bg-black/40 text-center">
            <p className="text-yellow-100/60 text-sm">
              Pose ta premiere question a l'agent {agent.name}.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="flex gap-3 min-w-0">
            <div
              className={
                "w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black " +
                (msg.role === "user"
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black"
                  : "bg-black text-yellow-300 border border-yellow-400/60")
              }
            >
              {msg.role === "user" ? "Moi" : agent.emoji}
            </div>

            <div
              className={
                "flex-1 min-w-0 p-4 rounded-2xl text-sm leading-relaxed break-words " +
                (msg.role === "user"
                  ? "bg-yellow-400/95 text-black font-medium"
                  : "bg-black/80 border border-yellow-400/40 text-yellow-100")
              }
            >
              {msg.role === "user" ? (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div className="break-words [&_h1]:text-yellow-300 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-yellow-300 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-yellow-400 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-1 [&_p]:mb-2 [&_strong]:text-yellow-300 [&_strong]:font-bold [&_code]:bg-yellow-400/20 [&_code]:text-yellow-200 [&_code]:px-1.5 [&_code]:rounded [&_pre]:bg-black [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-2 [&_li]:mb-1 [&_table]:w-full [&_table]:border-collapse [&_table]:my-3 [&_table]:text-xs [&_th]:border [&_th]:border-yellow-400/40 [&_th]:bg-yellow-400/10 [&_th]:px-2 [&_th]:py-1 [&_th]:text-yellow-300 [&_th]:font-bold [&_td]:border [&_td]:border-yellow-400/20 [&_td]:px-2 [&_td]:py-1">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}

              {loading && i === messages.length - 1 && msg.role === "assistant" && !msg.content && (
                <span className="text-yellow-400/70 italic">{agent.name} reflechit...</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 p-4 rounded-2xl border border-yellow-400/30 bg-black/80 backdrop-blur-md">
        <div className="flex gap-2 bg-black/60 border border-yellow-400/50 rounded-xl p-2 focus-within:border-yellow-400">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={"Pose ta question au " + agent.name + "..."}
            disabled={loading}
            className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm outline-none placeholder-yellow-400/60 text-yellow-100 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 disabled:opacity-50 text-black font-bold rounded-lg px-5 py-2 flex items-center gap-2 text-sm flex-shrink-0"
          >
            <Send className="w-4 h-4" />
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}