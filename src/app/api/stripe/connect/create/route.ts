import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createConnectAccount, createAccountLink } from "@/lib/stripeConnect";

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();

    if (!userId || !email) {
      return NextResponse.json({ error: "userId et email requis" }, { status: 400 });
    }

    // Vérifie si un compte existe déjà
    const { data: existing } = await supabaseAdmin
      .from("stripe_accounts")
      .select("*")
      .eq("user_id", userId)
      .single();

    let accountId = existing?.stripe_account_id;

    // Crée le compte si inexistant
    if (!accountId) {
      const account = await createConnectAccount(userId, email);
      accountId = account.id;

      await supabaseAdmin.from("stripe_accounts").insert({
        user_id: userId,
        stripe_account_id: accountId,
        email,
        details_submitted: false,
        charges_enabled: false,
      });
    }

    // Génère le lien d'onboarding
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const onboardingUrl = await createAccountLink(accountId, appUrl);

    console.log("✅ Onboarding URL généré pour", userId);
    return NextResponse.json({ url: onboardingUrl, accountId });
  } catch (err: any) {
    console.error("❌ Erreur Connect:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}