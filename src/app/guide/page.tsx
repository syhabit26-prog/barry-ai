"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Trash2, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { loadChat, saveChat, clearChat, PAGE_KEYS, type ChatMessage } from "@/lib/chatHistory";

type Message = ChatMessage;

const QUESTIONS = [
  "Je veux changer de carrière",
  "M'aider à préparer un entretien",
  "Apprendre le développement web",
  "Lancer mon business",
  "Mieux gérer mon argent",
  "Retrouver la motivation",
];

const MESSAGE_INITIAL: Message = {
  role: "assistant",
  content: "Bonjour ! Je suis ton coach personnel.\n\nQuel est ton objectif ?",
};

export default function GuidePage() {
  const [messages, setMessages] = useState<Message[]>([MESSAGE_INITIAL]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadChat(PAGE_KEYS.COACH);
    if (saved.length > 0) setMessages(saved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && messages.length > 0) {
      saveChat(PAGE_KEYS.COACH, messages);
    }
  }, [messages, mounted]);

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
          customSystemPrompt: `Tu es BARRY AI Coach. Réponds de façon CONCISE (max 150 mots). Pas de titres ##, pas de gras **. Juste du texte direct et utile. Empathique mais bref.`,
        }),
      });

      if (!res.body) throw new Error("Pas de réponse");

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
    <div className="min-h-screen flex flex-col bg-white">

      <header className="h-14 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto h-full px-5 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-[14px] font-semibold text-zinc-900 tracking-tight">Coach IA</h1>
          </div>
          <button
            onClick={handleClear}
            className="w-8 h-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-5 py-8">
          {messages.map((msg, i) => (
            <div key={i} className="mb-6 last:mb-0">
              {msg.role === "user" ? (
                <div className="flex justify-end">
                  <div className="max-w-[85%] bg-zinc-100 rounded-3xl px-5 py-2.5 text-[15px] leading-[1.7] text-zinc-900 whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[15px] leading-[1.75] text-zinc-800 break-words
                        [&_h1]:text-zinc-900 [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:mt-4 [&_h1]:mb-2
                        [&_h2]:text-zinc-900 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2
                        [&_h3]:text-zinc-900 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1
                        [&_p]:mb-3 [&_p]:leading-[1.75]
                        [&_strong]:text-zinc-900 [&_strong]:font-semibold
                        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ul]:space-y-1
                        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_ol]:space-y-1
                        [&_li]:leading-[1.75]
                        [&_code]:bg-zinc-100 [&_code]:text-zinc-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[13px]
                        [&_a]:text-orange-600 [&_a]:underline"
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>

                    {loading &&
                      i === messages.length - 1 &&
                      msg.role === "assistant" &&
                      !msg.content && (
                        <div className="flex items-center gap-2 text-zinc-400">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {messages.length <= 1 && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    disabled={loading}
                    className="text-left text-[13px] p-3 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-6">
        <div className="max-w-3xl mx-auto px-5 pb-6">
          <div className="flex items-end gap-2 bg-white rounded-3xl border border-zinc-200 shadow-[0_2px_15px_rgba(0,0,0,0.04)] focus-within:border-zinc-400 transition-all p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Décris ton objectif..."
              disabled={loading}
              rows={1}
              className="flex-1 bg-transparent px-3 py-2 text-[15px] outline-none resize-none placeholder-zinc-400 text-zinc-900 leading-[1.6]"
              style={{ maxHeight: "160px" }}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}