import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ ok: false, error: "Prompt manquant" }, { status: 400 });
    }

    const keyId = process.env.HF_API_KEY_ID;
    const keySecret = process.env.HF_API_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ ok: false, error: "Clés Higgsfield manquantes" }, { status: 500 });
    }

    // 1) Soumet la génération
    const submitRes = await fetch("https://api.higgsfield.ai/higgsfield-ai/soul/v2/standard", {
      method: "POST",
      headers: {
        "Authorization": `Key ${keyId}:${keySecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const submitData = await submitRes.json();
    const requestId = submitData.request_id;

    if (!requestId) {
      console.error("❌ Erreur Higgsfield submit :", submitData);
      return NextResponse.json({ ok: false, error: submitData.detail || "Erreur Higgsfield" }, { status: 500 });
    }

    // 2) Poll le statut (max 2 minutes)
    let attempts = 0;
    const maxAttempts = 40;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const statusRes = await fetch(`https://api.higgsfield.ai/requests/${requestId}/status`, {
        headers: { "Authorization": `Key ${keyId}:${keySecret}` },
      });

      const statusData = await statusRes.json();

      if (statusData.status === "completed") {
        return NextResponse.json({
          ok: true,
          requestId,
          images: statusData.images || [],
        });
      }

      if (["failed", "nsfw", "canceled"].includes(statusData.status)) {
        return NextResponse.json({ ok: false, error: statusData.error || statusData.status }, { status: 500 });
      }

      attempts++;
    }

    return NextResponse.json({ ok: false, error: "Timeout Higgsfield (2 min)" }, { status: 500 });
  } catch (err: any) {
    console.error("❌ Erreur Higgsfield :", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}