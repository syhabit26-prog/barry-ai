import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, width, height } = body;

    if (!prompt) {
      return NextResponse.json({ ok: false, error: "Prompt manquant" }, { status: 400 });
    }

    const encodedPrompt = encodeURIComponent(prompt);
    const w = width || 1024;
    const h = height || 1024;
    const seed = Math.floor(Math.random() * 1000000);

    // ⭐ Endpoint gratuit SANS clé API
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${w}&height=${h}&nologo=true&seed=${seed}`;

    console.log("🎨 Pollinations:", url);

    const res = await fetch(url, { method: "GET" });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `Pollinations a renvoyé ${res.status}` },
        { status: 500 }
      );
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const dataUrl = `data:${contentType};base64,${base64}`;

    return NextResponse.json({
      ok: true,
      imageUrl: dataUrl,
      prompt,
    });
  } catch (err: any) {
    console.error("❌ Erreur Pollinations :", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}