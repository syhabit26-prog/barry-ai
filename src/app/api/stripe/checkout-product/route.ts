import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productName, price, imageUrl, sku } = body;

    if (!productName || !price) {
      return NextResponse.json(
        { error: "productName et price obligatoires" },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(Number(price) * 100);

    if (amountInCents < 50) {
      return NextResponse.json(
        { error: "Montant minimum : 0,50 EUR" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: String(productName).slice(0, 100),
              ...(imageUrl ? { images: [imageUrl] } : {}),
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // ⭐ COLLECTE ADRESSE LIVRAISON
      shipping_address_collection: {
        allowed_countries: [
          "FR", "BE", "CH", "CA", "US", "GB", "DE", "ES", "IT", "SN", "CI", "ML", "GM"
        ],
      },
      // ⭐ COLLECTE TELEPHONE
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${baseUrl}/builder?stripe=success`,
      cancel_url: `${baseUrl}/builder?stripe=cancel`,
      metadata: {
        sku: sku || "",
      },
    });

    console.log("✅ Session Stripe creee :", session.id);

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error("❌ Erreur Stripe :", err.message);
    return NextResponse.json(
      { error: err.message || "Erreur Stripe" },
      { status: 500 }
    );
  }
}