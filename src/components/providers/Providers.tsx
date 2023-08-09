"use client";

import { FC, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ProviderProps {
  children: ReactNode;
  session?: Session;
}

const Providers: FC<ProviderProps> = ({ children, session }) => {
  const queryClient = new QueryClient();

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
};

export default Providers;
