import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PublicSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: project, error } = await supabaseAdmin
    .from("projects")
    .select("html, name, published")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !project) {
    notFound();
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: project.html }}
      style={{ margin: 0, padding: 0 }}
    />
  );
}