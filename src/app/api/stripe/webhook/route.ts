import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getPlanById } from "@/lib/plans";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { ok: false, error: "Signature manquante" },
      { status: 400 }
    );
  }

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error("❌ Signature invalide :", err.message);
    return NextResponse.json(
      { ok: false, error: "Signature invalide" },
      { status: 400 }
    );
  }

  console.log("📩 Événement Stripe:", event.type);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      const customerEmail = session.customer_details?.email || "";
      const customerName = session.customer_details?.name || "";
      const amount = (session.amount_total || 0) / 100;

      const planId = session.metadata?.planId;
      const userId = session.metadata?.userId;

      if (planId && userId) {
        console.log("💳 Abonnement BARRY AI:", planId);

        const plan = getPlanById(planId);
        if (!plan) {
          console.warn("⚠️ Plan introuvable:", planId);
          return NextResponse.json({ ok: true });
        }

        const now = new Date();
        const endDate = new Date(now);

        if (plan.duration === "monthly") {
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (plan.duration === "6months") {
          endDate.setMonth(endDate.getMonth() + 6);
        } else if (plan.duration === "yearly") {
          endDate.setFullYear(endDate.getFullYear() + 1);
        }

        const { error } = await supabaseAdmin.from("subscriptions").insert({
          user_id: userId,
          service: plan.service,
          tier: plan.tier,
          duration: plan.duration,
          stripe_subscription_id: session.subscription || null,
          stripe_customer_id: session.customer,
          status: "active",
          current_period_start: now.toISOString(),
          current_period_end: endDate.toISOString(),
          amount_paid: plan.price,
          currency: plan.currency,
        });

        if (error) {
          console.error("❌ Erreur insert subscription:", error);
        } else {
          console.log("✅ Abonnement enregistré:", planId);
        }

        if (session.customer) {
          await supabaseAdmin
            .from("profiles")
            .update({ stripe_customer_id: session.customer })
            .eq("id", userId);
        }
      } else {
        console.log("💰 Commande boutique reçue:", customerEmail);

        try {
          const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

          await fetch(`${baseUrl}/api/cj/create-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: session.id,
              customerEmail,
              customerName,
              amount,
              lineItems: session.line_items,
            }),
          });
        } catch (err: any) {
          console.error("❌ Erreur commande CJ :", err.message);
        }
      }
    }

    if (
      event.type === "customer.subscription.deleted" ||
      event.type === "customer.subscription.updated"
    ) {
      const subscription = event.data.object;

      await supabaseAdmin
        .from("subscriptions")
        .update({
          status: subscription.status,
          current_period_end: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);

      console.log("✅ Abonnement mis à jour:", subscription.id);
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object;
      console.warn("⚠️ Paiement échoué:", invoice.customer);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("❌ Erreur webhook:", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}