import Link from "next/link";
import { AGENTS } from "@/lib/agents";
import { ArrowRight, Bot } from "lucide-react";

export default function AgentsPage() {
  return (
    <div className="min-h-screen px-6 py-16 max-w-6xl mx-auto text-yellow-100">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-400/40 bg-black/60 mb-6">
          <Bot className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-xs text-yellow-300">Agents spécialisés</span>
        </div>
        <h1 className="text-5xl font-black text-yellow-300 tracking-wider mb-4">
          Ton équipe d'experts
        </h1>
        <p className="text-yellow-100/70 max-w-2xl mx-auto">
          4 experts IA spécialisés, disponibles 24/7 pour t'aider.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {AGENTS.map((agent) => (
          <Link key={agent.slug} href={"/agents/" + agent.slug}>
            <div className="group p-8 rounded-2xl border border-yellow-400/30 bg-black/60 backdrop-blur-md hover:border-yellow-400/80 transition-all cursor-pointer h-full">
              <div className="flex items-start gap-5">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                  style={{ background: agent.color + "33", border: "1px solid " + agent.color + "88" }}
                >
                  {agent.emoji}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-yellow-300 mb-1">
                    {agent.name}
                  </h2>
                  <p className="text-yellow-100/60 text-sm mb-4">
                    {agent.tagline}
                  </p>
                  <div className="inline-flex items-center gap-2 text-yellow-400 text-sm font-bold group-hover:gap-3 transition-all">
                    Discuter avec cet agent
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}