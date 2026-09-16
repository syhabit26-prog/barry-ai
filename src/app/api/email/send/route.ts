import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    console.log("📧 Email a envoyer :", to, subject);

    // ⚠️ Pour l'instant, on log seulement
    // Pour envoyer reellement, il faut RESEND, SENDGRID, ou MAILGUN

    // OPTION 1 : Resend (gratuit 100 emails/jour)
    // const { Resend } = await import("resend");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "BARRY AI <noreply@barry-ai.com>",
    //   to,
    //   subject,
    //   html,
    // });

    // OPTION 2 : Simule (log seulement)
    console.log("📧 =============================");
    console.log("   To :", to);
    console.log("   Subject :", subject);
    console.log("   HTML :", html.slice(0, 200));
    console.log("📧 =============================");

    return NextResponse.json({ ok: true, message: "Email log" });

  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}