import { NextResponse } from "next/server";
import crypto from "crypto";

function hashCode(code: string): string {
  const secret = process.env.CAISSE_SECRET || "barry-secret-2026";
  return crypto.createHmac("sha256", secret).update(code.toUpperCase().trim()).digest("hex");
}

// ⭐ GET /api/caisse/get-keys?projectId=xxx
// Retourne les clés Stripe/PayPal actuelles du projet (public, utilisé par le site)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    if (!projectId) return NextResponse.json({ ok: false, error: "projectId requis" }, { status: 400 });

    const { supabaseAdmin } = await import("@/lib/supabaseAdmin");
    const { data } = await supabaseAdmin
      .from("project_owners")
      .select("stripe_link, paypal_link")
      .eq("project_id", projectId)
      .single();

    return NextResponse.json({
      ok: true,
      stripe: data?.stripe_link || null,
      paypal: data?.paypal_link || null,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}

// ⭐ POST /api/caisse/login
// Body: { projectId, code }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, projectId, code, stripe, paypal } = body;

    if (!projectId) return NextResponse.json({ ok: false, error: "projectId requis" }, { status: 400 });

    const { supabaseAdmin } = await import("@/lib/supabaseAdmin");

    // ═══ LOGIN ═══
    if (action === "login") {
      if (!code) return NextResponse.json({ ok: false, error: "Code requis" }, { status: 400 });

      const { data } = await supabaseAdmin
        .from("project_owners")
        .select("password_hash, stripe_link, paypal_link")
        .eq("project_id", projectId)
        .single();

      if (!data) return NextResponse.json({ ok: false, error: "Projet introuvable" }, { status: 404 });

      const hash = hashCode(code);
      if (hash !== data.password_hash) {
        return NextResponse.json({ ok: false, error: "Code invalide" }, { status: 401 });
      }

      return NextResponse.json({
        ok: true,
        stripe: data.stripe_link || "",
        paypal: data.paypal_link || "",
        hasStripe: !!data.stripe_link,
        hasPaypal: !!data.paypal_link,
      });
    }

    // ═══ SAVE KEYS ═══
    if (action === "save") {
      if (!code) return NextResponse.json({ ok: false, error: "Code requis" }, { status: 400 });

      const { data } = await supabaseAdmin
        .from("project_owners")
        .select("password_hash")
        .eq("project_id", projectId)
        .single();

      if (!data) return NextResponse.json({ ok: false, error: "Projet introuvable" }, { status: 404 });

      const hash = hashCode(code);
      if (hash !== data.password_hash) {
        return NextResponse.json({ ok: false, error: "Code invalide" }, { status: 401 });
      }

      await supabaseAdmin
        .from("project_owners")
        .update({
          stripe_link: stripe || null,
          paypal_link: paypal || null,
        })
        .eq("project_id", projectId);

      return NextResponse.json({ ok: true, message: "Clés enregistrées !" });
    }

    return NextResponse.json({ ok: false, error: "Action inconnue" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}