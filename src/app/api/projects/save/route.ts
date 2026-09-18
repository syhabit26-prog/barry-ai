import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateSlug } from "@/lib/slug";

export async function POST(req: Request) {
  try {
    // 1️⃣ On récupère les données envoyées par Building
    const body = await req.json();
    const { name, prompt, html, style, category, userId } = body;

    // 2️⃣ Vérification : le HTML est obligatoire
    if (!html) {
      return NextResponse.json(
        { ok: false, error: "HTML manquant" },
        { status: 400 }
      );
    }

    // 3️⃣ On génère un slug unique
    const slug = generateSlug(name || "mon-site");

    // 4️⃣ On insère dans Supabase
    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert({
        user_id: userId || null,
        name: name || "Site sans nom",
        prompt: prompt || "",
        html,
        slug,
        style: style || null,
        category: category || null,
        published: false,
      })
      .select()
      .single();

    // 5️⃣ Si Supabase renvoie une erreur
    if (error) {
      console.error("❌ Erreur Supabase :", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    // 6️⃣ Succès — on log et on renvoie les infos
    console.log("✅ Projet sauvegardé :", data.id, "| slug:", slug);

    return NextResponse.json({
      ok: true,
      project: {
        id: data.id,
        slug: data.slug,
        name: data.name,
        published: data.published,
      },
    });
  } catch (err: any) {
    console.error("❌ Erreur save :", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}