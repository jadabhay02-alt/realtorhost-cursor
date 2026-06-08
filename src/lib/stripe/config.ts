import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true })
  : null;

export const PLANS = {
  STARTER: {
    name: "Starter",
    seats: 3,
    priceEnv: "STRIPE_PRICE_STARTER",
  },
  PROFESSIONAL: {
    name: "Professional",
    seats: 10,
    priceEnv: "STRIPE_PRICE_PROFESSIONAL",
  },
  BROKERAGE: {
    name: "Brokerage",
    seats: 50,
    priceEnv: "STRIPE_PRICE_BROKERAGE",
  },
} as const;
