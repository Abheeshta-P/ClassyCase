import Stripe from "stripe";

// If null?? ""
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-05-28.basil",
  typescript: true,
});