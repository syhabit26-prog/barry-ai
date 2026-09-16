import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error("❌ Webhook signature invalide :", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Paiement reussi
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const customerEmail = session.customer_details?.email || "";
    const customerName = session.customer_details?.name || "";
    const amount = session.amount_total / 100;

    console.log("💰 Paiement recu :");
    console.log("   Client :", customerName, "|", customerEmail);
    console.log("   Montant :", amount, "EUR");

    // Envoie la commande a CJ
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
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

  return NextResponse.json({ received: true });
}