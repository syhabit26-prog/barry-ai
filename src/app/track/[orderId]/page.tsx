"use client";

import { useEffect, useState } from "react";
import { Package, MapPin, CheckCircle2, Truck, Home } from "lucide-react";

export default function TrackPage({ params }: { params: { orderId: string } }) {
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/cj/track?orderId=${params.orderId}`)
      .then((r) => r.json())
      .then(setTracking)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.orderId]);

  return (
    <div className="min-h-screen bg-zinc-50 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
          <Package className="w-8 h-8 text-orange-500" />
          Suivi de commande
        </h1>

        {loading && <p className="text-zinc-500">Chargement...</p>}

        {!loading && !tracking && (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-zinc-500">Aucune information de suivi disponible</p>
          </div>
        )}

        {tracking?.data && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="mb-6">
              <p className="text-sm text-zinc-500 mb-1">N° de commande</p>
              <p className="font-bold text-lg">{params.orderId}</p>
            </div>

            <div className="space-y-4">
              {tracking.data.trackList?.map((step: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{step.trackInfo}</p>
                    <p className="text-xs text-zinc-500 mt-1">{step.trackTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}