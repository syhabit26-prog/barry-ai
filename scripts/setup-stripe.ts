import Stripe from "stripe";
import * as dotenv from "dotenv";
import { ALL_PLANS } from "../src/lib/plans";

dotenv.config({ path: ".env.local" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

async function setupStripe() {
  console.log("🚀 Création des Products Stripe...\n");

  for (const plan of ALL_PLANS) {
    try {
      const existing = await stripe.products.search({
        query: `metadata['plan_id']:'${plan.id}'`,
      });

      if (existing.data.length > 0) {
        console.log(`⏭️  ${plan.id} existe déjà`);
        continue;
      }

      const product = await stripe.products.create({
        name: plan.label,
        description: plan.features.join(" • "),
        metadata: {
          plan_id: plan.id,
          service: plan.service,
          tier: plan.tier,
          duration: plan.duration,
        },
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(plan.price * 100),
        currency: plan.currency.toLowerCase(),
        metadata: { plan_id: plan.id },
      });

      console.log(`✅ ${plan.id} → ${price.id}`);
    } catch (err: any) {
      console.error(`❌ Erreur ${plan.id}:`, err.message);
    }
  }

  console.log("\n🎉 Terminé !");
}

setupStripe();