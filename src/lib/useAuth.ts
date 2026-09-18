"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export type UserProfile = {
  id: string;
  email: string;
  phone: string;
  language: string;
  stripe_customer_id?: string;
  blocked?: boolean;
  created_at?: string;
};

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupère la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Écoute les changements
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    setProfile(data);
    setLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return { user, profile, loading, signOut };
}