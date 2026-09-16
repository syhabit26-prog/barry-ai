import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const amount = body.amount || "10.00";
    const currency = body.currency || "EUR";
    const productName = body.productName || "BARRY AI - Produit";

    const mode = process.env.PAYPAL_MODE || "live";
    const apiUrl = mode === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

    // 1. Token
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const tokenRes = await fetch(`${baseUrl}/api/paypal/get-token`);
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: "Impossible d'obtenir le token PayPal" },
        { status: 500 }
      );
    }

    // 2. Create order
    const orderRes = await fetch(`${apiUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: String(parseFloat(amount).toFixed(2)),
            },
            description: String(productName).slice(0, 127),
          },
        ],
        application_context: {
          return_url: `${baseUrl}/builder?paypal=success`,
          cancel_url: `${baseUrl}/builder?paypal=cancel`,
          brand_name: "BARRY AI",
          user_action: "PAY_NOW",
        },
      }),
    });

    const data = await orderRes.json();
    console.log("✅ PayPal order :", data.id);
    return NextResponse.json(data);

  } catch (err: any) {
    console.error("❌ Erreur PayPal :", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}