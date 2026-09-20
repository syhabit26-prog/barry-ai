export default function CGVPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-zinc-800">
      <h1 className="text-4xl font-black mb-8">Conditions Générales de Vente</h1>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">1. Objet</h2>
          <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre BARRY AI et tout utilisateur effectuant un achat sur une boutique créée via notre plateforme.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">2. Produits</h2>
          <p>Les produits proposés sont expédiés directement depuis nos entrepôts partenaires internationaux. Les photos sont non contractuelles. Les descriptions sont fournies à titre indicatif.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">3. Prix et frais de port</h2>
          <p>Les prix sont indiqués en euros, toutes taxes comprises. Les frais de port sont calculés selon le pays de livraison et affichés avant le paiement.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">4. Livraison</h2>
          <p>Les délais de livraison sont estimés entre 5 et 20 jours ouvrés selon la destination. Un numéro de suivi est fourni par email après expédition.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">5. Droit de rétractation</h2>
          <p>Conformément à la législation en vigueur, vous disposez de 14 jours à compter de la réception pour exercer votre droit de rétractation. Voir notre page <a href="/legal/refund" className="text-orange-500 underline">Politique de remboursement</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">6. Paiement</h2>
          <p>Le paiement est sécurisé via Stripe et PayPal. Nous n'avons jamais accès à vos informations bancaires.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">7. Données personnelles</h2>
          <p>Vos données sont traitées conformément au RGPD. Voir notre <a href="/legal/privacy" className="text-orange-500 underline">Politique de confidentialité</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">8. Contact</h2>
          <p>Pour toute question : support@barry-ai.com</p>
        </section>
      </div>
    </div>
  );
}