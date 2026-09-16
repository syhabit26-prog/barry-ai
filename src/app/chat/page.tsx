"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = { role: "user" | "assistant"; content: string };
type Provider = "openai" | "claude" | "deepseek" | "groq" | "gemini" | "mistral" | "cohere" | "grok" | "together";

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: "openai", label: "OpenAI" },
  { id: "claude", label: "Claude" },
  { id: "deepseek", label: "DeepSeek" },
  { id: "groq", label: "Groq" },
  { id: "gemini", label: "Gemini" },
  { id: "mistral", label: "Mistral" },
  { id: "cohere", label: "Cohere" },
  { id: "grok", label: "Grok" },
  { id: "together", label: "Together" },
];

const LABELS: Record<Provider, string> = {
  openai: "GPT-4o mini",
  claude: "Claude 3.5",
  deepseek: "DeepSeek",
  groq: "Llama (Groq)",
  gemini: "Gemini 2.0",
  mistral: "Mistral Large",
  cohere: "Command R+",
  grok: "Grok Beta",
  together: "Llama 3.3 70B",
};

function cleanMarkdown(text: string): string {
  return text
    .replace(/\\\*/g, "*")
    .replace(/\\_/g, "_")
    .replace(/\\#/g, "#")
    .replace(/\\`/g, "`");
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! / Bonjour! / Hola! 👋\n\n9 AI models available. I reply in your language.",
    },
  ]);
  const [input, setInput] = useState("");
  const [provider, setProvider] = useState<Provider>("groq");
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
        body: JSON.stringify({ prompt: texte, provider, mode: "chat" }),
      });

      const data = await res.json();

      if (!data.ok) {
        setMessages((prev) => {
          const copie = [...prev];
          copie[copie.length - 1] = { role: "assistant", content: "❌ " + data.error };
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
        copie[copie.length - 1] = { role: "assistant", content: "❌ Erreur reseau : " + err.message };
        return copie;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto w-full px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-yellow-300 tracking-wider">Chat IA</h1>
        <p className="text-yellow-500/70 text-sm mt-1">9 modeles - Reponse dans votre langue</p>
      </div>

      <div className="flex-1 space-y-4 mb-6">
        {messages.map((msg, i) => (
          <div key={i} className="flex gap-3 min-w-0">
            <div className={"w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black " + (msg.role === "user" ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black" : "bg-black text-yellow-300 border border-yellow-400/60")}>
              {msg.role === "user" ? "Moi" : "B"}
            </div>
            <div className={"flex-1 min-w-0 p-4 rounded-2xl text-sm leading-relaxed break-words " + (msg.role === "user" ? "bg-yellow-400/95 text-black font-medium" : "bg-black/80 border border-yellow-400/40 text-yellow-100")}>
              {msg.role === "user" ? (
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
              ) : (
                <div className="break-words [&_h1]:text-yellow-300 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-yellow-300 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-yellow-400 [&_h3]:font-bold [&_p]:mb-2 [&_strong]:text-yellow-300 [&_strong]:font-bold [&_code]:bg-yellow-400/20 [&_code]:text-yellow-200 [&_code]:px-1.5 [&_code]:rounded [&_pre]:bg-black [&_pre]:p-3 [&_pre]:rounded-lg [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:mb-1">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              )}
              {loading && i === messages.length - 1 && msg.role === "assistant" && !msg.content && (
                <span className="text-yellow-400/70 italic">BARRY reflechit...</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 space-y-3 p-4 rounded-2xl border border-yellow-400/30 bg-black/80 backdrop-blur-md">
        <div className="grid grid-cols-3 md:grid-cols-5 gap-1.5">
          {PROVIDERS.map((p) => (
            <button key={p.id} onClick={() => setProvider(p.id)} className={"text-[10px] py-2 rounded-lg border transition-all font-bold " + (provider === p.id ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black border-yellow-300" : "border-yellow-400/40 text-yellow-300 hover:bg-yellow-400/20")}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 bg-black/60 border border-yellow-400/50 rounded-xl p-2 focus-within:border-yellow-400">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()} placeholder="Posez votre question..." disabled={loading} className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm outline-none placeholder-yellow-400/60 text-yellow-100 disabled:opacity-50" />
          <button onClick={handleSend} disabled={loading} className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 disabled:opacity-50 text-black font-bold rounded-lg px-5 py-2 flex items-center gap-2 text-sm flex-shrink-0">
            <Send className="w-4 h-4" />
            Envoyer
          </button>
        </div>
        <div className="text-xs text-yellow-500/60 text-center">Modele : {LABELS[provider]}</div>
      </div>
    </div>
  );
}