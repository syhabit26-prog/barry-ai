import { NextResponse } from "next/server";
import { getCJAccessToken } from "@/lib/cj";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, customerEmail, customerName, amount, lineItems } = body;

    console.log("📦 Creation commande CJ :", sessionId);

    // Recupere les details de la session Stripe
    const { stripe } = await import("@/lib/stripe");
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    const product = session.line_items?.data?.[0];
    const productName = product?.description || "Produit";
    const sku = product?.price?.metadata?.sku || "";

    // 🔧 ICI : envoyer a l'API CJ Dropshipping
    // Documentation : https://developers.cjdropshipping.com/api2.0/v1/shopping/order/createOrder
    
    const token = await getCJAccessToken();

    // ⚠️ Cette commande necessite l'adresse du client
    // Stripe collecte l'adresse dans session.customer_details.address
    const address = session.customer_details?.address;
    
    if (!address) {
      console.log("⚠️ Pas d'adresse, commande non transmise a CJ");
      return NextResponse.json({
        ok: false,
        message: "Adresse manquante",
      });
    }

    // Envoi reel a CJ (necessite un vrai SKU de leur catalogue)
    const cjOrder = {
      orderNumber: sessionId,
      shippingCustomerName: customerName,
      shippingAddress: address.line1,
      shippingCity: address.city,
      shippingCountryCode: address.country,
      shippingZip: address.postal_code,
      shippingPhone: session.customer_details?.phone || "+22100000000",
      products: [
        {
          vid: sku,
          quantity: 1,
        },
      ],
    };

    console.log("📤 Envoi a CJ :", JSON.stringify(cjOrder, null, 2));

    const res = await fetch(
      "https://developers.cjdropshipping.com/api2.0/v1/shopping/order/createOrder",
      {
        method: "POST",
        headers: {
          "CJ-Access-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cjOrder),
      }
    );

    const data = await res.json();
    console.log("✅ Reponse CJ :", data);

    // Envoie un email de confirmation au client
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      await fetch(`${baseUrl}/api/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: customerEmail,
          subject: "Commande confirmee ✅",
          html: `
            <h1>Merci ${customerName} !</h1>
            <p>Votre commande de <strong>${productName}</strong> est confirmee.</p>
            <p>Montant paye : <strong>${amount} EUR</strong></p>
            <p>Vous recevrez votre colis sous 7-15 jours.</p>
            <p>Numero de commande : ${sessionId}</p>
          `,
        }),
      });
    } catch (err: any) {
      console.error("❌ Erreur email :", err.message);
    }

    return NextResponse.json({ ok: true, cjOrder: data });

  } catch (err: any) {
    console.error("❌ Erreur commande :", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}