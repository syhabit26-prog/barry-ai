export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-zinc-800">
      <h1 className="text-4xl font-black mb-8">Politique de confidentialité</h1>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">Données collectées</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Nom et prénom (livraison)</li>
            <li>Adresse email</li>
            <li>Adresse postale de livraison</li>
            <li>Numéro de téléphone (transporteur)</li>
            <li>Données de paiement (gérées par Stripe/PayPal)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">Utilisation</h2>
          <p>Vos données servent uniquement à :</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Traiter votre commande</li>
            <li>Assurer la livraison</li>
            <li>Vous envoyer les confirmations et suivis</li>
            <li>Répondre à vos demandes de support</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">Partage</h2>
          <p>Vos données sont partagées uniquement avec : Stripe (paiement), CJ Dropshipping (expédition), le transporteur (livraison).</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">Vos droits (RGPD)</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit de portabilité</li>
          </ul>
          <p className="mt-2">Pour exercer ces droits : <strong>privacy@barry-ai.com</strong></p>
        </section>
      </div>
    </div>
  );
}