"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ALL_AGENTS } from "@/lib/allAgents";
import { ArrowLeft, Send, Sparkles } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

// ═══ Rendu markdown custom style ChatGPT ═══
function MarkdownView({ content }: { content: string }) {
  return (
    <div className="md-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="table-wrap">
              <table>{children}</table>
            </div>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function AgentPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const agent = ALL_AGENTS.find((a) => a.slug === slug);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (agent) {
      setMessages([
        {
          role: "assistant",
          content:
            "Bonjour ! Je suis **" +
            agent.name +
            "** (" +
            agent.tagline +
            "). Comment puis-je t'aider ?",
        },
      ]);
    }
  }, [slug]);

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-50">
        <div className="text-center">
          <h1 className="text-3xl font-black text-gray-900 mb-4">Agent introuvable</h1>
          <p className="text-gray-500 mb-6">
            Slug demandé : <code>{slug}</code>
          </p>
          <Link href="/agents" className="text-blue-600 hover:underline font-bold">
            ← Retour aux agents
          </Link>
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    const texte = input.trim();
    if (!texte || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: texte }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "..." }]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: texte,
          messages: newMessages,
          mode: "chat",
          customSystemPrompt: agent.systemPrompt,
          provider: "groq",
        }),
      });

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

      setMessages((prev) => {
        const copie = [...prev];
        copie[copie.length - 1] = { role: "assistant", content: fullText || "..." };
        return copie;
      });
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

  const gradient = "from-blue-600 to-blue-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex flex-col">

      {/* HEADER */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/agents" className="text-gray-500 hover:text-gray-900 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div
            className={
              "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg bg-gradient-to-br " +
              gradient
            }
          >
            <span>{agent.emoji}</span>
          </div>
          <div className="flex-1">
            <h1 className="font-black text-gray-900">{agent.name}</h1>
            <p className="text-xs text-gray-500">{agent.tagline}</p>
          </div>
          {agent.category && (
            <span className="hidden md:block px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
              {agent.category}
            </span>
          )}
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={"flex gap-3 " + (msg.role === "user" ? "justify-end" : "")}
            >
              {msg.role === "assistant" && (
                <div
                  className={
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br " +
                    gradient +
                    " text-white"
                  }
                >
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
              <div
                className={
                  "max-w-full min-w-0 " +
                  (msg.role === "user"
                    ? "bg-gray-900 text-white rounded-2xl px-4 py-3 text-sm leading-relaxed"
                    : "text-gray-800")
                }
              >
                {msg.role === "user" ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <MarkdownView content={msg.content} />
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div
                className={
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br " +
                  gradient +
                  " text-white"
                }
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-sm pt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* INPUT */}
      <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm px-6 py-4">
        <div className="max-w-3xl mx-auto flex gap-2 bg-white border border-gray-200 rounded-2xl p-2 focus-within:border-blue-400 focus-within:shadow-md transition-all">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={"Pose ta question à " + agent.name + "..."}
            disabled={loading}
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={
              "bg-gradient-to-r " +
              gradient +
              " text-white font-bold rounded-xl px-4 py-2 text-sm flex items-center gap-1.5 disabled:opacity-40 transition-all"
            }
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-2">
          Entrée pour envoyer
        </p>
      </div>
    </div>
  );
}