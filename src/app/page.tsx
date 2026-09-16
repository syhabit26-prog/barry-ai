import Link from "next/link";
import {
  Sparkles, ArrowRight, Zap, Shield, Rocket,
  Code2, MessageCircle, Wand2, Bot, ShoppingBag,
  Lock, Globe, Layers, Cpu, Check,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-yellow-300">

      {/* ═══════════════ HERO ═══════════════ */}
      <section
        className="relative min-h-[95vh] flex flex-col items-center justify-center px-6 py-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=1920&q=95')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black pointer-events-none" />

        <div className="relative z-10 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-400/40 bg-black/60 backdrop-blur-sm mb-6">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs text-yellow-300">
              Propulsé par 9 IA · 6 Connecteurs · 4 Agents
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 drop-shadow-[0_4px_20px_rgba(0,0,0,1)]">
            Créez quelque chose
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              avec BARRY AI
            </span>
          </h1>

          <p className="text-yellow-100/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            Décrivez votre idée. BARRY AI la transforme en <strong>site web</strong>, <strong>jeu</strong>, <strong>app</strong> ou <strong>boutique e-commerce</strong> en 15 secondes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/builder"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-base hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-2xl shadow-yellow-400/50"
            >
              <Wand2 className="w-5 h-5" />
              Commencer à créer
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-yellow-400/50 text-yellow-300 font-bold text-base hover:bg-yellow-400/10 transition-all bg-black/40 backdrop-blur-sm"
            >
              <MessageCircle className="w-5 h-5" />
              Discuter avec l'IA
            </Link>
          </div>

          <div className="flex justify-center gap-8 mt-16 text-center flex-wrap">
            <Stat number="9" label="Modèles IA" />
            <Stat number="15s" label="Génération" />
            <Stat number="6" label="Connecteurs" />
            <Stat number="0€" label="Pour commencer" />
          </div>
        </div>
      </section>

      {/* ═══════════════ 4 PILIERS ═══════════════ */}
      <section className="px-6 py-20 border-t border-yellow-400/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Une seule plateforme.{" "}
              <span className="text-yellow-400">Des possibilités infinies.</span>
            </h2>
            <p className="text-yellow-100/70 max-w-2xl mx-auto">
              BARRY AI réunit tous les outils dont vous avez besoin pour créer,
              automatiser et développer votre activité.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PillarCard
              icon={<Wand2 className="w-7 h-7" />}
              title="Builder"
              desc="Créez sites, jeux, apps et boutiques e-commerce en un prompt."
              href="/builder"
            />
            <PillarCard
              icon={<MessageCircle className="w-7 h-7" />}
              title="Chat IA"
              desc="9 modèles IA : OpenAI, Claude, Gemini, Groq, Mistral, Cohere..."
              href="/chat"
            />
            <PillarCard
              icon={<Bot className="w-7 h-7" />}
              title="Agents"
              desc="Comptable, Analyste, Marketing et Cybersécurité à votre service."
              href="/agents"
            />
            <PillarCard
              icon={<Layers className="w-7 h-7" />}
              title="Connecteurs"
              desc="Gmail, YouTube, X, Shopify, PayPal, Stripe et CJ Dropshipping."
              href="/connectors"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ FONCTIONNALITÉS ═══════════════ */}
      <section className="px-6 py-20 border-t border-yellow-400/20 bg-gradient-to-b from-black via-yellow-950/5 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Tout ce que BARRY AI peut faire
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Globe className="w-6 h-6" />}
              title="Sites web"
              desc="Landing pages, portfolios, blogs — responsive et modernes."
            />
            <FeatureCard
              icon={<Code2 className="w-6 h-6" />}
              title="Jeux vidéo"
              desc="Snake, Memory, Puzzle et plus — jouables instantanément."
            />
            <FeatureCard
              icon={<ShoppingBag className="w-6 h-6" />}
              title="Boutiques e-commerce"
              desc="Dropshipping avec CJ — produits réels et paiements Stripe."
            />
            <FeatureCard
              icon={<Cpu className="w-6 h-6" />}
              title="9 modèles IA"
              desc="Les meilleures IA du marché dans une seule interface."
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6" />}
              title="Sécurité maximale"
              desc="Filtre de contenu intégré. Vos clés restent privées."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Ultra rapide"
              desc="Réponses en moins de 5 secondes. Génération en 15s."
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="px-6 py-24 border-t border-yellow-400/20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 mb-6">
            <Rocket className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Prêt à créer ?
          </h2>
          <p className="text-yellow-100/70 mb-10 text-lg">
            Rejoignez BARRY AI et lancez votre premier projet en moins de 60 secondes.
            <br />
            Aucune carte bancaire requise.
          </p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black text-lg hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-2xl shadow-yellow-400/50"
          >
            <Wand2 className="w-6 h-6" />
            Créer maintenant
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
        {number}
      </div>
      <div className="text-xs text-yellow-500/70 uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}

function PillarCard({
  icon, title, desc, href,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="group p-6 rounded-2xl border border-yellow-400/30 bg-black/60 backdrop-blur-md hover:border-yellow-400/80 hover:bg-yellow-400/5 transition-all cursor-pointer h-full">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black mb-4">
          {icon}
        </div>
        <h3 className="text-yellow-300 font-bold text-lg mb-2">{title}</h3>
        <p className="text-yellow-100/60 text-sm leading-relaxed mb-4">{desc}</p>
        <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold group-hover:gap-2 transition-all">
          Découvrir
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}

function FeatureCard({
  icon, title, desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-6 rounded-2xl border border-yellow-400/20 bg-black/40 hover:border-yellow-400/50 hover:bg-yellow-400/5 transition-all">
      <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/40 flex items-center justify-center text-yellow-400 mb-4">
        {icon}
      </div>
      <h3 className="text-yellow-300 font-bold text-base mb-2">{title}</h3>
      <p className="text-yellow-100/60 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}