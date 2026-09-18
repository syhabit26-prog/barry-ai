import { NextResponse } from "next/server";
import { getCJAccessToken } from "@/lib/cj";
import { supabaseAdmin } from "@/lib/supabase";
import { APP_URL, DEFAULT_CURRENCY } from "@/lib/config";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, customerEmail, customerName, amount, lineItems, userId, projectId } = body;

    console.log("📦 Creation commande CJ :", sessionId);

    // Récupère les détails de la session Stripe
    const { stripe } = await import("@/lib/stripe");
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    const product = session.line_items?.data?.[0];
    const productName = product?.description || "Produit";
    const sku = product?.price?.metadata?.sku || "";
    const quantity = product?.quantity || 1;
    const unitPrice = (product?.amount_total || 0) / 100 / quantity;

    // Adresse client
    const address = session.customer_details?.address;
    const phone = session.customer_details?.phone || "";

    // ═══ SAUVEGARDE DANS SUPABASE (avant CJ) ═══
    let localOrderId: string | null = null;
    try {
      const { data: orderData, error: orderError } = await supabaseAdmin
        .from("cj_orders")
        .insert({
          user_id: userId || null,
          project_id: projectId || null,
          status: "pending",
          total_price: amount || 0,
          currency: DEFAULT_CURRENCY,
          customer_name: customerName || "Client",
          customer_email: customerEmail || "",
          customer_phone: phone,
          shipping_address: address?.line1 || "",
          shipping_city: address?.city || "",
          shipping_country: address?.country || "",
          shipping_zip: address?.postal_code || "",
          products: [
            {
              cj_product_id: sku,
              product_name: productName,
              sku: sku,
              quantity,
              unit_price: unitPrice,
              total_price: (amount || 0),
            },
          ],
          notes: `Stripe session: ${sessionId}`,
        })
        .select()
        .single();

      if (orderError) {
        console.error("⚠️ Erreur save Supabase :", orderError.message);
      } else {
        localOrderId = orderData.id;
        console.log("✅ Commande sauvegardée localement :", localOrderId);

        // Crée les items séparés
        if (orderData && sku) {
          await supabaseAdmin.from("cj_order_items").insert({
            order_id: orderData.id,
            cj_product_id: sku,
            product_name: productName,
            quantity,
            unit_price: unitPrice,
            total_price: amount || 0,
          });
        }
      }
    } catch (err: any) {
      console.error("⚠️ Erreur Supabase (non bloquant) :", err.message);
    }

    // ═══ ENVOI À CJ DROPSHIPPING ═══
    if (!address) {
      console.log("⚠️ Pas d'adresse, commande non transmise à CJ");
      return NextResponse.json({
        ok: true,
        message: "Commande sauvegardée localement, adresse manquante pour CJ",
        localOrderId,
      });
    }

    try {
      const token = await getCJAccessToken();

      const cjOrder = {
        orderNumber: sessionId,
        shippingCustomerName: customerName,
        shippingAddress: address.line1,
        shippingCity: address.city,
        shippingCountryCode: address.country,
        shippingZip: address.postal_code,
        shippingPhone: phone || "+22100000000",
        products: [{ vid: sku, quantity }],
      };

      console.log("📤 Envoi à CJ :", JSON.stringify(cjOrder, null, 2));

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
      console.log("✅ Réponse CJ :", data);

      // Met à jour le statut avec l'ID CJ
      if (localOrderId && data?.data?.orderId) {
        await supabaseAdmin
          .from("cj_orders")
          .update({
            cj_order_id: data.data.orderId,
            status: "processing",
            updated_at: new Date().toISOString(),
          })
          .eq("id", localOrderId);
      }
    } catch (cjErr: any) {
      console.error("⚠️ Erreur CJ (non bloquant) :", cjErr.message);
    }

    // ═══ EMAIL DE CONFIRMATION ═══
    try {
      await fetch(`${APP_URL}/api/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: customerEmail,
          subject: "Commande confirmée ✅",
          html: `
            <h1>Merci ${customerName} !</h1>
            <p>Votre commande de <strong>${productName}</strong> est confirmée.</p>
            <p>Montant payé : <strong>${amount} ${DEFAULT_CURRENCY}</strong></p>
            <p>Vous recevrez votre colis sous 7-15 jours.</p>
            <p>Numéro de commande : ${sessionId}</p>
          `,
        }),
      });
    } catch (err: any) {
      console.error("⚠️ Erreur email :", err.message);
    }

    return NextResponse.json({
      ok: true,
      localOrderId,
    });

  } catch (err: any) {
    console.error("❌ Erreur commande :", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}