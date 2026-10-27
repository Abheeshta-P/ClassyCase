import { ADMIN_EMAIL, STRIPE_WEBHOOK_SECRET } from "@/app/config/config";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import OrderReceivedEmail from "@/components/emails/OrderReceivedEmail";
import { transporter } from "@/lib/nodemailer";
import { render, pretty } from "@react-email/render";
import { SentMessageInfo } from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    let sent: string | SentMessageInfo = "nahhh";
    
    // Stripe sends signature with webhook payloads
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      return new Response("Invalid signature", {
        status: 400,
      });
    }

    // Validate webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      // user paid
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

      // 1. Verify order existence, order ownership, and configuration ownership
      const existingOrder = await db.order.findUnique({
        where: { id: orderId },
        include: { configuration: true },
      });

      if (!existingOrder) {
        throw new Error("Order not found");
      }

      if (existingOrder.userId !== userId) {
        throw new Error("User ID mismatch for order");
      }

      // Verify configuration belongs to this customer if already claimed
      if (
        existingOrder.configuration.userId &&
        existingOrder.configuration.userId !== userId
      ) {
        throw new Error("User ID mismatch for configuration");
      }

      // 2. Event Idempotency & Duplicate-Email Prevention:
      // If the order has already been marked as paid, return 200 OK immediately.
      // This prevents duplicate database updates (addresses) and duplicate email dispatch on webhook retries.
      if (existingOrder.isPaid) {
        console.log(
          `[Webhook] Order ${orderId} has already been processed and marked as paid. Skipping duplicate processing.`
        );
        return NextResponse.json({
          message: "Order already processed",
          ok: true,
          isDuplicate: true,
        });
      }

      // Ensure shipping details are present
      const shippingAddress =
        session.collected_information?.shipping_details?.address;
      const customerName = session.customer_details?.name;

      if (!shippingAddress || !customerName) {
        throw new Error("Missing shipping details or customer name in session");
      }

      // Default billing address to shipping address if not separately provided
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

      // Claim unowned guest configuration for this customer upon completed payment
      if (!existingOrder.configuration.userId) {
        await db.configuration.update({
          where: { id: existingOrder.configurationId },
          data: { userId },
        });
      }

      const customerEmail = event.data.object.customer_details?.email;
      if (customerEmail) {
        try {
          const emailHtml = await pretty(
            await render(
              OrderReceivedEmail({
                orderId: updatedOrder.id,
                orderDate: updatedOrder.createdAt.toLocaleDateString(),
                //@ts-ignore
                shippingAddress: {
                  name: session.customer_details!.name!,
                  city: shippingAddress!.city!,
                  country: shippingAddress!.country!,
                  postalCode: shippingAddress!.postal_code!,
                  street: shippingAddress!.line1!,
                  state: shippingAddress!.state,
                },
              })
            )
          );

          sent = await transporter.sendMail({
            from: `ClassyCase <${ADMIN_EMAIL}>`,
            to: customerEmail,
            subject: "Thanks for your Classy order!",
            html: emailHtml,
          });
        } catch (emailError) {
          console.error(
            "Error sending email via Nodemailer/Gmail:",
            emailError
          );
          if (emailError instanceof Error) {
            console.error(
              "Nodemailer/Gmail Error Message:",
              emailError.message
            );
          }
        }
      } else {
        console.warn("No customer email available to send order confirmation.");
      }
    }

    return NextResponse.json({ result: event, ok: true, sent });
  } catch (error) {
    console.error("Stripe Webhook Error:", error);

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
