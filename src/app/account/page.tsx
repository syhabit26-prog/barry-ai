"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Mail, Phone, Globe, LogOut, Loader2,
  Crown, Calendar, Check,
} from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/lib/i18n/LanguageContext";
import { LANGUAGES, type Lang } from "@/lib/i18n/translations";

type Subscription = {
  id: string;
  service: string;
  tier: string;
  duration: string;
  status: string;
  amount_paid: number;
  currency: string;
  current_period_end: string;
};

export default function AccountPage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const { t, setLang } = useLang();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadSubscriptions();
    }
  }, [user]);

  const loadSubscriptions = async () => {
    setLoadingSubs(true);
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    setSubs(data || []);
    setLoadingSubs(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-1">
            Mon compte
          </h1>
          <p className="text-zinc-500">Gère tes informations et tes abonnements</p>
        </div>

        {/* PROFIL */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 mb-6">
          <h2 className="text-[14px] font-semibold text-zinc-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4" />
            Informations
          </h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3 py-2 border-b border-zinc-100">
              <Mail className="w-4 h-4 text-zinc-400" />
              <span className="text-[14px] text-zinc-700">{user.email}</span>
            </div>

            {profile?.phone && (
              <div className="flex items-center gap-3 py-2 border-b border-zinc-100">
                <Phone className="w-4 h-4 text-zinc-400" />
                <span className="text-[14px] text-zinc-700">{profile.phone}</span>
              </div>
            )}

            <div className="flex items-center gap-3 py-2">
              <Globe className="w-4 h-4 text-zinc-400" />
              <span className="text-[14px] text-zinc-700">
                Langue : {profile?.language?.toUpperCase() || "FR"}
              </span>
            </div>
          </div>

          {/* Changement de langue */}
          <div className="mt-4 pt-4 border-t border-zinc-100">
            <p className="text-[12px] font-medium text-zinc-500 mb-2">Changer la langue</p>
            <div className="flex gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={async () => {
                    setLang(l.code);
                    await supabase
                      .from("profiles")
                      .update({ language: l.code })
                      .eq("id", user.id);
                  }}
                  className={
                    "px-3 py-2 rounded-lg text-[16px] transition-all " +
                    (profile?.language === l.code
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 hover:bg-zinc-200")
                  }
                  title={l.name}
                >
                  {l.flag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ABONNEMENTS */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-semibold text-zinc-900 flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Mes abonnements
            </h2>
            <Link
              href="/pricing"
              className="text-[12px] font-medium text-zinc-900 hover:underline"
            >
              + Ajouter un plan
            </Link>
          </div>

          {loadingSubs ? (
            <div className="text-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-zinc-400 mx-auto" />
            </div>
          ) : subs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-500 text-[13px] mb-3">
                Aucun abonnement actif
              </p>
              <Link
                href="/pricing"
                className="inline-block px-4 py-2 rounded-lg bg-zinc-900 text-white text-[13px] font-semibold hover:bg-zinc-800 transition-all"
              >
                Voir les plans
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {subs.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Check className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-zinc-900">
                        {sub.service.toUpperCase()} · {sub.tier}
                      </p>
                      <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        Expire le {new Date(sub.current_period_end).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-bold text-zinc-900">
                      {sub.amount_paid} {sub.currency}
                    </p>
                    <p className="text-[10px] text-zinc-500">/{sub.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DÉCONNEXION */}
        <button
          onClick={signOut}
          className="w-full py-3 rounded-xl border border-red-200 text-red-600 font-medium text-[13px] hover:bg-red-50 transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>

      </div>
    </div>
  );
}