"use server";

export const ADMIN_EMAIL = String(process.env.NEXT_PUBLIC_ADMIN_EMAIL);
export const SERVER_URL = String(process.env.NEXT_PUBLIC_SERVER_URL);

export const STRIPE_SECRET_KEY = String(process.env.STRIPE_SECRET_KEY);
export const STRIPE_WEBHOOK_SECRET = String(process.env.STRIPE_WEBHOOK_SECRET);
