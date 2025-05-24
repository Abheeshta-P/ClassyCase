import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import sharp from "sharp";
import { buffer } from "stream/consumers";
import { db } from "@/db";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(z.object({ configId: z.string().optional() }))
    .middleware(async ({ input }) => {
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { configId } = metadata.input;

      const res = await fetch(file.ufsUrl);
      const buffer = await res.arrayBuffer();

      const imgMetadata = await sharp(buffer).metadata();
      const { width, height } = imgMetadata;

      if (!configId) {
        // New entry
        const configuration = await db.configuration.create({
          data: {
            imageURL: file.ufsUrl,
            height: height || 500,
            width: width || 500,
          },
        });

        return { configId: configuration.id };
      } else {
        // Update existing
        const updatedConfiguration = await db.configuration.update({
          where: {
            id: configId,
          },
          data: {
            croppedImageURL: file.ufsUrl,
          },
        });

        return { configId: updatedConfiguration.id };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
