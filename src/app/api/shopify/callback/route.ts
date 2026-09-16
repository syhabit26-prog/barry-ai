import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const shop = req.nextUrl.searchParams.get("shop");

  if (!code || !shop) {
    return NextResponse.json({ error: "Parametres manquants" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      }),
    });

    const data = await res.json();

    if (!data.access_token) {
      return NextResponse.json({ error: "Token invalide", details: data }, { status: 400 });
    }

    console.log("✅ Shopify connecte :", shop);
    console.log("🔑 Token :", data.access_token.substring(0, 20) + "...");

    return NextResponse.redirect(
      `http://localhost:3000/connectors?shopify=success&shop=${shop}`
    );
  } catch (err: any) {
    console.error("Erreur Shopify :", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}