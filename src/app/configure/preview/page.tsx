import { db } from "@/db";
import { notFound, redirect } from "next/navigation";
import DesignPreview from "./DesignPreview";
import { PageProps } from "../../../../.next/types/app/configure/preview/page";

async function Page({ searchParams }: PageProps) {
  const { id } = await searchParams;

  if (!id || typeof id != "string") {
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) {
    return notFound();
  }

  // If case customization has not been completed, redirect back to the design step
  if (
    !configuration.model ||
    !configuration.color ||
    !configuration.croppedImageURL
  ) {
    redirect(`/configure/design?id=${id}`);
  }

  return <DesignPreview configuration={configuration} />;
}

export default Page;
