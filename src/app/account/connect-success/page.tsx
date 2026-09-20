"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function ConnectSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/account/connect-stripe"), 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6">
      <div className="max-w-md text-center bg-white rounded-3xl shadow-2xl p-10">
        <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-zinc-900 mb-3">Compte connecté ! 🎉</h1>
        <p className="text-zinc-500 mb-6">
          Tu reçois maintenant <strong>98%</strong> de chaque vente directement sur ton compte bancaire.
        </p>
        <p className="text-xs text-zinc-400">Redirection dans 3 secondes...</p>
      </div>
    </div>
  );
}