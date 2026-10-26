"use server";

import { SERVER_URL } from "@/app/config/config";
import { BASE_PRICE, PRODUCT_PRICES } from "@/app/config/products";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Order } from "@prisma/client";
import { z } from "zod";

const createCheckoutSessionSchema = z.object({
  configId: z.string().min(1, "Configuration ID is required"),
});

export async function createCheckoutSession(rawInput: {
  configId: string;
}) {
  const { configId } = createCheckoutSessionSchema.parse(rawInput);

  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });

  if (!configuration) {
    throw new Error("No such configuration found");
  }

  // Validate configuration completeness
  if (
    !configuration.model ||
    !configuration.color ||
    !configuration.material ||
    !configuration.finish ||
    !configuration.croppedImageURL
  ) {
    throw new Error(
      "Configuration is incomplete. Please finish customizing your case before checking out."
    );
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id || !user.email) {
    throw new Error("You need to be logged in");
  }

  const { finish, material } = configuration;

  // Calculate pricing strictly on server from trusted price constants
  let price = BASE_PRICE;
  if (finish === "textured") price += PRODUCT_PRICES.finish.textured;
  if (material === "polycarbonate")
    price += PRODUCT_PRICES.material.polycarbonate;

  const calculatedAmount = price / 100;

  // Prevent unexpected price mutation or reuse of already paid orders
  let order: Order | undefined = undefined;

  const existingUnpaidOrder = await db.order.findFirst({
    where: {
      userId: user.id,
      configurationId: configId,
      isPaid: false,
    },
  });

  if (existingUnpaidOrder) {
    // If the price was altered or prices updated, ensure the order amount strictly matches server pricing
    if (existingUnpaidOrder.amount !== calculatedAmount) {
      order = await db.order.update({
        where: { id: existingUnpaidOrder.id },
        data: { amount: calculatedAmount },
      });
    } else {
      order = existingUnpaidOrder;
    }
  } else {
    order = await db.order.create({
      data: {
        amount: calculatedAmount,
        userId: user.id,
        configurationId: configId,
      },
    });
  }

  // Create product in stripe with verified server price
  const product = await stripe.products.create({
    name: "Custom phone case",
    images: [configuration.imageURL],
    default_price_data: {
      currency: "USD",
      unit_amount: price,
    },
  });

  // Create payment session, bound to the verified order ID
  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${SERVER_URL}/configure/preview?id=${configId}`,
    payment_method_types: ["card", "amazon_pay", "samsung_pay"],
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: ["DE", "US", "IN", "SN"],
    },
    billing_address_collection: "auto",

    // When webhook from stripe got info about successful checkout/pay,
    // To know which user and which order it is related to
    metadata: {
      userId: user.id,
      orderId: order.id,
    },

    // Product which user buyed
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  return { url: stripeSession.url };
}
