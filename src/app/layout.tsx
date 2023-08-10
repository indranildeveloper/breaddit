import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

import Providers from "@/components/providers/Providers";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/Toaster";

import "@/styles/globals.css";
import "@/styles/editor.css";

export const metadata: Metadata = {
  title: "Breadit",
  description: "A Reddit clone built with NextJS and TypeScript.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-white text-slate-900 antialiased light",
          inter.className,
        )}
      >
        <Providers>
          <main className="min-h-screen pt-12 bg-slate-50 antialiased">
            <Navbar />
            {authModal}
            <div className="container max-w-7xl ax-auto h-full pt-12">
              {children}
            </div>
            <Toaster />
          </main>
        </Providers>
      </body>
    </html>
  );
}
