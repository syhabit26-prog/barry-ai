import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

type CartItem = {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body as { items: CartItem[] };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Panier vide" },
        { status: 400 }
      );
    }

    // Récupère l'URL de base
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Construit les line_items Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe utilise les centimes
      },
      quantity: item.quantity,
    }));

    // Crée la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      metadata: {
        source: "barry-cart",
        itemCount: String(items.length),
      },
    });

    console.log("✅ Stripe cart session créée:", session.id);

    return NextResponse.json({
      ok: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (err: any) {
    console.error("❌ Erreur Stripe cart :", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Erreur Stripe" },
      { status: 500 }
    );
  }
}