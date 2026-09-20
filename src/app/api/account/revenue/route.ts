import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "userId requis" }, { status: 400 });

    const { data: transactions } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100);

    const txs = transactions || [];
    const totalEarnings = txs.reduce((s: number, t: any) => s + (t.creator_earnings || 0), 0);
    const totalCommission = txs.reduce((s: number, t: any) => s + (t.application_fee || 0), 0);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = txs
      .filter((t: any) => new Date(t.created_at) >= monthStart)
      .reduce((s: number, t: any) => s + (t.creator_earnings || 0), 0);

    return NextResponse.json({
      totalEarnings,
      totalCommission,
      totalOrders: txs.length,
      thisMonth,
      transactions: txs,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}