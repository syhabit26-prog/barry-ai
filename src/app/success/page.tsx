"use client";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-md w-full text-center">

        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-zinc-900 mb-3 tracking-tight">
          Commande confirmée
        </h1>

        <p className="text-zinc-600 mb-2">
          Merci pour ton achat !
        </p>

        <p className="text-zinc-500 text-sm mb-8">
          Tu vas recevoir un email de confirmation dans quelques minutes.
          Le colis arrivera sous 7 à 15 jours.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="javascript:window.close()"
            className="px-6 py-3 rounded-lg border border-zinc-200 text-zinc-700 font-medium hover:bg-zinc-50 transition-colors"
          >
            Fermer cet onglet
          </a>
          <a
            href="/builder"
            className="px-6 py-3 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors"
          >
            Retour au Builder
          </a>
        </div>

      </div>
    </div>
  );
}