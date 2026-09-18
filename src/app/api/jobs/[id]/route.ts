import { NextResponse } from "next/server";
import { getJob } from "@/lib/jobs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = await getJob(id);

    if (!job) {
      return NextResponse.json(
        { ok: false, error: "Job introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, job });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}