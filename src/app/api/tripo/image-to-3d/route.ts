import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json({ ok: false, error: "Image manquante" }, { status: 400 });
    }

    const apiKey = process.env.TRIPO_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "Clé Tripo manquante" }, { status: 500 });
    }

    // 1) Soumet la tâche
    const submitRes = await fetch("https://api.tripo3d.ai/v2/openapi/task", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "image_to_model",
        file: { type: "url", url: imageUrl },
      }),
    });

    const submitData = await submitRes.json();
    const taskId = submitData.data?.task_id;

    if (!taskId) {
      console.error("❌ Erreur Tripo submit :", submitData);
      return NextResponse.json(
        { ok: false, error: submitData.message || "Erreur Tripo" },
        { status: 500 }
      );
    }

    // 2) Poll le statut (max 3 minutes)
    let attempts = 0;
    const maxAttempts = 60;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const statusRes = await fetch(`https://api.tripo3d.ai/v2/openapi/task/${taskId}`, {
        headers: { "Authorization": `Bearer ${apiKey}` },
      });

      const statusData = await statusRes.json();
      const status = statusData.data?.status;

      if (status === "success") {
        return NextResponse.json({
          ok: true,
          taskId,
          modelUrl: statusData.data?.output?.pbr_model || statusData.data?.output?.model,
        });
      }

      if (status === "failed") {
        return NextResponse.json(
          { ok: false, error: statusData.data?.error || "Échec Tripo" },
          { status: 500 }
        );
      }

      attempts++;
    }

    return NextResponse.json({ ok: false, error: "Timeout Tripo (3 min)" }, { status: 500 });
  } catch (err: any) {
    console.error("❌ Erreur Tripo :", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}