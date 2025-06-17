"use server";

import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function getAuthStatus() {
  const { getUser } = getKindeServerSession();
  // logged in user
  const user = await getUser();

  if (!user?.id || !user?.email) {
    throw new Error("Invalid user data");
  }

  const existingUser = await db.user.findUnique({
    where: { id: user.id },
  });

  // This user is not entered in db
  if (!existingUser) {
    await db.user.create({
      data: {
        id: user.id,
        email: user.email,
      },
    });
  }

  return { sucess: true };
}
