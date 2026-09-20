import { NextResponse } from "next/server";
import { getCJAccessToken } from "@/lib/cj";
import { supabaseAdmin } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { sendEmail, clientOrderEmail, sellerSaleEmail } from "@/lib/email";

const DEFAULT_CURRENCY = "EUR";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, customerEmail, customerName, amount, userId, projectId } = body;

    console.log("📦 Création commande CJ :", sessionId);

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    const orderItemsJson = session.metadata?.orderItems || "[]";
    let orderItems: any[] = [];
    try {
      orderItems = JSON.parse(orderItemsJson);
    } catch {
      console.error("⚠️ Impossible de parser orderItems");
    }

    if (orderItems.length === 0) {
      return NextResponse.json({ ok: false, error: "Aucun article" }, { status: 400 });
    }

    const shipping = session.shipping_details;
    const customer = session.customer_details;
    const address = shipping?.address || customer?.address;
    const phone = customer?.phone || "";

    if (!address) {
      return NextResponse.json({ ok: false, error: "Adresse manquante" }, { status: 400 });
    }

    // ═══ SAUVEGARDE SUPABASE ═══
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
          customer_name: customerName || shipping?.name || "Client",
          customer_email: customerEmail || customer?.email || "",
          customer_phone: phone,
          shipping_address: address.line1 || "",
          shipping_city: address.city || "",
          shipping_country: address.country || "",
          shipping_zip: address.postal_code || "",
          products: orderItems,
          notes: `Stripe: ${sessionId}`,
        })
        .select()
        .single();

      if (!orderError && orderData) {
        localOrderId = orderData.id;
        console.log("✅ Commande sauvegardée :", localOrderId);
      }
    } catch (err: any) {
      console.error("⚠️ Supabase err:", err.message);
    }

    // ═══ ENVOI À CJ AVEC RETRY ═══
    const maxRetries = 3;
    let lastError: any = null;
    let cjOrderId: string | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const token = await getCJAccessToken();

        const validItems = orderItems.filter((i: any) => i.vid && i.vid.length > 0);
        if (validItems.length === 0) throw new Error("Aucun vid valide");

        const cjOrder = {
          orderNumber: sessionId,
          shippingCountryCode: address.country || "FR",
          shippingCountry: address.country || "France",
          shippingProvince: address.state || "",
          shippingCity: address.city || "",
          shippingAddress: address.line1 || "",
          shippingAddress2: address.line2 || "",
          shippingCustomerName: customerName || shipping?.name || "Client",
          shippingZip: address.postal_code || "",
          shippingPhone: phone || "+22100000000",
          email: customerEmail || customer?.email || "",
          remark: `Stripe: ${sessionId} | try ${attempt}`,
          fromCountryCode: "CN",
          payType: 2,
          logisticName: "CJPacket Ordinary",
          houseNumber: "",
          iossType: "",
          iossNumber: "",
          products: validItems.map((i: any) => ({
            vid: i.vid,
            quantity: i.quantity,
          })),
        };

        console.log(`📤 [Try ${attempt}/${maxRetries}] Envoi à CJ...`);

        const res = await fetch(
          "https://developers.cjdropshipping.com/api2.0/v1/shopping/order/createOrderV2",
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
        console.log(`✅ [Try ${attempt}] Réponse CJ:`, data?.code, data?.message);

        if (data?.code === 200 && data?.data?.orderId) {
          cjOrderId = data.data.orderId;
          if (localOrderId) {
            await supabaseAdmin
              .from("cj_orders")
              .update({
                cj_order_id: cjOrderId,
                status: "processing",
                updated_at: new Date().toISOString(),
              })
              .eq("id", localOrderId);
          }
          console.log(`🎉 Commande CJ créée: ${cjOrderId}`);
          lastError = null;
          break;
        } else {
          lastError = new Error(data?.message || "CJ a refusé");
          console.warn(`⚠️ [Try ${attempt}] CJ refuse:`, data?.message);
          if (attempt < maxRetries) {
            await new Promise((r) => setTimeout(r, attempt * 2000));
          }
        }
      } catch (e: any) {
        lastError = e;
        console.error(`❌ [Try ${attempt}] Erreur:`, e.message);
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, attempt * 2000));
        }
      }
    }

    if (lastError && localOrderId) {
      await supabaseAdmin
        .from("cj_orders")
        .update({
          status: "failed_retry",
          notes: `Échec après ${maxRetries} tentatives: ${lastError.message}`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", localOrderId);
      console.error("🚨 Commande marquée failed_retry");
    }

    // ═══ EMAIL CLIENT ═══
    try {
      const clientEmail = customerEmail || customer?.email;
      if (clientEmail) {
        const trackingUrl = cjOrderId
          ? `${process.env.NEXT_PUBLIC_APP_URL}/track/${cjOrderId}`
          : undefined;

        const result = await sendEmail({
          to: clientEmail,
          subject: `✅ Commande confirmée - ${sessionId.slice(0, 20)}`,
          html: clientOrderEmail({
            customerName: customerName || "cher client",
            orderNumber: sessionId.slice(0, 20),
            items: orderItems,
            total: amount || 0,
            trackingUrl,
          }),
        });
        console.log("📧 Client email:", result.ok ? "✅ envoyé" : "❌ " + result.error);
      }
    } catch (e: any) {
      console.error("⚠️ Email client échoué:", e.message);
    }

    // ═══ EMAIL VENDEUR ═══
    try {
      const creatorUserId = session.metadata?.creatorUserId;
      if (creatorUserId) {
        const { data: sellerAccount } = await supabaseAdmin
          .from("stripe_accounts")
          .select("email")
          .eq("user_id", creatorUserId)
          .single();

        if (sellerAccount?.email) {
          const total = amount || 0;
          const commission = total * 0.02;

          const result = await sendEmail({
            to: sellerAccount.email,
            subject: `💰 Nouvelle vente de ${(total - commission).toFixed(2)} €`,
            html: sellerSaleEmail({
              sellerName: "créateur",
              orderNumber: sessionId.slice(0, 20),
              amount: total,
              creatorEarnings: total - commission,
              productNames: orderItems.map((i: any) => i.name),
            }),
          });
          console.log("📧 Vendeur email:", result.ok ? "✅ envoyé" : "❌ " + result.error);
        }
      }
    } catch (e: any) {
      console.error("⚠️ Email vendeur échoué:", e.message);
    }

    return NextResponse.json({
      ok: true,
      localOrderId,
      cjOrderId,
      hasError: !!lastError,
    });
  } catch (err: any) {
    console.error("❌ Erreur commande :", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}