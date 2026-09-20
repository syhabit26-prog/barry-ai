// src/lib/stripeConnect.ts
import { stripe } from "@/lib/stripe";

// ⭐ Crée un compte Stripe Connect Express pour un créateur
export async function createConnectAccount(userId: string, email: string) {
  const account = await stripe.accounts.create({
    type: "express",
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: "individual",
    metadata: { userId },
  });

  console.log("✅ Compte Connect créé :", account.id);
  return account;
}

// ⭐ Génère un lien d'onboarding Stripe (le créateur remplira ses infos bancaires)
export async function createAccountLink(accountId: string, appUrl: string) {
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${appUrl}/account/connect-stripe?refresh=true`,
    return_url: `${appUrl}/account/connect-success`,
    type: "account_onboarding",
  });

  return link.url;
}

// ⭐ Vérifie le statut du compte (charges activées ?)
export async function getAccountStatus(accountId: string) {
  const account = await stripe.accounts.retrieve(accountId);
  return {
    charges_enabled: account.charges_enabled,
    payouts_enabled: account.payouts_enabled,
    details_submitted: account.details_submitted,
  };
}