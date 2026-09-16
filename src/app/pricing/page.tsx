import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen px-6 py-16 max-w-6xl mx-auto text-yellow-100">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-yellow-300 tracking-wider mb-4">Nos Tarifs</h1>
        <p className="text-yellow-100/70">Choisissez le plan qui vous convient</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlanCard
          name="Gratuit"
          price="0€"
          period="/mois"
          features={["Accès à Groq (Llama)", "50 messages / jour", "Réponses en français", "Support communautaire"]}
          highlighted={false}
        />
        <PlanCard
          name="Premium"
          price="9€"
          period="/mois"
          features={["4 IA débloquées", "Messages illimités", "Réponses priorité haute", "Support par email", "Historique sauvegardé"]}
          highlighted={true}
        />
        <PlanCard
          name="Entreprise"
          price="29€"
          period="/mois"
          features={["Tout le plan Premium", "API dédiée", "SLA garanti 99%", "Support 24/7", "Formation personnalisée"]}
          highlighted={false}
        />
      </div>
    </div>
  );
}

function PlanCard({ name, price, period, features, highlighted }: any) {
  return (
    <div
      className={
        "p-8 rounded-2xl border backdrop-blur-md flex flex-col " +
        (highlighted
          ? "border-yellow-400 bg-gradient-to-b from-yellow-400/10 to-black/60 scale-105 shadow-2xl shadow-yellow-400/20"
          : "border-yellow-400/30 bg-black/60")
      }
    >
      {highlighted && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-bold self-start mb-4">
          <Sparkles className="w-3 h-3" />
          Populaire
        </div>
      )}
      <h3 className="text-2xl font-black text-yellow-300 mb-2">{name}</h3>
      <div className="flex items-end gap-1 mb-6">
        <span className="text-4xl font-black text-yellow-300">{price}</span>
        <span className="text-yellow-500/70 text-sm mb-1">{period}</span>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-sm text-yellow-100/80">
            <Check className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      <Link
        href="/chat"
        className={
          "block text-center py-3 rounded-xl font-bold transition-all " +
          (highlighted
            ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300"
            : "border-2 border-yellow-400/50 text-yellow-300 hover:bg-yellow-400/10")
        }
      >
        Choisir ce plan
      </Link>
    </div>
  );
}