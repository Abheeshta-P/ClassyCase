"use server";

import { db } from "@/db";
import { OrderStatus } from "@prisma/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ADMIN_EMAIL } from "../config/config";
import { z } from "zod";

const changeOrderStatusSchema = z.object({
  id: z.string().min(1, "Order ID is required"),
  newStatus: z.nativeEnum(OrderStatus),
});

// Explicit order lifecycle transition constraints:
// awaiting_shipment -> shipped | fulfilled
// shipped -> fulfilled
// fulfilled -> terminal state
const ALLOWED_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  awaiting_shipment: [
    OrderStatus.awaiting_shipment,
    OrderStatus.shipped,
    OrderStatus.fulfilled,
  ],
  shipped: [OrderStatus.shipped, OrderStatus.fulfilled],
  fulfilled: [OrderStatus.fulfilled],
};

export const changeOrderStatus = async (rawInput: {
  id: string;
  newStatus: OrderStatus;
}) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id || !user.email || user.email !== ADMIN_EMAIL) {
    throw new Error("You are not authorized to perform this action.");
  }

  const { id, newStatus } = changeOrderStatusSchema.parse(rawInput);

  const existingOrder = await db.order.findUnique({
    where: { id },
  });

  if (!existingOrder) {
    throw new Error("Order not found");
  }

  // Prevent modifying status of unpaid orders
  if (!existingOrder.isPaid) {
    throw new Error("Cannot change order status for an unpaid order.");
  }

  // Validate order status transition
  const allowedNextStatuses =
    ALLOWED_STATUS_TRANSITIONS[existingOrder.status] ?? [];

  if (!allowedNextStatuses.includes(newStatus)) {
    throw new Error(
      `Invalid order status transition from '${existingOrder.status}' to '${newStatus}'.`
    );
  }

  await db.order.update({
    where: { id },
    data: { status: newStatus },
  });
};
