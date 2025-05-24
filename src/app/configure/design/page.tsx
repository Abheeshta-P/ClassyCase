import { notFound } from "next/navigation";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

async function Page({ searchParams }: PageProps) {
  const { id } = searchParams;

  if (!id || typeof id !== 'string') {
    return notFound();
  }
  return (
    <div>Page</div>
  )
}

export default Page;