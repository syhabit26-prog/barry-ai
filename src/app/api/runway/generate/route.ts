import { NextResponse } from "next/server";

export const maxDuration = 60;

// POST — Crée une vidéo
export async function POST(req: Request) {
  try {
    const { prompt, imageUrl, duration = 5 } = await req.json();

    const apiKey = process.env.RUNWAY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "RUNWAY_API_KEY manquante" }, { status: 500 });
    }

    const res = await fetch("https://api.dev.runwayml.com/v1/image_to_video", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Runway-Version": "2024-11-06",
      },
      body: JSON.stringify({
        model: "gen4_turbo",
        promptImage: imageUrl || undefined,
        promptText: prompt,
        duration,
        ratio: "1280:720",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: data.error || "Erreur Runway" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, taskId: data.id, status: "pending" });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

// GET — Vérifie le statut
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json({ ok: false, error: "taskId manquant" }, { status: 400 });
    }

    const apiKey = process.env.RUNWAY_API_KEY;

    const res = await fetch(`https://api.dev.runwayml.com/v1/tasks/${taskId}`, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "X-Runway-Version": "2024-11-06",
      },
    });

    const data = await res.json();

    return NextResponse.json({
      ok: true,
      status: data.status,
      videoUrl: data.output?.[0] || null,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}