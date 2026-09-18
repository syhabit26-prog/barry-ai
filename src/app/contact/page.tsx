"use client";

import { useState } from "react";
import { Mail, Send, Clock, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setSending(true);

    try {
      await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    } catch {
      window.location.href = `mailto:syhabit26@gmail.com?subject=Contact de ${form.name}&body=${encodeURIComponent(form.message)}`;
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0f2e] text-white relative overflow-hidden">

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600/40 blur-[150px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-fuchsia-500/30 blur-[150px]" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-violet-500/30 blur-[140px]" />
      </div>

      <div className="relative z-10 px-6 py-20 max-w-5xl mx-auto">

        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-400 to-violet-300 bg-clip-text text-transparent">
              Parlons-en
            </span>
          </h1>

          <p className="text-purple-100/70 text-lg max-w-2xl mx-auto">
            Une question, un projet, une idée ? Écris-nous. On te répond en moins de 24h.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="p-6 rounded-2xl border border-purple-400/30 bg-purple-500/10 backdrop-blur hover:border-purple-400/60 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/40">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xs text-purple-200/70 uppercase tracking-wider mb-1">Email</div>
                <a href="mailto:syhabit26@gmail.com" className="text-purple-100 font-bold hover:text-white transition-colors">
                  syhabit26@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-purple-400/30 bg-purple-500/10 backdrop-blur hover:border-purple-400/60 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/40">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xs text-purple-200/70 uppercase tracking-wider mb-1">Réponse</div>
                <div className="text-purple-100 font-bold">En moins de 24 heures</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10 rounded-3xl border border-purple-400/30 bg-purple-500/5 backdrop-blur">

          {sent ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 mb-6 shadow-xl shadow-purple-500/40">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Message envoyé !</h2>
              <p className="text-purple-100/70">Nous te répondrons très vite.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="block text-sm font-bold text-purple-200 mb-2">Nom</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Votre nom"
                  required
                  className="w-full bg-purple-950/40 border border-purple-400/30 rounded-2xl px-5 py-4 text-white outline-none focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 transition-all placeholder-purple-300/40"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-purple-200 mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="vous@email.com"
                  required
                  className="w-full bg-purple-950/40 border border-purple-400/30 rounded-2xl px-5 py-4 text-white outline-none focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 transition-all placeholder-purple-300/40"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-purple-200 mb-2">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Votre message..."
                  required
                  rows={6}
                  className="w-full bg-purple-950/40 border border-purple-400/30 rounded-2xl px-5 py-4 text-white outline-none focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20 transition-all placeholder-purple-300/40 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-500 text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 transition-all shadow-lg shadow-purple-500/30"
              >
                <Send className="w-4 h-4" />
                {sending ? "Envoi en cours..." : "Envoyer le message"}
              </button>

              <p className="text-xs text-purple-200/50 text-center md:text-left">
                Ou écris-nous directement à{" "}
                <a href="mailto:syhabit26@gmail.com" className="text-purple-300 underline hover:text-white">
                  syhabit26@gmail.com
                </a>
              </p>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}