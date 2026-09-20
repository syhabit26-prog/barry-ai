import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

const COMMISSION_RATE = 0.02;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "Signature manquante" }, { status: 400 });

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("❌ Signature invalide:", err.message);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  console.log("🔔 Webhook:", event.type);

  // ═══ PAIEMENT RÉUSSI ═══
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    console.log("💰 Paiement :", session.id);

    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const creatorUserId = session.metadata?.creatorUserId;

      // ⭐ 1. Enregistre la commission (2% pour BARRY AI)
      if (creatorUserId) {
        const total = (session.amount_total || 0) / 100;
        const commission = total * COMMISSION_RATE;
        const creatorEarnings = total - commission;

        await supabaseAdmin.from("transactions").insert({
          user_id: creatorUserId,
          project_id: session.metadata?.projectId || null,
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent || null,
          amount_total: total,
          application_fee: commission,
          creator_earnings: creatorEarnings,
          currency: (session.currency || "eur").toUpperCase(),
          customer_email: session.customer_details?.email || "",
          status: "paid",
        });

        console.log(`💵 Commission: ${commission.toFixed(2)}€ | Créateur: ${creatorEarnings.toFixed(2)}€`);
      }

      // ⭐ 2. Déclenche la commande CJ
      await fetch(`${appUrl}/api/cj/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          customerEmail: session.customer_details?.email || "",
          customerName: session.shipping_details?.name || "Client",
          amount: (session.amount_total || 0) / 100,
          userId: creatorUserId,
          projectId: session.metadata?.projectId || null,
        }),
      });
    } catch (err: any) {
      console.error("❌ Erreur:", err.message);
    }
  }

  // ⭐ Statut compte Connect mis à jour
  if (event.type === "account.updated") {
    const account = event.data.object as any;
    console.log("🔄 Compte Connect mis à jour :", account.id);

    await supabaseAdmin
      .from("stripe_accounts")
      .update({
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_account_id", account.id);
  }

  return NextResponse.json({ received: true });
}