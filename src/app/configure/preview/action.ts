"use server"

import { SERVER_URL } from "@/app/config/config";
import { BASE_PRICE, PRODUCT_PRICES } from "@/app/config/products";
import { db } from "@/db"
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Order } from "@prisma/client";

export async function createCheckoutSession({ configId }: { configId: string }) {
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });

  if (!configuration) {
    throw new Error("No such configuration found");
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("You need to be logged in");
  }
  
  const { finish, material } = configuration;

  let price = BASE_PRICE;
  if (finish === "textured")
    price += PRODUCT_PRICES.finish.textured;
  if (material === "polycarbonate")
    price += PRODUCT_PRICES.material.polycarbonate;

  // If the present confi/case already ordered then no need to order it again
  let order: Order | undefined = undefined;

  const exisitingOrder = await db.order.findFirst({
    // logged in user's all orders
    where: {
      userId: user.id,
      configurationId: configId
    },
  });

  if (exisitingOrder) {
    order = exisitingOrder;
  } else {
    order = await db.order.create({
      data: {
        amount: price / 100,
        userId: user.id,
        configurationId: configId
      }
    })
  }

  // create a product in stripe
  const product = await stripe.products.create({
    name: "Custom phone case",
    images: [configuration.imageURL],
    default_price_data: {
      currency: "USD",
      unit_amount: price,
    }
  });

  // create payment session, with the order id
  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${SERVER_URL}/configure/preview?id=${configId}`,
    payment_method_types: ["card", "paypal", "samsung_pay"],
    mode: "payment",
    shipping_address_collection: { allowed_countries: ["DE", "US", "IN", "SN"] },

    // When webhook from stripe got info about successful checkout/pay, 
    // To know which user and which order it is related to
    metadata: {
      userId: user.id,
      orderId: order.id,
    },

    // Product which user buyed
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  // Hosted checkout page by stripe
  return { url: stripeSession.url };
}