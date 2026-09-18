import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPlanById } from "@/lib/plans";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planId, userId, userEmail } = body;

    if (!planId) {
      return NextResponse.json(
        { ok: false, error: "planId manquant" },
        { status: 400 }
      );
    }

    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json(
        { ok: false, error: "Plan introuvable" },
        { status: 404 }
      );
    }

    // Cherche le price_id dans Stripe
    const products = await stripe.products.search({
      query: `metadata['plan_id']:'${plan.id}'`,
    });

    if (products.data.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Produit Stripe introuvable" },
        { status: 404 }
      );
    }

    const prices = await stripe.prices.list({
      product: products.data[0].id,
      active: true,
      limit: 1,
    });

    if (prices.data.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Prix Stripe introuvable" },
        { status: 404 }
      );
    }

    const priceId = prices.data[0].id;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Crée ou récupère le customer Stripe
    let customerId: string | undefined;
    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_customer_id")
        .eq("id", userId)
        .single();

      if (profile?.stripe_customer_id) {
        customerId = profile.stripe_customer_id;
      }
    }

    // Détermine si c'est un abonnement ou un paiement unique
    const isRecurring = plan.duration === "monthly";
    const mode = isRecurring ? "subscription" : "payment";

    // Crée la session Checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: mode as "payment" | "subscription",
      success_url: `${baseUrl}/account?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      metadata: {
        planId: plan.id,
        userId: userId || "",
        service: plan.service,
        tier: plan.tier,
        duration: plan.duration,
      },
    });

    console.log("✅ Session créée:", session.id, "| Plan:", plan.id);

    return NextResponse.json({
      ok: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (err: any) {
    console.error("❌ Erreur create-subscription:", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}