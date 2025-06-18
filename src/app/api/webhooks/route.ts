import { STRIPE_WEBHOOK_SECRET } from "@/app/config/config";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    // stripe sends signature if it sends webhooks
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      // no signature in header
      return new Response("Invalid signature", {
        status: 400,
      });
    }

    // validate the signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      // user payed
      if (!event.data.object.customer_details?.email) {
        // if no email assosiated (ts)
        throw new Error("Missing user email");
      }

      // get important details about the session
      const session = event.data.object as Stripe.Checkout.Session & {
        shipping_details?: {
          address?: Stripe.Address | null;
        };
      };

      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      };

      // if no user/order
      if (!userId || !orderId) {
        throw new Error("Invalid request metadata");
      }

      const billingAddress = session.customer_details!.address;
      const shippingAddress = session.collected_information!.shipping_details!.address;

      await db.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
          shippingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: shippingAddress!.city!,
              country: shippingAddress!.country!,
              postalCode: shippingAddress!.postal_code!,
              street: shippingAddress!.line1!,
              state: shippingAddress!.state,
            },
          },
          billingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: billingAddress!.city!,
              country: billingAddress!.country!,
              postalCode: billingAddress!.postal_code!,
              street: billingAddress!.line1!,
              state: billingAddress!.state,
            },
          },
        },
      });
    }
  } catch (error) {
    // could be sent to sentry
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong", ok: false, error: JSON.stringify(error) },
      { status: 500 }
    );
  }
}
