import { RESEND_API_KEY, RESEND_EMAIL, STRIPE_WEBHOOK_SECRET } from "@/app/config/config";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CreateEmailResponse, Resend } from "resend";
import OrderReceivedEmail from "@/components/emails/OrderReceivedEmail";

const resend = new Resend(RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    let sent: string | CreateEmailResponse = "nahhh";
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

      if (!userId || !orderId) {
        throw new Error("Invalid request metadata");
      }

      // Ensure shippingAddress is always present, as it was collected
      const shippingAddress =
        session.collected_information?.shipping_details?.address;
      const customerName = session.customer_details?.name; // Get customer name once

      if (!shippingAddress || !customerName) {
        throw new Error("Missing shipping details or customer name in session");
      }

      // Otherwise, default to using the shipping address as the billing address.
      const billingAddress =
        session.customer_details?.address || shippingAddress;

      const updatedOrder = await db.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
          shippingAddress: {
            create: {
              name: customerName,
              city: shippingAddress.city!,
              country: shippingAddress.country!,
              postalCode: shippingAddress.postal_code!,
              street: shippingAddress.line1!,
              state: shippingAddress.state,
            },
          },
          billingAddress: {
            create: {
              name: customerName,
              city: billingAddress.city!,
              country: billingAddress.country!,
              postalCode: billingAddress.postal_code!,
              street: billingAddress.line1!,
              state: billingAddress.state,
            },
          },
        },
      });

      console.log(updatedOrder)
      // email
       sent = await resend.emails.send({
        from: `ClassyCase <${RESEND_EMAIL}>`,
        to: [event.data.object.customer_details.email],
        subject: "Thanks for your Classy order!",
        react: OrderReceivedEmail({
          orderId,
          orderDate: updatedOrder.createdAt.toLocaleDateString(),
          // @ts-ignore
          shippingAddress: {
            name: session.customer_details!.name!,
            city: shippingAddress!.city!,
            country: shippingAddress!.country!,
            postalCode: shippingAddress!.postal_code!,
            street: shippingAddress!.line1!,
            state: shippingAddress!.state,
          },
        }),
      });
      console.log(sent)
    }
    return NextResponse.json({ result: event, ok: true, sent: sent }); 
  } catch (error) {
    console.error("Stripe Webhook Error:", error);

    // Return 500 status and error details for Stripe to see
    return new Response(
      JSON.stringify({
        message: "Webhook processing failed",
        error: (error as Error).message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
