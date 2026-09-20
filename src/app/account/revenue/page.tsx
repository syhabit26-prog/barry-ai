"use client";

import { useEffect, useState } from "react";
import { Euro, TrendingUp, ShoppingCart, Percent } from "lucide-react";

export default function RevenuePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const userId = "demo-user-1"; // ⚠️ Remplace par ton auth

  useEffect(() => {
    fetch(`/api/account/revenue?userId=${userId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-16 text-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-2">💰 Mes revenus</h1>
        <p className="text-zinc-500 mb-8">Vos gains sur BARRY AI</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg">
            <Euro className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-80">Solde total</p>
            <p className="text-3xl font-black mt-1">{(data?.totalEarnings || 0).toFixed(2)} €</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <ShoppingCart className="w-8 h-8 text-orange-500 mb-3" />
            <p className="text-sm text-zinc-500">Commandes</p>
            <p className="text-3xl font-black mt-1">{data?.totalOrders || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <TrendingUp className="w-8 h-8 text-blue-500 mb-3" />
            <p className="text-sm text-zinc-500">Ce mois</p>
            <p className="text-3xl font-black mt-1">{(data?.thisMonth || 0).toFixed(2)} €</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <Percent className="w-8 h-8 text-purple-500 mb-3" />
            <p className="text-sm text-zinc-500">Commission BARRY</p>
            <p className="text-3xl font-black mt-1">{(data?.totalCommission || 0).toFixed(2)} €</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-6 border-b border-zinc-100">
            <h2 className="text-xl font-bold">Historique des ventes</h2>
          </div>

          {!data?.transactions || data.transactions.length === 0 ? (
            <div className="p-16 text-center text-zinc-400">
              Aucune vente pour l'instant
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-zinc-500">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Date</th>
                  <th className="text-left px-6 py-3 font-medium">Commande</th>
                  <th className="text-right px-6 py-3 font-medium">Total</th>
                  <th className="text-right px-6 py-3 font-medium">Commission</th>
                  <th className="text-right px-6 py-3 font-medium">Votre gain</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((t: any) => (
                  <tr key={t.id} className="border-t border-zinc-100 hover:bg-zinc-50">
                    <td className="px-6 py-4 text-zinc-500">
                      {new Date(t.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {t.stripe_session_id?.slice(0, 20)}...
                    </td>
                    <td className="px-6 py-4 text-right">{t.amount_total.toFixed(2)} €</td>
                    <td className="px-6 py-4 text-right text-red-500">-{t.application_fee.toFixed(2)} €</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                      {t.creator_earnings.toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}