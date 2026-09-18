import Link from "next/link";
import { AGENTS } from "@/lib/agents";
import { ArrowRight } from "lucide-react";

export default function AgentsPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 overflow-hidden">

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-[20%] -left-[10%] w-[55%] h-[60%] rounded-full opacity-30 blur-[120px]"
          style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
        />
        <div
          className="absolute -bottom-[20%] -right-[10%] w-[55%] h-[60%] rounded-full opacity-30 blur-[120px]"
          style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
        />
        <div
          className="absolute top-[40%] left-[45%] w-[35%] h-[35%] rounded-full opacity-20 blur-[100px]"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">

        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-4">
            Ton équipe d'
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-red-500 bg-clip-text text-transparent">
              experts
            </span>
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {AGENTS.length} experts IA spécialisés, disponibles 24/7 pour t'aider.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {AGENTS.map((agent, index) => {
            const isBlue = index % 2 === 0;
            const gradient = isBlue
              ? "from-blue-600 to-blue-500"
              : "from-red-600 to-red-500";
            const borderColor = isBlue
              ? "border-blue-300 hover:border-blue-500"
              : "border-red-300 hover:border-red-500";
            const bgHover = isBlue ? "hover:bg-blue-50" : "hover:bg-red-50";
            const textColor = isBlue ? "text-blue-700" : "text-red-700";
            const shadowColor = isBlue
              ? "hover:shadow-blue-500/20"
              : "hover:shadow-red-500/20";

            return (
              <Link key={agent.slug} href={"/agents/" + agent.slug}>
                <div
                  className={
                    "group p-6 rounded-2xl border-2 bg-white/80 backdrop-blur-sm transition-all cursor-pointer h-full shadow-sm hover:shadow-xl hover:scale-[1.02] " +
                    borderColor + " " + bgHover + " " + shadowColor
                  }
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={
                        "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg bg-gradient-to-br " +
                        gradient
                      }
                    >
                      <span>{agent.emoji}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {agent.name}
                      </h2>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {agent.tagline}
                      </p>
                      <div
                        className={
                          "inline-flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all " +
                          textColor
                        }
                      >
                        Discuter avec cet agent
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-500 mt-16">
          BARRY AI · Créé par Mouhamed Barry
        </p>
      </div>
    </div>
  );
}