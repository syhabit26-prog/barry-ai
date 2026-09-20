import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { getShippingCost } from "@/lib/shipping";

const COMMISSION_RATE = 0.02;

export async function POST(req: Request) {
  try {
    const { items, projectId, projectSlug } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const invalid = items.filter((i: any) => !i.vid || i.vid.length === 0);
    if (invalid.length > 0) {
      return NextResponse.json(
        { error: "Produits sans vid CJ. Vide le panier." },
        { status: 400 }
      );
    }

    // ⭐ Récupère le créateur par ID OU par slug
    let creatorAccountId: string | null = null;
    let creatorUserId: string | null = null;

    try {
      let project: any = null;

      if (projectId) {
        const { data } = await supabaseAdmin
          .from("projects")
          .select("user_id")
          .eq("id", projectId)
          .single();
        project = data;
      } else if (projectSlug) {
        const { data } = await supabaseAdmin
          .from("projects")
          .select("user_id")
          .eq("slug", projectSlug)
          .single();
        project = data;
      }

      if (project?.user_id) {
        creatorUserId = project.user_id;
        const { data: stripeAccount } = await supabaseAdmin
          .from("stripe_accounts")
          .select("stripe_account_id, charges_enabled")
          .eq("user_id", project.user_id)
          .single();

        if (stripeAccount?.charges_enabled) {
          creatorAccountId = stripeAccount.stripe_account_id;
          console.log("✅ Créateur identifié :", creatorUserId);
        }
      }
    } catch (e: any) {
      console.warn("⚠️ Recherche créateur :", e.message);
    }

    // ⭐ Frais de port (France par défaut)
    const shippingCost = getShippingCost("FR");
    const shippingCents = Math.round(shippingCost * 100);

    // ⭐ Lignes Stripe
    const line_items: any[] = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: { vid: item.vid, sku: item.sku || "" },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // ⭐ Ajoute les frais de port
    line_items.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "📦 Frais de livraison (5-10 jours)",
          description: "Livraison suivie avec numéro de suivi",
        },
        unit_amount: shippingCents,
      },
      quantity: 1,
    });

    // Calcul du total
    const totalAmount = items.reduce(
      (sum: number, i: any) => sum + i.price * i.quantity,
      0
    );
    const applicationFee = Math.round(totalAmount * COMMISSION_RATE * 100);

    const sessionOptions: any = {
      mode: "payment",
      line_items,
      shipping_address_collection: {
        allowed_countries: [
          "FR", "BE", "CH", "CA", "US", "GB", "DE", "ES", "IT",
          "NL", "PT", "SN", "CI", "ML", "BF", "NE", "TG", "BJ", "CM", "GA",
        ],
      },
      phone_number_collection: { enabled: true },
      metadata: {
        projectId: projectId || "",
        projectSlug: projectSlug || "",
        creatorUserId: creatorUserId || "",
        shippingCost: shippingCost.toString(),
        orderItems: JSON.stringify(
          items.map((i: any) => ({
            vid: i.vid,
            sku: i.sku || "",
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image || "",
          }))
        ),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    };

    // ⭐ Split automatique 98/2
    if (creatorAccountId) {
      sessionOptions.payment_intent_data = {
        application_fee_amount: applicationFee,
        transfer_data: { destination: creatorAccountId },
      };
      console.log(
        `💰 Split: ${(totalAmount * 0.98).toFixed(2)}€ → créateur | ${(totalAmount * 0.02).toFixed(2)}€ → BARRY AI | Port: ${shippingCost}€`
      );
    } else {
      console.log("⚠️ Pas de Stripe Connect → 100% BARRY AI");
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);

    console.log("✅ Session créée :", session.id);
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Erreur Checkout:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}