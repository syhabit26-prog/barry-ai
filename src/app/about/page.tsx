import { Sparkles, Target, Users, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen px-6 py-16 max-w-5xl mx-auto text-yellow-100">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-yellow-300 tracking-wider mb-4">À propos de BARRY AI</h1>
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-6" />
        <p className="text-yellow-100/80 max-w-2xl mx-auto">
          BARRY AI est né d'une vision simple : rendre l'intelligence artificielle accessible, élégante et puissante pour tous.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <InfoCard icon={<Target className="w-7 h-7" />} title="Notre mission" desc="Démocratiser l'accès aux meilleures IA du marché dans une interface unique." />
        <InfoCard icon={<Users className="w-7 h-7" />} title="Notre équipe" desc="Des passionnés de tech et d'IA qui veulent simplifier votre quotidien." />
        <InfoCard icon={<Award className="w-7 h-7" />} title="Notre valeur" desc="Qualité, rapidité et élégance dans chaque interaction." />
      </div>

      <div className="p-8 rounded-2xl border border-yellow-400/30 bg-black/60 backdrop-blur-md">
        <h2 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6" /> Technologies utilisées
        </h2>
        <ul className="space-y-3 text-yellow-100/80">
          <li>⚡ <strong className="text-yellow-300">Next.js 16</strong> — Framework React moderne</li>
          <li>🎨 <strong className="text-yellow-300">Tailwind CSS</strong> — Design premium</li>
          <li>🤖 <strong className="text-yellow-300">4 IA de pointe</strong> — OpenAI, Claude, DeepSeek, Groq</li>
          <li>📝 <strong className="text-yellow-300">React Markdown</strong> — Réponses formatées</li>
        </ul>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl border border-yellow-400/30 bg-black/60 backdrop-blur-md text-center">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black mx-auto mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-yellow-300 text-lg mb-2">{title}</h3>
      <p className="text-yellow-100/70 text-sm">{desc}</p>
    </div>
  );
}