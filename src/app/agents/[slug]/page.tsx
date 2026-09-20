"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ALL_AGENTS } from "@/lib/allAgents";
import { ArrowLeft, Sparkles, Send, ImagePlus, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string; image?: string };

function MarkdownView({ content }: { content: string }) {
  return (
    <div className="md-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="table-wrap"><table>{children}</table></div>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer">{children}</a>
          ),
        }}
      >
        {content.replace(/<br\s*\/?>/gi, "\n")}
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
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (agent) {
      setMessages([
        {
          role: "assistant",
          content: "Bonjour ! Je suis **" + agent.name + "**. " + agent.tagline + ". Comment puis-je t'aider ?",
        },
      ]);
    }
  }, [slug]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Agent introuvable</h1>
          <Link href="/agents" className="text-orange-500 hover:underline">← Retour aux agents</Link>
        </div>
      </div>
    );
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSend = async () => {
    const texte = input.trim();
    if ((!texte && !image) || loading) return;

    const userMsg: Message = {
      role: "user",
      content: texte || "(photo)",
      image: image || undefined,
    };

    const newMessages: Message[] = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    const sentImage = image;
    clearImage();
    setLoading(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      // ⭐ On envoie le message + image au backend
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: texte,
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.image
              ? [
                  { type: "text", text: m.content },
                  { type: "image", image: m.image },
                ]
              : m.content,
          })),
          mode: "chat",
          customSystemPrompt: agent.systemPrompt,
          provider: "groq",
          hasImage: !!sentImage,
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
          if (value) {
            fullText += decoder.decode(value, { stream: true });
            setMessages((prev) => {
              const copie = [...prev];
              copie[copie.length - 1] = { role: "assistant", content: fullText };
              return copie;
            });
          }
        }
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
    <div className="min-h-screen bg-white flex flex-col">

      {/* HEADER */}
      <div className="border-b border-gray-100 px-6 py-3 flex items-center gap-3">
        <Link href="/agents" className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-xl">
          <span>{agent.emoji}</span>
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-gray-900 text-sm">{agent.name}</h1>
          <p className="text-xs text-gray-500">{agent.tagline}</p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className="flex gap-3">
              {msg.role === "assistant" ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    {msg.content ? (
                      <MarkdownView content={msg.content} />
                    ) : (
                      <div className="flex items-center gap-1 text-gray-400 pt-2">
                        <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex justify-end">
                  <div className="bg-gray-100 text-gray-900 rounded-3xl px-5 py-3 text-sm leading-relaxed max-w-[80%]">
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="photo"
                        className="rounded-2xl max-h-64 mb-2 object-cover"
                      />
                    )}
                    {msg.content && msg.content !== "(photo)" && (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* INPUT */}
      <div className="px-6 pb-6 pt-2">
        <div className="max-w-3xl mx-auto">

          {/* APERÇU PHOTO */}
          {image && (
            <div className="mb-2 inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2">
              <img src={image} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <span className="text-xs text-gray-600 font-medium">Photo prête</span>
              <button
                onClick={clearImage}
                className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-2 bg-white border border-gray-300 rounded-3xl px-3 py-2 shadow-sm focus-within:border-orange-400 focus-within:shadow-md transition-all">
            <button
              onClick={() => fileRef.current?.click()}
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all flex-shrink-0"
              title="Ajouter une photo"
            >
              <ImagePlus className="w-5 h-5" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="hidden"
            />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Pose ta question..."
              disabled={loading}
              rows={1}
              className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400 resize-none max-h-40 py-2"
            />
            <button
              onClick={handleSend}
              disabled={loading || (!input.trim() && !image)}
              className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            BARRY AI peut faire des erreurs.
          </p>
        </div>
      </div>
    </div>
  );
}