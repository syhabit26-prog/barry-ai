import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, published } = body;

    if (!projectId) {
      return NextResponse.json(
        { ok: false, error: "projectId manquant" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("projects")
      .update({ published: published === true })
      .eq("id", projectId)
      .select()
      .single();

    if (error) {
      console.error("❌ Erreur publish :", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    console.log("✅ Projet", published ? "publié" : "dépublié", ":", data.slug);

    return NextResponse.json({
      ok: true,
      project: {
        id: data.id,
        slug: data.slug,
        published: data.published,
      },
    });
  } catch (err: any) {
    console.error("❌ Erreur publish :", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}