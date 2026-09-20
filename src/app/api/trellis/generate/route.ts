import { NextResponse } from "next/server";

export const maxDuration = 60;

// POST — Lance une génération 3D
export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    const apiKey = process.env.TRELLIS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "TRELLIS_API_KEY manquante" }, { status: 500 });
    }

    if (!imageUrl) {
      return NextResponse.json({ ok: false, error: "imageUrl requise" }, { status: 400 });
    }

    const res = await fetch("https://trellis2.app/api/v1/3d/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageUrl,
        model: "trellis2",
        mode: "async",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: data.error || data.message || "Erreur Trellis" }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      taskId: data.id || data.task_id,
      status: "pending",
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// GET — Vérifie le statut + récupère le .glb
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json({ ok: false, error: "taskId manquant" }, { status: 400 });
    }

    const apiKey = process.env.TRELLIS_API_KEY;

    const res = await fetch(`https://trellis2.app/api/v1/3d/generations/${taskId}`, {
      headers: { "Authorization": `Bearer ${apiKey}` },
    });

    const data = await res.json();

    return NextResponse.json({
      ok: true,
      status: data.status,
      modelUrl: data.model_url || data.glb_url || null,
      previewUrl: data.preview_url || null,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}