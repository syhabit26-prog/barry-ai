export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-zinc-800">
      <h1 className="text-4xl font-black mb-8">Politique de remboursement</h1>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">Délai de rétractation</h2>
          <p>Vous disposez de <strong>14 jours</strong> à compter de la réception de votre colis pour demander un remboursement, conformément à la directive européenne 2011/83/UE.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">Conditions</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Le produit doit être non utilisé et dans son emballage d'origine</li>
            <li>Les frais de retour sont à votre charge (sauf défaut produit)</li>
            <li>Le remboursement est effectué sous 14 jours après réception du retour</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">Procédure</h2>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Envoyez un email à <strong>refund@barry-ai.com</strong></li>
            <li>Indiquez votre numéro de commande</li>
            <li>Nous vous envoyons l'adresse de retour</li>
            <li>Expédiez le colis avec un suivi</li>
            <li>Remboursement sous 14 jours</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3">Produit défectueux</h2>
          <p>Si votre produit arrive endommagé, envoyez-nous des photos sous 48h. Nous vous rembourserons intégralement ou vous renverrons un nouveau produit.</p>
        </section>
      </div>
    </div>
  );
}