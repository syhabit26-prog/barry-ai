import Link from "next/link";
import { Building2, Users, Target, Award, TrendingUp, Globe, ArrowRight } from "lucide-react";

export default function EntreprisePage() {
  return (
    <div className="min-h-screen px-6 py-16 max-w-6xl mx-auto text-yellow-100">

      {/* HEADER */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-400/40 bg-black/60 mb-6">
          <Building2 className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-xs text-yellow-300">Entreprise</span>
        </div>
        <h1 className="text-5xl font-black text-yellow-300 tracking-wider mb-4">
          BARRY AI pour les entreprises
        </h1>
        <p className="text-yellow-100/70 max-w-2xl mx-auto text-lg">
          Solutions IA sur mesure pour votre activité. Gagnez du temps, automatisez, innovez.
        </p>
      </div>

      {/* SERVICES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card
          icon={<Target className="w-7 h-7" />}
          title="Automatisation"
          desc="Automatisez vos tâches répétitives : emails, rapports, factures, support client."
        />
        <Card
          icon={<TrendingUp className="w-7 h-7" />}
          title="Growth"
          desc="Stratégies marketing, analyse de données, prédictions IA pour booster votre croissance."
        />
        <Card
          icon={<Globe className="w-7 h-7" />}
          title="Sites sur mesure"
          desc="Créez vos sites web, applications internes et outils métiers en quelques minutes."
        />
      </div>

      {/* AVANTAGES */}
      <div className="p-8 rounded-2xl border border-yellow-400/30 bg-gradient-to-br from-yellow-400/5 to-black/60 mb-16">
        <h2 className="text-3xl font-bold text-yellow-300 mb-6 text-center">
          Pourquoi choisir BARRY AI ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Advantage text="4 agents experts (Comptable, Analyste, Marketing, Cyber)" />
          <Advantage text="9 modèles IA parmi les meilleurs du marché" />
          <Advantage text="6 connecteurs prêts (Gmail, X, Shopify, Stripe...)" />
          <Advantage text="Génération de sites/boutiques en 15 secondes" />
          <Advantage text="Paiements PayPal et Stripe intégrés" />
          <Advantage text="Sécurité et confidentialité garanties" />
        </div>
      </div>

      {/* TARIFS ENTREPRISE */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-yellow-300 mb-3">
          Tarifs Entreprise
        </h2>
        <p className="text-yellow-100/60">Choisissez le plan adapté à vos besoins</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <PlanCard
          name="Startup"
          price="29€"
          features={[
            "Accès à 9 IA",
            "50 sites/mois",
            "Connecteurs illimités",
            "Support email",
          ]}
        />
        <PlanCard
          name="Business"
          price="99€"
          highlighted
          features={[
            "Tout Startup +",
            "500 sites/mois",
            "Agents personnalisés",
            "Support prioritaire",
            "API dédiée",
          ]}
        />
        <PlanCard
          name="Enterprise"
          price="Sur devis"
          features={[
            "Tout Business +",
            "Sites illimités",
            "Formation équipe",
            "Support 24/7",
            "SLA garanti",
          ]}
        />
      </div>

      {/* CTA */}
      <div className="text-center p-10 rounded-2xl border border-yellow-400/30 bg-gradient-to-r from-yellow-400/10 to-yellow-600/5">
        <h2 className="text-3xl font-black text-yellow-300 mb-4">
          Prêt à transformer votre entreprise ?
        </h2>
        <p className="text-yellow-100/70 mb-6">
          Contactez-nous pour une démo personnalisée
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all"
        >
          Demander une démo
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

    </div>
  );
}

function Card({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl border border-yellow-400/30 bg-black/60 hover:border-yellow-400/60 transition-all">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black mb-4">
        {icon}
      </div>
      <h3 className="text-yellow-300 font-bold text-lg mb-2">{title}</h3>
      <p className="text-yellow-100/60 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Advantage({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-green-400/20 border border-green-400/50 flex items-center justify-center flex-shrink-0">
        <span className="text-green-400 text-xs">✓</span>
      </div>
      <span className="text-yellow-100/80 text-sm">{text}</span>
    </div>
  );
}

function PlanCard({
  name, price, features, highlighted,
}: {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={
        "p-8 rounded-2xl border flex flex-col " +
        (highlighted
          ? "border-yellow-400 bg-gradient-to-b from-yellow-400/10 to-black/60 scale-105 shadow-2xl shadow-yellow-400/20"
          : "border-yellow-400/30 bg-black/60")
      }
    >
      {highlighted && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-bold self-start mb-4">
          ⭐ Populaire
        </div>
      )}
      <h3 className="text-2xl font-black text-yellow-300 mb-2">{name}</h3>
      <div className="text-4xl font-black text-yellow-300 mb-6">{price}</div>
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-yellow-100/80">
            <span className="text-yellow-400 mt-0.5">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/contact"
        className={
          "block text-center py-3 rounded-xl font-bold transition-all " +
          (highlighted
            ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black"
            : "border-2 border-yellow-400/50 text-yellow-300 hover:bg-yellow-400/10")
        }
      >
        Choisir ce plan
      </Link>
    </div>
  );
}