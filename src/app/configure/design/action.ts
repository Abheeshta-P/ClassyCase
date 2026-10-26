"use server";

import { db } from "@/db";
import {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  PhoneModel,
} from "@prisma/client";
import { z } from "zod";

export const saveConfigSchema = z.object({
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

  await db.configuration.update({
    where: { id: configId },
    data: { color, finish, material, model },
  });
}
