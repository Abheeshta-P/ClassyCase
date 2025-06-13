import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignPreview from "./DesignPreview";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  }
}

function page({ searchParams }: PageProps) {
  const { id } = searchParams;

  if (!id || typeof id != "string") {
    return notFound();
  }

  const configuration = db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) {
    return notFound();
  }

  return (
    <DesignPreview />
  );
}

export default page