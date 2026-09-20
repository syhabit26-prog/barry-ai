import { NextResponse } from "next/server";
import { getCJAccessToken } from "@/lib/cj";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cjOrderId = searchParams.get("orderId");

    if (!cjOrderId) {
      return NextResponse.json({ error: "orderId requis" }, { status: 400 });
    }

    // Récupère l'order ID CJ depuis Supabase
    const { data: order } = await supabaseAdmin
      .from("cj_orders")
      .select("cj_order_id")
      .eq("cj_order_id", cjOrderId)
      .single();

    if (!order?.cj_order_id) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    const token = await getCJAccessToken();

    // API CJ pour récupérer le tracking
    const res = await fetch(
      `https://developers.cjdropshipping.com/api2.0/v1/logistic/trackInfo?trackNumber=${encodeURIComponent(cjOrderId)}`,
      { headers: { "CJ-Access-Token": token } }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}