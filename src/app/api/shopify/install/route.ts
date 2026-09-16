import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const shop = req.nextUrl.searchParams.get("shop");

  if (!shop) {
    return NextResponse.json({ error: "Shop manquant" }, { status: 400 });
  }

  const apiKey = process.env.SHOPIFY_API_KEY!;
  const scopes = process.env.SHOPIFY_SCOPES || "read_products,write_products,read_orders";
  const redirectUri = process.env.SHOPIFY_REDIRECT_URI!;

  const authUrl =
    `https://${shop}/admin/oauth/authorize?` +
    `client_id=${apiKey}&` +
    `scope=${scopes}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}`;

  return NextResponse.redirect(authUrl);
}