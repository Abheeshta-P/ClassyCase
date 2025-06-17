"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";

function Providers({ children }: { children: ReactNode }) {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export default Providers;
