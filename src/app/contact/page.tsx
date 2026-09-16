"use client";

import { useState } from "react";
import { Send, Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="min-h-screen px-6 py-16 max-w-4xl mx-auto text-yellow-100">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-yellow-300 tracking-wider mb-4">Contact</h1>
        <p className="text-yellow-100/70">Une question ? Une suggestion ? Écrivez-nous</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-2xl border border-yellow-400/30 bg-black/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black flex-shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-yellow-500/70 uppercase tracking-wider">Email</p>
            <p className="text-yellow-300 font-bold">contact@barry-ai.com</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-yellow-400/30 bg-black/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black flex-shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-yellow-500/70 uppercase tracking-wider">Support</p>
            <p className="text-yellow-300 font-bold">Réponse en moins de 24h</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 rounded-2xl border border-yellow-400/30 bg-black/60 space-y-5">
        <div>
          <label className="block text-sm text-yellow-300 font-bold mb-2">Nom</label>
          <input
            type="text"
            required
            className="w-full bg-black/60 border border-yellow-400/40 rounded-xl px-4 py-3 text-yellow-100 outline-none focus:border-yellow-400 transition-colors"
            placeholder="Votre nom"
          />
        </div>

        <div>
          <label className="block text-sm text-yellow-300 font-bold mb-2">Email</label>
          <input
            type="email"
            required
            className="w-full bg-black/60 border border-yellow-400/40 rounded-xl px-4 py-3 text-yellow-100 outline-none focus:border-yellow-400 transition-colors"
            placeholder="vous@email.com"
          />
        </div>

        <div>
          <label className="block text-sm text-yellow-300 font-bold mb-2">Message</label>
          <textarea
            required
            rows={5}
            className="w-full bg-black/60 border border-yellow-400/40 rounded-xl px-4 py-3 text-yellow-100 outline-none focus:border-yellow-400 transition-colors resize-none"
            placeholder="Votre message..."
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold hover:from-yellow-300 transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Envoyer le message
        </button>

        {sent && (
          <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/50 text-green-300 text-sm text-center">
            ✅ Message envoyé ! (démo)
          </div>
        )}
      </form>
    </div>
  );
}