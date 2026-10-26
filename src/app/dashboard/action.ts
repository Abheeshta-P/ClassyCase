"use server";

import { db } from "@/db";
import { OrderStatus } from "@prisma/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ADMIN_EMAIL } from "../config/config";

export const changeOrderStatus = async ({
  id,
  newStatus,
}: {
  id: string;
  newStatus: OrderStatus;
}) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id || !user.email || user.email !== ADMIN_EMAIL) {
    throw new Error("You are not authorized to perform this action.");
  }

  await db.order.update({
    where: { id },
    data: { status: newStatus },
  });
};
