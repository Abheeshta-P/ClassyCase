"use server";

import { db } from "@/db";
import {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  PhoneModel,
} from "@prisma/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";

const saveConfigSchema = z.object({
  configId: z.string().min(1, "Configuration ID is required"),
  color: z.nativeEnum(CaseColor),
  finish: z.nativeEnum(CaseFinish),
  material: z.nativeEnum(CaseMaterial),
  model: z.nativeEnum(PhoneModel),
});

export type saveConfigArgs = z.infer<typeof saveConfigSchema>;

export async function saveConfig(args: saveConfigArgs) {
  const { color, finish, material, model, configId } =
    saveConfigSchema.parse(args);

  const existingConfig = await db.configuration.findUnique({
    where: { id: configId },
  });

  if (!existingConfig) {
    throw new Error("No such configuration found");
  }

  // Ownership verification
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // If the configuration is already owned by a user, ensure the logged-in user is that owner
  if (existingConfig.userId && existingConfig.userId !== user?.id) {
    throw new Error("You are not authorized to modify this configuration");
  }

  // If user is authenticated and the configuration does not have an owner yet, associate it
  let shouldClaimOwnership = false;
  if (user?.id && !existingConfig.userId) {
    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (dbUser) {
      shouldClaimOwnership = true;
    }
  }

  await db.configuration.update({
    where: { id: configId },
    data: {
      color,
      finish,
      material,
      model,
      ...(shouldClaimOwnership && user?.id ? { userId: user.id } : {}),
    },
  });
}
