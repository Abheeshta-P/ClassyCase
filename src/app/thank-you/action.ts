"use server";

import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  Order,
  Configuration,
  BillingAddress,
  ShippingAddress,
  User,
} from "@prisma/client";

type FullOrder = Order & {
  configuration: Configuration; 
  billingAddress: BillingAddress | null; 
  shippingAddress: ShippingAddress | null; 
  user: User; 
};

// Define the possible return types for getPaymentStatus
type GetPaymentStatusResponse =
  | { success: true; data: FullOrder } // Order is paid and data is available
  | { success: true; data: false } // Order is found but not paid yet (data: false)
  | { success: false; error: "NOT_LOGGED_IN" } // User not logged in
  | { success: false; error: "ORDER_NOT_FOUND" }; // Order not found or not belonging to user

export const getPaymentStatus = async ({
  orderId,
}: {
  orderId: string;
}): Promise<GetPaymentStatusResponse> => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id || !user.email) {
    return { success: false, error: "NOT_LOGGED_IN" };
  }

  const order = await db.order.findFirst({
    where: { id: orderId, userId: user.id },
    include: {
      billingAddress: true,
      configuration: true,
      shippingAddress: true,
      user: true,
    },
  });

  if (!order) {
    return { success: false, error: "ORDER_NOT_FOUND" };
  }

  if (order.isPaid) {
    return { success: true, data: order as FullOrder }; 
  } else {
    return { success: true, data: false };
  }
};
