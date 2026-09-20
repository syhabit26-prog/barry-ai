import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
  const sig = req.headers.get("stripe-signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret manquant" }, { status: 500 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    const { supabaseAdmin } = await import("@/lib/supabaseAdmin");

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const feature = session.metadata?.feature;
      const tier = session.metadata?.tier;
      const planId = session.metadata?.planId;

      if (userId && feature) {
        // Upsert dans user_features (une ligne par feature)
        await supabaseAdmin.from("user_features").upsert(
          {
            user_id: userId,
            feature,
            tier,
            plan_id: planId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            status: "active",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,feature" }
        );

        // Historique global
        await supabaseAdmin.from("subscriptions").insert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: "active",
          plan: planId || "pro",
        });

        console.log("✅ Abonnement activé:", userId, feature, tier);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      await supabaseAdmin
        .from("user_features")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", sub.id);

      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", sub.id);
    }

    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;
      await supabaseAdmin
        .from("user_features")
        .update({ status: sub.status })
        .eq("stripe_subscription_id", sub.id);
    }
  } catch (e) {
    console.error("Webhook error:", e);
  }

  return NextResponse.json({ received: true });
}