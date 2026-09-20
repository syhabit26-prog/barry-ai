import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getAccountStatus } from "@/lib/stripeConnect";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId requis" }, { status: 400 });
    }

    const { data: account } = await supabaseAdmin
      .from("stripe_accounts")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!account || !account.stripe_account_id) {
      return NextResponse.json({ connected: false, charges_enabled: false });
    }

    // Rafraîchit le statut depuis Stripe
    const status = await getAccountStatus(account.stripe_account_id);

    await supabaseAdmin
      .from("stripe_accounts")
      .update({
        charges_enabled: status.charges_enabled,
        payouts_enabled: status.payouts_enabled,
        details_submitted: status.details_submitted,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    return NextResponse.json({
      connected: true,
      charges_enabled: status.charges_enabled,
      payouts_enabled: status.payouts_enabled,
      details_submitted: status.details_submitted,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}