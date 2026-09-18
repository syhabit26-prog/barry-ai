import Link from "next/link";
import { Rocket, Heart, Users, Target, Sparkles, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">

      {/* Halos arc-en-ciel */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600/30 blur-[150px]" />
        <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full bg-pink-500/25 blur-[130px]" />
        <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-orange-500/25 blur-[130px]" />
        <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] rounded-full bg-yellow-400/20 blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[150px]" />
      </div>

      <div className="relative z-10 px-6 py-16 max-w-6xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur mb-6">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs text-white/80">À propos de BARRY AI</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              L'IA qui libère
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              votre créativité
            </span>
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            BARRY AI est né d'une conviction simple : <strong className="text-white">chacun mérite d'avoir accès aux meilleures technologies</strong>, sans complexité, sans barrière, sans jargon technique.
          </p>
        </div>

        {/* NOTRE HISTOIRE */}
        <div className="mb-20 p-8 md:p-12 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur">
          <h2 className="text-3xl md:text-4xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Notre histoire
          </h2>
          <div className="space-y-4 text-white/70 leading-relaxed">
            <p>
              Créé par <strong className="text-white">Mouhamed Barry</strong>, BARRY AI est le fruit d'une obsession : rendre l'intelligence artificielle <strong className="text-white">vraiment utile</strong> pour les créateurs, entrepreneurs, étudiants et rêveurs.
            </p>
            <p>
              Chaque jour, nous repoussons les limites pour que créer un site, écrire un business plan, préparer un entretien ou lancer une boutique en ligne devienne aussi simple qu'une conversation.
            </p>
            <p className="text-white">
              Notre mission est claire : <strong className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">démocratiser le pouvoir de l'IA</strong> pour que chacun puisse transformer ses idées en réalité.
            </p>
          </div>
        </div>

        {/* 4 CARTES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <Card
            icon={<Target className="w-7 h-7" />}
            title="Notre mission"
            desc="Rendre l'IA accessible à tous, sans barrière technique ni prix exorbitant. Chaque idée mérite d'être réalisée."
            gradient="from-purple-500 to-pink-500"
          />
          <Card
            icon={<Rocket className="w-7 h-7" />}
            title="Notre vision"
            desc="Un monde où chaque créateur, entrepreneur ou étudiant a un assistant IA personnel capable de concrétiser ses projets."
            gradient="from-pink-500 to-orange-500"
          />
          <Card
            icon={<Heart className="w-7 h-7" />}
            title="Nos valeurs"
            desc="Excellence, simplicité, transparence. Nous croyons en une IA utile, éthique et respectueuse de ses utilisateurs."
            gradient="from-orange-500 to-yellow-500"
          />
          <Card
            icon={<Users className="w-7 h-7" />}
            title="Notre équipe"
            desc="Une équipe de passionnés de tech et d'IA, animée par l'envie de simplifier la vie des créateurs."
            gradient="from-yellow-500 to-purple-500"
          />
        </div>

        {/* CHIFFRES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          <Stat number="9+" label="Modèles IA disponibles" gradient="from-purple-400 to-pink-500" />
          <Stat number="15s" label="Pour créer un site" gradient="from-pink-400 to-orange-500" />
          <Stat number="24/7" label="Disponibilité totale" gradient="from-orange-400 to-yellow-500" />
          <Stat number="∞" label="Possibilités créatives" gradient="from-yellow-400 to-purple-500" />
        </div>

        {/* CTA */}
        <div className="relative p-10 md:p-16 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur overflow-hidden text-center">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-pink-500/20 blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-yellow-400/20 blur-[100px]" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                Prêt à créer quelque chose d'extraordinaire ?
              </span>
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Rejoins des milliers de créateurs qui construisent déjà leur avenir avec BARRY AI.
            </p>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-pink-500/30"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

function Card({
  icon,
  title,
  desc,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  gradient: string;
}) {
  return (
    <div className="group p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur hover:border-white/20 hover:bg-white/[0.05] transition-all">
      <div
        className={
          "w-14 h-14 rounded-2xl bg-gradient-to-br " + gradient +
          " flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform"
        }
      >
        {icon}
      </div>
      <h3 className="text-xl font-black text-white mb-2">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Stat({ number, label, gradient }: { number: string; label: string; gradient: string }) {
  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur text-center">
      <div className={"text-3xl md:text-4xl font-black bg-gradient-to-r " + gradient + " bg-clip-text text-transparent mb-2"}>
        {number}
      </div>
      <div className="text-xs text-white/60 uppercase tracking-wider">{label}</div>
    </div>
  );
}