// src/lib/email.ts
// Resend — 100 emails/jour gratuits

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "BARRY AI <onboarding@resend.dev>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ RESEND_API_KEY manquant");
    return { ok: false, error: "no_api_key" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("✅ Email envoyé:", data.id, "→", to);
      return { ok: true, id: data.id };
    }

    console.error("❌ Email refusé:", data);
    return { ok: false, error: data.message || "unknown" };
  } catch (err: any) {
    console.error("❌ Email erreur:", err.message);
    return { ok: false, error: err.message };
  }
}

// ⭐ Email CLIENT — Confirmation de commande
export function clientOrderEmail(data: {
  customerName: string;
  orderNumber: string;
  items: any[];
  total: number;
  trackingUrl?: string;
}) {
  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9fafb">
      <div style="background:linear-gradient(135deg,#facc15,#f97316);border-radius:16px;padding:32px;text-align:center;color:white;margin-bottom:24px">
        <h1 style="margin:0;font-size:32px">Merci ${data.customerName} ! 🎉</h1>
        <p style="margin-top:8px;opacity:.9;font-size:16px">Votre commande est confirmée</p>
      </div>

      <div style="background:white;border-radius:16px;padding:24px;margin-bottom:16px">
        <h2 style="margin:0 0 16px;font-size:18px;color:#111">Détails de la commande</h2>
        <p style="margin:4px 0;font-size:14px;color:#555"><strong>N° commande :</strong> ${data.orderNumber}</p>
        <p style="margin:4px 0;font-size:14px;color:#555"><strong>Total payé :</strong> ${data.total.toFixed(2)} €</p>
      </div>

      <div style="background:white;border-radius:16px;padding:24px;margin-bottom:16px">
        <h2 style="margin:0 0 16px;font-size:18px;color:#111">📦 Vos articles</h2>
        ${data.items.map((i: any) => `
          <div style="display:flex;gap:12px;padding:8px 0;border-bottom:1px solid #f3f4f6">
            <div style="flex:1">
              <p style="margin:0;font-weight:600;font-size:14px;color:#111">${i.name}</p>
              <p style="margin:4px 0 0;font-size:12px;color:#6b7280">Quantité : ${i.quantity}</p>
            </div>
            <div style="font-weight:700;color:#f97316">${(i.price * i.quantity).toFixed(2)} €</div>
          </div>
        `).join("")}
      </div>

      <div style="background:white;border-radius:16px;padding:24px;margin-bottom:16px">
        <h2 style="margin:0 0 12px;font-size:18px;color:#111">🚚 Livraison</h2>
        <p style="margin:4px 0;font-size:14px;color:#555">Votre colis arrivera sous <strong>5 à 12 jours ouvrés</strong>.</p>
        ${data.trackingUrl ? `
          <p style="margin:16px 0 0;text-align:center">
            <a href="${data.trackingUrl}" style="background:#facc15;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block">
              📦 Suivre mon colis
            </a>
          </p>
        ` : ""}
      </div>

      <div style="text-align:center;padding:16px;font-size:12px;color:#9ca3af">
        Une question ? <a href="mailto:support@barry-ai.com" style="color:#f97316;text-decoration:none">support@barry-ai.com</a>
      </div>
    </div>
  `;
}

// ⭐ Email VENDEUR — Nouvelle vente
export function sellerSaleEmail(data: {
  sellerName: string;
  orderNumber: string;
  amount: number;
  creatorEarnings: number;
  productNames: string[];
}) {
  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9fafb">
      <div style="background:linear-gradient(135deg,#22c55e,#16a34a);border-radius:16px;padding:32px;text-align:center;color:white;margin-bottom:24px">
        <h1 style="margin:0;font-size:32px">💰 Nouvelle vente !</h1>
        <p style="margin-top:8px;opacity:.9;font-size:16px">Félicitations ${data.sellerName}</p>
      </div>

      <div style="background:white;border-radius:16px;padding:24px;margin-bottom:16px">
        <h2 style="margin:0 0 16px;font-size:18px;color:#111">Détails</h2>
        <p style="margin:4px 0;font-size:14px;color:#555"><strong>N° :</strong> ${data.orderNumber}</p>
        <p style="margin:4px 0;font-size:14px;color:#555"><strong>Produits :</strong> ${data.productNames.join(", ")}</p>
        <p style="margin:4px 0;font-size:14px;color:#555"><strong>Total client :</strong> ${data.amount.toFixed(2)} €</p>
      </div>

      <div style="background:linear-gradient(135deg,#facc15,#f97316);border-radius:16px;padding:24px;text-align:center;color:white;margin-bottom:16px">
        <p style="margin:0;font-size:14px;opacity:.9">Votre gain (après 2% commission BARRY AI)</p>
        <p style="margin:8px 0 0;font-size:40px;font-weight:900">${data.creatorEarnings.toFixed(2)} €</p>
      </div>

      <div style="background:white;border-radius:16px;padding:24px;font-size:13px;color:#6b7280">
        Le montant sera versé automatiquement sur votre compte bancaire via Stripe sous <strong>2 à 7 jours</strong>.
      </div>
    </div>
  `;
}