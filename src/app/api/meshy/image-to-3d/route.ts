import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json({ ok: false, error: "Image manquante" }, { status: 400 });
    }

    const apiKey = process.env.MESHY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "Clé Meshy manquante" }, { status: 500 });
    }

    // 1) Soumet la tâche Image-to-3D
    const submitRes = await fetch("https://api.meshy.ai/openapi/v1/image-to-3d", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_url: imageUrl }),
    });

    const submitData = await submitRes.json();
    const taskId = submitData.result;

    if (!taskId) {
      console.error("❌ Erreur Meshy submit :", submitData);
      return NextResponse.json({ ok: false, error: submitData.message || "Erreur Meshy" }, { status: 500 });
    }

    // 2) Poll le statut (max 3 minutes)
    let attempts = 0;
    const maxAttempts = 60;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const statusRes = await fetch(`https://api.meshy.ai/openapi/v1/image-to-3d/${taskId}`, {
        headers: { "Authorization": `Bearer ${apiKey}` },
      });

      const statusData = await statusRes.json();

      if (statusData.status === "SUCCEEDED") {
        return NextResponse.json({
          ok: true,
          taskId,
          modelUrls: statusData.model_urls || {},
          thumbnailUrl: statusData.thumbnail_url,
        });
      }

      if (statusData.status === "FAILED") {
        return NextResponse.json({ ok: false, error: statusData.task_error || "Échec Meshy" }, { status: 500 });
      }

      attempts++;
    }

    return NextResponse.json({ ok: false, error: "Timeout Meshy (3 min)" }, { status: 500 });
  } catch (err: any) {
    console.error("❌ Erreur Meshy :", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}