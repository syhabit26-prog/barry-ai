import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const amount = body.amount || 1;
    const currency = body.currency || "eur";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "BARRY AI - Paiement",
              description: "Service BARRY AI",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/connectors?stripe=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/connectors?stripe=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Erreur Stripe :", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}